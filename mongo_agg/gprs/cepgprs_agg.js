//=============================== cep 2g A G G =================================
//mongo cdr cepgprs_agg.js > ./cepgprs_agg_$(date +"%Y%m%d")_$(date +"%H%M%S").txt
//mongo 192.168.0.196/cdr cepgprs_agg.js > ./cepgprs_agg_$(date +"%Y%m%d")_$(date +"%H%M%S").txt
//mongo  192.168.0.196/cdr cepgprs_agg.js --eval "var col = 'cepgprs_join'"

//db.cepgprs.find({
//    /*time: interval,up_falg:1,*/
//    "RECORD_TYPE":"19"
//},{
//      "RECORD_TYPE"             : 1
//    , "SERVED_MSISDN"           : 1
//    , "G_UPLINK"                : 1
//    , "G_DOWNLINK"              : 1
//    , "G_RECORD_OPENING_TIME"   : 1
//    , "G_DIAGNOSTICS"           : 1
//    , "CALLED_SUBS_FIRST_LAC"   : 1
//    , "CALLED_SUBS_FIRST_SAC"   : 1
//    , "_id":0
//});
print(new Date().toLocaleTimeString());
var flow = db.getCollection(col.toString()).aggregate([
        {$match: {
            /*time: interval,up_falg:1,*/
            "RECORD_TYPE":"19"
        }}
        ,{$project:{
            //time:1,
            //STATISTIC_DATE : "$time"
              DATE:{ $substr: [ "$G_RECORD_OPENING_TIME", 0, 10 ] }
            , HOUR:{ $substr: [ "$G_RECORD_OPENING_TIME", 11, 2 ] }
            //, qHOUR:{ $substr: [ "G_RECORD_OPENING_TIME", 14, 2 ] }

            //site
            , COUNTY : { $substr: [ "$BTS_ADDRESS", 0, 9 ] }//"$BTS_ADDRESS" //縣市
            , DISTRICT : { $substr: [ "$BTS_ADDRESS", 9, 9 ] }//"$BTS_CODE" //地區
            , SITE_NAME : "$SITE_NAME"
            , SITE_ID : "$SITE_ID"
            //, END_CODE: "$END_CODE"

            , G_UPLINK : 1
            , G_DOWNLINK : 1
            , DATA_LOAD : {$add:["$G_UPLINK","$G_DOWNLINK"]}
        }}
        ,{$group:{
            _id: {

                  DATE : "$DATE"
                , HOUR : "$HOUR"
                //site
                , COUNTY: "$COUNTY" //縣市
                , DISTRICT: "$DISTRICT" //地區
                , SITE_NAME: "$SITE_NAME"
                , SITE_ID: "$SITE_ID"
                //, END_CODE: "$END_CODE"
            }

            , DATA_UPLOAD: {$sum: "$G_UPLINK"}
            , DATA_DOWNLOAD: {$sum: "G_DOWNLINK"}
            , DATA_LOAD: {$sum: "$DATA_LOAD"}
        }}
        ,{$project: {
            _id: 0
            , DATE : "$_id.DATE"
            , HOUR : "$_id.HOUR"
            //site
            , COUNTY: "$_id.COUNTY" //縣市
            , DISTRICT: "$_id.DISTRICT" //地區
            , SITE_NAME: "$_id.SITE_NAME"
            , SITE_ID: "$_id.SITE_ID"
            //, END_CODE: "$_id.END_CODE"

            , DATA_UPLOAD: "$DATA_UPLOAD"
            , DATA_DOWNLOAD: "$DATA_DOWNLOAD"
            , DATA_LOAD: "$DATA_LOAD" //{$divide: ["$DATA_LOAD", 60]}

        }}
        ,{    $out:"cepgprs_agg"}
    ]
    //,{    explain: true}
    ,{    allowDiskUse: true}
    //,{    cursor: { batchSize: 0 }
);

print(new Date().toLocaleTimeString());
//print(flow.result.length);
//flow.result.forEach(function(doc){
//    //print(JSON.stringify(doc));
//});

//mongo 2.4.0
/*
> print(flow.result.length);
11091
> flow.result[0]
{
    "_id" : {
    "STATISTIC_DATE" : {
        "DATE" : "G_RECORD_O",
            "HOUR" : "EN"
    },
    "COUNTY" : "宜蘭縣",
        "DISTRICT" : "頭城鎮",
        "SITE_NAME" : "蘭陽博物館",
        "SITE_ID" : "26124"
},
    "DATA_UPLOAD" : 21248,
    "DATA_DOWNLOAD" : 0,
    "DATA_LOAD" : 868.35
}
*/
