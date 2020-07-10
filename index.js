require("dotenv").config();

var express = require('express');
var app = express();
const qr = require('qr-image')

app.get('/endpoint', function(req, res) {
    var id = req.query.id;
    const code = qr.image(id , { type: 'png'})
    res.type ('png')
    code.pipe(res)
});

app.listen(process.env.PORT || 3000);
console.log("node express app started at http://localhost:3000");