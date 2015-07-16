

// Dummy users

var db = require('../modules/database/dbInteraction');


module.exports=function(app) {
    app.get('/', function (req, res) {

        res.render('index.html');
        //here you use 'data'. just replace console.log(data) with implementation


    });
    app.get('/about', function (req, res) {

        res.render('aboutUs.html');


    });
    app.get('/contact', function (req, res) {

        res.render('contactUs.html');


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
        app.get('/test', function (req, res) {
            db.getCollection('testCol', function (data) {
                res.render('test', {subjects: data});
            });
            //var val = req.query.name;
            //console.log(req);

        });

    app.post('/insert', function (req, res) {

        db.insertDocument(req.body.collection, req.body.data)


    });

    app.post('/login', function (req, res) {

        db.insertDocument(req.body.collection, req.body.data)


    });

    app.get('/projectHome', function (req, res) {

        res.render('projectSetup.html');


    });

}