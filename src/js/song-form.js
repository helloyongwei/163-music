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
                <input type="submit" name="" value="保存">
            </label>
        </div>
        </form>
        `,
        render(data={}) {
            let placeholders = ['name', 'singer', 'url', 'id']
            let html = this.template
            placeholders.map((string)=>{
                html = html.replace(`__${string}__`, data[string] || '')
            })
            $(this.el).html(html)
        },
        reset(){
            this.render({})
        }
    }
    let model = {
        data: {
            name: '', singer:'', url:'', id:''
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
            return song.save().then((newSong) =>{
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
            window.eventHub.on('upload', (data)=>{
                this.model.data = data
                this.view.render(this.model.data)
            })
        },
        bindEvents() {
            this.view.$el.on('submit', 'form', (e)=>{
                e.preventDefault()
                let needs = 'name singer url'.split(' ')
                let data = {}
                needs.map((string)=>{
                    data[string] = this.view.$el.find(`[name="${string}"]`).val()
                })
                
                this.model.create(data)
                    .then(()=>{
                        this.view.reset()
                        let string = JSON.stringify(this.model.data)
                        let object = JSON.parse(sting)
                        window.eventHub.emit('create', object)
                    })
            })
        }
    }
    controller.init(view, model)
}
