{
    let view = {
        el: '.page > main',
        template: `
        <div class="song">新建歌曲</div>
        <div class="row">
            <label for="">
                歌名
                <input type="text" name="" id="">
            </label>
        </div>
        <div class="row">
            <label for="">
                歌手
                <input type="text" name="" id="">
            </label>
        </div>
        <div class="row">
            <label for="">
                外链
                <input type="text" name="" id="">
            </label>
        </div>
        <div class="row">
            <label for="">
                <input type="submit" name="" id="" value="保存">
            </label>
        </div>
        `,
        render(data={}) {
            let placeholders = ['key', 'link']
            let html = this.template
            placeholders.map((string)=>{
                html = html.replace(`__${string}__`, data[string] || '')
            })
            $(this.el).html(html)
        }
    }
    let model = {}
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.view.render(this.model.data)
            window.eventHub.on('upload', (data)=>{
                this.view.render(data)
            })
        }
    }
    controller.init(view, model)
}
