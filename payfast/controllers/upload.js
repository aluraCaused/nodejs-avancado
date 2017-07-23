var fs = require('fs');

module.exports = function(app){
    app.post("/upload/imagem", function(req, res){
        var fileName = req.headers.filename;
        req.pipe(fs.createWriteStream("files/" +fileName))
        .on('finish', function(){
            console.log("Arquivo recebido");
            res.status(201).send("ok");
        })
    })
}