var express = require('express');
var router = express.Router();
var redis = require('redis');
var client = redis.createClient(6379, "127.0.0.1");

var reserve = require('../api/reserve.js');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('main');
});

router.post('/reserveWrite', function (req, res) {
  console.log('## POST /reserveWrite');
  var inputData = req.body;
  var maxIndex;
  client.hkeys("reserve", function (err, reply) {
    var keysArray = new Array();
    if (reply.length == 0) {
      maxIndex = 1;
    } else {
      reply.forEach(function (reply, index) {
        keysArray.push(parseInt(reply));
      })
      maxIndex = Math.max.apply(null, keysArray) || 1;
      maxIndex++;
    }
    client.hset('reserve', maxIndex, JSON.stringify(inputData), function (err, reply) {
      if (err) return;
      res.send();
    });
  })
})

router.post('/reserveGet', function (req, res) {
  console.log('## POST / /reserveGet');
  var daysArray = req.body.daysArray;
  var _result = {
    response: 'false',
    resultJson: {}
  }
  client.hgetall("reserve", function (err, reply) {
    for (key in reply) {
      var parseReply = JSON.parse(reply[key]);
      for (var i = 0; i < daysArray.length; i++) {
        if (parseReply.date == daysArray[i]) {
          _result.response = 'true';
          _result.resultJson[key] = parseReply;
        }
      }
    }
    res.send(_result);
  })
});


router.post('/reserveGetByKey', function (req, res) {
  var _result = {
    resCode: 'false',
    resultJson: {}
  }

  var key = req.body.key;
  client.hget("reserve", key, function (err, reply) {
    if (err) {
      console.log(err);
      res.send();
    }
    _result.resCode = 'true';
    _result.resultJson = reply;
    res.send(_result);
  });
})

router.post('/reserveUpdate', function (req, res) {
  var inputData = req.body;
  client.hset('reserve', key, JSON.stringify(inputData), function (err, reply) {
    if (err) return;
    res.send();
  });
})


router.post('/reserveDelete', function (req, res) {
  console.log('reserveDelete');

  var key = req.body.key;
  var result = {
    resCode: 'false',
  }

  client.hdel('reserve', key, function (err, reply) {
    if (err) return;

    result.resCode = 'success';
    res.send(result);
  })

})

router.post('/reserveCheck', function (req, res) {
  var date = req.body.date;
  var time = req.body.time;
  var check;
  var result = {
    resCode: 'fail'
  }
  client.hgetall('reserve', function (err, reply) {
    for (key in reply) {
      var parseReply = JSON.parse(reply[key]);
      if (parseReply.date == date) {
        check = fnCheckTime(parseReply.startTime, parseReply.endTime, time)
        if (check) {
          result.resCode = 'success';
          result.reply = JSON.stringify(parseReply);
        }
      }
    }
    res.send(result);
  })
})

function fnCheckTime(startTime, endTime, curTime) {
  var result;
  var startDate = new Date();
  var endDate = new Date();
  var curDate = new Date();

  if (endDate.length == 3) {
    endDate.setHours(parseInt(endTime.substring(0, 1)), parseInt(endTime.substring(1, 3)), 0);
  } else {
    endDate.setHours(parseInt(endTime.substring(0, 2)), parseInt(endTime.substring(2, 4)), 0);
  }

  if (startTime.length == 3) {
    startDate.setHours(startTime.substring(0, 1), startTime.substring(1, 3), 0);
  } else {
    startDate.setHours(startTime.substring(0, 2), startTime.substring(2, 4), 0);
  }
  curDate.setHours(curTime.substring(0, 2), curTime.substring(2, 4), 0);

  if (startDate <= curDate && curDate <= endDate) {
    result = true;
  } else {
    result = false;
  }

  return result;
}

router.get('/a', function (req, res) {
  res.render('calendar');
})

module.exports = router;