// mongo --port 40000 cdr cep3g_mr.js   > ~/fluentd/agg/log/cep3g_mr.txt
//mongo cdr cep3g_mr.js > ./cep3g_mr_result_$(date +"%Y%m%d")_$(date +"%H%M%S").txt         db = 'cdr',
//mongo  192.168.0.196/cdr cep3g_mr.js --eval "var col = 'cep3g_join'"

//db = new Mongo().getDB(db.toString());
//var doc = db.getCollection(collection.toString()).findOne({},{_id:1});

print(new Date().toLocaleTimeString()+'\t3g mr start');
var mr3g = db.getCollection(col.toString()).mapReduce(
    function () {
        //var time= this.timestamp.substring(0,2);
        var key={};
        var value={};
        try {
            key = {
                //record_type: this.record_type
                //, STATISTIC_DATE: new Date(this.time.getTime).substr(0,13)
                DATE: this.date_time.substr(0, 10)
                , HOUR: this.date_time.substr(11, 2)
                , COUNTY: this.BTS_ADDRESS.substr(0, 3)
                , DISTRICT: this.BTS_ADDRESS.substr(3, 3)
                , SITE_NAME: this.SITE_NAME
                , SITE_ID: this.SITE_ID

                //, VENDOR : "$VENDOR"
                //, MODEL : "$MODEL"

                , END_CODE: this.cause_for_termination
                , SIM_TYPE: this.SIM_TYPE
                , CARRIER: this.CARRIER
                //, HANGOVER : this.HANGOVER
            };

            //var value = {};
            if (this.record_type == '1') {
                //value.HANGOVER= this.HANGOVER;
                value.CALLDURATION= this.orig_mcz_duration;
            }
            else if (this.record_type == '2') {
                //value.HANGOVER= this.HANGOVER;
                value.CALLDURATION= this.term_mcz_duration;
            }
            else {
                //value.HANGOVER=0;
                value.CALLDURATION=0;
            }
            emit(key, value);
        }catch(e){}
    },
    function (key, values) {
        var doc = {
             HO_CALLED_COUNT: 0
            ,HO_CALLED_MINUTES: 0
            ,HO_CALLED_SECONDS: 0
        };

        //try {
            values.forEach(function (value) {
                doc.HO_CALLED_COUNT += 1;
                doc.HO_CALLED_SECONDS += value.CALLDURATION;
            });

            if (!isNaN(doc.HO_CALLED_SECONDS))
                return doc;
        //}catch(e){}
    },
    {
        finalize:
            function (key,values){
                try {
                    if (!isNaN(values.HO_CALLED_SECONDS)) {
                        values.HO_CALLED_MINUTES = (values.HO_CALLED_SECONDS / 60.0);
                        return values;
                    }
                }catch(e){}
            },
        query: {
            //time: interval
            record_type:{$in:["1","2"]}
        },
        out: {
            replace:"cep3g_mr" //replace/merge/reduce
            //,inline:1 //use memory either shard
            //,sharded:1
            //,nonAtomic:0

        }
    }
);
//mongo cdr cep3g_mr.js > ./cep3g_mr_result_$(date +"%Y%m%d")_$(date +"%H%M%S").txt

print(new Date().toLocaleTimeString()+'\t3g mr end');
print(JSON.stringify(mr3g));
//db.cep3g_mr.find().skip(5).limit(2).pretty()
//mr3g.forEach(function(doc){
//    print(JSON.stringify(doc));
//});

//{
//    "result" : "cdr3g_mapR",
//    "timeMillis" : 9755,
//    "counts" : {
//    "input" : 228216,
//        "emit" : 228216,
//        "reduce" : 34578,
//        "output" : 4136
//},
//    "ok" : 1
//}

//db.cep3g_insert.find({
//    "record_type": "1",
//    //"date_time": /^2014-12-22 2/,
//    "BTS_ADDRESS": "台北市中正區",
//    "SITE_NAME": "中正公園",
//    "SITE_ID": "100PS",
//    //"END_CODE": "0000",
//    "SIM_TYPE": "ISIM",
//    "CARRIER": "台灣大哥大"
//},{HANGOVER:1,orig_mcz_duration:1,term_mcz_duration:1});
