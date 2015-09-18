db.test.insert({test:1,date:Date('2014-12-12 12:34:56:')});     //"Fri Sep 18 2015 11:55:43 GMT+0800 (台北標準時間)"
db.test.insert({test:1,date:ISODate('2014-12-12 12:34:56:')});  // ISODate("2014-12-12T12:34:56Z") }
db.test.insert({test:1,date:new Date('2014-12-12 12:34:56:')}); //  ISODate("2014-12-12T12:34:56Z") }

