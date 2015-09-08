//mongo cdr cepgprs_join.js > c:\workspace\CDR0324\cepgprs_join.txt
//mongo cdr cepgprs_join.js > ./cepgprs_join.txt
//mongo cdr cepgprs_join.js > ./cepgprs_join_$(date +"%Y%m%d")_$(date +"%H%M%S").txt
var /*cepgprs,*/ site3g_map = {};

//function buildPhoneMap(){
//    var obj = {};
//    var phone = db.phone_sample.find({});
//    phone.forEach(function(type){
//        obj = {
//            //id          : type._id,
//            PT_OID      : type.PT_OID,
//            IMEI_VALUE  : type.IMEI_VALUE,
//            DMS_ID      : type.DMS_ID,
//            VENDOR      : type.VENDOR,
//            MODEL       : type.MODEL
//        };
//        phone_map[type.IMEI_VALUE+''] = obj;
//    });
//}buildPhoneMap();

//function buildSite2gMap(){
//    var obj = {};
//    var site2g = db.siteview2g_sample.find({});
//    site2g.forEach(function(site){
//        obj = {
//            //id          :site._id,
//            BTS_CODE    : site.BTS_CODE,
//            SITE_ID     : site.SITE_ID,     //return
//            SITE_NAME   : site.SITE_NAME,
//            BELONG_TO   : site.BELONG_TO,
//            CELL_NO     : site.CELL_NO,     //cell
//            LAC_OD      : site.LAC_OD,       //lac
//            BTS_ADDRESS : site.BTS_ADDRESS
//        };
//        site2g_map[site.LAC_OD +'-'+ site.CELL_NO] = obj;
//    });
//} buildSite2gMap();

function buildSite3gMap(){
    var obj = {};
    var site3g = db.siteview3g_sample.find({});
    site3g.forEach(function(site){
        obj = {
            //id          :site._id,
            BTS_CODE    : site.BTS_CODE,
            SITE_ID     : site.SITE_ID,     //return
            SITE_NAME   : site.SITE_NAME,
            BELONG_TO   : site.BELONG_TO,
            LAC         : site.LAC, //CELL_NO     : site.CELL_NO,     //cell
            SAC         : site.SAC, //LAC_OD      : site.LAC_OD,       //lac
            BTS_ADDRESS : site.BTS_ADDRESS
        };
        site3g_map[site.LAC +'-'+ site.SAC] = obj;
    });
}buildSite3gMap();

/*function buildSIMmap(){
    SIM_map['46693']  = {SIM_TYPE:'SIM' ,GENERATION:'2G',IMSI_STARTOF:/^46693/};
    SIM_map['466970'] = {SIM_TYPE:'SIM' ,GENERATION:'2G',IMSI_STARTOF:/^466970/};
    SIM_map['466971'] = {SIM_TYPE:'SIM' ,GENERATION:'2G',IMSI_STARTOF:/^466971/};
    SIM_map['466972'] = {SIM_TYPE:'SIM' ,GENERATION:'2G',IMSI_STARTOF:/^466972/};
    SIM_map['466973'] = {SIM_TYPE:'SIM' ,GENERATION:'2G',IMSI_STARTOF:/^466973/};
    SIM_map['466974'] = {SIM_TYPE:'USIM',GENERATION:'3G',IMSI_STARTOF:/^466974/};
    SIM_map['466975'] = {SIM_TYPE:'SIM' ,GENERATION:'2G',IMSI_STARTOF:/^466975/};
    SIM_map['466976'] = {SIM_TYPE:'SIM' ,GENERATION:'2G',IMSI_STARTOF:/^466976/};
    SIM_map['466977'] = {SIM_TYPE:'ISIM',GENERATION:'4G',IMSI_STARTOF:/^466977/};
    SIM_map['466978'] = {SIM_TYPE:'SIM' ,GENERATION:'2G',IMSI_STARTOF:/^466978/};
    SIM_map['466979'] = {SIM_TYPE:'SIM' ,GENERATION:'2G',IMSI_STARTOF:/^466979/};
    SIM_map['46699']   = {SIM_TYPE:'SIM' ,GENERATION:'2G',IMSI_STARTOF:/^46699/};
    SIM_map[''] = {SIM_TYPE:'roaming',GENERATION:'all',IMSI_STARTOF:/^/};
} buildSIMmap();

function buildCARRIERmap(){
    CARRIER_map['9']={CARRIER:'台灣大哥大',NPRN:/^9/};
    CARRIER_map['8869'] ={CARRIER:'台灣大哥大',NPRN:/^8869/};
    CARRIER_map['1406']={CARRIER:'台灣大哥大',NPRN:/^1406/};
    CARRIER_map['1411']={CARRIER:'台灣大哥大',NPRN:/^1411/};
    CARRIER_map['1412']={CARRIER:'台灣大哥大',NPRN:/^1412/};
    CARRIER_map['1413']={CARRIER:'台灣大哥大',NPRN:/^1413/};
    CARRIER_map['1414']={CARRIER:'台灣大哥大',NPRN:/^1414/};
    CARRIER_map['1426']={CARRIER:'台灣大哥大',NPRN:/^1426/};
    CARRIER_map['1431']={CARRIER:'台灣大哥大',NPRN:/^1431/};
    CARRIER_map['1407']={CARRIER:'遠傳電信'  ,NPRN:/^1407/};
    CARRIER_map['1410']={CARRIER:'遠傳電信'  ,NPRN:/^1410/};
    CARRIER_map['1416']={CARRIER:'遠傳電信'  ,NPRN:/^1416/};
    CARRIER_map['1417']={CARRIER:'遠傳電信'  ,NPRN:/^1417/};
    CARRIER_map['1427']={CARRIER:'遠傳電信'  ,NPRN:/^1427/};
    CARRIER_map['1432']={CARRIER:'遠傳電信'  ,NPRN:/^1432/};
    CARRIER_map['1409']={CARRIER:'中華電信'  ,NPRN:/^1409/};
    CARRIER_map['1419']={CARRIER:'中華電信'  ,NPRN:/^1419/};
    CARRIER_map['1429']={CARRIER:'中華電信'  ,NPRN:/^1429/};
    CARRIER_map['1433']={CARRIER:'中華電信'  ,NPRN:/^1433/};
    CARRIER_map['1439']={CARRIER:'中華電信'  ,NPRN:/^1439/};
    CARRIER_map['1405']={CARRIER:'亞太電信'  ,NPRN:/^1405/};
    CARRIER_map['1415']={CARRIER:'亞太電信'  ,NPRN:/^1415/};
    CARRIER_map['1425']={CARRIER:'亞太電信'  ,NPRN:/^1425/};
    CARRIER_map['1435']={CARRIER:'亞太電信'  ,NPRN:/^1435/};
    CARRIER_map['1436']={CARRIER:'亞太電信'  ,NPRN:/^1436/};
    CARRIER_map['1418']={CARRIER:'台灣之星'  ,NPRN:/^1418/};
    CARRIER_map['1434']={CARRIER:'台灣之星'  ,NPRN:/^1434/};
    CARRIER_map['']={CARRIER:'其他業者'  ,NPRN:''};
} buildCARRIERmap();*/
//for(var key in site2g_map){print(key)}
var i=0;
print(new Date().toLocaleTimeString()+'\tprocess:'+i);
//var d = new Date();
//var t1 = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(),0,0,0);
//var t0 = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours()-1,0,0,0);
//var interval = {$gte:t0,$lt:t1}; //ISODate("2015-03-31T16:00:00Z")

