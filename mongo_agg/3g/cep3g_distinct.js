//db.cep3g_agg.findOne() =
//{
//    "_id" : {
//    "STATISTIC_DATE" : {
//        "DATE" : "2015-04-24",
//            "HOUR" : "12"
//    },
//    "COUNTY" : "新北市",
//        "DISTRICT" : "汐止區",
//        "SITE_NAME" : "汐止樟樹直營店",
//        "SITE_ID" : "221M7",
//        "END_CODE" : "0000",
//        "SIM_TYPE" : "USIM",
//        "CARRIER" : "台灣大哥大"
//},
//    "HO_CALLED_COUNT" : 0,
//    "HO_CALLED_SECOND" : 277
//}

// mongo cdr --port 40000 cep3g_distinct.js > cep3g_distinct_result.txt
print(new Date().toLocaleTimeString());
var f1 = db.cep3g_agg.distinct('_id.COUNTY');
var f2 = db.cep3g_agg.distinct('_id.DISTRICT');
var f3 = db.cep3g_agg.distinct('_id.SITE_NAME');
var f4 = db.cep3g_agg.distinct('_id.SITE_ID');
var f5 = db.cep3g_agg.distinct('_id.END_CODE');
var f6 = db.cep3g_agg.distinct('_id.SIM_TYPE');
var f7 = db.cep3g_agg.distinct('_id.CARRIER');

f1.forEach(function(value){
    var fieldCount = db.cep3g_agg.find({"_id.COUNTY":value}).count();
    print('COUNTY: '+value+'\tfieldCount:'+fieldCount);
});
f2.forEach(function(value){
    var fieldCount = db.cep3g_agg.find({"_id.DISTRICT":value}).count();
    print('DISTRICT: '+value+'\tfieldCount:'+fieldCount);
});
f3.forEach(function(value){
    var fieldCount = db.cep3g_agg.find({"_id.SITE_NAME":value}).count();
    print('SITE_NAME: '+value+'\tfieldCount:'+fieldCount);
});
f4.forEach(function(value){
    var fieldCount = db.cep3g_agg.find({"_id.SITE_ID":value}).count();
    print('SITE_ID: '+value+'\tfieldCount:'+fieldCount);
});
f5.forEach(function(value){
    var fieldCount = db.cep3g_agg.find({"_id.END_CODE":value}).count();
    print('END_CODE: '+value+'\tfieldCount:'+fieldCount);
});
f6.forEach(function(value){
    var fieldCount = db.cep3g_agg.find({"_id.SIM_TYPE":value}).count();
    print('SIM_TYPE: '+value+'\tfieldCount:'+fieldCount);
});
f7.forEach(function(value){
    var fieldCount = db.cep3g_agg.find({"_id.CARRIER":value}).count();
    print('CARRIER: '+value+'\tfieldCount:'+fieldCount);
});
print(new Date().toLocaleTimeString());