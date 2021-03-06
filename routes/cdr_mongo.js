/**
 * Created by Yuqi on 2015/2/16.
 */
/*** Created by Yuqi on 2015/1/21.
 *
 */
// var mongodb = require('../models/db.js');
var util = require('util');
var _pageunit = 10;
_max_pageunit = 10;
_statInterval = 5*60*1000;

var query = {
  COUNTY:''
};

var page = 1;

exports.index = function(req, res){
    res.render('cdr_CRUD_show', { title: 'show cdr', resp : false});
};

/*exports.cdr_CRUD_insert = function(mongodb){
    return function(req, res) {
        //fields
        var call = {};

        //insert
        var collection = mongodb.get('cep3g');
        collection.insert(call,{safe: true}, function(err, docs){
            console.log("insert log : " + util.inspect(docs));
            res.render('cdr_CRUD_insert', {title: 'Create log', resp: docs});
        });
    };
};*/

exports.cdr_CRUD_loglist = function(mongodb){
    return function(req, res) {
        var collection = mongodb.get('cep3g_join');
        collection.count({},function(err, count) {
            if(err) res.redirect('cdr_CRUD_query');
            //console.log(format("count = %s", count));
            res.render('cdr_CRUD_query', {
                title: 'cdr',
                totalcount : count,
                resp :null,
                query:{},
                page:1,
                isFirstPage: (page - 1) == 0,
                isLastPage: ((page - 1) * _pageunit + count) == count
            });
        });
    };
};

exports.cdr_CRUD_query = function(mongodb){
    return function(req, res) {
        var page = req.body.page ? parseInt(req.body.page) : 1;
        //field input
        var query = {};

        for (var key in req.body){
            if(req.body[key].length==0);
            else {
                switch(key){
                    case 'page':break;
                    default:
                        query[key] = req.body[key].trim();
                }
            }
        }


        //if(req.body.called_number){
        //    query.called_number = req.body.called_number.trim();
        //}
        //if(req.body.calling_imei){
        //    query.calling_imei = req.body.calling_imei.trim();
        //}
        //if(req.body.called_imei){
        //    query.called_imei = req.body.called_imei.trim();
        //}
        //if(req.body.calling_imsi){
        //    query.calling_imsi = req.body.calling_imsi.trim();
        //}
        //if(req.body.called_imsi){
        //    query.called_imsi = req.body.called_imsi.trim();
        //}
        //if(req.body.calling_number){
        //    query.calling_number = req.body.calling_number.trim();
        //}
        //
        //if(req.body.exchange_id){
        //    query.exchange_id = req.body.exchange_id.trim();
        //}
        //if(req.body.cause_for_termination){
        //    query.cause_for_termination = req.body.cause_for_termination.trim();
        //}
        //
        //if(req.body.orig_mcz_duration){
        //    query.orig_mcz_duration = req.body.orig_mcz_duration.trim();
        //}
        //if(req.body.term_mcz_duration){
        //    query.term_mcz_duration = req.body.term_mcz_duration.trim();
        //}
        //if(req.body.radio_network_type){
        //    query.radio_network_type = req.body.radio_network_type.trim();
        //}
        //if(req.body.record_type){
        //    query.record_type = req.body.record_type.trim();
        //}

        //console.log('p:'+query['page']);

        console.log(util.inspect(query));

        var keys = [];
        for(var k in query) keys.push(k);

        if(keys.length==0)
            res.redirect('cdr_CRUD_query');

        //query
        //var collection = mongodb.get('cep3g_sample');
        var collection = mongodb.get('cep3g_join');
        collection.count({},function(err,db_count){
            collection.count(query, function (err, query_count) {
                collection.find(query, //{limit: _pageunit}, function (err, docs) {
                    {skip : (page - 1) * _pageunit,limit : _pageunit,sort : { _id : -1 }}, function (e, docs) {
                    if(e) res.redirect('cdr_CRUD_query');
                    //if (docs.length) console.log('docs.length: ' + docs.length);
                    res.render('cdr_CRUD_query', {
                            title: 'query cdr',
                            db_count: db_count,
                            query_count:query_count,
                            totalcount: db_count,
                            query:query,
                            //page_count:docs.length,
                            resp: docs,
                            page: page,
                            pageTotal: Math.ceil(docs.length / _pageunit),
                            isFirstPage: (page - 1) == 0,
                            isLastPage: ((page - 1) * _pageunit + docs.length) == docs.length
                        }
                    );
                    //if (err) res.redirect('cdr_CRUD_query');
                });
            });
        });
    };
};

