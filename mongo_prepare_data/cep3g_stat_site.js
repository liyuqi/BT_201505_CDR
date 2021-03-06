// mongo cdr cep3g_stat_site.js  > ./log/agg_$(date +"%Y%m%d")_$(date +"%H%M%S").txt
// mongo cdr cep3g_stat_site.js --eval "query_string={record_type:{$in:["1","2"]}}"
print(new Date().toLocaleTimeString());
var agg_3g = db.cep3g_join.aggregate([
        {$match: {
            /*time: interval,up_falg:1,*/
            record_type:{$in:["1","2"]}
            , COUNTRY:"高雄市"
            , DISTRICT: "湖內區"
        }}
        ,{$project:{
              DATE:{ $substr: [ "$date_time", 0, 10 ] }
            , HOUR:{ $substr: [ "$date_time", 11, 2 ] }
            , NETWORK_TYPE : 1
            , END_CODE : "$cause_for_termination"
            , SIM_TYPE : "$SIM_TYPE"
            , CARRIER : "$CARRIER"
            ////site
            , COUNTY : { $substr: [ "$BTS_ADDRESS", 0, 9 ] }//"$BTS_ADDRESS" //縣市3 zh
            , DISTRICT : { $substr: [ "$BTS_ADDRESS", 9, 9 ] }//"$BTS_CODE" //地區
            , SITE_NAME : "$SITE_NAME"
            //, SITE_ID : "$SITE_ID"
            ////phone_type
            //, VENDOR : "$VENDOR"
            //, MODEL  : "$MODEL"

            //, HO_DISTINCT:{$cond :[{$gt:["$HO",0]},"$CALL_NUMBER",""]}
            //, HO : 1
            //, HO_SECOND : 1

            , DISTINCT_CALLED_COUNT_0_3  :{$cond :[{$and:[{$gte:["$CALL_DURATION",0 ]},{$lte:["$CALL_DURATION",3 ]} ]},"$CALL_NUMBER","$n"]}
            , DISTINCT_CALLED_COUNT_3_5  :{$cond :[{$and:[{$gt :["$CALL_DURATION",3 ]},{$lte:["$CALL_DURATION",5 ]} ]},"$CALL_NUMBER","$n"]}
            , DISTINCT_CALLED_COUNT_5_7  :{$cond :[{$and:[{$gt :["$CALL_DURATION",5 ]},{$lte:["$CALL_DURATION",7 ]} ]},"$CALL_NUMBER","$n"]}
            , DISTINCT_CALLED_COUNT_7_10 :{$cond :[{$and:[{$gt :["$CALL_DURATION",7 ]},{$lte:["$CALL_DURATION",10]} ]},"$CALL_NUMBER","$n"]}
            //, DISTINCT_CALLED_COUNT_10UP :{$cond :[       {$gt :["$CALL_DURATION",10]}                                ,"$CALL_NUMBER","$n"]}

            , SUM_CALLED_COUNT_0_3  :{$cond :[{$and:[{$gte:["$CALL_DURATION",0 ]},{$lte:["$CALL_DURATION",3 ]} ]},1,0]}
            , SUM_CALLED_COUNT_3_5  :{$cond :[{$and:[{$gt :["$CALL_DURATION",3 ]},{$lte:["$CALL_DURATION",5 ]} ]},1,0]}
            , SUM_CALLED_COUNT_5_7  :{$cond :[{$and:[{$gt :["$CALL_DURATION",5 ]},{$lte:["$CALL_DURATION",7 ]} ]},1,0]}
            , SUM_CALLED_COUNT_7_10 :{$cond :[{$and:[{$gt :["$CALL_DURATION",7 ]},{$lte:["$CALL_DURATION",10]} ]},1,0]}
            //, SUM_CALLED_COUNT_10UP :{$cond :[       {$gt :["$CALL_DURATION",10]}                                ,1,0]}

            , SUM_CALLED_SECOND_0_3  :{$cond :[{$and:[{$gte:["$CALL_DURATION",0 ]},{$lte:["$CALL_DURATION",3 ]} ]},"$CALL_DURATION",0]}
            , SUM_CALLED_SECOND_3_5  :{$cond :[{$and:[{$gt :["$CALL_DURATION",3 ]},{$lte:["$CALL_DURATION",5 ]} ]},"$CALL_DURATION",0]}
            , SUM_CALLED_SECOND_5_7  :{$cond :[{$and:[{$gt :["$CALL_DURATION",5 ]},{$lte:["$CALL_DURATION",7 ]} ]},"$CALL_DURATION",0]}
            , SUM_CALLED_SECOND_7_10 :{$cond :[{$and:[{$gt :["$CALL_DURATION",7 ]},{$lte:["$CALL_DURATION",10]} ]},"$CALL_DURATION",0]}
            //, SUM_CALLED_SECOND_10UP :{$cond :[       {$gt :["$CALL_DURATION",10]}                                ,"$CALL_DURATION",0]}
        }}
        ,{$group:{
            _id: {
                  DATE : "$DATE"
                , HOUR : "$HOUR"
                , NETWORK_TYPE : "$NETWORK_TYPE"
                , END_CODE: "$END_CODE"
                , SIM_TYPE: "$SIM_TYPE"
                , CARRIER: "$CARRIER"
                ////site
                , COUNTY: "$COUNTY" //縣市
                , DISTRICT: "$DISTRICT" //地區
                , SITE_NAME: "$SITE_NAME"
                //, SITE_ID: "$SITE_ID"
                ////phone_type
                //, VENDOR: "$VENDOR"
                //, MODEL: "$MODEL"
            }
            //, HO_DISTINCT:{$addToSet:"$HO_DISTINCT"}
            //, HO_CALLED_COUNT:{$sum:"$HO"}
            //, HO_CALLED_SECOND:{$sum:"$HO_SECOND"}

            , DISTINCT_CALLED_COUNT_0_3  :{$addToSet:"$DISTINCT_CALLED_COUNT_0_3"}
            , DISTINCT_CALLED_COUNT_3_5  :{$addToSet:"$DISTINCT_CALLED_COUNT_3_5"}
            , DISTINCT_CALLED_COUNT_5_7  :{$addToSet:"$DISTINCT_CALLED_COUNT_5_7"}
            , DISTINCT_CALLED_COUNT_7_10 :{$addToSet:"$DISTINCT_CALLED_COUNT_7_10"}
            //, DISTINCT_CALLED_COUNT_10UP :{$addToSet:"$DISTINCT_CALLED_COUNT_10UP"}

            , SUM_CALLED_COUNT_0_3 : {$sum:"$SUM_CALLED_COUNT_0_3"}
            , SUM_CALLED_COUNT_3_5 : {$sum:"$SUM_CALLED_COUNT_0_3"}
            , SUM_CALLED_COUNT_5_7 : {$sum:"$SUM_CALLED_COUNT_3_5"}
            , SUM_CALLED_COUNT_7_10: {$sum:"$SUM_CALLED_COUNT_5_7"}
            //, SUM_CALLED_COUNT_10UP: {$sum:"$SUM_CALLED_COUNT_7_10"}

            , SUM_CALLED_SECOND_0_3 : {$sum:"$SUM_CALLED_SECOND_0_3"}
            , SUM_CALLED_SECOND_3_5 : {$sum:"$SUM_CALLED_SECOND_0_3"}
            , SUM_CALLED_SECOND_5_7 : {$sum:"$SUM_CALLED_SECOND_3_5"}
            , SUM_CALLED_SECOND_7_10: {$sum:"$SUM_CALLED_SECOND_5_7"}
            //, SUM_CALLED_SECOND_10UP: {$sum:"$SUM_CALLED_SECOND_7_10"}
        }}
        ,{$project:{
            _id:0
            , DATE          : "$_id.DATE"
            , HOUR          : "$_id.HOUR"
            , NETWORK_TYPE  : "$_id.NETWORK_TYPE"
            , SIM_TYPE      : "$_id.SIM_TYPE"
            , CARRIER       : "$_id.CARRIER"
            , END_CODE      : "$_id.END_CODE"
            ////site
            , COUNTY        : "$_id.COUNTY"
            , DISTRICT      : "$_id.DISTRICT"
            , SITE_NAME     : "$_id.SITE_NAME"
            //, SITE_ID       : "$_id.SITE_ID"
            ////phone_type
            //, VENDOR        : "$_id.VENDOR"
            //, MODEL         : "$_id.MODEL"

            //, HO_DISTINCT       :1
            //, HO_CALLED_COUNT   :1
            //, HO_CALLED_SECOND  :1
            //, HO_CALLED_MINUTES :{$divide:["$HO_CALLED_SECOND",60]}

            , DISTINCT_CALLED_COUNT_0_3 :1
            , DISTINCT_CALLED_COUNT_3_5 :1
            , DISTINCT_CALLED_COUNT_5_7 :1
            , DISTINCT_CALLED_COUNT_7_10:1
            //, DISTINCT_CALLED_COUNT_10UP:1

            , SUM_CALLED_COUNT_0_3 : 1
            , SUM_CALLED_COUNT_3_5 : 1
            , SUM_CALLED_COUNT_5_7 : 1
            , SUM_CALLED_COUNT_7_10: 1
            //, SUM_CALLED_COUNT_10UP: 1

            , SUM_CALLED_MINUTES_0_3 : {$divide:["$SUM_CALLED_SECOND_0_3",60]}
            , SUM_CALLED_MINUTES_3_5 : {$divide:["$SUM_CALLED_SECOND_3_5",60]}
            , SUM_CALLED_MINUTES_5_7 : {$divide:["$SUM_CALLED_SECOND_5_7",60]}
            , SUM_CALLED_MINUTES_7_10: {$divide:["$SUM_CALLED_SECOND_7_10",60]}
            //, SUM_CALLED_MINUTES_10UP: {$divide:["$SUM_CALLED_SECOND_10UP",60]}
        }}
        ,{$match:{
            $or:[
                 {SUM_CALLED_COUNT_0_3 :{$gt:0}}
                ,{SUM_CALLED_COUNT_3_5 :{$gt:0}}
                ,{SUM_CALLED_COUNT_5_7 :{$gt:0}}
                ,{SUM_CALLED_COUNT_7_10:{$gt:0}}
                //,{SUM_CALLED_COUNT_10UP:0}
            ]
        }}
        ,{    $out:"cep3g_stat_site0_10"}
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