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
    // console.log(req.query.beseda);
    var foundWord = getWord(searchBeseda);

    // console.log(searchBeseda);
    // console.log(foundWord);

    if (searchBeseda !== undefined && foundWord[0] === undefined) {
        res.send("no word");
    }
    else if (searchBeseda !== undefined && foundWord[0] !== undefined) {

        var wordResult = {};

        wordResult.id = foundWord[0].beseda_id;
        wordResult.beseda = foundWord[0].beseda_prava;
        wordResult.osnovna = foundWord[0].beseda_osnova;

        var sklop = getTematskiSklop(foundWord[0].beseda_tematskiSklop_id);
        wordResult.sklopId = sklop.tematskiSklop_id;
        wordResult.sklopName = sklop.tematskiSklop_ime;

        if(getSSKJopis(foundWord[0].beseda_prava)[0] != undefined) {
            wordResult.sskjGeslo = getSSKJopis(foundWord[0].beseda_prava)[0].sskj_cache_poizvedba;
            wordResult.sskjOpis = getSSKJopis(foundWord[0].beseda_prava)[0].sskj_cache_vsebina;
        }

        if (foundWord[0].beseda_osnova === 1) {
            // found word is OSNOVNA

            wordResult.jpg1 = baseUrl + foundWord[0].beseda_oznaka + '.jpg';
            wordResult.gif1 = "NOT_AVAILABLE/" + foundWord[0].beseda_oznaka + '.gif';

            res.send(wordResult);

        }
        else {
            // found word isn't OSNOVNA

            var sameWordsIds = getSameIds(foundWord[0].beseda_id);
            var composedWordsIds = getCompositeIds(foundWord[0].beseda_id);

            if (sameWordsIds[0] !== undefined) {
                // found word is same as other word

                var sameWord = getWordByID(sameWordsIds[0].beseda_enakaKretnja_osnova_beseda_id);

                wordResult.jpg1 = baseUrl + sameWord[0].beseda_oznaka + '.jpg';
                wordResult.gif1 = "NOT_AVAILABLE/" + sameWord[0].beseda_oznaka + '.gif';

                wordResult.enaka = sameWord[0].beseda_prava;

                res.send(wordResult);

            }
            else if (composedWordsIds[0] !== undefined) {
                // found word is composed of multiple words

                // TODO: find and combine images of words
                var word1 = getWordByID(composedWordsIds[0].beseda_sestavljena_osnova1_beseda_id);
                var word2 = getWordByID(composedWordsIds[0].beseda_sestavljena_osnova2_beseda_id);
                var word3 = getWordByID(composedWordsIds[0].beseda_sestavljena_osnova3_beseda_id);

                var jpg1 = baseUrl + word1[0].beseda_oznaka + '.jpg'; // .jpg
                var jpg2 = baseUrl + word2[0].beseda_oznaka + '.jpg'; // .jpg
                var composedJpgs = jpg1 + jpg2;

                var gif1 = "NOT_AVAILABLE/" + word1[0].beseda_oznaka + '.gif'; // .gif
                var gif2 = "NOT_AVAILABLE/" + word2[0].beseda_oznaka + '.gif'; // .gif

                wordResult.osnovna1 = word1[0].beseda_oznaka;
                wordResult.osnovna2 = word2[0].beseda_oznaka;
                wordResult.jpg1 = jpg1;
                wordResult.jpg2 = jpg2;
                wordResult.gif1 = gif1;
                wordResult.gif2 = gif2;


                if (word3[0] !== undefined) {
                    var jpg3 = baseUrl + word3[0].beseda_oznaka + '.jpg'; // .jpg
                    composedJpgs += jpg3;

                    var gif3 = "NOT_AVAILABLE/" + word3[0].beseda_oznaka + '.gif'; // .gif

                    wordResult.osnovna3 = word3[0].beseda_oznaka;
                    wordResult.jpg3 = jpg3;
                    wordResult.gif3 = gif3;
                }

                res.send(wordResult);
                
            }
        }


    }
    else {
        // send all words
        res.send(dbBesedajson);
    }

});

module.exports = router;
// connection.end();