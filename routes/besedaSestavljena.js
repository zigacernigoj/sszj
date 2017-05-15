// var express = require('express');
// var router = express.Router();
//
// var mysql = require('mysql');
// var connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'sszj'
// });
//
// connection.connect();
//
// router.get('/', function (req, res, next) {
//
//     connection.query('SELECT * FROM beseda_sestavljena', function (error, results, fields) {
//         if (error) throw error;
//
//         res.send(results);
//
//     });
//
// });
//
// module.exports = router;
// // connection.end();