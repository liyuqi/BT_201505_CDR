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
            , HO : 1
            , HO_MIN : 1
            , END_CODE : "$cause_for_termination"
            , SIM_TYPE : "$SIM_TYPE"
            , CARRIER : "$CARRIER"

            //, HO_CALLED_1 : 1
            , CALLDURATION : {$add:["$orig_mcz_duration","$term_mcz_duration"]}
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
            , HO_CALLED_MIN:{$sum:"$HO_MIN"}
        }}
        ,{$project:{
            _id:1
            //, STATISTIC_DATE:"$_id.DATE"
            //, STATISTIC_HOUR:"$_id.HOUR"

            ////site
            //, COUNTY : "$_id.COUNTY"
            //, DISTRICT: "$_id.DISTRICT"
            //, SITE_NAME : "$_id.SITE_NAME"

            ////phone_type
            //, VENDOR : "$_id.VENDOR"
            //, MODEL : "$_id.MODEL"

            //, SIM_TYPE : "$_id.SIM_TYPE"
            //, CARRIER : "$_id.CARRIER"
            //, END_CODE: "$_id.END_CODE"
            , HO_CALLED_COUNT :1
            , HO_CALLED_MIN:1
        }}
        ,{    $out:"cep3g_agg"}
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
