var express = require('express');
var router = express.Router();

var dbBesedajson = require('./beseda.json');

router.get('/', function (req, res, next) {

    var searchTerm = req.query.q;
    var result = "";

    if (searchTerm !== undefined) {
        var re = new RegExp("^"+searchTerm,"gmi");

        for(i in dbBesedajson){
            var m;
            var str = dbBesedajson[i].beseda_prava;

            while ((m = re.exec(str)) != null) {
                if (m.index === re.lastIndex) {
                    re.lastIndex++;
                }

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