
var express=require('express');
var bodyParser = require('body-parser')



var app=express();

app.use(bodyParser.urlencoded({ extended: false }));
var db = require('./modules/database/dbInteraction');
require('./router/main')(app);
app.set('views',__dirname + '/views');
app.set('view engine', 'html');
app.use(express.static(__dirname + '/public'));
//app.use("/views/style", express.static(__dirname + '/css'));
app.engine('.html', require('ejs').__express);
var server=app.listen(8080,function(){
    console.log("Express is running on port 8080");
});



//52416
