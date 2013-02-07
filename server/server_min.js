var http = require("http"),
	request = require("request")
	;

var listen_port = process.env.PORT || 8080;

http.createServer(function(req, res) {
	req.pipe(request(req.url)).pipe(res)
})
.listen(listen_port)

console.log("Server running at http://127.0.0.1:" + listen_port)
