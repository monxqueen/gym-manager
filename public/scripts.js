const currentPage = location.pathname //aqui vai receber o nome da página que o usuário está no momento (instructors ou members), pegando a localização do navegador
const menuItems = document.querySelectorAll("header .links a") 

for (item of menuItems){//para cada "a" nos itens do menu da página
    if(currentPage.includes(item.getAttribute("href"))){ //se tiver incluso no nome da página atual(intructors ou members) um nome igual ao do href, então vai criar uma página chamada "active"
        item.classList.add("active")
    }
}