while getopts "d:c:h:p:" flag; do
        case $flag in
d)      arg_d="$OPTARG";;
c)      arg_c="$OPTARG";;
h)      arg_h="$OPTARG";;
p)      arg_p="$OPTARG";;
done

for f in *.csv
do
    filename=$(basename "$f")
    extension="${filename##*.}"
    filename="${filename%.*}"
    mongoimport -d "$arg_d" -c "$arg_c" --type csv --file "$f" --headerline --numInsertionWorkers=5
done
