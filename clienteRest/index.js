var app = require("./config/express")();

app.listen(3001, function(){
	console.log("Servidor rodando");
})