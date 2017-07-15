module.exports = function(app){
     const PAGAMENTO_CRIADO = "CRIADO";
     const PAGAMENTO_CONFIRMADO = "CONFIRMADO";
     const PAGAMENTO_CANCELADO = "CANCELADO";

    app.get("/pagamentos", function(req, res){
        var connection = app.persistencia.connectionFactory();
        var pagamentoDAO = new app.persistencia.PagamentoDAO(connection);

        pagamentoDAO.listar(function(erros, resultado){
            if(erros){
                res.status(500).send(erros);
            }else{
                res.status(200).json(resultado);
            }

        });
    })

    app.post("/pagamentos/pagamento", function(req, res){
        var body = req.body;

        var pagamento = body['pagamento'];
        
        req.assert("pagamento.forma_de_pagamento", "Forma de pagamento eh obrigatoria").notEmpty();
        req.assert("pagamento.valor", "Valor eh obrigatorio e deve ser decimal").notEmpty().isFloat();
        req.assert("pagamento.moeda", "Moeda eh obrigatorio e deve ter no 3 caracteres").notEmpty().len(3, 3);
        
        var erros = req.validationErrors();

        if(erros){
            res.status(400).send(erros);
            return;
        }

        
        console.log("Recebendo requisição para pagamento");

        pagamento.status = PAGAMENTO_CRIADO;
        pagamento.data = new Date();
        console.log(pagamento.forma_de_pagamento);
        
            var connection = app.persistencia.connectionFactory();
            var pagamentoDAO = new app.persistencia.PagamentoDAO(connection);

            pagamentoDAO.salvar(pagamento, function(erro, resultado){
                if(erro){
                    res.status(500).send(erro);
                    return;
                }else{
                    if(pagamento.forma_de_pagamento == "cartao"){
                        var cartao = body['cartao'];
                        var client = new app.servico.CartoesClient();
                        client.autoriza(cartao, function(err, request, response, resultado){
                                if(err){
                                    console.log("Erro ao autorizar cartao")
                                    res.status(500).json(err);
                                    return;
                                }
                            res.location('/pagamentos/pagamento/' + pagamento.id);

                            var response = {
                                dados_do_pagamanto: pagamento,
                                cartao: resultado,
                                links: [
                                {
                                    href:"http://localhost:3000/pagamentos/pagamento/"
                                            + pagamento.id,
                                    rel:"confirmar",
                                    method:"PUT"
                                },
                                {
                                    href:"http://localhost:3000/pagamentos/pagamento/"
                                            + pagamento.id,
                                    rel:"cancelar",
                                    method:"DELETE"
                                }
                                ]
                            }
                            res.status(201).json(response);
                            return;
                                
                         })
                    }else{
                        res.location("pagamentos/pagamento/"+resultado.insertId);
                        console.log("Pagamento criado");
                        pagamento.id = resultado.insertId;
                        var response = {
                            dados_do_pagamento: pagamento,
                            links: [
                                    {
                                        href: "http://localhost:3000/pagamentos/pagamento/" + pagamento.id,
                                        rel: "confirmar",
                                        method: "PUT"
                                    },
                                    {
                                        href: "http://localhost:3000/pagamentos/pagamento/" + pagamento.id,
                                        rel: "cancelar",
                                        method: "DELETE"
                                    }
                                ]
                            }
                        res.status(201).json(response);
                    }
                }
            })
        

        
    });
	
	app.put("/pagamentos/pagamento/:id", function(req, res){
		var pagamento = {};
		var id = req.params.id;
		pagamento.id = id;
		pagamento.status = PAGAMENTO_CONFIRMADO;
		
		var connection = app.persistencia.connectionFactory();
		var pagamentoDAO = new app.persistencia.PagamentoDAO(connection);
		
		pagamentoDAO.atualizar(pagamento, function(erro, resultado){
			if(erro){
				res.status(500).send(erro);
			}else{
				console.log("pagamento confirmado");
				res.json(pagamento);
			}
		})
	})

    app.delete("/pagamentos/pagamento/:id", function(req, res){
        var pagamento =  {
            id: req.params.id,
            status: PAGAMENTO_CANCELADO
        }
        
        var connection = app.persistencia.connectionFactory();
        var pagamentoDAO = new app.persistencia.PagamentoDAO(connection);

        pagamentoDAO.deletar(pagamento,function(erro, resultado) {
            if(erro){
                res.status(500).send(erro);
            }else{
                res.json(pagamento);
            }


        })
    })
}