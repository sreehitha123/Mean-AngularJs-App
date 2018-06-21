var express = require('express'),
    cors = require('cors'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose');
var Employee  = require("./models/employee");
var Posts  = require("./models/posts");
var app = express();


app.use(cors({
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200
}));
app.use(bodyParser.json());


app.use(express.static(__dirname + '/client'));

mongoose.connect('mongodb://localhost/mean');


app.post('/post', (req, res) => {
    console.log(req.body.keyword);
    var newPost = new Posts(req.body);

    newPost.save().then((doc) => {
        console.log(doc);
        res.json(doc);
    });
});


app.post('/register', (req, res) => {
    var newEmployee = new Employee(req.body);

    newEmployee.save().then((doc) => {
        console.log(doc);
        res.json({
            flg: true,
            name: req.body.name
        });
    }, (e) => {
        console.log(e);
        res.json({
            flg: false,
            name: req.body.name
        });
    });
});

app.post('/login', (req, res) => {
    Employee.find({
        name: req.body.name
    }).then((doc) => {
        if (doc.length == 0) {
            res.json({
                flg: false,
                name: null
            });
        } else {
            if (doc[0].password == req.body.password) {
                res.json({
                    flg: true,
                    name: doc[0].name
                });
            } else {
                res.json({
                    flg: false,
                    name: null
                });
            }
        }
    }).catch((err) => {
        console.log("Error", err);
    });
});

app.get('/getEmployee/:uname', (req, res) => {
    Employee.find({
        name: req.params.uname
    }).then((doc) => {
        res.json({
            flg: true,
            doc: doc
        });
    }).catch((err) => {
        res.json(err);
    });
});



app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.listen(1200, () => {
    console.log('Server running on localhost:1200');
});