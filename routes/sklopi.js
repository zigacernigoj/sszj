var express = require('express');
var router = express.Router();

var gifshot = require('./gifshot');

var baseUrl = "http://sszj.fri.uni-lj.si/datoteke/sprites_low/";
// var baseUrl = "/images/gif/";

var dbBesedajson = require('./beseda.json');
var dbBesedaEnakaKretnja = require('./beseda_enakaKretnja.json');
var dbBesedaSestavljena = require('./beseda_sestavljena.json');
var dbSSKJ = require('./sskj_cache.json');
var dbSklopi = require('./tematskiSklopi.json');

function getWords(sklopID) {
    return dbBesedajson.filter(
        function (dbBesedajson) {
            return dbBesedajson.beseda_tematskiSklop_id === sklopID
        }
    );
}



function getSklop(sklop_name) {
    return dbSklopi.filter(
        function (dbSklopi) {
            return dbSklopi.tematskiSklop_ime === sklop_name;
        }
    );
}


// beseda_tematskiSklop_id

router.get('/', function (req, res, next) {

    var searchSklop = req.query.q;
    var foundSklop = getSklop(searchSklop);

    if (searchSklop !== undefined && foundSklop[0] === undefined) {
        res.send("no topic");
    }
    else if (searchSklop !== undefined && foundSklop[0] !== undefined) {

        var words = getWords(foundSklop[0].tematskiSklop_id);

        foundSklop[0].words = words;
        
        res.send(foundSklop[0]);
    }
    else {
        // send all words
        res.send(dbSklopi);
    }

});

module.exports = router;
// connection.end();