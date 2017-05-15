// var express = require('express');
// var router = express.Router();
// var dbBesedajson = require('./beseda.json');
// var fs = require('fs');
//
// var b64 = require('./b64');
// var GIFEncoder = require('./GIFEncoder');
//
// var GifEncoder = require('gif-encoder');
//
// var LZWEncoder = require('./LZWEncoder');
// var NeuQuant = require('./NeuQuant');
// var Canvas = require('canvas');
//
// var getPixels = require("get-pixels");
//
// router.get('/', function (req, res, next) {
//
//     // var canvas = document.getElementById('bitmap');
//     // var canvas = new Canvas(6000, 256);
//     // var context = canvas.getContext('2d');
//
//     //http://sszj.fri.uni-lj.si/datoteke/sprites_low/a.jpg
//
//
//
//     fs.readFile(__dirname + '/raw.png', function (err, data) {
//         if (err) throw err;
//         var img = new Canvas.Image; // Create a new Image
//         img.src = data;
//
//         console.log(data);
//
//         // Initialiaze a new Canvas with the same dimensions
//         // as the image, and get a 2D drawing context for it.
//         var canvas = new Canvas(img.width, img.height);
//         var context = canvas.getContext('2d');
//         context.drawImage(img, 0, 0, img.width, img.height);
//
//
//         getPixels(__dirname + '/raw.png', function (err, pixels) {
//             if (err) {
//                 console.log("Bad image path");
//                 return;
//             }
//
//
//             var pxls = context.getImageData(0, 0, img.width, img.height).data;
//
//             var file = require('fs').createWriteStream('img.gif');
//
//             var gif = new GifEncoder(img.width, img.height);
//             gif.pipe(file);
//             gif.writeHeader();
//             gif.addFrame(pxls);
//             // gif.addFrame(pixels); // Write subsequent rgba arrays for more frames
//             gif.finish();
//
//             console.log("got pixels", pixels);
//         });
//
//
//     });
//
//     res.send("finished");
//
//
// });
//
// module.exports = router;
// // connection.end();