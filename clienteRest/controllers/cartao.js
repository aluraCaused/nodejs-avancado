module.exports = function(app) {
        app.post("/cartoes/autoriza",function(req, res) {
          console.log('processando pagamento com cart�o');

            var cartao = req.body;

            req.assert("numero", "N�mero � obrigat�rio e deve ter 16 caracteres.").notEmpty().len(16,16);
            req.assert("bandeira", "Bandeira do cart�o � obrigat�ria.").notEmpty();
            req.assert("ano_de_expiracao", "Ano de expira��o � obrigat�rio e deve ter 4 caracteres.").notEmpty().len(4,4);
            req.assert("mes_de_expiracao", "M�s de expira��o � obrigat�rio e deve ter 2 caracteres").notEmpty().len(2,2);
            req.assert("cvv", "CVV � obrigat�rio e deve ter 3 caracteres").notEmpty().len(3,3);

            var errors = req.validationErrors();

            if (errors){
              console.log("Erros de valida��o encontrados");

              res.status(400).send(errors);
              return;
            }
            cartao.status = 'AUTORIZADO';

            var response = {
              dados_do_cartao: cartao,
            }

            res.status(201).json(response);
            return;
        });
      }