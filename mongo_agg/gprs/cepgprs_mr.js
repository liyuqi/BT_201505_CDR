//mongo cdr cepgprs_mr.js > ./cepgprs_mr_$(date +"%Y%m%d")_$(date +"%H%M%S").txt
print(new Date().toLocaleTimeString()+'\tgprs mr start');
var mrgprs = db.cepgprs_join.mapReduce(
    function () {
        //var time= this.timestamp.substring(0,2);
        try {
            var key = {
                RECORD_TYPE: this.RECORD_TYPE
                //STATISTIC_DATE : "$time"
                , DATE: this.G_RECORD_OPENING_TIME.substr(0,10)
                , HOUR: this.G_RECORD_OPENING_TIME.substr(11, 2)

                , COUNTY: this.BTS_ADDRESS.substr(0, 3)
                , DISTRICT: this.BTS_ADDRESS.substr(3, 3)
                , SITE_NAME: this.SITE_NAME
                , SITE_ID: this.SITE_ID
            };
        }catch(e){}
        var value = {
            G_UPLINK: this.G_UPLINK
            ,G_DOWNLINK: this.G_DOWNLINK

        };
        emit(key, value);
    },
    function (key, values) {
        var doc = {};

        values.forEach(function (value) {
            doc.DATA_UPLOAD += value.$G_UPLINK;
            doc.DATA_DOWNLOAD += value.G_DOWNLINK;
            doc.DATA_LOAD += doc.DATA_UPLOAD+doc.DATA_DOWNLOAD;
        });

        //doc.HO_CALLED_MINUTES = (doc.HO_CALLED_SECONDS / 60.0);
        //doc.HO_CALLED_MINUTES = (doc.HO_CALLED_SECONDS / 60.0);
        //doc.HO_CALLED_MINUTES = (doc.HO_CALLED_SECONDS / 60.0);

        return doc;
    },
    {
        query: {//--------------------------------filter------------------------------
            /*time: interval,up_falg:1,*/
            "RECORD_TYPE":"19"
        },
        out: {
            replace:"cepgprs_mr" //replace/merge/reduce
            //,inline:1 //use memory either shard
            //,sharded:1
            //,nonAtomic:0
        }
    }
);
//mongo cdr cepgprs_mr.js > ./cepgprs_mr_$(date +"%Y%m%d")_$(date +"%H%M%S").txt
print(new Date().toLocaleTimeString()+'\tgprs mr end');
print(JSON.stringify(mrgprs));
//db.cepgprs.find().skip(5).limit(2).pretty()
//mr2g.forEach(function(doc){
//    print(JSON.stringify(doc));
//});

/*
MongoDB shell version: 3.0.1
connecting to: cdr
10:26:25	gprs mr start
10:28:38	gprs mr end
{
	"result" : "cdrgprs_mr",
	"timeMillis" : 132366,
	"counts" : {
		"input" : 3509017,
		"emit" : 3509017,
		"reduce" : 337377,
		"output" : 32762
	},
	"ok" : 1,
	"_o" : {
		"result" : "cdrgprs_mr",
		"timeMillis" : 132366,
		"counts" : {
			"input" : 3509017,
			"emit" : 3509017,
			"reduce" : 337377,
			"output" : 32762
		},
		"ok" : 1
	},
	"_keys" : ["result", "timeMillis", "counts", "ok"],
	"_db" : {
		"_mongo" : {
			"slaveOk" : false,
			"host" : "127.0.0.1"
		},
		"_name" : "cdr",
		"_defaultAuthenticationMechanism" : null,
		"_defaultGssapiServiceName" : "mongodb"
	},
	"_coll" : {
		"_mongo" : {
			"slaveOk" : false,
			"host" : "127.0.0.1"
		},
		"_db" : {
			"_mongo" : {
				"slaveOk" : false,
				"host" : "127.0.0.1"
			},
			"_name" : "cdr",
			"_defaultAuthenticationMechanism" : null,
			"_defaultGssapiServiceName" : "mongodb"
		},
		"_shortName" : "cdrgprs_mr",
		"_fullName" : "cdr.cdrgprs_mr"
	}
*/