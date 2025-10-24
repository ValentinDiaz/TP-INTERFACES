let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let whith = canvas.width;
let height = canvas.height; 
window.onload = () =>{
        const game =  new Game(ctx, whith, height);
        game.dibujarFondo();
        
}

