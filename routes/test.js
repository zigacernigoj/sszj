var express = require('express');
var router = express.Router();
var dbBesedajson = require('./beseda.json');


// var mysql = require('mysql');
// var connection = mysql.createConnection({
//     host: 'sql203.000a.biz',
//     user: 'a000b_12082540',
//     password: '000aPIKAb1z',
//     database: 'a000b_12082540_sszj'
//     // host: 'localhost',
//     // user: 'root',
//     // password: '',
//     // database: 'sszj'
// });
//
// connection.connect();


function getWord(word) {
    return dbBesedajson.filter(
        function (dbBesedajson) {
            return dbBesedajson.beseda_prava === word
        }
    );
}


router.get('/', function (req, res, next) {

    var searchBeseda = req.query.q;
    // console.log(req.query.beseda);

    if (searchBeseda !== undefined) {
        var foundWord = getWord(searchBeseda);
        res.send(foundWord);
    }
    else {
        res.send(dbBesedajson);
    }

});

module.exports = router;
// connection.end();