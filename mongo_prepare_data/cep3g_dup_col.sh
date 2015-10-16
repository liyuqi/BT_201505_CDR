
mongoexport -d cdr -c phone_sample      | mongoimport -d cdr_tos -c phone_sample
mongoexport -d cdr -c siteview2g_sample | mongoimport -d cdr_tos -c siteview2g_sample
mongoexport -d cdr -c siteview3g_sample | mongoimport -d cdr_tos -c siteview3g_sample

mongoexport -d cdr_tos -c cep3g_sample  | mongoimport -d cdr_tos -c cep3g_gen
