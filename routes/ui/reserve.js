var express = require('express');
var router = express.Router();
var redis = require('redis');
var client = redis.createClient(6379, "127.0.0.1");

var reserve = require('../api/reserve.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('main');
});

router.post('/reserveWrite', function(req,res){ 
  console.log('## POST /reserveWrite');
  var inputData = req.body;
  var maxIndex;
  client.hkeys("reserve",function(err,reply){
    var keysArray = new Array();
    reply.forEach(function(reply,index){
        keysArray.push(parseInt(reply));
        console.log(index + " :  " + reply);
    })

    maxIndex = Math.max.apply(null, keysArray);
    maxIndex++;
    client.hset('reserve',maxIndex,JSON.stringify(inputData),redis.print);
  })
})


router.get('/a',function(req,res){
  res.render('calendar');
})

module.exports = router;
