var http = require('http');
var requestListener = function(req, res){
  res.writeHead(200);
  res.end('Hello, World!');
}

var server = http.createServer(requestListner);
server.listen(8000, function(){
  console.log("Listening on port 8000");
});