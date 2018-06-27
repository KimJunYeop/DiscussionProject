var reserve = {};
var redis = require('redis');
var client = redis.createClient(6379, "127.0.0.1");


reserve.getIndex = function() {
    var _maxIndex;
    client.hkeys("reserve",function(err,reply){
        var keysArray = new Array();
        reply.forEach(function(reply,index){
            keysArray.push(parseInt(reply));
            console.log(index + " :  " + reply);
        })

        _maxIndex = Math.max.apply(null, keysArray);
        _maxIndex++;
        console.log('##reserve');
        console.log(_maxIndex);

        return _maxIndex;
    })
}


reserve.getHello = function() {
    // return 'hello';
    console.log('hello');



}

module.exports = reserve;