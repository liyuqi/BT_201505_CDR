// mongo cdr cep3g_gen.js --eval "var start = 0, end = 1, pick = 10000" > cep3g_gen.txt

print(new Date().toLocaleTimeString()+'\tprocess: start');

var row = 0 ;
for (var day = start; day < end; day++) {
    var cdr3g = db.cep3g_sample.find({
        //time : interval
        record_type:{$in:["1","2"]}
    },{}).limit(pick);
    cdr3g.forEach(function (doc) {

        var item = doc;
        item._id = new ObjectId();
        item.time = new Date((new Date).getTime() + day * 24 * 60 * 60 * 1000 /*+ milli*/);
        //item.STARTOFCHARGINGDATE = new Date((new Date).getTime() + day * 24 * 60 * 60 * 1000 /*+ milli*/).toJSON().substr(0, 10);
        //item.TIMESTAMP = new Date((new Date).getTime() + day * 24 * 60 * 60 * 1000 /*+ milli*/).toLocaleTimeString();
        item.date_time = new Date((new Date).getTime() + day * 24 * 60 * 60 * 1000 /*+ milli*/).toJSON();
 /*gprs*/       //item.G_RECORD_OPENING_TIME = new Date((new Date).getTime() + day * 24 * 60 * 60 * 1000 /*+ milli*/).toJSON();
        //print(item.STARTOFCHARGINGDATE + '\t' + item.TIMESTAMP + '\t' + item.time.toJSON());
        db.cep3g_gen.insert(item);
        //milli++;
    });

    print(new Date().toLocaleTimeString()+'\tprocess: day'+day);
}

print(new Date().toLocaleTimeString()+'\tprocess: end');
