var soap = require('soap');

function CorreiosSoapClient(){
    this._url = this._url = 'http://ws.correios.com.br/calculador/CalcPrecoPrazo.asmx?wsdl';
}

CorreiosSoapClient.prototype.calculaPrazo = function(args, callback){
    soap.createClient(this._url, function(erro, cliente){
        if(erro){
            return;
        }
        cliente.CalcPrazo(args, callback);
    })
}

module.exports = function(){
    return CorreiosSoapClient;
}