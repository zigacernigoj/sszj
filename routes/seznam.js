var express = require('express');
var router = express.Router();

var gifshot = require('./gifshot');

var baseUrl = "http://sszj.fri.uni-lj.si/datoteke/sprites_low/";
// var baseUrl = "/images/gif/";

var dbBesedajson = require('./beseda.json');



router.get('/', function (req, res, next) {

    var searchTerm = req.query.q;
    var result = "";

    if (searchTerm !== undefined) {

        var re = new RegExp("^"+searchTerm,"gmi");
        console.log(re);
        

        for(i in dbBesedajson){
            var m;
            var str = dbBesedajson[i].beseda_prava;

            while ((m = re.exec(str)) != null) {
                if (m.index === re.lastIndex) {
                    re.lastIndex++;
                }

                console.log(str);
                result += dbBesedajson[i].beseda_prava+"\n";
            }
        }

        res.send(result);

    }
    else {
        // send all words
        var result = "";

        for(i in dbBesedajson){
            result += dbBesedajson[i].beseda_prava+"\n";
        }


        res.send(result);
    }

});

module.exports = router;
// connection.end();