document.addEventListener("DOMContentLoaded", () => {
    let temaSeleccionado = null;
    
    const mensajeError = document.querySelector('#mensajeError');
    const canvas = document.querySelector('#canvas');
    const menuInicio = document.querySelector('#menuInicio');
    const gameUI = document.querySelector('#gameUI');
    const boton = document.querySelector('#btnJugar');
    
    // Seleccionar tema de fichas
    const temas = document.querySelectorAll(".tema-option");
    
    temas.forEach((tema) => {
        tema.addEventListener("click", () => {
            // Remover selección anterior
            temas.forEach(t => t.classList.remove('selected'));
            
            // Marcar como seleccionado
            tema.classList.add('selected');
            
            // Guardar tema seleccionado
            temaSeleccionado = tema.getAttribute("data-tema");
        });
    });
    
    // Botón de jugar
    boton.addEventListener("click", () => {
        mensajeError.innerHTML = ""; 
        
        if (!temaSeleccionado) {
            mensajeError.innerHTML = "Selecciona un tema de fichas antes de iniciar.";
            return;
        }
        
        // Ocultar menú y mostrar canvas
        menuInicio.classList.add("hidden");
        canvas.classList.remove("hidden");
        gameUI.classList.remove("hidden");
        
        const ctx = canvas.getContext('2d');
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        
        // Configuración de temas
        const temasConfig = {
            espacial: {
                colores: [
                    { color: '#00d4ff', glow: 'rgba(0, 212, 255, 0.6)' },
                    { color: '#ff00ff', glow: 'rgba(255, 0, 255, 0.6)' },
                    { color: '#ffff00', glow: 'rgba(255, 255, 0, 0.6)' },
                    { color: '#00ff88', glow: 'rgba(0, 255, 136, 0.6)' }
                ],
                fondo: { color1: '#1a1a3e', color2: '#0a0a1e' }
            },
            fuego: {
                colores: [
                    { color: '#ff6b35', glow: 'rgba(255, 107, 53, 0.6)' },
                    { color: '#ffaa00', glow: 'rgba(255, 170, 0, 0.6)' },
                    { color: '#ff4400', glow: 'rgba(255, 68, 0, 0.6)' },
                    { color: '#ff8800', glow: 'rgba(255, 136, 0, 0.6)' }
                ],
                fondo: { color1: '#3e1a1a', color2: '#1e0a0a' }
            },
            
        };
        
        // Iniciar el juego con las configuraciones seleccionadas
        const config = temasConfig[temaSeleccionado];
        const juego = new Game(ctx, canvasWidth, canvasHeight, config, canvas, menuInicio, gameUI);
    });
});

// Funciones globales para los botones HTML
function resetGame() {
    if (window.juegoActual) {
        window.juegoActual.reiniciar();
    }
}

function volverMenu() {
    if (window.juegoActual) {
        window.juegoActual.detener();
    }
    
    const canvas = document.querySelector('#canvas');
    const menuInicio = document.querySelector('#menuInicio');
    const gameUI = document.querySelector('#gameUI');
    const instructions = document.querySelector('#instructions');
    
    canvas.classList.add("hidden");
    menuInicio.classList.remove("hidden");
    gameUI.classList.add("hidden");
    instructions.style.display = 'none';
    
    // Limpiar selección de temas
    document.querySelectorAll('.tema-option').forEach(t => t.classList.remove('selected'));
}

function toggleInstructions() {
    const instructions = document.querySelector('#instructions');
    if (instructions.style.display === 'none' || instructions.style.display === '') {
        instructions.style.display = 'block';
    } else {
        instructions.style.display = 'none';
    }
}

function actualizarStats(piezas, movimientos, tiempo) {
    document.getElementById('piecesCount').textContent = piezas;
    document.getElementById('movesCount').textContent = movimientos;
    document.getElementById('timer').textContent = formatTime(tiempo);
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function mostrarModal(titulo, mensaje) {
    // Aquí puedes implementar tu modal personalizado
    // O usar alert por ahora
    alert(`${titulo}\n\n${mensaje}`);
}
