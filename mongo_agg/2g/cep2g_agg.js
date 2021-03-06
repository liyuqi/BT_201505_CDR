//=============================== cep 2g A G G =================================
//mongo 192.168.0.196/cdr cep2g_agg.js > ./cep2g_agg_$(date +"%Y%m%d")_$(date +"%H%M%S").txt


print(new Date().toLocaleTimeString());
var agg_2g = db.cep2g_join.aggregate([
        {$match: {
        /*time: interval,up_falg:1,*/
            CALLTRANSACTIONTYPE:{$in:['1','2']}
        }}
        ,{$project:{
            //time:1,
            //CALLTRANSACTIONTYPE :"$CALLTRANSACTIONTYPE",
              DATE: "$STARTOFCHARGINGDATE"
            , HOUR: {$substr:["$TIMESTAMP",0,2]}

            //site
            , COUNTRY : { $substr: [ "$BTS_ADDRESS", 0, 9 ] }//"$BTS_ADDRESS" //縣市
            , DISTRICT : { $substr: [ "$BTS_ADDRESS", 9, 9 ] }//"$BTS_CODE" //地區
            , SITE_NAME : "$SITE_NAME"
            , SITE_ID : "$SITE_ID"

            //phone_type
            //, VENDOR : "$VENDOR"
            //, MODEL : "$MODEL"

            , END_CODE : "$CAUSEFORTERMINATION"
            , SIM_TYPE : "$SIM_TYPE"
            , CARRIER : "$CARRIER"

            //, HO_CALLED_1 : 1
            , CALLDURATION : "$CALLDURATION"
        }}
        ,{$group:{
            _id: {
                //CALLTRANSACTIONTYPE : 1,
                  DATE : "$DATE"
                , HOUR : "$HOUR"
                //site
                , COUNTRY: "$COUNTRY" //縣市
                , DISTRICT: "$DISTRICT" //地區
                , SITE_NAME: "$SITE_NAME"
                , SITE_ID: "$SITE_ID"

                //phone_type
                //, VENDOR: "$VENDOR"
                //, MODEL: "$MODEL"

                , END_CODE: "$END_CODE"
                , SIM_TYPE: "$SIM_TYPE"
                , CARRIER: "$CARRIER"
                //, IMEI: "$IMEI"
            }
            //value : {
                ,HO_CALLED_COUNT:{$sum:1}
                ,HO_CALLED_SECOND:{$sum:"$CALLDURATION"}
            //}
        }}
        ,{$project:{
            _id:1
            ,value : {
                  HO_CALLED_COUNT :"$HO_CALLED_COUNT"
                , HO_CALLED_SECOND:"$HO_CALLED_SECOND"
                , HO_CALLED_MINUTES :{$divide:["$HO_CALLED_SECOND",60]}
            }
        }}
        ,{    $out:"cep2g_agg"}
    ]
    //,{    explain: true}
    ,{    allowDiskUse: true}
    //,{    cursor: { batchSize: 0 }
);

print(new Date().toLocaleTimeString());
//print(agg_2g.result.length);
//agg_2g.result.forEach(function(doc){
//    //print(JSON.stringify(doc));
//});