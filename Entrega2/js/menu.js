const navB =  document.querySelector("#navBurger");
const abrirburger = document.querySelector("#openBurger");
const cerrarburger = document.querySelector("#closeBurger");
const navU = document.querySelector("#navUser");
const btnUser = document.querySelector("#toggleUser");

abrirburger.addEventListener("click", () =>{
    navB.classList.add("visible");
})

cerrarburger.addEventListener("click", () =>{
    navB.classList.remove("visible");
})

btnUser.addEventListener ("click", () => {
    navU.classList.toggle("visible");
})

