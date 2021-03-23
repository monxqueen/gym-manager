const fs = require('fs') /*o fs é um modulo do node chamado de FILE SYSTEM que trabalha com arquivos do sistema, criando um json com os dados coletados */
const data = require("../data.json")
const { organizedDate } = require('../utils')

//index
exports.index = function(req, res) {
    return res.render("members/index", { members: data.members })
}

//create
exports.create = function(req, res){
    return res.render("members/create")
}

// post
exports.post = function(req,res){ /*usei esse método post para saber se os dados do formulário foram recebidos mesmo*/
    //req.query
    //req.body /*os dados coletados no formulário vão ir para o body (se eu estiver usando ele)*/
    
    const keys = Object.keys(req.body) /*criei o construtor OBJECT, que é uma função que vai criar um objeto para mim */
    /* O Object.keys vai retornar para o const keys apenas as chaves de cada input, que no caso são as chaves "avatar_url", "name", etc. Todas essas chaves estarão em um array*/

    /*VALIDAÇÃO*/
    /*PERCORRENDO O ARRAY PARA CHECAR SE NÃO TEM NENHUMA CHAVE SEM VALOR (em branco, sem ter sido preenchida) */
    for(key of keys){
        //req.body.nome_da_chave == ""
        if(req.body[key] == ""){ /*se estiver em branco, aparece essa mensagem de baixo. */
            return res.send("Please, fill all fields.")
        }
    }
    

    /*TRATAMENTO DOS DADOS*/
    birth = Date.parse(req.body.birth) //retorna o número de milisegundos desde 1 de janeiro de 1970
    
    let id = 1 //só vai obedecer essa lógica se for o primeiro membro que eu tiver cadastrando
    const lastMember = data.members[data.members.lenght - 1] //aqui está pegando o último membro
    if(lastMember){ //se existir um lastmember, então vai adicionar mais 1 ao id.
        id = lastMember.id + 1
    }

    /*ORGANIZANDO OS DADOS QUE EU QUERO E ENVINANDO ELES NESSA ORDEM PARA O data.json*/
    /*SALVADO TODOS OS DADOS NA VARIÁVEL DATA, PARA NÃO SER APAGADO NO ARQUIVO (pois sempre que eu cadastrava algum instrutor novo, apagava os dados do antigo)*/
    data.members.push({ /*a função push vai ficar adicionando todos os novos dados (que estão em formato de objeto) em um array. tipo: [{objeto 1}, {objeto 2}...{objeto n}] */
        id,
        ...req.body,
        birth
    })

    /*ESCREVENDO OS DADOS NUM ARQUIVO JSON*/
    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){ /*o stringify usa os parametros "data", que é os dados q vai escrever no arq data.json, "null" é o 2º parametro q n preciso saber agora, e 2 é o espaçamento q vai dar entre cada dado (objeto) recebido */
        if(err /* == TRUE */) return res.send("Erro na escrita do arquivo.")
        
        return res.redirect("members")/*se nao der erro, vai redirecionar p página members */
    })
    /*parâmetros do writeFile: ("local que vai ficar salvo os dados",
                                objeto que vai ser salvo (nesse caso é o req.body, mas se eu escrevesse apenas req.body ele seria salvo como um objeto normal e não um JSON, então tive que usar um constructor JSON)
                                e por último, vem a CALLBACK function, que é uma função que vai ser executada após a escrita do arquivo data.json, fazemos isso para o arq não seja bloqueado (se caso o arq já estiver cheio, por exemplo)
                                ) */

    
    //return res.send(req.body)
}

// show
exports.show = function(req,res){
    // req.params é um outro jeito de receber dados, ou seja, pegando dos parâmetros do próprio link. Ex: www.google.com/monique/gloria (monique e gloria são parâmetros)
    /*desestruturando/retirando do req.params o dado chamado "id" e fazendo com que ele seja uma variável*/
    const { id } = req.params

    const foundMember = data.members.find(function(member){ //smp que achar um instrutor dentro do array de instrutores então vai rodar a função passando pra dentro o instrutor do momento
        return id == member.id //aqui retora o id do instrutor atual se ele for igual ao id que eu desestruturei acima
    })

    //se nao encontrar o instrutor
    if(!foundMember) return res.send("Member not found")


    const member = {
        ...foundMember, //vai colocar dentro desse objeto tudo que já tiver dentro do objeto foundMember, por isso usa o três pontinhos. Nas linhas abaixo eu só vou reajustar oq tiver em formato errado
        birth: organizedDate(foundMember.birth).birthday,
    }

    //se achar o instrutor
    return res.render("members/show", {member})
}

// edit 
exports.edit = function(req,res){
    const { id } = req.params

    const foundMember = data.members.find(function(member){ //smp que achar um instrutor dentro do array de instrutores então vai rodar a função passando pra dentro o instrutor do momento
        return id == member.id //aqui retora o id do instrutor atual se ele for igual ao id que eu desestruturei acima
    })

    //se nao encontrar o instrutor
    if(!foundMember) return res.send("Member not found")

    member = {
        ...foundMember,
        birth: organizedDate(foundMember.birth).bornAt
    }

    return res.render('members/edit', {member})
}

// put (salvando os dados editados no backend)
exports.put = function(req,res){
    const { id } = req.body
    let index = 0

    const foundMember = data.members.find(function(member, foundIndex){ //smp que achar um instrutor dentro do array de instrutores então vai rodar a função passando pra dentro o instrutor do momento
        if (id == member.id){
            index = foundIndex
            return true
        } //aqui retora o id do instrutor atual se ele for igual ao id que eu desestruturei acima
    })

    //se nao encontrar o instrutor
    if(!foundMember) return res.send("Member not found")

    const member = {
        ...foundMember,
        ...req.body, //espalhando nesse objeto (member) todos os dados novos/editados que sairam do body
        birth: Date.parse(req.body.birth),
        id: Number(req.body.id)
    }

    //TRANSFERINDO OS NOVOS DADOS PARA O ARQUIVO data
    data.members[index] = member

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
        if(err) return res.send("Write error!")
        
        return res.redirect(`/members/${id}`)
    })
}

// delete
exports.delete = function(req,res){
    const {id} = req.body

    const filteredMembers = data.members.filter(function(member){ //o filter é como se fosse uma estrutura de repetição que vai filtrando todos os objetos members e vendo se o id de cada um é diferente do id coletado da req.body. Se for diferente, retorna true, então não é o id do instrutor que eu quero deletar, então vou adicionando esses objetos member pra dentro do array filteredMembers
        return member.id != id 
    })

    data.members = filteredMembers

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
        if(err) return res.send("Write file error!")

        return res.redirect("/members")
    })
}