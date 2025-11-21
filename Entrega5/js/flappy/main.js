let game = null;

// ============================================
// FUNCIONES GLOBALES
// ============================================
function resetGame() {
  if (game) {
    game.reset();
    game.start();
  }
}

function volverMenu() {
  if (game) {
    game.isRunning = false;
    if (game.gameLoopId) {
      cancelAnimationFrame(game.gameLoopId);
    }
  }
  
  document.getElementById('gameArea').classList.add('hidden');
  document.getElementById('gameUI').classList.add('hidden');
  document.getElementById('gameOverScreen').classList.add('hidden');
  document.getElementById('menuInicio').classList.remove('hidden');
  
  document.querySelectorAll('.parallax-layer').forEach(layer => {
    layer.style.animationPlayState = 'paused';
  });
  
  if (game) {
    game.reset();
  }
}

function toggleInstructions() {
  const instructions = document.getElementById('instructions');
  if (instructions) {
    instructions.style.display = 
      instructions.style.display === 'none' ? 'block' : 'none';
  }
}

function startGame() {
  console.log('▶️ Iniciando nueva partida...');
  
  try {
    if (!game) {
      game = new Game();
      game.init();
    } else {
      game.reset();
    }
    
    game.start();
    
    document.querySelectorAll('.parallax-layer').forEach(layer => {
      layer.style.animationPlayState = 'running';
    });
    
    console.log('✅ Juego iniciado correctamente');
    
  } catch (error) {
    console.error('❌ Error al iniciar el juego:', error);
    const mensajeError = document.getElementById('mensajeError');
    if (mensajeError) {
      mensajeError.textContent = 'Error al iniciar el juego';
      mensajeError.style.color = '#ff5252';
    }
  }
}

// ============================================
// INICIALIZACIÓN
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  console.log('🎮 Flappy Bird RPG cargado');
  
  const btnJugar = document.getElementById('btnJugar');
  
  if (btnJugar) {
    btnJugar.addEventListener('click', startGame);
  } else {
    console.error('❌ No se encontró el botón "Jugar"');
  }
  
  const instructions = document.getElementById('instructions');
  if (instructions) {
    instructions.style.display = 'none';
  }
});

document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && game && game.isRunning) {
    e.preventDefault();
  }
});

// Debug
window.debugGame = () => {
  if (game) {
    console.log('🔍 Estado del juego:', {
      isRunning: game.isRunning,
      score: game.score,
      lives: game.lives,
      moves: game.moves,
      pipes: game.pipes.length,
      birdPosition: game.bird ? { x: game.bird.x, y: game.bird.y } : null
    });
  } else {
    console.log('⚠️ El juego no está inicializado');
  }
};