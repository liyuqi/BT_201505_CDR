4步驟: 

1.2.只需執行一次，準備資料

3.4.可重複執行，複寫資料

### 1.Restore data

```sh
$ cd dump
$ mongorestore -d cdr ./cdr
```

### 2.Duplicate data

```sh
$ mongoexport -d cdr -c cep3g_sample | mongoimport -d cdr -c cep3g_gen
$ # echo mongo cdr
```
```js
> db.cep3g_gen.find({
	//  date_time:{$in:[/^2015-09-02 09/,/^2015-09-02 10/,/^2015-09-02 11/]}
	, record_type:{$in:["1","2"]}
	//, called_number:{$in:[]
},{
  _id:0	
  , date_time         :1	
  , record_type       :1	
  , calling_number    :1	
  , called_number     :1	
  , orig_mcz_duration :1	
  , term_mcz_duration :1
})
```

### 3.Enrich/Join/Mapping Data

```sh
$ mongo cdr ./mongo_prepare_data/cep3g_join.js
```
```js
> db.cep3g_join.find({
  _id:{ $exists:1}
  , CARRIER         : '中華電信'
  , record_type     : { $in: [ '1', '2' ] }
},{
  _id:0
  , "CALL_NUMBER"   :1
  , "CALL_DURATION" :1
  
  , "DATE"          :1
  , "HOUR"          :1
  
  , "SIM_TYPE"      :1
  , "CARRIER"       :1
  , "END_CODE"      :1
  
  , "SITE_ID"       :1
  , "BELONG_TO"     :1
  , "CELL_NO"       :1
  , "LAC_OD"        :1
  , "BTS_ADDRESS"   :1
  , "COUNTRY"       :1
  , "DISTRICT"      :1
  , "SITE_NAME"     :1
  , "NETWORK_TYPE"  :1
})
```

### 4.Aggregate Data (site)

```sh
$ mongo cdr ./mongo_prepare_data/cep3g_stat_site.js
```
```js
> db.cep3g_stat_site.find({
  SUM_CALLED_COUNT_3_5:{$gt:1}
},{
  _id:0
  , DISTINCT_CALLED_COUNT_3_5:1
  
  , SUM_CALLED_COUNT_3_5:1
  , SUM_CALLED_COUNT_10UP:1
  
  , SUM_CALLED_MINUTES_3_5:1
  , SUM_CALLED_MINUTES_10UP:1
  
  , COUNTY:1
  , DISTRICT:1
})
```
