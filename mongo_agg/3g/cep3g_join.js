//mongo cdr cep3g_join.js > c:\workspace\CDR0324\cep3g_join_result.txt
//mongo cdr cep3g_join.js > ./cep3g_join_result.txt
//mongo cdr --eval "var max_id=$_max_id, pick=$pick, i=$i;" cep3g_join.js > ./cep3g_join_result_$(date +"%Y%m%d")_$(date +"%H%M%S").txt
var /*cdr3g,*/ phone_map = {}, site2g_map = {}, site3g_map = {}, SIM_map = {}, CARRIER_map = {};

function buildPhoneMap(){
    var obj = {};
    var phone = db.phone_sample.find({});
    phone.forEach(function(type){
        obj = {
            //id          : type._id,
            PT_OID      : type.PT_OID,
            IMEI_VALUE  : type.IMEI_VALUE,
            DMS_ID      : type.DMS_ID,
            VENDOR      : type.VENDOR,
            MODEL       : type.MODEL
        };
        phone_map[type.IMEI_VALUE+''] = obj;
    });
}buildPhoneMap();

function buildSite2gMap(){
    var obj = {};
    var site2g = db.siteview2g_sample.find({});
    site2g.forEach(function(site){
        obj = {
            //id          :site._id,
            BTS_CODE    : site.BTS_CODE,
            SITE_ID     : site.SITE_ID,     //return
            SITE_NAME   : site.SITE_NAME,
            BELONG_TO   : site.BELONG_TO,
            CELL_NO     : site.CELL_NO,     //cell
            LAC_OD      : site.LAC_OD,       //lac
            BTS_ADDRESS : site.BTS_ADDRESS
        };
        site2g_map[site.LAC_OD +'-'+ site.CELL_NO] = obj;
    });
} buildSite2gMap();

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
            CELL_NO     : site.CELL_NO,     //cell
            LAC_OD      : site.LAC_OD,       //lac
            BTS_ADDRESS : site.BTS_ADDRESS
        };
        site3g_map[site.LAC_OD +'-'+ site.CELL_NO] = obj;
    });
}buildSite3gMap();

function buildSIMmap(){
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
} buildCARRIERmap();
//for(var key in site3g_map){print(key)}
var i=0;
print(new Date().toLocaleTimeString()+'\tprocess:'+i);
//var d = new Date();
//var t1 = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(),30,0,0);
//var t0 = new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours()-1,30,0,0);
//var interval = {$gte:t0,$lt:t1}; //ISODate("2015-03-31T16:00:00Z")

