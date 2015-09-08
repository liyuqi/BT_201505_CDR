for f in *.csv
do
    filename=$(basename "$f")
    extension="${filename##*.}"
    filename="${filename%.*}"
    mongoimport -d cdr_test -c cep3g --type csv --file "$f" --headerline --numInsertionWorkers=5
done