exports.cdr_CRUD_count = function (mongodb) {
    return function (req, res) {
        //var page = req.query.p ? parseInt(req.query.p) : 1;
        console.log('cdr_count');
        var collection = mongodb.get('cep3g_sample');
        collection.count({},function(err,count){
            collection.find({}, {limit : _pageunit ,sort : { _id : -1 }} , function (err, docs) {
                console.log('cdr: ',docs.length/*,JSON.stringify(docs[0])*/);
                if (err) res.redirect('cdr_CRUD_show_pagging');
                res.render('cdr_CRUD_show_pagging', {
                    title: 'cdr',
                    totalcount: count,
                    resp: docs
                });
            });
        });
    };
};

exports.cdr_CRUD_show = function (mongodb) {
    return function (req, res) {
        console.log('cdr_show');
        //var collection = mongodb.get('cep3g_sample');
        var collection = mongodb.get('cep3g_join');
        collection.count({}, function (err, count) {
            collection.find({}, {limit: _pageunit, sort: {_id: -1}}, function (e, docs) {
                // console.log("docs data : "+util.inspect(docs));
                var docdetail;
                if (docs.length == 1) docdetail = util.inspect(docs);
                //console.log(docs[0].toJSON());
                res.render('cdr_CRUD_show', {
                    title: 'cdr',
                    totalcount: count,
                    resp: docs,
                    logdetail: docdetail
                });
            });
        });
    };
};

exports.cdr_CRUD_show_pagging = function (mongodb) {
    return function (req, res) {
        var page = req.query.p ? parseInt(req.query.p) : 2;

        //var collection = mongodb.get('cep3g_sample');
        var collection = mongodb.get('cep3g_join');
        collection.count({}, function (err, count) {
            collection.find({}, //{/*limit: 20,*/ sort: {_id: -1}}, function (e, docs) {
                {skip : (page - 1) * _pageunit,limit : _pageunit,sort : { _id : -1 }}, function (e, docs) {
                    // console.log("docs data : "+util.inspect(docs));
                    //var docdetail;
                    //if (docs.length == 1) docdetail = util.inspect(docs);
                    res.render('cdr_CRUD_show_pagging', {
                        title: 'cdr',
                        totalcount: count,
                        resp: docs,
                        //logdetail: docdetail,
                        page: page,
                        pageTotal: Math.ceil(docs.length / _pageunit),
                        isFirstPage: (page - 1) == 0,
                        isLastPage: ((page - 1) * _pageunit + docs.length) == docs.length
                    });
                });
        });
    };
};

exports.cdr_3g_site_report = function(mongodb){
    return function(req, res) {
        var collection = mongodb.get('cep3g_join');
        collection.col.count({},function(err, count) {
            if(err) res.redirect('cdr_3g_site_query');
            //console.log(format("count = %s", count));
            res.render('cdr_3g_site_query', {title: 'cdr', totalcount : count,resp :null});
        });
    };
};

exports.cdr_3g_site_query = function(mongodb){
    return function(req, res) {

        //field input
        var query={};

        for (var key in req.body){
            if(req.body[key].length==0);
            else
                query[''+key] = req.body[key].trim();
        }

        console.log(util.inspect(query));

        var keys = [];
        for(var k in query) keys.push(k);

        if(keys.length==0)
            res.redirect('cdr_3g_site_query');

        //query
        var collection = mongodb.get('cep3g_join');
        collection.count({},function(err,db_count){
            collection.count(query, function (err, query_count) {
                collection.find(query, {limit: _pageunit}, function (err, docs) {
                    //if (docs.length) console.log('docs.length: ' + docs.length);
                    if(err) res.redirect('cdr_3g_site_query');
                    //res.render('cdr_3g_site_stats_header45', {
                    res.render('cdr_3g_site_show_header45', {
                            title: 'query cep3g',
                            db_count: db_count,
                            totalcount: query_count,
                            //page_count:docs.length,
                            resp: docs
                        }
                    );
                    //if (err) res.redirect('cdr_CRUD_query');
                });
            });
        });
    };
};

