const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();


app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
	res.redirect('index.html');
});

app.get('/css/app.css', function (req, res) {
	res.sendFile(path.join(__dirname + '/css/app.css'));
});

app.get('/js/app.js', function (req, res) {
	res.sendFile(path.join(__dirname + '/js/app.js'));
});

//add the router
app.use('/', router);
app.listen(process.env.port || 3000);

console.log('Running at Port 3000');