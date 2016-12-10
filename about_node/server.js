//使用 require 指令来载入 http 模块
var http = require("http");
var url = require("url");

var fs = require("fs");
function start(route){
	function onRequest(request, response){
		var pathname = url.parse(request.url).pathname;
		console.log("Request for "+pathname+"received");

		route(pathname)

		// 从文件系统中读取请求的文件内容
		fs.readFile(pathname.substr(1), function (err, data) {
			if (err) {
				console.log(err);
				// HTTP 状态码: 404 : NOT FOUND
				// Content Type: text/plain
				response.writeHead(404, {'Content-Type': 'text/html'});
			}else{	         
				// HTTP 状态码: 200 : OK
				// Content Type: text/plain
				response.writeHead(200, {'Content-Type': 'text/html'});	

				// 响应文件内容
				response.write(data.toString());		
			}
			//  发送响应数据
			response.end();
		})
		
	}
	http.createServer(onRequest).listen(8888)
}

exports.start = start;