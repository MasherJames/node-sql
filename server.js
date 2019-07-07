var express = require('express');
var mysql = require('mysql');
var dotenv = require('dotenv');
var path = require('path');
var fileUpload = require('express-fileupload');
var bodyParser = require('body-parser');

dotenv.config();

const { getHomePage } = require('./routes/index');
const { addPlayerPage, addPlayer, deletePlayer, editPlayer, editPlayerPage } = require('./routes/player');
var port = process.env.PORT || 5000;

var app = express();

var db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});


db.connect(function(err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log('Database connection successfully made');
    createTable();
});

function createTable() {
    let sql = 'CREATE TABLE IF NOT EXISTS players(id int AUTO_INCREMENT, name VARCHAR(255) NOT NULL, position VARCHAR(255) NOT NULL,number int(11) NOT NULL,image varchar(255) NOT NULL, PRIMARY KEY(id))';

    db.query(sql, function(err, result) {
        if (err) throw err;
        console.log('Players table created...');
    });
}

global.db = db;

app.set('port', process.env.port || port);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());

app.get('/', getHomePage);
app.get('/add', addPlayerPage);
app.get('/edit/:id', editPlayerPage);
app.get('/delete/:id', deletePlayer);
app.post('/add', addPlayer);
app.post('/edit/:id', editPlayer);

app.listen(port, function() {
    console.log('Server is running on port: ' + port);
});