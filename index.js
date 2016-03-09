var express = require("express");
var path = require("path");
var app = express();

app.use("/", express.static(path.join(__dirname,"/")));

// Run Server
var server = app.listen(1222, function () {
    console.log('Wood Demo at http://%s:%s', server.address().address, server.address().port)
});
