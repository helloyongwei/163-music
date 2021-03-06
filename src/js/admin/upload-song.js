{
    let view = {
        el: '.uploadArea',
        find(selector) {
            return $(this.el).find(selector)[0]
        }
    }
    let model = {
        data: {
            status: 'open'
        }
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.initQiniu()
        },
        initQiniu() {
            var uploader = Qiniu.uploader({
                runtimes: 'html5,flash,html4',      // 上传模式，依次退化
                browse_button: this.view.find('#uploadButton'),         // 上传选择的点选按钮，必需
                // 在初始化时，uptoken，uptoken_url，uptoken_func三个参数中必须有一个被设置
                // 切如果提供了多个，其优先级为uptoken > uptoken_url > uptoken_func
                // 其中uptoken是直接提供上传凭证，uptoken_url是提供了获取上传凭证的地址，如果需要定制获取uptoken的过程则可以设置uptoken_func
                // uptoken : '<Your upload token>', // uptoken是上传凭证，由其他程序生成
                 uptoken_url: 'http://localhost:8888/uptoken',         // Ajax请求uptoken的Url，强烈建议设置（服务端提供）
                // uptoken_func: function(){    // 在需要获取uptoken时，该方法会被调用
                //    // do something
                //    return uptoken;
                // },
                get_new_uptoken: false,             // 设置上传文件的时候是否每次都重新获取新的uptoken
                // downtoken_url: '/downtoken',
                // Ajax请求downToken的Url，私有空间时使用，JS-SDK将向该地址POST文件的key和domain，服务端返回的JSON必须包含url字段，url值为该文件的下载地址
                // unique_names: true,              // 默认false，key为文件名。若开启该选项，JS-SDK会为每个文件自动生成key（文件名）
                // save_key: true,                  // 默认false。若在服务端生成uptoken的上传策略中指定了sava_key，则开启，SDK在前端将不对key进行任何处理
                domain: 'pb2qi4auu.bkt.clouddn.com',     // bucket域名，下载资源时用到，必需
                container: this.view.find('#uploadContainer'),             // 上传区域DOM ID，默认是browser_button的父元素
                max_file_size: '100mb',             // 最大文件体积限制
                flash_swf_url: 'path/of/plupload/Moxie.swf',  //引入flash，相对路径
                max_retries: 3,                     // 上传失败最大重试次数
                dragdrop: true,                     // 开启可拖曳上传
                drop_element: this.view.find('#uploadContainer'),          // 拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
                chunk_size: '20mb',                  // 分块上传时，每块的体积
                auto_start: true,                   // 选择文件后自动上传，若关闭需要自己绑定事件触发上传
                
                init: {
                    'FilesAdded': function(up, files) {
                        plupload.each(files, function(file) {
                            // 文件添加进队列后，处理相关的事情
                        });
                    },
                    'BeforeUpload': (up, file)=> {
                            // 每个文件上传前，处理相关的事情
                            window.eventHub.emit('beforeUpload')
                            if (this.model.data.status === 'closed') {
                                return false
                            } else {
                                this.model.data.status = 'closed'
                            }
                    },
                    'UploadProgress': function(up, file) {
                            // 每个文件上传时，处理相关的事情
                        uploadStatus.textContent='文件上传中'
                    },
                    'FileUploaded': (up, file, info)=> {
                            // 其中info.response是文件上传成功后，服务端返回的json，形式如：
                            // {
                            //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
                            //    "key": "gogopher.jpg"
                            //  }
                        this.model.data.status = 'closed'
                        window.eventHub.emit('afterUpload')
                        var domain = up.getOption('domain');
                        var response = JSON.parse(info.response);
                        var sourceLink = 'http://' + domain +"/"+ encodeURIComponent(response.key); //获取上传成功后的文件的Url
                        window.eventHub.emit('new', {
                            url: sourceLink,
                            name: response.key
                        });
                        uploadStatus.textContent="上传成功"
                    },
                    'Error': function(up, err, errTip) {
                            //上传出错时，处理相关的事情
                    },
                    'UploadComplete': function() {
                            //队列文件处理完毕后，处理相关的事情
                    },
                }
            });
            // domain为七牛空间对应的域名，选择某个空间后，可通过 空间设置->基本设置->域名设置 查看获取
            // uploader为一个plupload对象，继承了所有plupload的方法  
        }
    }
    controller.init(view, model)
}