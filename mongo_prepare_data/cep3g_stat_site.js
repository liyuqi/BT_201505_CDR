// mongo cdr cep3g_agg.js  > ./log/agg_$(date +"%Y%m%d")_$(date +"%H%M%S").txt


print(new Date().toLocaleTimeString());
var agg_3g = db.cep3g_join.aggregate([
        {$match: {
            /*time: interval,up_falg:1,*/
            record_type:{$in:["1","2"]}
        }}
        ,{$project:{
            //STATISTIC_DATE : "$time"
            DATE:{ $substr: [ "$date_time", 0, 10 ] }
            , HOUR:{ $substr: [ "$date_time", 11, 2 ] }

            //site
            , COUNTY : { $substr: [ "$BTS_ADDRESS", 0, 9 ] }//"$BTS_ADDRESS" //縣市3 zh zhar
            , DISTRICT : { $substr: [ "$BTS_ADDRESS", 9, 9 ] }//"$BTS_CODE" //地區
            , SITE_NAME : "$SITE_NAME"
            , SITE_ID : "$SITE_ID"

            ////phone_type
            //, VENDOR : "$VENDOR"
            //, MODEL  : "$MODEL"

            , NETWORK_TYPE : 1
            , END_CODE : "$cause_for_termination"
            , SIM_TYPE : "$SIM_TYPE"
            , CARRIER : "$CARRIER"

            , HO : 1
            , HO_SECOND : 1

            //, SUM_CALLED_COUNT_0_3 :{"$HO_CALLED_MINUTES":{$gt:0,$lte:3}}
            //, SUM_CALLED_COUNT_3_5 :{"$HO_CALLED_MINUTES":{$gt:3,$lte:5}}
            //, SUM_CALLED_COUNT_5_7 :{"$HO_CALLED_MINUTES":{$gt:5,$lte:7}}
            //, SUM_CALLED_COUNT_7_10:{"$HO_CALLED_MINUTES":{$gt:7,$lte:10}}
            //, SUM_CALLED_COUNT_10UP:{"$HO_CALLED_MINUTES":{$gt:10}}

            , SUM_CALLED_COUNT_0_3  :{$sum:{"$cond" : [{"$HO_SECOND":{$gt:0,$lte:3 }},"$HO",0]}}
            //, SUM_CALLED_COUNT_3_5  :{"$cond" : [{"$HO_SECOND":{$gt:3,$lte:5 }},"$HO",0]}
            //, SUM_CALLED_COUNT_5_7  :{"$cond" : [{"$HO_SECOND":{$gt:5,$lte:7 }},"$HO",0]}
            //, SUM_CALLED_COUNT_7_10 :{"$cond" : [{"$HO_SECOND":{$gt:7,$lte:10}},"$HO",0]}
            //, SUM_CALLED_COUNT_10UP :{"$cond" : [{"$HO_SECOND":{$gt:10       }},"$HO",0]}

            //, SUM_CALLED_MINUTES_0_3  :{"$cond" : {"$HO_CALLED_MINUTES" :{$and:[{$gt:0},{$lte:3}]}},"$HO_CALLED_MINUTES",0}
            //, SUM_CALLED_MINUTES_3_5  :{"$cond" : {"$HO_CALLED_MINUTES" :{$and:[{$gt:0},{$lte:3}]}},"$HO_CALLED_MINUTES",0}
            //, SUM_CALLED_MINUTES_5_7  :{"$cond" : {"$HO_CALLED_MINUTES" :{$and:[{$gt:0},{$lte:3}]}},"$HO_CALLED_MINUTES",0}
            //, SUM_CALLED_MINUTES_7_10 :{"$cond" : {"$HO_CALLED_MINUTES" :{$and:[{$gt:0},{$lte:3}]}},"$HO_CALLED_MINUTES",0}
            //, SUM_CALLED_MINUTES_10UP :{"$cond" : {"$HO_CALLED_MINUTES" :{$and:[{$gt:0},{$lte:3}]}},"$HO_CALLED_MINUTES",0}

        }}
        ,{$group:{
            _id: {
                //STATISTIC_DATE : {
                DATE : "$DATE"
                , HOUR : "$HOUR"
                //}
                //site
                , COUNTY: "$COUNTY" //縣市
                , DISTRICT: "$DISTRICT" //地區
                , SITE_NAME: "$SITE_NAME"
                , SITE_ID: "$SITE_ID"

                ////phone_type
                //, VENDOR: "$VENDOR"
                //, MODEL: "$MODEL"

                , NETWORK_TYPE : "$NETWORK_TYPE"
                , END_CODE: "$END_CODE"
                , SIM_TYPE: "$SIM_TYPE"
                , CARRIER: "$CARRIER"
                //, IMEI: "$IMEI"
            }

            , HO_CALLED_COUNT:{$sum:"$HO"}
            , HO_CALLED_SECOND:{$sum:"$HO_SECOND"}
            , SUM_CALLED_COUNT_0_3 : {$sum:"$SUM_CALLED_COUNT_0_3"}
        }}
        ,{$project:{
            _id:0
            //, STATISTIC_DATE:"$_id.DATE"
            //, STATISTIC_HOUR:"$_id.HOUR"
            , DATE: "$_id.DATE"
            , HOUR: "$_id.HOUR"
            ////site
            , COUNTY : "$_id.COUNTY"
            , DISTRICT: "$_id.DISTRICT"
            , SITE_NAME : "$_id.SITE_NAME"
            , SITE_ID: "$_id.SITE_ID"

            ////phone_type
            //, VENDOR : "$_id.VENDOR"
            //, MODEL : "$_id.MODEL"

            , NETWORK_TYPE : "$_id.NETWORK_TYPE"
            , SIM_TYPE : "$_id.SIM_TYPE"
            , CARRIER : "$_id.CARRIER"
            , END_CODE: "$_id.END_CODE"

            , HO_CALLED_COUNT :1
            , HO_CALLED_SECOND :1
            , HO_CALLED_MINUTES :{$divide:["$HO_CALLED_SECOND",60]}

            , SUM_CALLED_COUNT_0_3 : 1
            //, SUM_CALLED_COUNT_3_5 : {$sum:"$SUM_CALLED_COUNT_3_5"}
            //, SUM_CALLED_COUNT_5_7 : {$sum:"$SUM_CALLED_COUNT_5_7"}
            //, SUM_CALLED_COUNT_7_10: {$sum:"$SUM_CALLED_COUNT_7_10"}
            //, SUM_CALLED_COUNT_10UP: {$sum:"$SUM_CALLED_COUNT_10UP"}

        }}
        ,{    $out:"cep3g_stat_site"}
    ]
    //,{    explain: true}
    ,{    allowDiskUse: true}
    //,{    cursor: { batchSize: 0 }
);

print(new Date().toLocaleTimeString());

//@ version2.4
//print(agg_3g.result.length);

//@ version3.0
//print(agg_3g.toArray.length)

//agg_3g.result.forEach(function(doc){
//    //print(JSON.stringify(doc));
//});
