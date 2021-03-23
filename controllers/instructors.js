const fs = require('fs') /*o fs é um modulo do node chamado de FILE SYSTEM que trabalha com arquivos do sistema, criando um json com os dados coletados */
const data = require("../data.json")
const { age, organizedDate } = require('../utils')

//index
exports.index = function(req, res) {
    return res.render("instructors/index", { instructors: data.instructors })
}

//create
exports.create =  function(req, res){
    return res.render("instructors/create")
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
    
    /*desestruturando o req.body pra saber se ta vindo tudo direitinho, tudo q eu preciso sem vir nada a mais ou algo que não preciso*/
    let {avatar_url, birth, name, services, gender} = req.body /*vai pegar só aquelas informações (q estão na esquerda), do req.body */

    /*TRATAMENTO DOS DADOS*/
    /*PARA SABER O DIA QUE FOI FEITO O CADASTRO DO NOVO INSTRUTOR */
    const created_at = Date.now() /*o date.now é um método que vai criar uma data de agora, hoje.*/
    birth = Date.parse(birth) //retorna o número de milisegundos desde 1 de janeiro de 1970
    const id = Number(data.instructors.length + 1) /*esse id é a ordem em que cada instrutor que for sendo criado vai ter. Ou seja, sempre vai ficar adicionando +1 a cada novo instrutor criado. Usei o constructor NUMBER pra ter certeza que vai retornar um número*/
    
    /*ORGANIZANDO OS DADOS QUE EU QUERO E ENVINANDO ELES NESSA ORDEM PARA O data.json*/
    /*SALVADO TODOS OS DADOS NA VARIÁVEL DATA, PARA NÃO SER APAGADO NO ARQUIVO (pois sempre que eu cadastrava algum instrutor novo, apagava os dados do antigo)*/
    data.instructors.push({ /*a função push vai ficar adicionando todos os novos dados (que estão em formato de objeto) em um array. tipo: [{objeto 1}, {objeto 2}...{objeto n}] */
        id, 
        avatar_url,
        name,
        birth,
        gender,
        services,
        created_at,
    })

    /*ESCREVENDO OS DADOS NUM ARQUIVO JSON*/
    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){ /*o stringify usa os parametros "data", que é os dados q vai escrever no arq data.json, "null" é o 2º parametro q n preciso saber agora, e 2 é o espaçamento q vai dar entre cada dado (objeto) recebido */
        if(err /* == TRUE */) return res.send("Erro na escrita do arquivo.")
        
        return res.redirect("instructors")/*se nao der erro, vai redirecionar p página instructors */
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

    const foundInstructor = data.instructors.find(function(instructor){ //smp que achar um instrutor dentro do array de instrutores então vai rodar a função passando pra dentro o instrutor do momento
        return id == instructor.id //aqui retora o id do instrutor atual se ele for igual ao id que eu desestruturei acima
    })

    //se nao encontrar o instrutor
    if(!foundInstructor) return res.send("Instructor not found")


    const instructor = {
        ...foundInstructor, //vai colocar dentro desse objeto tudo que já tiver dentro do objeto foundInstructor, por isso usa o três pontinhos. Nas linhas abaixo eu só vou reajustar oq tiver em formato errado
        age: age(foundInstructor.birth),
        services: foundInstructor.services.split(","), //a função "split" do javascript serve pra pegar um string (Que no caso é a string de services do instrutor), transformar ela num array e ir dividindo cada casa do array baseado em algum elemento, nesse caso estou dividindo cada casa quando eu encontrar uma virgula
        created_at: new Intl.DateTimeFormat("pt-BR").format(foundInstructor.created_at),
    }

    //se achar o instrutor
    return res.render("instructors/show", {instructor})
}

// edit 
exports.edit = function(req,res){
    const { id } = req.params

    const foundInstructor = data.instructors.find(function(instructor){ //smp que achar um instrutor dentro do array de instrutores então vai rodar a função passando pra dentro o instrutor do momento
        return id == instructor.id //aqui retora o id do instrutor atual se ele for igual ao id que eu desestruturei acima
    })

    //se nao encontrar o instrutor
    if(!foundInstructor) return res.send("Instructor not found")

    instructor = {
        ...foundInstructor,
        birth: organizedDate(foundInstructor.birth).bornAt
    }

    return res.render('instructors/edit', {instructor})
}

// put (salvando os dados editados no backend)
exports.put = function(req,res){
    const { id } = req.body
    let index = 0

    const foundInstructor = data.instructors.find(function(instructor, foundIndex){ //smp que achar um instrutor dentro do array de instrutores então vai rodar a função passando pra dentro o instrutor do momento
        if (id == instructor.id){
            index = foundIndex
            return true
        } //aqui retora o id do instrutor atual se ele for igual ao id que eu desestruturei acima
    })

    //se nao encontrar o instrutor
    if(!foundInstructor) return res.send("Instructor not found")

    const instructor = {
        ...foundInstructor,
        ...req.body, //espalhando nesse objeto (instructor) todos os dados novos/editados que sairam do body
        birth: Date.parse(req.body.birth),
        id: Number(req.body.id)
    }

    //TRANSFERINDO OS NOVOS DADOS PARA O ARQUIVO data
    data.instructors[index] = instructor

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
        if(err) return res.send("Write error!")
        
        return res.redirect(`/instructors/${id}`)
    })
}

// delete
exports.delete = function(req,res){
    const {id} = req.body

    const filteredInstructors = data.instructors.filter(function(instructor){ //o filter é como se fosse uma estrutura de repetição que vai filtrando todos os objetos instructors e vendo se o id de cada um é diferente do id coletado da req.body. Se for diferente, retorna true, então não é o id do instrutor que eu quero deletar, então vou adicionando esses objetos instructor pra dentro do array filteredInstructors
        return instructor.id != id 
    })

    data.instructors = filteredInstructors

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err){
        if(err) return res.send("Write file error!")

        return res.redirect("/instructors")
    })
}