//criando um servidor
const express = require('express') /*aqui ta importando as dependencias do express*/
const nunjucks = require('nunjucks') /* o require permite que eu pegue arquivos js externos */
const routes = require("./routes")
const methodOverride = require('method-override') //usando a dependência method override para sobrepor o tipo de método que eu poderei usar no form do arquivo "edit", pois lá no html só pode usar o método get e post e eu quero usar o put e delete tbm

const server = express() /*o server vai executar o express que agora virou uma funçao*/

server.use(express.urlencoded({ extended: true })) /*essa linha é responsável por fazer funcionar o req.body lá do routes.js, para que seja possível eu receber os dados que foram coletados no formulário de novo instrutor */
server.use(express.static('public')) /*todas essas funçoes que estão entre a criação do server (na linha de cima), até a função server.liste, são chamadas de funções/configs MIDDLEWARE*/
server.use(methodOverride('_method'))// configurando o method override
server.use(routes)

server.set("view engine", "njk")

/*configurando a template engine */
nunjucks.configure("views"/*pasta views*/, {
    express: server, /*ta em formato de objeto, entre chaves*/
    autoescape: false,
    noCache: true
})


server.listen(5000, function() {
    console.log("server is running")
}) /*o servidor vai ficar ouvindo a porta 5000*/