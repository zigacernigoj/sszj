var express = require('express');
var router = express.Router();

var baseUrl = "http://sszj.fri.uni-lj.si/datoteke/sprites_low/";
var gifUrl = "https://sszj.herokuapp.com/images/";
var request1 = require('ajax-request');

var LocalStorage = require('node-localstorage').LocalStorage,
    localStorage = new LocalStorage('./scratch');


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
        res.send(dbBesedajson);
    }
    else {


        var foundWord = getWord(searchBeseda);
        if (foundWord[0] === undefined) {
            res.send("no word");
        }
        else if (foundWord[0] !== undefined) { /////////

            var wordResult = {};

            wordResult.id = foundWord[0].beseda_id;
            wordResult.beseda = foundWord[0].beseda_prava;
            wordResult.osnovna = foundWord[0].beseda_osnova;

            var sklop = getTematskiSklop(foundWord[0].beseda_tematskiSklop_id);
            wordResult.sklopId = sklop.tematskiSklop_id;
            wordResult.sklopName = sklop.tematskiSklop_ime;

            if (foundWord[0].beseda_osnova === 1) {
                // found word is OSNOVNA

                wordResult.jpg1 = baseUrl + foundWord[0].beseda_oznaka + '.jpg';
                wordResult.gif1 = gifUrl + foundWord[0].beseda_oznaka + '.gif';

                wordResult.jpg = [wordResult.jpg1];

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
                    wordResult.gif1 = gifUrl + sameWord[0].beseda_oznaka + '.gif';

                    wordResult.jpg = [wordResult.jpg1];

                    wordResult.enaka = sameWord[0].beseda_prava;

                    wordResult.osnovne = [wordResult.enaka];

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

                    var gif1 = gifUrl + word1[0].beseda_oznaka + '.gif'; // .gif
                    var gif2 = gifUrl + word2[0].beseda_oznaka + '.gif'; // .gif

                    wordResult.osnovna1 = word1[0].beseda_prava;
                    wordResult.osnovna2 = word2[0].beseda_prava;
                    wordResult.jpg1 = jpg1;
                    wordResult.jpg2 = jpg2;
                    wordResult.gif1 = gif1;
                    wordResult.gif2 = gif2;

                    wordResult.jpg = [jpg1, jpg2];
                    wordResult.osnovne = [wordResult.osnovna1, wordResult.osnovna2];


                    if (word3[0] !== undefined) {
                        var jpg3 = baseUrl + word3[0].beseda_oznaka + '.jpg'; // .jpg
                        composedJpgs += jpg3;

                        var gif3 = gifUrl + word3[0].beseda_oznaka + '.gif'; // .gif

                        wordResult.osnovna3 = word3[0].beseda_oznaka;
                        wordResult.jpg3 = jpg3;
                        wordResult.gif3 = gif3;

                        wordResult.jpg.push(jpg3);
                        wordResult.osnovne.push(wordResult.osnovna3);
                    }

                    wordResult.gifOsnovna = gifUrl + foundWord[0].beseda_oznaka + '.gif';

                    res.send(wordResult);

                }
            }


        }///////
    }
});

module.exports = router;