// Create web server
// Load the http module to create an http server.
var http = require('http');
var fs = require('fs');
var url = require('url');

// Configure our HTTP server to respond with Hello World to all requests.
var server = http.createServer(function (request, response) {
	var path = url.parse(request.url).pathname;

	switch(path){
		case '/':
			response.writeHead(200, {"Content-Type": "text/html"});
			response.write("Hello World");
			response.end();
			break;
		case '/comments':
			switch(request.method){
				case 'POST':
					var body = '';
					request.on('data', function(data){
						body += data;
					});
					request.on('end', function(){
						fs.appendFile('comments.txt', body + '\n', function(err){
							if(err) throw err;
						});
						response.writeHead(200, {"Content-Type": "text/html"});
						response.write('Data saved\n');
						response.end();
					});
					break;
				case 'GET':
					fs.readFile('comments.txt', 'utf8', function(err, data){
						if(err) throw err;
						response.writeHead(200, {"Content-Type": "text/html"});
						response.write(data);
						response.end();
					});
					break;
				default:
					response.writeHead(405, {"Content-Type": "text/html"});
					response.write("Method not allowed");
					response.end();
					break;
			}
			break;
		default:
			response.writeHead(404, {"Content-Type": "text/html"});
			response.write("Not found");
			response.end();
			break;
	}
});

// Listen on port 8000, IP defaults to