var cepgprs = db.cepgprs_sample.find({
//var cepgprs = db.cepgprs_gen.find({
    /*time: interval,up_falg:1,*/

    "RECORD_TYPE":"19"
},{
           "RECORD_TYPE"
      : 1, "SERVED_MSISDN"
      : 1, "G_UPLINK"
      : 1, "G_DOWNLINK"
      : 1, "G_RECORD_OPENING_TIME"
      : 1, "G_DIAGNOSTICS"
      : 1, "CALLED_SUBS_FIRST_LAC"
      : 1, "CALLED_SUBS_FIRST_SAC"
      : 1, "_id":0
}).forEach(function (doc) { //================= cep gprs find =================
//while(cdr2g.hasNext()){
    //var doc = col.next();
    if(doc.up_flag!=2) {  //================================================= update done, erich up_flag:1
        if (doc.RECORD_TYPE == "19") {
            try {
                var cell = doc.CALLED_SUBS_FIRST_LAC + '-' + doc.CALLED_SUBS_FIRST_SAC;
                try {
                    doc.SITE_ID     = site3g_map[cell].SITE_ID;
                    doc.SITE_NAME   = site3g_map[cell].SITE_NAME;
                    doc.BELONG_TO   = site3g_map[cell].BELONG_TO;
                    doc.SAC         = site3g_map[cell].SAC;  //#
                    doc.LAC         = site3g_map[cell].LAC;   //#
                    doc.BTS_ADDRESS = site3g_map[cell].BTS_ADDRESS;
                } catch (e) {} //doc.SITE_ID = '-----'; }
            } catch (e) {}
            if  (doc.G_UPLINK == null || "") {   doc.G_UPLINK = 0;   }
            else{doc.G_UPLINK = Number(doc.G_UPLINK);}
            if  (doc.G_DOWNLINK == null || "") {    doc.G_DOWNLINK = 0;   }
            else{doc.G_DOWNLINK = Number(doc.G_DOWNLINK);}
        }
        print(new Date().toLocaleTimeString() + '\trt:' + doc.RECORD_TYPE +
            '\tcell:' + doc.CALLED_SUBS_FIRST_LAC + '-' + doc.CALLED_SUBS_FIRST_SAC +
            '     \tsite:' + doc.SITE_ID + '\tup:'+ doc.G_UPLINK + '\tdn:'+doc.G_DOWNLINK
        );

        //doc.up_flag = 1;  //================================================= update done, erich up_flag:1
        //db.cdrgprs.save(doc); //============= cep 2g save =============
        db.cepgprs_sample.update({_id:doc._id},{$set : {up_flag:1}}); //============= cep 2g save =============
        //db.cepgprs_gen.update({_id:doc._id},{$set : {up_flag:1}}); //============= cep 2g save =============
        db.cepgprs_join.save(doc);
        i++;
    }else{} //print("else")


});
print(new Date().toLocaleTimeString()+'\tprocess:'+i+'\tdb.cepgprs_join.count()'+db.cepgprs_join.count());
//db.cepgprs_sample.findOne({up_flag:1},{RECORD_TYPE:1,CALLED_SUBS_FIRST_LAC:1,CALLED_SUBS_FIRST_SAC:1,G_UPLINK:1,G_DOWNLINK:1,up_flag:1});
//mongo cdr cepgprs_join.js > ./cepgprs_join_$(date +"%Y%m%d")_$(date +"%H%M%S").txt


//> db.cepgprs_sample.find({G_RECORD_OPENING_TIME:/^2015-01-02 21/}).count()4
//> db.cepgprs_sample.find({G_RECORD_OPENING_TIME:/^2015-01-02 22/}).count()345940
//> db.cepgprs_sample.find({G_RECORD_OPENING_TIME:/^2015-01-02 23/}).count()1861785
//> db.cepgprs_sample.find({G_RECORD_OPENING_TIME:/^2015-01-03 00/}).count()1290868

4
345940
1861785
1290868