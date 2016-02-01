import express = require('express');
import path = require('path');
var port: number = process.env.PORT || 3000;
var app = express();

app.use('/client', express.static(path.resolve(__dirname, '../client')));
app.use('/assets', express.static(path.resolve(__dirname, 'assets')));

var renderIndex = (req: express.Request, res: express.Response) => {
    res.sendFile(path.resolve(__dirname, '../client/index.html'));
}

app.get('/*', renderIndex);

var server = app.listen(port, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('This express app is listening on port:' + port);
});



// 'use strict';

// var express = require('express');
// var http = require('http');
// var path = require('path');
// var app = express();
// var server = http.createServer(app);

// app.get('/', function(req, res) {

// 	res.sendfile(path.resolve(__dirname, '../client/index.html'));

// });

// app.use(express.static('built/client'));

// server.listen(3000, 'localhost');
// server.on('listening', function() {
// 	console.log('Express server started on port %s at %s', server.address().port, server.address().address);
// });
