// mongo cdr cep3g_agg.js  > ./log/agg_$(date +"%Y%m%d")_$(date +"%H%M%S").txt
// mongo cdr cep3g_stat_agg.js --eval 'var query = { DATE: '2015-09-02', END_CODE: '0000' };'
print(new Date().toLocaleTimeString());
var T0,T1;
T0 = new Date();
print(T0.toJSON());

/*
 363655/59.77 { DATE: '2015-09-02' }
 344558/53.56 { END_CODE: '0000' }
 160421/38.30 { CARRIER: 'MTC' }
 159805/39.84 { DATE: '2015-09-02', CARRIER: 'MTC' }
 155541/37.86 { END_CODE: '0000', CARRIER: 'MTC' }
 170974/27.74 { DATE: '2015-09-02', SIM_TYPE: 'USIM' }
 149953/25.46 { DATE: '2015-09-02', SIM_TYPE: 'ISIM' }
 137153/22.47 { DATE: '2015-09-02', CARRIER: '台灣大哥大' }
 39656 / 6.04 { DATE: '2015-09-02', SIM_TYPE: 'roaming' }
 22881 /10.22 { DATE: '2015-09-02', HOUR: '10' }
 8502  / 1.39 { DATE: '2015-09-02', COUNTY: '新北市', DISTRICT: '板橋區' }
 3084  / 2.32 { SIM_TYPE: 'SIM' }
 568   / 2.56 { COUNTY: '台中市', SIM_TYPE: 'SIM' }
 */

