var http = require('http');
var redis = require('redis');

http.createServer(function (req,res){
   res.writeHead(200, {'Content-Type':'text/html'});
   var cliente = redis.createClient(); 
   res.write('Ola Mundo NodeJS and Redis<br><br>');	
   cliente.get('chato', function(erro, resposta){
	if (erro) {
		throw erro; 
	} 
        else {
   	       res.write(resposta);
 	       console.log(resposta); 
	}
        res.end();
   });
}).listen(8080);