exports.cdr_3g_site_stats = function(mongodb){
    return function(req, res) {
        var page = req.body.page ? parseInt(req.body.page) : 1;
        //field input
        var query = {};

        for (var key in req.body){
            if(req.body[key].length==0);
            else {
                switch(key){
                    case 'page':break;
                    default:
                        query[key] = req.body[key].trim();
                }
            }
        }

        //if(new Date(req.body.DATETIME0)=='Invalid Date') {
        //    query.DATETIME0 = null;
        //} else {
        //    query.DATETIME['$gte'] = new Date(req.body.DATETIME0)
        //}
        //if(new Date(req.body.DATETIME1)=='Invalid Date') {
        //    query.DATETIME1 = null;
        //    query.DATETIME ={
        //        $lte:new Date()
        //    }
        //} else {
        //    query.DATETIME['$lte'] = new Date(req.body.DATETIME1)
        //}

        //if(req.query.DATETIME0 && req.query.DATETIME1)
        //query.DATETIME = {
        //      $gte : ISODate(req.query.DATETIME0)
        //    , $lte : ISODate(req.query.DATETIME1)
        //};
        //query.record_type = {$in:['1','2']};
        console.log(util.inspect(query));

        var keys = [];
        for(var k in query) keys.push(k);

        if(keys.length==0) {
            res.redirect('cdr_3g_site_stats');
        }

        var agg_pipe_match = {$match:query};
        var agg_pipe_pro1  = {$project:{
              DATE          : "$DATE" //{ $substr: [ "$date_time", 0, 10 ] }
            , HOUR          : "$HOUR" //{ $substr: [ "$date_time", 11, 2 ] }
            , NETWORK_TYPE  : "$NETWORK_TYPE"
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


        }};
        var agg_pipe_group = {$group:{
            _id: {
                  DATE : "$DATE"                //日期
                , HOUR : "$HOUR"                //小時
                , NETWORK_TYPE : "$NETWORK_TYPE"//網路
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
        }};
        var agg_pipe_match2 = {$match:{
            $or:[
                 {SUM_CALLED_COUNT_0_3 :{$gt:0}}
                ,{SUM_CALLED_COUNT_3_5 :{$gt:0}}
                ,{SUM_CALLED_COUNT_5_7 :{$gt:0}}
                ,{SUM_CALLED_COUNT_7_10:{$gt:0}}
                //,{SUM_CALLED_COUNT_10UP:{$gt:0}}
            ]
        }};

        var agg_pipe_pro_en = {$project:{
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

        }};
        var agg_pipe_pro_zh = {$project:{
            _id:0
            , 日期        : "$_id.DATE"
            , 時間        : "$_id.HOUR"
            , 網路        : "$_id.NETWORK_TYPE"
            , 卡別        : "$_id.SIM_TYPE"
            , 業者        : "$_id.CARRIER"
            , 結束        : "$_id.END_CODE"
            ////site
            , 縣市        : "$_id.COUNTY"
            , 區域        : "$_id.DISTRICT"
            , 基站        : "$_id.SITE_NAME"
            //, SITE_ID       : "$_id.SITE_ID"
            ////phone_type
            //, VENDOR        : "$_id.VENDOR"
            //, MODEL         : "$_id.MODEL"

            , HO次數      :"$HO_CALLED_COUNT"
            , HO秒數      :"$HO_CALLED_SECOND"
            , HO分鐘      :{$divide:["$HO_CALLED_SECOND",60]}
            , HO不重複     :"$HO_DISTINCT"
            , HO重複      :"$HO_EACH_ID"

            , 次數0_3 : "$SUM_CALLED_COUNT_0_3"
            , 次數3_5 : "$SUM_CALLED_COUNT_3_5"
            , 次數5_7 : "$SUM_CALLED_COUNT_5_7"
            , 次數7_10: "$SUM_CALLED_COUNT_7_10"
            //, 次數10UP: "$SUM_CALLED_COUNT_10UP"

            , 分鐘0_3 : {$divide:["$SUM_CALLED_SECOND_0_3",60]}
            , 分鐘3_5 : {$divide:["$SUM_CALLED_SECOND_3_5",60]}
            , 分鐘5_7 : {$divide:["$SUM_CALLED_SECOND_5_7",60]}
            , 分鐘7_10: {$divide:["$SUM_CALLED_SECOND_7_10",60]}
            //, 分鐘10UP: {$divide:["$SUM_CALLED_SECOND_10UP",60]}

            , 不重複0_3 :"$DISTINCT_0_3"
            , 不重複3_5 :"$DISTINCT_3_5"
            , 不重複5_7 :"$DISTINCT_5_7"
            , 不重複7_10:"$DISTINCT_7_10"
            //, 不重複10UP:"$DISTINCT_10UP"

            , 重複0_3  :"$EACH_ID_0_3"
            , 重複3_5  :"$EACH_ID_3_5"
            , 重複5_7  :"$EACH_ID_5_7"
            , 重複7_10 :"$EACH_ID_7_10"
            //, 重複_10UP :"$EACH_ID_10UP"
        }};

        var agg_pipe_skip = {$skip:(page - 1) * _pageunit};    //(page - 1) * _pageunit
        var agg_pipe_limit = {$limit:_pageunit};  //_pageunit
        var agg_pipe_out = {$out:"cep3g_stat_site"};


        var agg_pipes = [
            agg_pipe_match
            ,agg_pipe_pro1
            ,agg_pipe_group
            ,agg_pipe_match2

            //,agg_pipe_pro_en
            ,agg_pipe_pro_zh
            ,agg_pipe_skip
            ,agg_pipe_limit
            //,agg_pipe_out
        ];

        //console.log(util.inspect(agg_pipes));

        var collection = mongodb.get('cep3g_join');
        var collection_stat = mongodb.get('cep3g_stat_site');
        collection.count(query, function (err, query_count) {
            collection.col.aggregate(agg_pipes,{ allowDiskUse:true }, function(err, result) {
                if(err) //res.redirect('cdr_3g_site_stats');
                    console.log("err : "+err.trace());
                    res.render('cdr_3g_site_show_fixHead_zh', {
                        title: 'stat cep3g',
                        //db_count: db_count,
                        //totalcount: result.lenth,
                        totalcount: result.length,
                        //page_count:docs.length,
                        resp: result,
                        query:query,
                        page: page,
                        pageTotal: Math.ceil(query_count.length / _pageunit),
                        isFirstPage: (page - 1) == 0,
                        isLastPage: ((page - 1) * _pageunit + query_count.length) == query_count.length
                    });
            });
        });
        //collection_stat.find({}, function(err,docs){
        //    res.render('cdr_3g_site_show_fixHead_pagging', {
        //        title: 'stat cep3g',
        //        //db_count: db_count,
        //        //totalcount: result.lenth,
        //        totalcount: docs.length,
        //        //page_count:docs.length,
        //        resp: docs
        //    });
        //});
    };
};

exports.cdr_3g_site_query_pagging = function(mongodb){
    return function(req, res) {

        var page = req.body.page ? parseInt(req.body.page) : 1;
        //field input
        var query = {};

        for (var key in req.body){
            if(req.body[key].length==0);
            else {
                switch(key){
                    case 'page':break;
                    default:
                        query[key] = req.body[key].trim();
                }
            }
        }
        //if(new Date(req.query.DATETIME0)=='Invalid Date')
        //if(req.query.DATETIME0 && req.query.DATETIME1)
        //query.date_time = {
        //      $gte : ISODate(req.query.DATETIME0)
        //    , $lte : ISODate(req.query.DATETIME1)
        //};
        //query.record_type = {$in:['1','2']};
        console.log(util.inspect(query));

        var keys = [];
        for(var k in query) keys.push(k);

        if(keys.length==0)
            res.redirect('cdr_3g_site_query');


        var agg_pipe_match = {$match:query};
        var agg_pipe_pro1  = {$project:{
            DATE          : "$DATE" //{ $substr: [ "$date_time", 0, 10 ] }
            , HOUR          : "$HOUR" //{ $substr: [ "$date_time", 11, 2 ] }
            , NETWORK_TYPE  : "$NETWORK_TYPE"
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

            //, HO_DISTINCT:{$cond :[{$gt:["$HO",0]},"$called_number",""]}
            //, HO : 1
            //, HO_SECOND : 1

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

        }};
        var agg_pipe_group = {$group:{
            _id: {
                DATE : "$DATE"                //日期
                , HOUR : "$HOUR"                //小時
                , NETWORK_TYPE : "$NETWORK_TYPE"//網路
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
        }};
        var agg_pipe_match2 = {$match:{
            $or:[
                {SUM_CALLED_COUNT_0_3 :{$gt:0}}
                ,{SUM_CALLED_COUNT_3_5 :{$gt:0}}
                ,{SUM_CALLED_COUNT_5_7 :{$gt:0}}
                ,{SUM_CALLED_COUNT_7_10:{$gt:0}}
                //,{SUM_CALLED_COUNT_10UP:{$gt:0}}
            ]
        }};

        var agg_pipe_pro_en = {$project:{
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
        }};
        var agg_pipe_pro_zh = {$project:{
            _id:0
            , 日期        : "$_id.DATE"
            , 時間        : "$_id.HOUR"
            , 網路        : "$_id.NETWORK_TYPE"
            , 卡別        : "$_id.SIM_TYPE"
            , 業者        : "$_id.CARRIER"
            , 結束        : "$_id.END_CODE"
            ////site
            , 縣市        : "$_id.COUNTY"
            , 區域        : "$_id.DISTRICT"
            , 基站        : "$_id.SITE_NAME"
            //, SITE_ID       : "$_id.SITE_ID"
            ////phone_type
            //, VENDOR        : "$_id.VENDOR"
            //, MODEL         : "$_id.MODEL"

            //, HO_DISTINCT       :1
            //, HO_CALLED_COUNT   :1
            //, HO_CALLED_SECOND  :1
            //, HO_CALLED_MINUTES :{$divide:["$HO_CALLED_SECOND",60]}

            , 次數0_3 : "$SUM_CALLED_COUNT_0_3"
            , 次數3_5 : "$SUM_CALLED_COUNT_3_5"
            , 次數5_7 : "$SUM_CALLED_COUNT_5_7"
            , 次數7_10: "$SUM_CALLED_COUNT_7_10"
            //, 次數10UP: "$SUM_CALLED_COUNT_10UP"

            , 分鐘0_3 : {$divide:["$SUM_CALLED_SECOND_0_3",60]}
            , 分鐘3_5 : {$divide:["$SUM_CALLED_SECOND_3_5",60]}
            , 分鐘5_7 : {$divide:["$SUM_CALLED_SECOND_5_7",60]}
            , 分鐘7_10: {$divide:["$SUM_CALLED_SECOND_7_10",60]}
            //, 分鐘10UP: {$divide:["$SUM_CALLED_SECOND_10UP",60]}

            , 不重複0_3 :"$DISTINCT_0_3"
            , 不重複3_5 :"$DISTINCT_3_5"
            , 不重複5_7 :"$DISTINCT_5_7"
            , 不重複7_10:"$DISTINCT_7_10"
            //, 不重複10UP:"$DISTINCT_10UP"
        }};

        var agg_pipe_skip = {$skip:500};    //(page - 1) * _pageunit
        var agg_pipe_limit = {$limit:100};  //_pageunit
        var agg_pipe_out = {$out:"cep3g_stat_site"};

        var agg_pipes = [
            agg_pipe_match
            ,agg_pipe_pro1
            ,agg_pipe_group
            ,agg_pipe_match2

            //,agg_pipe_pro_en
            ,agg_pipe_pro_zh
            //,agg_pipe_skip
            //,agg_pipe_limit
            //,agg_pipe_out
        ];

        //console.log(util.inspect(agg_pipes));
        var page = req.query.p ? parseInt(req.query.p) : 1;
        var collection = mongodb.get('cep3g_join');
        //collection.col.aggregate(agg_pipes,{limit:100}, function(err, result) {
        collection.col.aggregate(agg_pipes, { allowDiskUse: true},
            function(err, result) {
            if(err) //res.redirect('cdr_3g_site_query');
                console.log("err : "+err.trace());
            //if(result) console.log("result : "+util.inspect(result));
            //res.render('cdr_3g_site_show', {
            res.render('cdr_3g_site_show_fixHead_pagging', {
                    query:query,
                    title: 'stat cep3g',
                    //db_count: db_count,
                    totalcount: result.length,
                    //page_count:docs.length,
                    resp: result,
                    page: page,
                    pageTotal: Math.ceil(docs.length / _pageunit),
                    isFirstPage: (page - 1) == 0,
                    isLastPage: ((page - 1) * _pageunit + docs.length) == docs.length
                }
            );
        });
    };
};
