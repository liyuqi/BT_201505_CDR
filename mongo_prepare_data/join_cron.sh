#!/bin/bash
init_id=`mongo cdr --port 27017 --eval 'db.cep3g_gen.find({record_type:{\$in:["1","2"]}}).sort({_id:1}).limit(1).forEach(function(doc){print(doc._id)})'|tail -n 1`
#max_id=`mongo cdr --port 40000 --eval 'db.cep3g_join.find({record_type:{\$in:["1","2"]}}).sort({_id:-1}).limit(1).forEach(function(doc){print(doc._id)})'|tail -n 1`

pick=2000000
bucket=`mongo cdr --port 27017 --eval "var n = (db.cep3g_gen.count() - db.cep3g_join1.count())/$pick; print(Math.ceil(n));" | tail -n 1`

echo $bucket
bucket=5	#5 process use 60% CPU
if [ $bucket -gt 0 ]; then
    for n in $(seq 1 $bucket);
    do
        mongo cdr --port 27017  --eval "var max_id=$init_id, pick=$pick, n=$n;" cep3g_join_cron.js  > ./cep3g_join_result_bucket$n.txt &
#        mongo cdr --port 40000  --eval "var max_id=$max_id, pick=$pick, n=$n;" cep3g_join_cron.js  > ./cep3g_join_result_bucket$n.txt &
    done
else
    echo "$bucket"
fi
