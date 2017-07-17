module.exports = function(app){
    app.post("/correios/calcula-prazo", function(req, res){
        var client = new app.servico.CorreiosSoapClient();
        var dadosEntrega = req.body;

        client.calculaPrazo(dadosEntrega, function(erro, resultado){
            if(erro){
                res.status(500).send(erro);
                return;
            }

            res.status(200).json(resultado);
        })
    })
}