var agg_3g = db.cep3g_join.aggregate([
        {$match:
        { DATE: '2015-09-02' }
        }
        ,{$project:{
            DATE          : "$DATE" //{ $substr: [ "$date_time", 0, 10 ] }
            , HOUR          : "$HOUR" //{ $substr: [ "$date_time", 11, 2 ] }
            //, NETWORK_TYPE  : "$NETWORK_TYPE"
            , END_CODE      : "$END_CODE"
            , SIM_TYPE      : "$SIM_TYPE"
            , CARRIER       : "$CARRIER"
            ////site
            , COUNTY        : "$COUNTY" //{ $substr: [ "$BTS_ADDRESS", 0, 9 ] } //縣市3 zh
            , DISTRICT      : "$DISTRICT" //{ $substr: [ "$BTS_ADDRESS", 9, 9 ] } //地區
            , SITE_NAME     : "$SITE_NAME"
            //, SITE_ID : "$SITE_ID"
            ////phone_type
            //, VENDOR : "$VENDOR"
            //, MODEL  : "$MODEL"

            , HO : "$HO"
            , HO_SECOND : {$cond :[{$gt:["$HO",0]},"$HO_SECOND",0]}
            , HO_DISTINCT:{$cond :[{$gt:["$HO",0]},"$CALL_NUMBER","$null"]}
            , HO_EACH_ID :{$cond :[{$gt:["$HO",0]},"$_id","$null"]}

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

            , DISTINCT_0_3  :{$cond :[{$and:[{$gte:["$CALL_DURATION",0 ]},{$lte:["$CALL_DURATION",3 ]} ]},"$CALL_NUMBER","$null"]}
            , DISTINCT_3_5  :{$cond :[{$and:[{$gt :["$CALL_DURATION",3 ]},{$lte:["$CALL_DURATION",5 ]} ]},"$CALL_NUMBER","$null"]}
            , DISTINCT_5_7  :{$cond :[{$and:[{$gt :["$CALL_DURATION",5 ]},{$lte:["$CALL_DURATION",7 ]} ]},"$CALL_NUMBER","$null"]}
            , DISTINCT_7_10 :{$cond :[{$and:[{$gt :["$CALL_DURATION",7 ]},{$lte:["$CALL_DURATION",10]} ]},"$CALL_NUMBER","$null"]}
            //, DISTINCT_10UP :{$cond :[       {$gt :["$CALL_DURATION",10]}                                ,"$CALL_NUMBER","$n"]}

            , EACH_ID_0_3  :{$cond :[{$and:[{$gte:["$CALL_DURATION",0 ]},{$lte:["$CALL_DURATION",3 ]} ]},"$_id","$null"]}
            , EACH_ID_3_5  :{$cond :[{$and:[{$gt :["$CALL_DURATION",3 ]},{$lte:["$CALL_DURATION",5 ]} ]},"$_id","$null"]}
            , EACH_ID_5_7  :{$cond :[{$and:[{$gt :["$CALL_DURATION",5 ]},{$lte:["$CALL_DURATION",7 ]} ]},"$_id","$null"]}
            , EACH_ID_7_10 :{$cond :[{$and:[{$gt :["$CALL_DURATION",7 ]},{$lte:["$CALL_DURATION",10]} ]},"$_id","$null"]}
            //, EACH_ID_10UP :{$cond :[       {$gt :["$CALL_DURATION",10]}                                ,"$_id","$n"]}

        }}
        ,{$match:{
            $or:[
                {SUM_CALLED_COUNT_0_3 :{$gt:0}}
                ,{SUM_CALLED_COUNT_3_5 :{$gt:0}}
                ,{SUM_CALLED_COUNT_5_7 :{$gt:0}}
                ,{SUM_CALLED_COUNT_7_10:{$gt:0}}
                //,{SUM_CALLED_COUNT_10UP:{$gt:0}}
            ]
        }}
        ,{$group:{
            _id: {
                DATE : "$DATE"                //日期
                , HOUR : "$HOUR"                //小時
                //, NETWORK_TYPE : "$NETWORK_TYPE"//網路
                , END_CODE: "$END_CODE"         //結束
                , SIM_TYPE: "$SIM_TYPE"         //卡別
                , CARRIER: "$CARRIER"           //業者
                ////site
                , COUNTY: "$COUNTY"             //縣市
                , DISTRICT: "$DISTRICT"         //地區
                , SITE_NAME: "$SITE_NAME"       //基站
                //, SITE_ID: "$SITE_ID"
                ////phone_type
                //, VENDOR: "$VENDOR"
                //, MODEL: "$MODEL"
            }

            , HO_CALLED_COUNT:{$sum:"$HO"}
            , HO_CALLED_SECOND:{$sum:"$HO_SECOND"}
            , HO_DISTINCT:{$addToSet:"$HO_DISTINCT"}
            , HO_EACH_ID:{$push:"$HO_EACH_ID"}

            , SUM_CALLED_COUNT_0_3 : {$sum:"$SUM_CALLED_COUNT_0_3"}
            , SUM_CALLED_COUNT_3_5 : {$sum:"$SUM_CALLED_COUNT_3_5"}
            , SUM_CALLED_COUNT_5_7 : {$sum:"$SUM_CALLED_COUNT_5_7"}
            , SUM_CALLED_COUNT_7_10: {$sum:"$SUM_CALLED_COUNT_7_10"}
            //, SUM_CALLED_COUNT_10UP: {$sum:"$SUM_CALLED_COUNT_10UP"}

            , SUM_CALLED_SECOND_0_3 : {$sum:"$SUM_CALLED_SECOND_0_3"}
            , SUM_CALLED_SECOND_3_5 : {$sum:"$SUM_CALLED_SECOND_3_5"}
            , SUM_CALLED_SECOND_5_7 : {$sum:"$SUM_CALLED_SECOND_5_7"}
            , SUM_CALLED_SECOND_7_10: {$sum:"$SUM_CALLED_SECOND_7_10"}
            //, SUM_CALLED_SECOND_10UP: {$sum:"$SUM_CALLED_SECOND_10UP"}

            , DISTINCT_0_3  :{$addToSet:"$DISTINCT_0_3"}
            , DISTINCT_3_5  :{$addToSet:"$DISTINCT_3_5"}
            , DISTINCT_5_7  :{$addToSet:"$DISTINCT_5_7"}
            , DISTINCT_7_10 :{$addToSet:"$DISTINCT_7_10"}
            //, DISTINCT_10UP :{$addToSet:"$DISTINCT_10UP"}

            , EACH_ID_0_3  :{$push:"$EACH_ID_0_3"}
            , EACH_ID_3_5  :{$push:"$EACH_ID_3_5"}
            , EACH_ID_5_7  :{$push:"$EACH_ID_5_7"}
            , EACH_ID_7_10 :{$push:"$EACH_ID_7_10"}
            //, EACH_ID_10UP :{$push:"$EACH_ID_10UP"}
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

            , HO_CALLED_COUNT   :"$HO_CALLED_COUNT"
            , HO_CALLED_SECOND  :"$HO_CALLED_SECOND"
            , HO_CALLED_MINUTES :{$divide:["$HO_CALLED_SECOND",60]}
            , HO_DISTINCT       :"$HO_DISTINCT"
            , HO_EACH_ID        :"$HO_EACH_ID"

            , SUM_CALLED_COUNT_0_3 : "$SUM_CALLED_COUNT_0_3"
            , SUM_CALLED_COUNT_3_5 : "$SUM_CALLED_COUNT_3_5"
            , SUM_CALLED_COUNT_5_7 : "$SUM_CALLED_COUNT_5_7"
            , SUM_CALLED_COUNT_7_10: "$SUM_CALLED_COUNT_7_10"
            //, SUM_CALLED_COUNT_10UP: "$SUM_CALLED_COUNT_10UP"

            , SUM_CALLED_MINUTES_0_3 : {$divide:["$SUM_CALLED_SECOND_0_3",60]}
            , SUM_CALLED_MINUTES_3_5 : {$divide:["$SUM_CALLED_SECOND_3_5",60]}
            , SUM_CALLED_MINUTES_5_7 : {$divide:["$SUM_CALLED_SECOND_5_7",60]}
            , SUM_CALLED_MINUTES_7_10: {$divide:["$SUM_CALLED_SECOND_7_10",60]}
            //, SUM_CALLED_MINUTES_10UP: {$divide:["$SUM_CALLED_SECOND_10UP",60]}

            , DISTINCT_0_3 :"$DISTINCT_0_3"
            , DISTINCT_3_5 :"$DISTINCT_3_5"
            , DISTINCT_5_7 :"$DISTINCT_5_7"
            , DISTINCT_7_10:"$DISTINCT_7_10"
            //, DISTINCT_10UP:"$DISTINCT_10UP"

            , EACH_ID_0_3  :"$EACH_ID_0_3"
            , EACH_ID_3_5  :"$EACH_ID_3_5"
            , EACH_ID_5_7  :"$EACH_ID_5_7"
            , EACH_ID_7_10 :"$EACH_ID_7_10"
            //, EACH_ID_10UP :"$EACH_ID_10UP"
        }}
        //,{    $out:"cep3g_stat_agg"}
    ]
    //,{    explain: true}
    ,{    allowDiskUse: true}
    //,{    cursor: { batchSize: 0 }
);

//print(new Date().toLocaleTimeString());
T1 = new Date();
print(T0.toJSON());
print(T1.toJSON());
print((T1-T0)/1000+'\t sec.\t'+(T1-T0)/60000+' min.');

printjson(db.getCollection('cep3g_stat_agg').count());

// db.getCollection('cep3g_join').getPlanCache().clear()

//@ version2.4
//print(agg_3g.result.length);

//@ version3.0
//print(agg_3g.toArray.length)

//agg_3g.result.forEach(function(doc){
//    //print(JSON.stringify(doc));
//});/**


