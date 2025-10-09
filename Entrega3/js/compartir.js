const infoCompartir = document.querySelector("#info-compartir");
const contCompartir = document.querySelector("#Cont-Compartir");
const openCompartir = document.querySelector("#openCompartir");
const closeCompartir = document.querySelector("#closeCompartir");

openCompartir.addEventListener("click", () =>{
    infoCompartir.classList.add("visible");
    contCompartir.classList.add("visible");
})
closeCompartir.addEventListener("click", () =>{
    infoCompartir.classList.remove("visible");
    contCompartir.classList.remove("visible");
})