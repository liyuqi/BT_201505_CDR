// mongo cdr genCDR3g_start_end.js > genCDR3g_result.txt
// mongo cdr genCDR3g_start_end.js --eval "var start= 0 , end= 10;"> genCDR3g_$(date +"%H%M%S")_$(date +"%Y%m%d")_result0010.txt;
// mongo cdr genCDR3g_start_end.js --eval "var start= 10, end= 20;"> genCDR3g_$(date +"%H%M%S")_$(date +"%Y%m%d")_result1020.txt;
// mongo cdr genCDR3g_start_end.js --eval "var start= 20, end= 30;"> genCDR3g_$(date +"%H%M%S")_$(date +"%Y%m%d")_result2030.txt;
// mongo cdr genCDR3g_start_end.js --eval "var start= 30, end= 40;"> genCDR3g_$(date +"%H%M%S")_$(date +"%Y%m%d")_result3040.txt;
// mongo cdr genCDR3g_start_end.js --eval "var start= 40, end= 50;"> genCDR3g_$(date +"%H%M%S")_$(date +"%Y%m%d")_result4050.txt;
// mongo cdr genCDR3g_start_end.js --eval "var start= 50, end= 60;"> genCDR3g_$(date +"%H%M%S")_$(date +"%Y%m%d")_result5060.txt;
// mongo cdr genCDR3g_start_end.js --eval "var start= 60, end= 70;"> genCDR3g_$(date +"%H%M%S")_$(date +"%Y%m%d")_result6070.txt;
// mongo cdr genCDR3g_start_end.js --eval "var start= 70, end= 80;"> genCDR3g_$(date +"%H%M%S")_$(date +"%Y%m%d")_result7080.txt;
// mongo cdr genCDR3g_start_end.js --eval "var start= 80, end= 90;"> genCDR3g_$(date +"%H%M%S")_$(date +"%Y%m%d")_result8090.txt;

// mongo cdr genCDR3g_start_end.js --eval "var start= 5, end=10;"> genCDR3g_$(date +"%H%M%S")_$(date +"%Y%m%d")_result0510.txt;
// mongo cdr genCDR3g_start_end.js --eval "var start=10, end=15;"> genCDR3g_$(date +"%H%M%S")_$(date +"%Y%m%d")_result1015.txt;
// mongo cdr genCDR3g_start_end.js --eval "var start=15, end=20;"> genCDR3g_$(date +"%H%M%S")_$(date +"%Y%m%d")_result1520.txt;
// mongo cdr genCDR3g_start_end.js --eval "var start=20, end=25;"> genCDR3g_$(date +"%H%M%S")_$(date +"%Y%m%d")_result2025.txt;
// mongo cdr genCDR3g_start_end.js --eval "var start=25, end=30;"> genCDR3g_$(date +"%H%M%S")_$(date +"%Y%m%d")_result2530.txt;
// mongo cdr genCDR3g_start_end.js --eval "var start=30, end=35;"> genCDR3g_$(date +"%H%M%S")_$(date +"%Y%m%d")_result3035.txt;
// mongo cdr genCDR3g_start_end.js --eval "var start=35, end=40;"> genCDR3g_$(date +"%H%M%S")_$(date +"%Y%m%d")_result3540.txt;
// mongo cdr genCDR3g_start_end.js --eval "var start=40, end=45;"> genCDR3g_$(date +"%H%M%S")_$(date +"%Y%m%d")_result4045.txt;
// mongo cdr genCDR3g_start_end.js --eval "var start=45, end=50;"> genCDR3g_$(date +"%H%M%S")_$(date +"%Y%m%d")_result4550.txt;

var row = 0 ;
print(new Date().toLocaleTimeString()+'\tprocess: start');
for (var day = start; day <end; day++) {
//for (var day = 5; day > 0; day--) {
//    var milli = 0;
    var cdr3g = db.cep3g_sample.find({
        //time : interval
        //CALLTRANSACTIONTYPE:{$in:["1","2"]} //2g
        record_type:{$in:["1","2"]} //3g
        //RECORD_TYPE:"19" //gprs
    },{}).limit(100000);
    //for (var milli = 0; milli < 1000; milli++) {
    cdr3g.forEach(function (doc) {

        var item = doc;
        item._id = new ObjectId();
        item.time = new Date((new Date).getTime() + day * 24 * 60 * 60 * 1000 /*+ milli*/);
        //item.STARTOFCHARGINGDATE = new Date((new Date).getTime() + day * 24 * 60 * 60 * 1000 /*+ milli*/).toJSON().substr(0, 10);
        //item.TIMESTAMP = new Date((new Date).getTime() + day * 24 * 60 * 60 * 1000 /*+ milli*/).toLocaleTimeString();
        item.date_time = new Date((new Date).getTime() + day * 24 * 60 * 60 * 1000 /*+ milli*/).toJSON();
 /*gprs*/       //item.G_RECORD_OPENING_TIME = new Date((new Date).getTime() + day * 24 * 60 * 60 * 1000 /*+ milli*/).toJSON();
        //print(item.STARTOFCHARGINGDATE + '\t' + item.TIMESTAMP + '\t' + item.time.toJSON());
        db.gen_3g.insert(item);
        //milli++;
    });

    print(new Date().toLocaleTimeString()+'\tprocess: day'+day);
}

print(new Date().toLocaleTimeString()+'\tprocess: end');