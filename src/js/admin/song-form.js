{
    let view = {
        el: '.page > main',
        init() {
            this.$el = $(this.el)
        },
        template: `
        <form action="" class="form">
        <div class="row">
            <label for="">
                歌名
                <input type="text" name="name" value="__name__">
            </label>
        </div>
        <div class="row">
            <label for="">
                歌手
                <input type="text" name="singer" value="__singer__">
            </label>
        </div>
        <div class="row">
            <label for="">
                外链
                <input type="text" name="url" value="__url__">
            </label>
        </div>
        <div class="row">
            <label for="">
                封面
                <input type="text" name="cover" value="__cover__">
            </label>
        </div>
        <div class="row">
            <label for="">
                <input type="submit" name="" value="保存">
            </label>
        </div>
        </form>
        `,
        render(data={}) {
            let placeholders = ['name', 'singer', 'url', 'id', 'cover']
            let html = this.template
            placeholders.map((string)=>{
                html = html.replace(`__${string}__`, data[string] || '')
            })
            $(this.el).html(html)
            if (data.id) {
                $(this.el).prepend('<h1>编辑歌曲</h1')
            } else {
                $(this.el).prepend('<h1>新建歌曲</h1')
            }
        },
        reset(){
            this.render({})
        }
    }
    let model = {
        data: {
            name: '', singer:'', url:'', id:'', cover: ''
        },
        update(data){
            var song = AV.Object.createWithoutData('Song', this.data.id)
            song.set('name', data.name)
            song.set('singer', data.singer)
            song.set('url', data.url)
            song.set('cover', data.cover)
            return song.save().then((response)=>{
                Object.assign(this.data, data)
                return response
            }, (err)=>{
                console.log(err)
            })
        },
        create(data) {
             // 声明类型
            var Song = AV.Object.extend('Song');
            // 新建对象
            var song = new Song();
            // 设置名称
            song.set('name', data.name);
            song.set('singer', data.singer);
            song.set('url', data.url);
            song.set('cover', data.cover);
            return song.save().then((newSong) =>{
                console.log('newSong')
                console.log(newSong)
                let {id , attributes} = newSong
                Object.assign(this.data, {id, ...attributes})
            }, (error)=> {
                console.error(error);
            });
        }
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.view.init()
            this.model = model
            this.view.render(this.model.data)
            this.bindEvents()
            window.eventHub.on('select', (data)=>{
                this.model.data = data
                this.view.render(this.model.data)
            })
            window.eventHub.on('new', (data)=>{
                if(this.model.data.id) {
                    this.model.data = {
                        name: '', url: '', id: '', singer: '', cover:''
                    }
                } else {
                    Object.assign(this.model.data, data)
                }
                this.view.render(this.model.data)
            })
        },
        create(){
            let needs = 'name singer url cover'.split(' ')
            let data = {}
            needs.map((string)=>{
                data[string] = this.view.$el.find(`[name="${string}"]`).val()
            })
            
            console.log("开始 createdata")
            this.model.create(data)
                .then(()=>{
                    console.log("createdata 成功")
                    this.view.reset()
                    let string = JSON.stringify(this.model.data)
                    let object = JSON.parse(string)
                    window.eventHub.emit('create', object)
                }, (err)=>{
                    console.log(err)
                })
        },
        update(){
            let needs = 'name singer url cover'.split(' ')
            let data = {}
            needs.map((string)=>{
                data[string] = this.view.$el.find(`[name="${string}"]`).val()
            })
            this.model.update(data)
                .then(()=>{
                    window.eventHub.emit('update', JSON.parse(JSON.stringify(this.model.data)))
                })
        },
        bindEvents() {
            this.view.$el.on('submit', 'form', (e)=>{
                e.preventDefault()
                if (this.model.data.id) {
                    this.update()
                } else {
                    this.create()
                }
            })
        }
    }
    controller.init(view, model)
}
