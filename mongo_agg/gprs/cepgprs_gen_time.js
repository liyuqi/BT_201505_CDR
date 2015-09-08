// mongo cdr cepgprs_gen_time.js > genCDRgprs_result.txt
// mongo cdr cepgprs_gen_time.js --eval "var start= 0 , end= 10, pick = 10000;"> cepgprs_gen_$(date +"%Y%m%d")_$(date +"%H%M%S")_result0010.txt;
// mongo cdr cepgprs_gen_time.js --eval "var start= 10, end= 20, pick = 10000;"> cepgprs_gen_$(date +"%Y%m%d")_$(date +"%H%M%S")_result1020.txt;
// mongo cdr cepgprs_gen_time.js --eval "var start= 20, end= 30, pick = 10000;"> cepgprs_gen_$(date +"%Y%m%d")_$(date +"%H%M%S")_result2030.txt;
// mongo cdr cepgprs_gen_time.js --eval "var start= 30, end= 40, pick = 10000;"> cepgprs_gen_$(date +"%Y%m%d")_$(date +"%H%M%S")_result3040.txt;
// mongo cdr cepgprs_gen_time.js --eval "var start= 40, end= 50, pick = 10000;"> cepgprs_gen_$(date +"%Y%m%d")_$(date +"%H%M%S")_result4050.txt;
// mongo cdr cepgprs_gen_time.js --eval "var start= 50, end= 60, pick = 10000;"> cepgprs_gen_$(date +"%Y%m%d")_$(date +"%H%M%S")_result5060.txt;
// mongo cdr cepgprs_gen_time.js --eval "var start= 60, end= 70, pick = 10000;"> cepgprs_gen_$(date +"%Y%m%d")_$(date +"%H%M%S")_result6070.txt;
// mongo cdr cepgprs_gen_time.js --eval "var start= 70, end= 80, pick = 10000;"> cepgprs_gen_$(date +"%Y%m%d")_$(date +"%H%M%S")_result7080.txt;
// mongo cdr cepgprs_gen_time.js --eval "var start= 80, end= 90, pick = 10000;"> cepgprs_gen_$(date +"%Y%m%d")_$(date +"%H%M%S")_result8090.txt;

// mongo cdr cepgprs_gen_time.js --eval "var start= 5, end=10, pick = 10000;"> cepgprs_gen_$(date +"%Y%m%d")_$(date +"%H%M%S")_result0510.txt;
// mongo cdr cepgprs_gen_time.js --eval "var start=10, end=15, pick = 10000;"> cepgprs_gen_$(date +"%Y%m%d")_$(date +"%H%M%S")_result1015.txt;
// mongo cdr cepgprs_gen_time.js --eval "var start=15, end=20, pick = 10000;"> cepgprs_gen_$(date +"%Y%m%d")_$(date +"%H%M%S")_result1520.txt;
// mongo cdr cepgprs_gen_time.js --eval "var start=20, end=25, pick = 10000;"> cepgprs_gen_$(date +"%Y%m%d")_$(date +"%H%M%S")_result2025.txt;
// mongo cdr cepgprs_gen_time.js --eval "var start=25, end=30, pick = 10000;"> cepgprs_gen_$(date +"%Y%m%d")_$(date +"%H%M%S")_result2530.txt;
// mongo cdr cepgprs_gen_time.js --eval "var start=30, end=35, pick = 10000;"> cepgprs_gen_$(date +"%Y%m%d")_$(date +"%H%M%S")_result3035.txt;
// mongo cdr cepgprs_gen_time.js --eval "var start=35, end=40, pick = 10000;"> cepgprs_gen_$(date +"%Y%m%d")_$(date +"%H%M%S")_result3540.txt;
// mongo cdr cepgprs_gen_time.js --eval "var start=40, end=45, pick = 10000;"> cepgprs_gen_$(date +"%Y%m%d")_$(date +"%H%M%S")_result4045.txt;
// mongo cdr cepgprs_gen_time.js --eval "var start=45, end=50, pick = 10000;"> cepgprs_gen_$(date +"%Y%m%d")_$(date +"%H%M%S")_result4550.txt;

var row = 0 ;
print(new Date().toLocaleTimeString()+'\tprocess: start');
for (var day = start; day <end; day++) {
//for (var day = 5; day > 0; day--) {
//    var milli = 0;
    //var cdrgprs = db.cepgprs_sample.find({
    var cdrgprs = db.cepgprs.find({
        //time : interval
        //CALLTRANSACTIONTYPE:{$in:["1","2"]} //2g
        //record_type:{$in:["1","2"]} //3g
        RECORD_TYPE:"19" //gprs
    },{}).limit(pick);
    //for (var milli = 0; milli < 1000; milli++) {
    cdrgprs.forEach(function (doc) {

        var item = doc;
        item._id = new ObjectId();
        item.time =
            new ISODate
                (new Date
                    (new Date(
                            new Date().getTime() + day * 24 * 60 * 60 * 1000)
                    ).toJSON().substr(0, 11)
                    + item.G_RECORD_OPENING_TIME.substr(11,8)
                );
        //item.STARTOFCHARGINGDATE = new Date((new Date).getTime() + day * 24 * 60 * 60 * 1000 /*+ milli*/).toJSON().substr(0, 10);
        //item.TIMESTAMP = new Date((new Date).getTime() + day * 24 * 60 * 60 * 1000 /*+ milli*/).toLocaleTimeString();
        //item.date_time = new Date((new Date).getTime() + day * 24 * 60 * 60 * 1000 /*+ milli*/).toJSON();
        item.G_RECORD_OPENING_TIME =
            (new ISODate
                (new Date
                    (new Date(
                            new Date().getTime() + day * 24 * 60 * 60 * 1000)
                    ).toJSON().substr(0, 11)
                    + item.G_RECORD_OPENING_TIME.substr(11,8)
                )
            ).toJSON();
        //print(item.STARTOFCHARGINGDATE + '\t' + item.TIMESTAMP + '\t' + item.time.toJSON());
        db.cepgprs_gen.insert(item);
        //milli++;
    });

    print(new Date().toLocaleTimeString()+'\tprocess: day'+day+'\trec:'+db.cepgprs_gen.count());
}

print(new Date().toLocaleTimeString()+'\tprocess: end');