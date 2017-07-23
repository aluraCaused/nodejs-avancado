var fs = require('fs'), 
arquivo = process.argv[2];


fs.readFile(arquivo, function(erro, buffer){
    console.log("arquivo lido");
    fs.writeFile("imagem2.png", buffer, function(erro){
        console.log("Arquivo escrito");
    })
})