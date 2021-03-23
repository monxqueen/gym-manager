const express = require('express') /*importando as dependencias do express */
const routes = express.Router() /*o .router faz com que a variavel routes seja responsável pelas rotas */
const instructors = require('./controllers/instructors') /*importando as funções do arquivo instructors.js */
const members = require('./controllers/members')

// HTTP VERBS 
// GET: Receber "alguma coisa" (geralmente devolvendo uma página renderizada, etc)
// POST: Criar ou Salvar "alguma coisa" nova com dados enviados, e depois redireciona o usuário para algum lugar
// PUT: Atualizar "alguma coisa" já criada
// DELETE: Deletar "alguma coisa"
// alguma coisa: chamamos de resource (é uma entidade, algo que representa um objeto do mundo real, nesse caso é os instructors e members)

routes.get('/', function(req, res) {
    return res.redirect("/instructors")
})


routes.get('/instructors', instructors.index)
routes.get('/instructors/create', instructors.create)
routes.get('/instructors/:id', instructors.show)
routes.get('/instructors/:id/edit', instructors.edit)
routes.post("/instructors", instructors.post) /*o instructors.post é a função (req, res) que importei do arquivo instructors.js */
routes.put("/instructors", instructors.put)
routes.delete("/instructors", instructors.delete)



routes.get('/members', members.index)
routes.get('/members/create', members.create)
routes.get('/members/:id', members.show)
routes.get('/members/:id/edit', members.edit)
routes.post("/members", members.post) /*o members.post é a função (req, res) que importei do arquivo members.js */
routes.put("/members", members.put)
routes.delete("/members", members.delete)

 

module.exports = routes /*aqui está exportando as rotas */