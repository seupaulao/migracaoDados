const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017";
const client = new MongoClient(url);

client.connect(function(err, client) {

    if (err) throw err;
    const db = client.db("bsb");
    var obj = {'a':2};
    if (typeof obj == 'string')
    {
       console.log('nao posso carregar string'); 
    }
    else
    {
        db.collection("data").insertOne(obj, function(erro, res){ 
            if(erro) throw erro; console.log("Linha inserida:" + obj);          
        });
    }  
    client.close();


});