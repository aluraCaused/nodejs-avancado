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
        var pagamento = req.body;
        req.assert("forma_de_pagamento", "Forma de pagamento eh obrigatoria").notEmpty();
        req.assert("valor", "Valor eh obrigatorio e deve ser decimal").notEmpty().isFloat();
        req.assert("moeda", "Moeda eh obrigatorio e deve ter no 3 caracteres").notEmpty().len(3, 3);
        console.log(pagamento);
        var erros = req.validationErrors();

        if(erros){
            res.status(400).send(erros);
            return;
        }

        var pagamento = req.body;
        console.log("Recebendo requisição para pagamento");

        pagamento.status = PAGAMENTO_CRIADO;
        pagamento.data = new Date();

        var connection = app.persistencia.connectionFactory();
        var pagamentoDAO = new app.persistencia.PagamentoDAO(connection);

        pagamentoDAO.salvar(pagamento, function(erro, resultado){
            if(erro){
                res.status(500).send(erro);
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