var cdr3g = db.cep3g_sample.find({
//var cdr3g = db.cep3g_gen.find({
//     date_time : {$in:[new RegExp('^'+)]}
//    ,up_flag : {$nin:[1]}
    _id:{$gt:max_id}
    ,record_type:{$in:["1","2"]}
},{
    "called_number" : 1             //substr(IMSI,0,8)['TWM','FET','CHT','ARTP','T_START','other','MTC']
    ,"called_imei" : 1              //#index phone MTC
    ,"called_imsi" : 1              //substr(IMSI,0,6)['SIM_2G','USIM_3G','ISIM_4G','roaming']
    ,"called_subs_last_ci" : 1      //#index site MTC
    ,"called_subs_last_lac" : 1     //#index site MTC

    ,"calling_imei" : 1             //#index phone MOC
    ,"calling_imsi" : 1             //substr(IMSI,0,6)['SIM_2G','USIM_3G','ISIM_4G','roaming']
    //,"calling_number" : 1           //^[]
    ,"calling_subs_last_ci" : 1     //#index site MOC
    ,"calling_subs_last_lac" : 1    //#index site MOC

    ,"cause_for_termination" : 1    //c = 100
    ,"charging_end_time" : 1
    ,"charging_start_time" : 1
    ,"exchange_id" : 1
    ,"orig_mcz_duration" : 1        //$sum
    ,"radio_network_type" : 1
    ,"record_type" : 1
    ,"term_mcz_duration" : 1        //$sum
    ,"date_time" : 1                //#index date, time
    ,"up_flag" : 1
    ,"_id":1
}).skip(pick).limit(pick).forEach(function (doc) {
//while(cdr3g.hasNext()){
    //var doc = col.next();
    if(doc.up_flag!=2) {  //======================================== update done, erich up_flag:1
        if(doc.record_type=="1") {
            try{
                var cell = doc.calling_subs_last_lac + '-' + doc.calling_subs_last_ci;
                try {
                    doc.SITE_ID     = site3g_map[cell].SITE_ID;
                    doc.SITE_NAME   = site3g_map[cell].SITE_NAME;
                    doc.BELONG_TO   = site3g_map[cell].BELONG_TO;
                    doc.CELL_NO     = site3g_map[cell].CELL_NO;  //#
                    doc.LAC_OD      = site3g_map[cell].LAC_OD;   //#
                    doc.BTS_ADDRESS = site3g_map[cell].BTS_ADDRESS;
                } catch(e){ } //doc.SITE_ID = '3g'; }
                try {
                    doc.SITE_ID     = site2g_map[cell].SITE_ID;
                    doc.SITE_NAME   = site2g_map[cell].SITE_NAME;
                    doc.BELONG_TO   = site2g_map[cell].BELONG_TO;
                    doc.CELL_NO     = site2g_map[cell].CELL_NO;  //#
                    doc.LAC_OD      = site2g_map[cell].LAC_OD;   //#
                    doc.BTS_ADDRESS = site2g_map[cell].BTS_ADDRESS;
                    doc.HANGOVER    = 1; //========================= 換手 ======//
                } catch(e){ } //doc.SITE_ID = '2g'; doc.HANGOVER    = 1;}
                try {
                    //var calling_imei = doc.calling_imei.substr(0,8);
                    //doc.IMEI_VALUE  = phone_map[doc.calling_imei.substr(0,8)].IMEI_VALUE;
                    doc.PT_OID      = phone_map[doc.calling_imei.substr(0,8)].PT_OID;
                    doc.DMS_ID      = phone_map[doc.calling_imei.substr(0,8)].DMS_ID;
                    doc.VENDOR      = phone_map[doc.calling_imei.substr(0,8)].VENDOR;
                    doc.MODEL       = phone_map[doc.calling_imei.substr(0,8)].MODEL;
                } catch (e) { } // doc.PT_OID
                try{
                    if(doc.calling_imsi.substr(0,5)=='46693')
                        doc.SIM_TYPE = SIM_map[doc.calling_imsi.substr(0,5)].SIM_TYPE;
                    else if(doc.calling_imsi.substr(0,5)=='46697')
                        doc.SIM_TYPE = SIM_map[doc.calling_imsi.substr(0,6)].SIM_TYPE;
                    else if(doc.calling_imsi.substr(0,5)=='46699')
                        doc.SIM_TYPE = SIM_map[doc.calling_imsi.substr(0,5)].SIM_TYPE;
                    else
                        doc.SIM_TYPE = SIM_map[''].SIM_TYPE;
                }catch (e) {} //doc.SIM_TYPE
                try{
                    if(doc.called_number.substr(0,1)=='9')
                        doc.CARRIER = CARRIER_map[doc.called_number.substr(0,1)].CARRIER;
                    else if(doc.called_number.substr(0,4)=='8869')
                        doc.CARRIER = CARRIER_map[doc.called_number.substr(0,4)].CARRIER;
                    else if(doc.called_number.substr(0,2)=='14')
                        doc.CARRIER = CARRIER_map[doc.called_number.substr(0,4)].CARRIER;
                    else
                        doc.CARRIER = CARRIER_map[''].CARRIER;
                }catch (e) {} //doc.CARRIER
                try{
                    doc.cause_for_termination = doc.cause_for_termination.substr(-4,4);
                }catch(e){} //doc.cause_for_termination
            }catch(e){}
            if  (doc.orig_mcz_duration == null||""){doc.orig_mcz_duration=0;}
            else{doc.orig_mcz_duration = Number(doc.orig_mcz_duration);}
            if  (doc.term_mcz_duration == null||""){doc.term_mcz_duration=0;}
            else{doc.term_mcz_duration = Number(doc.term_mcz_duration);}

//            print(new Date().toLocaleTimeString() + '\tMOC rt:' + doc.record_type +
//            '\t發cell:' + doc.calling_subs_last_lac +'-'+ doc.calling_subs_last_ci+ '  \tsite:' + doc.SITE_ID +
//            '\t發imsi:'+ doc.calling_imsi.substr(0,6)+ '\tSIM:'+ doc.SIM_TYPE +
//            '\t發imei:'+ doc.calling_imei.substr(0,8) + '\tPT:'+ doc.PT_OID +
//            '\tCARRIER:'+ doc.CARRIER + '\ted_num:'+ doc.called_number.substr(0,4));

        }else if(doc.record_type=="2") {
            try {
                var cell = doc.called_subs_last_lac +'-'+ doc.called_subs_last_ci;
                var called_imei = doc.called_imei.substr(0, 8);
                try {
                    doc.SITE_ID     = site3g_map[cell].SITE_ID;
                    doc.SITE_NAME   = site3g_map[cell].SITE_NAME;
                    doc.BELONG_TO   = site3g_map[cell].BELONG_TO;
                    doc.CELL_NO     = site3g_map[cell].CELL_NO; //#
                    doc.LAC_OD      = site3g_map[cell].LAC_OD;   //#
                    doc.BTS_ADDRESS = site3g_map[cell].BTS_ADDRESS;
                } catch (e) { } //doc.SITE_ID = '3g'; }
                try {
                    doc.SITE_ID     = site2g_map[cell].SITE_ID;
                    doc.SITE_NAME   = site2g_map[cell].SITE_NAME;
                    doc.BELONG_TO   = site2g_map[cell].BELONG_TO;
                    doc.CELL_NO     = site2g_map[cell].CELL_NO;  //#
                    doc.LAC_OD      = site2g_map[cell].LAC_OD;   //#
                    doc.BTS_ADDRESS = site2g_map[cell].BTS_ADDRESS;
                    doc.HANGOVER    = 1; //========================= 換手 ======//
                } catch(e){ } //doc.SITE_ID = '2g'; doc.HANGOVER    = 1;}
                try {
                    //doc.IMEI_VALUE  = phone_map[doc.called_imei.substr(0,8)].IMEI_VALUE;
                    doc.PT_OID      = phone_map[doc.called_imei.substr(0,8)].PT_OID;
                    doc.DMS_ID      = phone_map[doc.called_imei.substr(0,8)].DMS_ID;
                    doc.VENDOR      = phone_map[doc.called_imei.substr(0,8)].VENDOR;
                    doc.MODEL       = phone_map[doc.called_imei.substr(0,8)].MODEL;
                } catch (e) { } // doc.PT_OID
                try{
                         if(doc.called_imsi.substr(0,5)=='46693')
                        doc.SIM_TYPE = SIM_map[doc.called_imsi.substr(0,5)].SIM_TYPE;
                    else if(doc.called_imsi.substr(0,5)=='46697')
                        doc.SIM_TYPE = SIM_map[doc.called_imsi.substr(0,6)].SIM_TYPE;
                    else if(doc.called_imsi.substr(0,5)=='46699')
                        doc.SIM_TYPE = SIM_map[doc.called_imsi.substr(0,5)].SIM_TYPE;
                    else
                        doc.SIM_TYPE = SIM_map[''].SIM_TYPE;
                }catch (e) {} //doc.SIM_TYPE
                try{
                    //if(doc.called_number.substr(0,1)=='9')
                    //    doc.CARRIER = CARRIER_map[doc.called_number.substr(0,1)].CARRIER;
                    //else if(doc.called_number.substr(0,4)=='8869')
                    //    doc.CARRIER = CARRIER_map[doc.called_number.substr(0,4)].CARRIER;
                    //else if(doc.called_number.substr(0,2)=='14')
                    //    doc.CARRIER = CARRIER_map[doc.called_number.substr(0,4)].CARRIER;
                    //else
                        doc.CARRIER = CARRIER_map[''].CARRIER;
                }catch (e) {} //doc.CARRIER
                try{
                    doc.cause_for_termination = doc.cause_for_termination.substr(-4,4);
                }catch(e){} //doc.cause_for_termination
            }catch(e){}

            if  (doc.orig_mcz_duration == null||""){doc.orig_mcz_duration=0;}
            else{doc.orig_mcz_duration = Number(doc.orig_mcz_duration);}
            if  (doc.term_mcz_duration == null||""){doc.term_mcz_duration=0;}
            else{doc.term_mcz_duration = Number(doc.term_mcz_duration);}

//            print(new Date().toLocaleTimeString() + '\tMTC rt:' + doc.record_type +
//            '\t  cell:' + doc.called_subs_last_lac +'-'+ doc.called_subs_last_ci + '\tsite:' + doc.SITE_ID +
//            '\t  imsi:'+ doc.called_imsi.substr(0,6) + '\tSIM:'+ doc.SIM_TYPE +
//            '\t  imei:'+ doc.called_imei.substr(0,8) + '\tPT:' + doc.PT_OID+
//            '\tCARRIER:'+ doc.CARRIER +'\ted_num:'+ doc.called_number.substr(0,4));
        }
        //doc.up_flag = 1; //======================================== update done, erich up_flag:1
        //db.cep3g_sample.update({_id: doc._id}, {$set: {up_flag:1}});
//        db.cep3g_gen.update({_id: doc._id}, {$set: {up_flag:1}});
        db.cep3g_join.save(doc);
    }else{}
    i++;
});
print(new Date().toLocaleTimeString()+'\tprocess:'+i);
db.cep3g_sample.findOne({up_flag:1},{time:1,up_flag:1});
//mongo cdr cep3g_join.js > ./cep3g_join_result_$(date +"%Y%m%d")_$(date +"%H%M%S").txt
