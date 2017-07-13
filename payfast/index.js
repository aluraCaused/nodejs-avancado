var app = require("./config/custom-express")();

var porta = process.env.PORT || 3000;

app.listen(porta, function(){
    console.log("Servidor rodando na porta %s", porta);
})