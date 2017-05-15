var express = require('express');
var router = express.Router();

var gifshot = require('./gifshot');

var baseUrl = "http://sszj.fri.uni-lj.si/datoteke/sprites_low/";
// var baseUrl = "/images/gif/";

var dbBesedajson = require('./beseda.json');
var dbBesedaEnakaKretnja = require('./beseda_enakaKretnja.json');
var dbBesedaSestavljena = require('./beseda_sestavljena.json');
var dbSSKJ = require('./sskj_cache.json'); // sskj_cache_poizvedba

function getWord(word) {
    return dbBesedajson.filter(
        function (dbBesedajson) {
            return dbBesedajson.beseda_prava === word
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
            return dbSSKJ.sskj_cache_poizvedba === word;
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

        if (foundWord[0].beseda_osnova === 0) {
            // found word isn't OSNOVNA

            var sameWordsIds = getSameIds(foundWord[0].beseda_id);
            var composedWordsIds = getCompositeIds(foundWord[0].beseda_id);

            // console.log("same words ids", sameWordsIds[0]);
            // console.log("composite words ids", composedWordsIds[0]);

            if (sameWordsIds[0] !== undefined) {
                // found word is same as other word

                var sameWord = getWordByID(sameWordsIds[0].beseda_enakaKretnja_osnova_beseda_id);

                // res.send([foundWord, sameWord]);
                // res.send(baseUrl + sameWord[0].beseda_prava + ".gif");

                var wordResult = {};

                wordResult.beseda = searchBeseda;
                wordResult.img1 = baseUrl + sameWord[0].beseda_oznaka + '.jpg';
                wordResult.opis = getSSKJopis(searchBeseda);

                res.send(wordResult);

            }
            else if (composedWordsIds[0] !== undefined) {
                // found word is composed of multiple words

                // TODO: find and combine images of words
                var word1 = getWordByID(composedWordsIds[0].beseda_sestavljena_osnova1_beseda_id);
                var word2 = getWordByID(composedWordsIds[0].beseda_sestavljena_osnova2_beseda_id);
                var word3 = getWordByID(composedWordsIds[0].beseda_sestavljena_osnova3_beseda_id);

                var img1 = baseUrl + word1[0].beseda_oznaka + '.jpg'; // .jpg
                var img2 = baseUrl + word2[0].beseda_oznaka + '.jpg'; // .jpg
                var composedImgs = img1 + img2;


                var wordResult = {};

                wordResult.beseda = searchBeseda;
                wordResult.img1 = img1;
                wordResult.img2 = img2;
                wordResult.opis = getSSKJopis(searchBeseda);



                if(word3[0] !== undefined) {
                    var img3 = baseUrl + word3[0].beseda_oznaka + '.jpg'; // .jpg
                    composedImgs +=  img3;
                    wordResult.img3 = img3;
                }

                res.send(wordResult);


            }
        }
        else {
            // found word is OSNOVNA

            // res.send(foundWord);
            // res.send(baseUrl + foundWord[0].beseda_prava + ".gif");

            var wordResult = {};

            wordResult.beseda = searchBeseda;
            wordResult.img1 = baseUrl + foundWord[0].beseda_oznaka + '.jpg';
            wordResult.opis = getSSKJopis(searchBeseda);

            res.send(wordResult);

        }

    }
    else {
        // send all words
        res.send(dbBesedajson);
    }

});

module.exports = router;
// connection.end();