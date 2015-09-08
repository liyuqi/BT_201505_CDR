// mongo cdr cep3g_gen_time.js --eval "var start = 0, end = 1, pick = 10000;" > cep3g_gen_$(date +"%Y%m%d")_$(date +"%H%M%S").txt

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
        item.time = new ISODate
                        (new Date
                                (new Date(
                                    new Date().getTime() + day * 24 * 60 * 60 * 1000)
                                ).toJSON().substr(0, 11)
                            + item.date_time.substr(11,8)
                        );

        //item.STARTOFCHARGINGDATE = new Date((new Date).getTime() + day * 24 * 60 * 60 * 1000 /*+ milli*/).toJSON().substr(0, 10);
        //item.TIMESTAMP = new Date((new Date).getTime() + day * 24 * 60 * 60 * 1000 /*+ milli*/).toLocaleTimeString();
        item.date_time = (new ISODate
                            (new Date
                                (new Date(
                                        new Date().getTime() + day * 24 * 60 * 60 * 1000)
                                ).toJSON().substr(0, 11)
                                + item.date_time.substr(11,8)
                            )
                        ).toJSON();
 /*gprs*/       //item.G_RECORD_OPENING_TIME = new Date((new Date).getTime() + day * 24 * 60 * 60 * 1000 /*+ milli*/).toJSON();
        //print(item.STARTOFCHARGINGDATE + '\t' + item.TIMESTAMP + '\t' + item.time.toJSON());
        db.cep3g_gen.insert(item);
        //milli++;
    });

    print(new Date().toLocaleTimeString()+'\tprocess: day'+day+'\trec:'+db.cep3g_gen.count());
}

print(new Date().toLocaleTimeString()+'\tprocess: end');


//item.time = (new ISODate
//                (new Date
//                        (new Date(
//                            new Date() + 1 * 24 * 60 * 60 * 1000)
//                        ).toJSON().substr(0, 11)
//                    + '18:25:14'
//                )
//            ).toJSON();