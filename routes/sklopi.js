var express = require('express');
var router = express.Router();

var gifshot = require('./gifshot');

var baseUrl = "http://sszj.fri.uni-lj.si/datoteke/sprites_low/";
// var baseUrl = "/images/gif/";

var dbBesedajson = require('./beseda.json');
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


router.get('/', function (req, res, next) {

    var searchSklop = req.query.q;
    var foundSklop = getSklop(searchSklop);

    if (searchSklop !== undefined && foundSklop[0] === undefined) {
        res.send("no topic");
    }
    else if (searchSklop !== undefined && foundSklop[0] !== undefined) {

        foundSklop[0].words = getWords(foundSklop[0].tematskiSklop_id);
        res.send(foundSklop[0]);
    }
    else {
        // send all topics
        for(skl in dbSklopi){
            if(dbSklopi[skl].words != undefined || dbSklopi[skl].words != null){
                delete dbSklopi[skl].words;
            }
        }
        


        res.send(dbSklopi);
    }

});

module.exports = router;
// connection.end();