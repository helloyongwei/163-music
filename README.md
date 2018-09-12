# 说明
 1. 这是模仿网易云音乐的项目, 
 2. src/index.html 是网易云首页. 
 3. src/admin.html是网易云的后台页面.
 4. 本地上传歌曲到七牛, 同时存储数据信息于leanCloud. 
 5. 本项目需要使用node, npm以及http-server

# 使用
将此项目下载到本地
```
git clone git@github.com:helloyongwei/163-music.git
```

运行server.js
```
node server.js
```

运行:
```
http-server -c-1
```
在浏览器中打开http-server -c-1返回的网址, 进入src目录即可进入网易云页面.

