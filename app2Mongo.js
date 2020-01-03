/**
 * REDIS SINTAXE
 * VER_ABREV_CAP:VERS = TEXTO
 * -----------------------------------------------------
 * 1. Unzip bsb2.zip -> bsb2.csv
 * 2. CARGA BSB2 -> MONGODB 
 * -----------------------------------------------------
 * CSV BSB2.CSV DADOS
 * separador = %
 * 
 * ID
 * HebSort
 * GrkSort
 * BSBSort
 * Language
 * Vs
 * WLC
 * Translit
 * Parsing
 * Strongs
 * Verse
 * Heading
 * BSBVersion
 * footnotes
 * BDB_Thayers
 * keyRedis    - calculado
 * -----------------------------------------------------
 * Mongo db : bsb
 * Collection : data
 *
 **/
const csv = require('csv-parser');
var fs = require('fs');

var AdmZip = require('adm-zip');
console.log('Unzip Base\n');	

//Ler arquivo ZIP na memoria
var zip = new AdmZip("./bsb2.zip");
var zipEntries = zip.getEntries(); // an array of ZipEntry records
//zip.extractEntryTo("bsb2.csv", "./", false, true);
//console.log(zip.readAsText("bsb2.csv")); 


console.log('Migrando dados CSV 2 MONGO\n');	


var ob = {'Genesis':'GEN','Exodus':'EXO','Leviticus':'LEV','Numbers':'NUM','Deuteronomy':'DEU','Joshua':'JOS',
'Judges':'JDZ','Ruth':'RUT','1 Samuel':'1SM','2 Samuel':'2SM','1 Kings':'1KI','2 Kings':'2KI',
'1 Chronicles':'1CH','2 Chronicles':'2CH','Ezra':'EZR','Nehemiah':'NEH','Esther':'EST','Job':'JOB','Psalm':'PSA',
'Proverbs':'PRO','Ecclesiastes':'ECC','Song of Solomon':'SNG','Isaiah':'ISA','Jeremiah':'JER',
'Lamentations':'LAM','Ezekiel':'EZE','Daniel':'DAN','Hosea':'OSE','Joel':'JOE','Amos':'AMO','Obadiah':'OBA',
'Jonah':'JON','Micah':'MIC','Nahum':'NAH','Habakkuk':'HAB','Zephaniah':'ZAP','Haggai':'AGE',
'Zechariah':'ZAC','Malachi':'MAL','Matthew':'MAT','Mark':'MRK','Luke':'LUK','John':'JHN',
'Acts':'ACT','Romans':'ROM','1 Corinthians':'1CO','2 Corinthians':'2CO',
'Galatians':'GAL','Ephesians':'EPH','Philippians':'PHP','Colossians':'COL','1 Thessalonians':'1TS',
'2 Thessalonians':'2TS','1 Timothy':'1TM','2 Timothy':'2TM','Titus':'TIT','Philemon':'PHM','Hebrews':'HEB',
'James':'JAM','1 Peter':'1PE','2 Peter':'2PE','1 John':'1JO','2 John':'2JO','3 John':'3JO','Jude':'JUD','Revelation':'REV'};
var linha = 1;
var verso = '';

//Extrair o zip como uma String e converter numa Stream
const Readable = require('stream').Readable;
const s = new Readable();
s._read = () => {}; // redundant? see update below
s.push(zip.readAsText("bsb2.csv"));
s.push(null);

var vetor = Array();
  //Ler a stream como um  arquivo CSV com o separador % e transformar num objeto JSON cada linha
  s.pipe(csv({separator : '%'}))
  .on('data', (row) => {

    if (verso == '') verso = row.Verse;
    if (row.Verse.trim() == '') row.Verse = verso;
    if (row.Verse != verso) verso = row.Verse;  
    var vv = row.Verse.split(' ');

    switch(vv.length) {
      case 2: row.keyRedis = 'BLV_' + ob[ vv[0] ] + '_' + vv[vv.length-1]; break;
      case 3: row.keyRedis = 'BLV_' + ob[ vv[0] + " " + vv[1] ] + '_' + vv[vv.length-1];  break;
      case 4: row.keyRedis = 'BLV_' + ob[ vv[0] + " " + vv[1] + " " + vv[2] ] + '_' + vv[vv.length-1];   break;
    }

    vetor.push(row);

  })
  .on('end', () => {
    console.log('CSV file successfully processed');
    console.log(vetor.length);
    //conexao com o banco nosql
    const MongoClient = require('mongodb').MongoClient;
    const url = "mongodb://localhost:27017";
    const client = new MongoClient(url);

    client.connect(function(err, client) {
      if (err) throw err;
      const db = client.db("bsb");
      db.collection("data").insertMany(vetor, function(erro, res){ 
        if(erro) throw erro; 
        console.log("Linha inserida");
        client.close();
      });
    }); 
  });




