// cep3g_gen query raw data
// called_number could bt hide(comment) or dispplay

// query 1 called 9
db.cep3g_gen.find({
	date_time:{$in:[/^2015-09-02 09/,/^2015-09-02 10/,/^2015-09-02 11/]}
	, record_type:{$in:["1","2"]}
	, called_number:{$in:[
		,"989877818778"
		,"989981302189"
		,"989849938948"
		,"989963928369"
		,"989910969019"
		,"989952875259"
		,"989885239588"
		,"989885239588"
		,"989863677368"
		,"989926696629"
		]}
},{	_id:0	, date_time:1	, record_type:1	, calling_number:1	, called_number:1	, orig_mcz_duration:1	, term_mcz_duration:1
})

// query 2 called 886
db.cep3g_gen.find({
	date_time:{$in:[/^2015-09-02 12/,/^2015-09-02 13/,/^2015-09-02 14/]}
	, record_type:{$in:["1","2"]}
	, called_number:{$in:[
		"886989780383"
		,"886989909347"
		,"886989718998"
		,"886989994174"
		,"886989822456"
		,"886989897258"
		,"886989853003"
		,"886989913732"
		,"886989738496"
		,"886989717618"
		]}
},{	_id:0	, date_time:1	, record_type:1	, calling_number:1	, called_number:1	, orig_mcz_duration:1	, term_mcz_duration:1
})

// query 3 called 1412 TWM
db.cep3g_gen.find({
	date_time:{$in:[/^2015-09-02 15/,/^2015-09-02 16/,/^2015-09-02 17/]}
	, record_type:{$in:["1","2"]}
	, called_number:{$in:[
		"141298879601"
		,"141298779069"
		,"141298846537"
		,"141298741319"
		,"141298761039"
		]}
},{	_id:0	, date_time:1	, record_type:1	, calling_number:1	, called_number:1	, orig_mcz_duration:1	, term_mcz_duration:1
})

// query 4 called ^C
db.cep3g_gen.find({
	date_time:{$in:[/^2015-09-02 18/,/^2015-09-02 19/,/^2015-09-02 20/]}
	, record_type:{$in:["1","2"]}
	, called_number:{$in:[
		"C32680990040"
		,"C1451"
		,"C32780866863"
		,"C32880000002"
		,"C32880512350"
		,"C32680282900"
		,"C32780222550"
		,"C32880902350"
		,"C32680821080"
		]}
},{	_id:0	, date_time:1	, record_type:1	, calling_number:1	, called_number:1	, orig_mcz_duration:1	, term_mcz_duration:1
})

// query 4 all date_time 
db.cep3g_gen.find({
	date_time:{$in:[/^2015-09-02/]}
	, record_type:{$in:["1","2"]}
	, called_number:{$in:[
		"989877818778"
		,"989981302189"
		,"989849938948"
		,"989963928369"
		,"989910969019"
		,"989952875259"
		,"989885239588"
		,"989885239588"
		,"989863677368"
		,"989926696629"
		]}
},{	_id:0	, date_time:1	, record_type:1	, calling_number:1	, called_number:1	, orig_mcz_duration:1	, term_mcz_duration:1
})