var express = require('express');
var router = express.Router();

var request1 = require('ajax-request');
var baseUrl = "http://sszj.fri.uni-lj.si/datoteke/sprites_low/";
var gifUrl = "https://sszj.herokuapp.com/images/";

var dbBesedajson = require('./beseda.json');
var dbBesedaEnakaKretnja = require('./beseda_enakaKretnja.json');
var dbBesedaSestavljena = require('./beseda_sestavljena.json');
var dbSSKJ = require('./sskj_cache.json');
var dbSklopi = require('./tematskiSklopi.json');

function getWord(word) {
    return dbBesedajson.filter(
        function (dbBesedajson) {
            return dbBesedajson.beseda_prava.toLowerCase() === word.toLowerCase()
        }
    );
}

function getWordByID(wordId) {
    return dbBesedajson.filter(
        function (dbBesedajson) {
            return dbBesedajson.beseda_id === wordId
        }
    );
}

function getSameIds(wordId) {
    return dbBesedaEnakaKretnja.filter(
        function (dbBesedaEnakaKretnja) {
            return dbBesedaEnakaKretnja.beseda_enakaKretnja_beseda_id === wordId;
        }
    );
}

function getCompositeIds(wordId) {
    return dbBesedaSestavljena.filter(
        function (dbBesedaSestavljena) {
            return dbBesedaSestavljena.beseda_sestavljena_beseda_id === wordId;
        }
    );
}

function getSSKJopis(word) {
    return dbSSKJ.filter(
        function (dbSSKJ) {
            return dbSSKJ.sskj_cache_poizvedba.toLowerCase() === word.toLowerCase();
        }
    );
}

function getTematskiSklop(sklopId) {
    return dbSklopi.filter(
        function (dbSklopi) {
            return dbSklopi.tematskiSklop_id === sklopId;
        }
    );
}

router.get('/', function (req, res, next) {

    var searchBeseda = req.query.q;

    if (searchBeseda === undefined) {
        // send all words
        res.send("wrong request");
    }
    else {
        var foundWord = getWord(searchBeseda);
        if (foundWord[0] === undefined) {
            res.send("no word");
        }
        else if (foundWord[0] !== undefined) {

            request1({
                url: 'http://bos.zrc-sazu.si/cgi/a03.exe',
                method: 'GET',
                data: {
                    name: 'sskj_testa',
                    expression: searchBeseda
                }
            }, function (err, res1, body) {

                var sskj_content = body;
                var start = sskj_content.indexOf("<li");
                var stop = sskj_content.indexOf("<li", start + 1);

                if (!stop) {
                    stop = sskj_content.indexOf("</ol", start + 1);
                }
                sskj_content = sskj_content.substring(start, stop);

                // Odstrani vse font tag-e
                sskj_content = sskj_content.replace(/<font[^>]*>/gi, "");
                sskj_content = sskj_content.replace(/<\/font>/gi, "");

                // Odstrani vse li tag-e
                sskj_content = sskj_content.replace(/<li[^>]*>/gi, "");
                sskj_content = sskj_content.replace(/<\/li>/gi, "");

                // Odstrani nbsp
                sskj_content = sskj_content.replace(/&nbsp;/gi,'');

                // Odstrani note
                sskj_content = sskj_content.replace("&#x266A;", "");

                if(sskj_content == "") {
                    sskj_content = "<i>Opis ni na voljo.</i>";
                }

                res.send(sskj_content);
            });


        }


    }
});

module.exports = router;