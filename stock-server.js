var express = require('express');
var parser = require('body-parser');
var mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/funwebdev');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
    console.log("connected to mongo");
});
var stockSchema = new mongoose.Schema({
    Symbol: String,
    Company_Name: String,
    SEC_filings: String,
    Sector: String,
    Sub_Industry: String,
    Address_of_Headquarters: String,
    Date_first_added: Date,
    CIK: Number
});
var Stock = mongoose.model('Stock', stockSchema);
var app = express();
app.use(parser.json());
app.use(parser.urlencoded({
    extended: true
}));

app.route('/api/stocks/:symbol')
    .get(function (req, resp) {
        Stock.find({
                Symbol: req.params.symbol
            },
            function (err, data) {
                if (err) {
                    resp.json({
                        message: 'Stock not found'
                    });
                } else {
                    resp.json(data);
                }
            });
    });


app.route('/api/sector/:sector')
    .get(function (req, resp) {
        Stock.find({
            Sector: req.params.sector
        }, function (err, data) {
            if (err) {
                resp.json({
                    message: `No stocks with sector ${req.params.sector}`
                });
            } else {
                resp.json(data);
            }
        });
    });



app.route('/api/stocks/:date/:symbol')
    .get(function (req, resp) {
        Stock.find({"Prices.Name": req.params.symbol,"Prices.Date": new RegExp(req.params.date)},
        {'Prices.$': 1 },
        function (err, data) {
            if (err) {
                resp.json({
                    message: 'Stock not found'
                });
            } else {
                if(data.length > 0){resp.json(data);}else{resp.json("Null");}
            }
        });
    });

// Use express to listen to port
let port = 8080;
app.listen(port, function () {
    console.log("Server running at port= " + port);
});