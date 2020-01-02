var redis = require('redis');
var fs = require('fs');
var cliente = redis.createClient(); 
console.log('Migrando dados JSON 2 REDIS\n');	

var ob = {'GN':'GEN','ÊX':'EXO','LV':'LEV','NM':'NUM','DT':'DEU','JS':'JOS','JZ':'JDZ','RT':'RUT','1SM':'1SM','2SM':'2SM','1RS':'1KI','2RS':'2KI',
'1CR':'1CH','2CR':'2CH','ED':'EZR','NE':'NEH','ET':'EST','JÓ':'JOB','SL':'PSA','PV':'PRO','EC':'ECC','CT':'SNG','IS':'ISA','JR':'JER',
'LM':'LAM','EZ':'EZE','DN':'DAN','OS':'OSE','JL':'JOE','AM':'AMO','OB':'OBA','JN':'JON','MQ':'MIC','NA':'NAH','HB':'HAB','SF':'ZAP','AG':'AGE',
'ZC':'ZAC','ML':'MAL','MT':'MAT','MC':'MRK','LC':'LUK','JO':'JHN','AT':'ACT','RM':'ROM','1CO':'1CO','2CO':'2CO',
'GL':'GAL','EF':'EPH','FP':'PHP','CL':'COL','1TS':'1TS',
'2TS':'2TS','1TM':'1TM','2TM':'2TM','TT':'TIT','FM':'PHM','HB':'HEB',
'TG':'JAM','1PE':'1PE','2PE':'2PE','1JO':'1JO','2JO':'2JO','3JO':'3JO','JD':'JUD','AP':'REV'};

//carga BLV.JSON -> REDIS
fs.readFile('blv.json',function(erro,data){
   if (erro) { throw erro; }
   var blv=JSON.parse(data);
   var meuSet = new Set();
   for(var i=0; i<66; i++)
   {
      var c=1;
      var abreviatura = blv['blv'][''+(i+1)]['abrev'].toUpperCase(); 
      meuSet.add(abreviatura);
      while (blv['blv'][''+(i+1)]['capitulos'][c]!=null) 
      {
	      var v = 1;
	      while (blv['blv'][''+(i+1)]['capitulos'][c][v] != null)
	      {
                 var chave = 'BLV_' + ob[abreviatura] + '_' + c +":" + v;
		 console.log(chave + ' ' + blv['blv'][''+(i+1)]['capitulos'][c][v]);
                 cliente.set(chave,blv['blv'][''+(i+1)]['capitulos'][c][v]);
		 v += 1; 
	      }
              c += 1;
      }
   }

  //meuSet.forEach(function(item){console.log(item);}); 

});

