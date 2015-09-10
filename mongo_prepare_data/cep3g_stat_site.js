// mongo cdr cep3g_stat_site.js  > ./log/agg_$(date +"%Y%m%d")_$(date +"%H%M%S").txt

print(new Date().toLocaleTimeString());
var agg_3g = db.cep3g_join.aggregate([
        {$match: {
            /*time: interval,up_falg:1,*/
            record_type:{$in:["1","2"]}
        }}
        ,{$project:{
            DATE:{ $substr: [ "$date_time", 0, 10 ] }
            , HOUR:{ $substr: [ "$date_time", 11, 2 ] }
            , NETWORK_TYPE : 1
            , END_CODE : "$cause_for_termination"
            , SIM_TYPE : "$SIM_TYPE"
            , CARRIER : "$CARRIER"
            ////site
            , COUNTY : { $substr: [ "$BTS_ADDRESS", 0, 9 ] }//"$BTS_ADDRESS" //縣市3 zh zhar
            , DISTRICT : { $substr: [ "$BTS_ADDRESS", 9, 9 ] }//"$BTS_CODE" //地區
            , SITE_NAME : "$SITE_NAME"
            , SITE_ID : "$SITE_ID"
            ////phone_type
            //, VENDOR : "$VENDOR"
            //, MODEL  : "$MODEL"

            , HO_DISTINCT:{$cond :[{$gt:["$HO",0]},"$called_number",""]}
            , HO : 1
            , HO_SECOND : 1

            , SUM_CALLED_COUNT_0_3  :{$cond :[{$and:[{$gte:["$HO_SECOND",0 ]},{$lte:["$HO_SECOND",3 ]} ]},"$HO",0]}
            , SUM_CALLED_COUNT_3_5  :{$cond :[{$and:[{$gt :["$HO_SECOND",3 ]},{$lte:["$HO_SECOND",5 ]} ]},"$HO",0]}
            , SUM_CALLED_COUNT_5_7  :{$cond :[{$and:[{$gt :["$HO_SECOND",5 ]},{$lte:["$HO_SECOND",7 ]} ]},"$HO",0]}
            , SUM_CALLED_COUNT_7_10 :{$cond :[{$and:[{$gt :["$HO_SECOND",7 ]},{$lte:["$HO_SECOND",10]} ]},"$HO",0]}
            , SUM_CALLED_COUNT_10UP :{$cond :[       {$gt :["$HO_SECOND",10]}                            ,"$HO",0]}

            , SUM_CALLED_SECOND_0_3  :{$cond :[{$and:[{$gte:["$HO_SECOND",0 ]},{$lte:["$HO_SECOND",3 ]} ]},"$HO_SECOND",0]}
            , SUM_CALLED_SECOND_3_5  :{$cond :[{$and:[{$gt :["$HO_SECOND",3 ]},{$lte:["$HO_SECOND",5 ]} ]},"$HO_SECOND",0]}
            , SUM_CALLED_SECOND_5_7  :{$cond :[{$and:[{$gt :["$HO_SECOND",5 ]},{$lte:["$HO_SECOND",7 ]} ]},"$HO_SECOND",0]}
            , SUM_CALLED_SECOND_7_10 :{$cond :[{$and:[{$gt :["$HO_SECOND",7 ]},{$lte:["$HO_SECOND",10]} ]},"$HO_SECOND",0]}
            , SUM_CALLED_SECOND_10UP :{$cond :[       {$gt :["$HO_SECOND",10]}                            ,"$HO_SECOND",0]}
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
                , SITE_ID: "$SITE_ID"
                ////phone_type
                //, VENDOR: "$VENDOR"
                //, MODEL: "$MODEL"
            }
            , HO_DISTINCT:{$addToSet:"$HO_DISTINCT"}
            , HO_CALLED_COUNT:{$sum:"$HO"}
            , HO_CALLED_SECOND:{$sum:"$HO_SECOND"}

            , SUM_CALLED_COUNT_0_3 : {$sum:"$SUM_CALLED_COUNT_0_3"}
            , SUM_CALLED_COUNT_3_5 : {$sum:"$SUM_CALLED_COUNT_0_3"}
            , SUM_CALLED_COUNT_5_7 : {$sum:"$SUM_CALLED_COUNT_3_5"}
            , SUM_CALLED_COUNT_7_10: {$sum:"$SUM_CALLED_COUNT_5_7"}
            , SUM_CALLED_COUNT_10UP: {$sum:"$SUM_CALLED_COUNT_7_10"}

            , SUM_CALLED_SECOND_0_3 : {$sum:"$SUM_CALLED_SECOND_0_3"}
            , SUM_CALLED_SECOND_3_5 : {$sum:"$SUM_CALLED_SECOND_0_3"}
            , SUM_CALLED_SECOND_5_7 : {$sum:"$SUM_CALLED_SECOND_3_5"}
            , SUM_CALLED_SECOND_7_10: {$sum:"$SUM_CALLED_SECOND_5_7"}
            , SUM_CALLED_SECOND_10UP: {$sum:"$SUM_CALLED_SECOND_7_10"}
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
            , SITE_ID       : "$_id.SITE_ID"
            ////phone_type
            //, VENDOR        : "$_id.VENDOR"
            //, MODEL         : "$_id.MODEL"

            , HO_DISTINCT       :1
            , HO_CALLED_COUNT   :1
            , HO_CALLED_SECOND  :1
            , HO_CALLED_MINUTES :{$divide:["$HO_CALLED_SECOND",60]}

            , SUM_CALLED_COUNT_0_3 : 1
            , SUM_CALLED_COUNT_3_5 : 1
            , SUM_CALLED_COUNT_5_7 : 1
            , SUM_CALLED_COUNT_7_10: 1
            , SUM_CALLED_COUNT_10UP: 1

            , SUM_CALLED_MINUTES_0_3 : {$divide:["$SUM_CALLED_SECOND_0_3",60]}
            , SUM_CALLED_MINUTES_3_5 : {$divide:["$SUM_CALLED_SECOND_3_5",60]}
            , SUM_CALLED_MINUTES_5_7 : {$divide:["$SUM_CALLED_SECOND_5_7",60]}
            , SUM_CALLED_MINUTES_7_10: {$divide:["$SUM_CALLED_SECOND_7_10",60]}
            , SUM_CALLED_MINUTES_10UP: {$divide:["$SUM_CALLED_SECOND_10UP",60]}
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