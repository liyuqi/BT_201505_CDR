// mongo cdr cep3g_stat_site.js  > ./log/agg_$(date +"%Y%m%d")_$(date +"%H%M%S").txt


print(new Date().toLocaleTimeString());
var agg_3g = db.cep3g_agg.aggregate([
        {$match: {
            /*time: interval,up_falg:1,*/
            //record_type:{$in:["1","2"]}
            DATE  :{$in:[/^20/]}
            //, HOUR      :{$in:[]}
            //, NETWORK_TYPE :{$in:[]}
            //, COUNTY    :{$in:[]}
            //, DISTRICT  :{$in:[]}
            //, SITE_NAME :{$in:[]}
            //
            //, END_CODE  : {$in:[]}
            //, SIM_TYPE  : {$in:[]}
            //, CARRIER   : {$in:[]}
            , HO_CALLED_COUNT  : {$gte:1}
            , HO_CALLED_SECOND : {$gt:0}
            , HO_CALLED_MINUTES: {$gt:0}
        }}
        ,{$project:{
            //STATISTIC_DATE : "$time"
            DATE:"$_id.DATE"
            , HOUR:"$_id.HOUR"
            , NETWORK_TYPE : "$_id.NETWORK_TYPE"
            //site
            , COUNTY : "$_id.COUNTRY"
            , DISTRICT : "$_id.DISTRICT"
            , SITE_NAME : "$_id.SITE_NAME"
            , SITE_ID : "$_id.SITE_ID"

            ////phone_type
            //, VENDOR : "$VENDOR"
            //, MODEL  : "$MODEL"

            , END_CODE : "$_id.END_CODE"
            , SIM_TYPE : "$_id.SIM_TYPE"
            , CARRIER : "$_id.CARRIER"

            , HO_CALLED_COUNT : 1
            , HO_CALLED_SECOND : 1
            , SUM_CALLED_COUNT_0_3 :{$and:[{$gt:["$HO_CALLED_MINUTES",0]},{$lte:["$HO_CALLED_MINUTES",3]}]}
            //, SUM_CALLED_COUNT_0_3 :{"$cond" : {"$HO_CALLED_MINUTES" :{$and:[{$gt:0},{$lte:3}]}},"$HO_CALLED_COUNT",0}
            //, SUM_CALLED_COUNT_3_5 :{"$cond" : {"$HO_CALLED_MINUTES" :{$and:[{$gt:3},{$lte:5}]}},"$HO_CALLED_COUNT",0}
            //, SUM_CALLED_COUNT_5_7 :{"$cond" : {"$HO_CALLED_MINUTES" :{$and:[{$gt:0},{$lte:3}]}},"$HO_CALLED_COUNT",0}
            //, SUM_CALLED_COUNT_7_10 :{"$cond" : {"$HO_CALLED_MINUTES" :{$and:[{$gt:0},{$lte:3}]}},"$HO_CALLED_COUNT",0}
            //, SUM_CALLED_COUNT_10UP :{"$cond" : {"$HO_CALLED_MINUTES" :{$and:[{$gt:0},{$lte:3}]}},"$HO_CALLED_COUNT",0}

            //, SUM_CALLED_MINUTES_0_3 :{"$cond" : {"$HO_CALLED_MINUTES" :{$and:[{$gt:0},{$lte:3}]}},"$HO_CALLED_MINUTES",0}
            //, SUM_CALLED_MINUTES_3_5 :{"$cond" : {"$HO_CALLED_MINUTES" :{$and:[{$gt:0},{$lte:3}]}},"$HO_CALLED_MINUTES",0}
            //, SUM_CALLED_MINUTES_5_7 :{"$cond" : {"$HO_CALLED_MINUTES" :{$and:[{$gt:0},{$lte:3}]}},"$HO_CALLED_MINUTES",0}
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

            , HO_CALLED_COUNT : {$sum:"$HO_CALLED_COUNT"}
            , HO_CALLED_SECOND : {$sum:"$HO_CALLED_SECOND"}
            , SUM_CALLED_COUNT_0_3 : {$sum:"$SUM_CALLED_COUNT_0_3"}
        }}
        ,{    $out:"cep3g_stat_site"}
    ]
    //,{    explain: true}
    ,{    allowDiskUse: true}
    //,{    cursor: { batchSize: 0 }
);

print(new Date().toLocaleTimeString());
