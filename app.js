var express = require('express'),
    mongoose = require('mongoose'),
    cors = require('cors'),
    bodyParser = require('body-parser');
var db = mongoose.connect('mongodb://localhost/bookapi');

var Book = require('./models/bookModel');

var app = express();

var port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

bookRouter = require('./Routes/bookRoutes')(Book);


app.use('/api/books', bookRouter);
//app.use('/api/authors', authorRouter);



app.get('/', function(req, res) {
    res.send('welcome to my API');


});

app.listen(port, function(){
    console.log('Gulp is running my app on PORT: ' + port);


});