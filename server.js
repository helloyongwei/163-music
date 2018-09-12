var http = require('http')
var fs = require('fs')
var url = require('url')
var qiniu = require('qiniu')
var port = 8888


var server = http.createServer(function(request, response){
  var parsedUrl = url.parse(request.url, true)
  var path = request.url
  var query = ''
  if(path.indexOf('?') >= 0){ query = path.substring(path.indexOf('?')) }
  var pathNoQuery = parsedUrl.pathname
  var queryObject = parsedUrl.query
  var method = request.method

  console.log('HTTP 路径为\n' + path)
 if(path == '/uptoken'){
    response.setHeader('Content-Type', 'text/css; charset=utf-8')
    response.setHeader('Access-Control-Allow-Origin', '*')
    response.removeHeader('Date')

    var config = fs.readFileSync('./qiniu-key.json')
    config = JSON.parse(config)
    var {accessKey ,secretKey} = config;

    var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    var options = {
      scope: "163-music",
    };
    var putPolicy = new qiniu.rs.PutPolicy(options);
    var uploadToken=putPolicy.uploadToken(mac);
    response.write(`
      {
        "uptoken": "${uploadToken}"
      }
    `)

    response.end()
  }else{
    response.statusCode = 404
    response.end()
  }

})

server.listen(port)
console.log('successed')

