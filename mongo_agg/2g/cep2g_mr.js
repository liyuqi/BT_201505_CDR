//mongo cdr cep2g_mr.js > ./cep2g_mr_$(date +"%Y%m%d")_$(date +"%H%M%S").txt
//mongo cdr cep2g_mr.js > ./cep2g_mr_result_$(date +"%Y%m%d")_$(date +"%H%M%S").txt         db = 'cdr',
//mongo  192.168.0.196/cdr cep2g_mr.js --eval "var col = 'cep2g_join'"

//db = new Mongo().getDB(db.toString());
//var doc = db.getCollection(collection.toString()).findOne({},{_id:1});

print(new Date().toLocaleTimeString()+'\t2g mr start');
var mr2g = db.getCollection(col.toString()).mapReduce(
    function () {
        //var time= this.timestamp.substring(0,2);
        var key={};
        var value={};
        try {

            key = {
                //CALLTRANSACTIONTYPE: this.CALLTRANSACTIONTYPE
                //, STATISTIC_DATE: new Date(this.time.getTime).substr(0,13)
                DATE: this.STARTOFCHARGINGDATE
                , HOUR: this.TIMESTAMP.substr(0, 2)
                , COUNTY: this.BTS_ADDRESS.substr(0, 3)
                , DISTRICT: this.BTS_ADDRESS.substr(3, 3)
                , SITE_NAME: this.SITE_NAME
                , SITE_ID: this.SITE_ID

                //, VENDOR : "$VENDOR"
                //, MODEL : "$MODEL"

                , END_CODE: this.CAUSEFORTERMINATION
                , SIM_TYPE: this.SIM_TYPE
                , CARRIER: this.CARRIER
                //, HANGOVER : this.HANGOVER
            };


            value = {
                CALLDURATION: this.CALLDURATION
            };
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
            CALLTRANSACTIONTYPE:{$in:['1','2']}
        },
        out: {
            replace:"cep2g_mr" //replace/merge/reduce
            //,inline:1 //use memory either shard
            //,sharded:1
            //,nonAtomic:0

        }
    }
);
//mongo cdr cep3g_mr.js > ./cep3g_mr_result_$(date +"%Y%m%d")_$(date +"%H%M%S").txt

print(new Date().toLocaleTimeString()+'\t2g mr end');
print(JSON.stringify(mr2g));
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











//print(new Date().toLocaleTimeString()+'\t2g mr start');
//var mr2g = db.getCollection(col.toString()).mapReduce(
////var mr2g = db.cep2g_join.mapReduce(
//    function () {
//        //var time= this.timestamp.substring(0,2);
//        try {
//            var key = {
//                //CALLTRANSACTIONTYPE: this.CALLTRANSACTIONTYPE
//                //STATISTIC_DATE : "$time"
//                  DATE: this.STARTOFCHARGINGDATE
//                , HOUR: this.TIMESTAMP.substr(0, 2)
//
//                , COUNTY: this.BTS_ADDRESS.substr(0, 3)
//                , DISTRICT: this.BTS_ADDRESS.substr(3, 3)
//                , SITE_NAME: this.SITE_NAME
//                , SITE_ID: this.SITE_ID
//
//                ////phone
//                //, VENDOR : "$VENDOR"
//                //, MODEL : "$MODEL"
//
//                , END_CODE: this.CAUSEFORTERMINATION
//                , SIM_TYPE: this.SIM_TYPE
//                , CARRIER: this.CARRIER
//                //, HANGOVER : this.HANGOVER
//
//            };
//
//            var value = {
//                CALLDURATION: Number(this.CALLDURATION)
//            };
//            emit(key, value);
//        }catch(e){}
//    },
//    function (key, values) {
//        var doc = {
//             HO_CALLED_COUNT: 0
//            ,HO_CALLED_SECONDS: 0
//            ,HO_CALLED_MINUTES: 0
//        };
//        try {
//            values.forEach(function (value) {
//                doc.HO_CALLED_COUNT += 1; //value.HO_CALLED_COUNT;
//                doc.HO_CALLED_SECONDS += value.CALLDURATION;
//            });
//
//            //for (var i = 0; i < values.length; i++) {
//            //    doc.HO_CALLED_COUNT += 1; //values[i].HO_CALLED_COUNT;
//            //    doc.HO_CALLED_SECONDS += values[i].CALLDURATION;
//            //}
//            // doc.HO_CALLED_MINUTES = (doc.HO_CALLED_SECONDS / 60.0);
//            if (!isNaN(doc.HO_CALLED_SECONDS))
//                return doc;
//        }catch(e){}
//    },
//    {
//        finalize:
//        function (key,values){
//            try {
//                if (!isNaN(values.HO_CALLED_SECONDS)) {
//                    values.HO_CALLED_MINUTES = (values.HO_CALLED_SECONDS / 60.0);
//                    return values;
//                }
//            }catch(e){}
//        },
//        query: {//--------------------------------filter------------------------------
//            /*time: interval,up_falg:1,*/
//            CALLTRANSACTIONTYPE:{$in:['1','2']}
//        },
//        out: {
//            replace:"cep2g_mr" //replace/merge/reduce
//            //,inline:1 //use memory either shard
//            //,sharded:1
//            //,nonAtomic:0
//
//        }
//    }
//);
////mongo cdr cep2g_mr.js > ./cep2g_mr_$(date +"%Y%m%d")_$(date +"%H%M%S").txt
//print(new Date().toLocaleTimeString()+'\t2g mr end');
//print(JSON.stringify(mr2g));
//db.cep2g_mr.find().skip(5).limit(1).pretty()
//db.cep2g_join.find({STARTOFCHARGINGDATE:/^2015-01-05/,TIMESTAMP:/^09/,SITE_ID:"54241"},{CALLDURATION:1})
//mr2g.forEach(function(doc){
//    print(JSON.stringify(doc));
//});
//{
//    "result" : "cdr2g_mr",
//    "timeMillis" : 9129,
//    "counts" : {
//    "input" : 244723,
//        "emit" : 244723,
//        "reduce" : 83431,
//        "output" : 69153
//},
//    "ok" : 1
//}