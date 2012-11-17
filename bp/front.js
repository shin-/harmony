var http = require('http');
var fs = require('fs');
var url = require('url');

var stackiojs = fs.readFileSync('/home/dotcloud/current/stack.io.js', 'utf-8');
var indexhtml = fs.readFileSync('/home/dotcloud/current/index.html', 'utf-8');

indexhtml = indexhtml.replace('$$HOST$$', process.env['DOTCLOUD_SERVER_HTTP_HOST']);

http.createServer(function(req, rep) {
    if (url.parse(req.url).pathname == '/stack.io.js') {
        rep.setHeader('Content-Type', 'text/javascript');
        return rep.end(stackiojs);
    }

    rep.setHeader('Content-Type', 'text/html');
    rep.end(indexhtml);
}).listen(8080);