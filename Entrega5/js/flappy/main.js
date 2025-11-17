function startGameDemo() {
    // 1. Oculta el menú de inicio
    document.getElementById('menuInicio').classList.add('hidden');
    // 2. Muestra el área de juego
    document.getElementById('gameArea').classList.remove('hidden');
    // 3. Inicia la animación de todas las capas de parallax
    document.querySelectorAll('.parallax-layer').forEach(layer => {
        layer.style.animationPlayState = 'running';
    });
    // Oculta el GameUI también, ya que solo estamos viendo el fondo en la demo
    document.getElementById('gameUI').classList.add('hidden'); 
}

// *** Nueva Sección: Vinculación del Evento ***

// Espera a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    const btnJugar = document.getElementById('btnJugar');
    
    // Asigna la función startGameDemo al botón "Jugar"
    if (btnJugar) {
        btnJugar.addEventListener('click', startGameDemo);
    }
});