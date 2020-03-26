var express = require('express');
var parser = require('body-parser');
var mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/funwebdev');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
    console.log("connected to mongo");
});
var bookSchema = new mongoose.Schema({
    id: Number,
    isbn10: String,
    isbn13: String,
    title: String,
    year: Number,
    publisher: String,
    production: {
        status: String,
        binding: String,
        size: String,
        pages: Number,
        instock: Date
    },
    category: {
        main: String,
        secondary: String
    }
});
var Stock = mongoose.model('Stock', bookSchema);
var app = express();
app.use(parser.json());
app.use(parser.urlencoded({
    extended: true
}));

app.route('/api/stocks')
    .get(function (req, resp) {
        // use mongoose to retrieve all books from Mongo
        Book.find({}, function (err, data) {
            if (err) {
                resp.json({
                    message: 'Unable to connect to books'
                });
            } else {
                // return JSON retrieved by Mongo as response
                resp.json(data);
            }
        });
    });

app.route('/api/books/:name')
    .get(function (req, resp) {
        Book.find({
            Name: req.params.name
        }, function (err, data) {
            if (err) {
                resp.json({
                    message: 'Stock not found'
                });
            } else {
                resp.json(data);
            }
        });
    });


    app.route('/api/books/:sector')
    .get(function (req, resp) {
        Book.find({
            Name: req.params.name
        }, function (err, data) {
            if (err) {
                resp.json({
                    message: 'Stock not found'
                });
            } else {
                resp.json(data);
            }
        });
    });



app.route('/api/books/pages/:date/:symbol')
    .get(function (req, resp) {
        Book.find().where('Sector')
            .gt(req.params.date)
            .lt(req.params.symbol)
            .sort({
                title: 1
            })
            .select('title isbn10')
            .exec(function (err, data) {
                if (err) {
                    resp.json({
                        message: 'Books not found'
                    });
                } else {
                    resp.json(data);
                }
            });
    });

// Use express to listen to port
let port = 8080;
app.listen(port, function () {
    console.log("Server running at port= " + port);
});