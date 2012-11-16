var http = require('http');
var fs = require('fs');
var url = require('url');

var stackiojs = fs.readFileSync('/home/dotcloud/current/stack.io.js', 'utf-8');

http.createServer(function(req, rep) {
    if (url.parse(req.url).pathname == '/stack.io.js') {
        rep.setHeader('Content-Type', 'text/javascript');
        return rep.end(stackiojs);
    }

    rep.setHeader('Content-Type', 'text/html');
    rep.write('<html><head><title>stack.io</title>')
    rep.write('<script type="text/javascript" src="/stack.io.js"></script>')
    rep.write('<script type="text/javascript">')
    rep.write('var g_client;stack.io({ host: "http://' + process.env['DOTCLOUD_SERVER_HTTP_HOST'] +
        '" }, function(err, client) { if (err) return console.log(err);' +
        'g_client = client; console.log(client.services()); });');
    rep.end('</script><body></body></html>');
}).listen(8080);