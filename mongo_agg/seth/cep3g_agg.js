// mongo cdr cep3g_agg.js  > ~/fluentd/agg/log/cep3g_agg.txt
// mongo 192.168.0.196/cdr cep3g_agg.js  > ~/fluentd/agg/log/cep3g_agg.txt
//mongo  192.168.0.196/cdr cep3g_agg_site.js --eval "var col = 'cep3g_join'"

print(new Date().toLocaleTimeString());
var agg_3g = db.getCollection(col.toString()).aggregate([			//seth 測試用
        {$match: {
        /*time: interval,up_falg:1,*/
            record_type:{$in:["1","2"]}
        }}
        ,{$project:{
            //STATISTIC_DATE : "$time"
            //record_type : 1,
              DATE:{ $substr: [ "$date_time", 0, 10 ] }
            , HOUR:{ $substr: [ "$date_time", 11, 2 ] }

            //site
            , COUNTRY : { $substr: [ "$BTS_ADDRESS", 0, 9 ] }//"$BTS_ADDRESS" //縣市3 zh zhar
            , DISTRICT : { $substr: [ "$BTS_ADDRESS", 9, 9 ] }//"$BTS_CODE" //地區
            , SITE_NAME : "$SITE_NAME"
            , SITE_ID : "$SITE_ID"

            ////phone_type
            //, VENDOR : "$VENDOR"
            // , MODEL : "$MODEL"

            //, HANGOVER : 1
            , END_CODE : "$cause_for_termination"
            , SIM_TYPE : "$SIM_TYPE"
            , CARRIER : "$CARRIER"

            //, HO_CALLED_1 : 1
            , CALLDURATION : {$add:["$orig_mcz_duration","$term_mcz_duration"]}
        }}
        ,{$group:{
            _id: {
                //record_type:"$record_type"
                //STATISTIC_DATE: {
                  DATE : "$DATE"
                , HOUR: "$HOUR"
                //}
                //site
                , COUNTRY: "$COUNTRY" //縣市
                , DISTRICT: "$DISTRICT" //地區
                , SITE_NAME: "$SITE_NAME"
                , SITE_ID: "$SITE_ID"

                ////phone_type
                //, VENDOR: "$VENDOR"
                //, MODEL: "$MODEL"

                , END_CODE: "$END_CODE"
                , SIM_TYPE: "$SIM_TYPE"
                , CARRIER: "$CARRIER"
                //, IMEI: "$IMEI"
            }

            ,HO_CALLED_COUNT:{$sum:1}//"$HANGOVER"}
            ,HO_CALLED_SECOND:{$sum:"$CALLDURATION"}
        }}
        ,{$project:{
            _id:1
            ,value : {
                 HO_CALLED_COUNT : "$HO_CALLED_COUNT"
                ,HO_CALLED_SECOND : "$HO_CALLED_SECOND"
                ,HO_CALLED_MINUTES :{$divide:["$HO_CALLED_SECOND",60]}
            }

        }}
        ,{    $out:"cep3g_agg1"}	//seth 測試用
    ]
    //,{    explain: true}
    ,{    allowDiskUse: true}
    //,{    cursor: { batchSize: 0 }
);

print(new Date().toLocaleTimeString());
//print(agg_3g.result.length);
//agg_3g.result.forEach(function(doc){
//    //print(JSON.stringify(doc));
//});
