

// Dummy users

var db = require('../modules/database/dbInteraction');

module.exports=function(app) {
    app.get('/', function (req, res) {

        res.render('index.html');
        //here you use 'data'. just replace console.log(data) with implementation


    });
    app.get('/about', function (req, res) {

        res.render('aboutUs.html');
        //here you use 'data'. just replace console.log(data) with implementation


    });
    app.get('/contact', function (req, res) {

        res.render('contactUs.html');
        //here you use 'data'. just replace console.log(data) with implementation


    });
    app.get('/demo', function (req, res) {
        db.getCollection('testCol', function (data) {
            res.render('teamSetup', {subjects: data});
        });
    });

    app.get('/teamSetup', function (req, res) {
        db.getCollection('testCol', function (data) {
            res.render('teamSetup', {subjects: data});
        });


    });
}