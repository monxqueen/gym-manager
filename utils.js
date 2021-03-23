module.exports = {
    age: function(timestamp){
        const today = new Date()
        const birthDate = new Date(timestamp)
        
        //pra pegar o ano de nascimento. Ex: 2020 - 2001 = 19
        let age = today.getFullYear() - birthDate.getFullYear()
        const month = today.getMonth() - birthDate.getMonth()
        
        today.getDate()
        birthDate.getDate() //aqui é p verificar qual dia que ta

        if(month < 0 || month == 0 && today.getDate() <= birthDate.getDate()){
            age = age - 1
        }

        return age
    },
    organizedDate: function(timestamp){ //função para formatar a data, que antes estava no formato de milisegundos
        const date = new Date(timestamp)

        //year //I use 'UTC' to make it become an universal date, because if it's not, the day is always gonna show 1 day before (bc of brazilian timezone)
        const year = date.getUTCFullYear()
        
        //month (coloquei +1 pq o primeiro mÊs (janeiro) é contado como 0 e o dezembro como 11)
        //coloquei um zero na frente, pois se o mês for entre o mes 01 e 09, só iria aparecer 1 ou 9, sem o zero, então foi necessário colocar
        let month = `0${date.getUTCMonth() + 1}`.slice(-2) //a função "slice" corta a string no segundo caractere da direita pra esquerda. (ex: 1850, vai cortar deixando só 50). Por isso está com um -2
        
        //day
        let day = `0${date.getUTCDate()}`.slice(-2)
        
        //returning like yyyy-mm-dd
        return{
            day,
            month,
            year,
            bornAt: `${year}-${month}-${day}`,
            birthday: `${day}/${month}`,
        }
    }
}