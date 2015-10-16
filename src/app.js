
var express=require('express');
var bodyParser = require('body-parser');


var app=express();

app.use(bodyParser.urlencoded({ extended: false }));
var db = require('./modules/database/dbInteraction');
require('./router/main')(app);
app.set('views',__dirname + '/views');
app.set('view engine', 'html');
app.use(express.static(__dirname + '/public'));
app.engine('.html', require('ejs').__express);
var port = (process.env.PORT || 80)
var server=app.listen(port,function(){
    console.log("Express is running on port "+port);
});



//52416
