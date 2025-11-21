class Pipe {
  constructor(game) {
    this.game = game;
    this.width = 80 + Math.random() * 40; // Ancho variable entre 80-120px
    this.gap = game.config.pipeGap;
    this.x = game.gameArea.offsetWidth;
    this.scored = false;
    
    const minHeight = 100;
    const maxHeight = game.gameArea.offsetHeight - this.gap - 100;
    this.topHeight = Math.random() * (maxHeight - minHeight) + minHeight;
    
    this.createElement();
  }
  
createElement() {
  // ---------- TUBERÍA SUPERIOR ----------
  this.topElement = document.createElement('div');
  this.topElement.style.position = 'absolute';
  this.topElement.style.width = `${this.width}px`;
  this.topElement.style.height = `${this.topHeight}px`;
  this.topElement.style.left = `${this.x}px`;
  this.topElement.style.top = '-10px';
  
  this.topElement.style.backgroundImage = 'url("/assets/bird/tuberia.png")';
  this.topElement.style.backgroundSize = 'cover';
  this.topElement.style.backgroundRepeat = 'repeat-y';
  this.topElement.style.backgroundPosition = 'bottom center';
  this.topElement.style.imageRendering = 'pixelated';
  this.topElement.style.zIndex = '100';
  
  // ---------- TUBERÍA INFERIOR ----------
  const bottomHeight = this.game.gameArea.offsetHeight - this.topHeight - this.gap;
  
  this.bottomElement = document.createElement('div');
  this.bottomElement.style.position = 'absolute';
  this.bottomElement.style.width = `${this.width}px`;
  this.bottomElement.style.height = `${bottomHeight}px`;
  this.bottomElement.style.left = `${this.x}px`;
  this.bottomElement.style.bottom = '-10px';
  
  this.bottomElement.style.backgroundImage = 'url("/assets/bird/tuberia.png")';
  this.bottomElement.style.backgroundSize = 'cover';
  this.bottomElement.style.backgroundRepeat = 'repeat-y';
  this.bottomElement.style.backgroundPosition = 'top center';
  this.bottomElement.style.imageRendering = 'pixelated';
  this.bottomElement.style.zIndex = '100';
  
  // Insertar elementos
  this.game.gameElements.appendChild(this.topElement);
  this.game.gameElements.appendChild(this.bottomElement);
}
  
  update() {
    this.x -= this.game.config.pipeSpeed;
    this.topElement.style.left = `${this.x}px`;
    this.bottomElement.style.left = `${this.x}px`;
  }
  
  isOffScreen() {
    return this.x + this.width < 0;
  }
  
  isPassed(bird) {
    return this.x + this.width < bird.x && !this.scored;
  }
  
  checkCollision(bird) {
    const birdBounds = bird.getBounds();
    const pipeMargin = 10;
    
    // ─── Colisión con la tubería superior ───
    if (
      birdBounds.right > this.x + pipeMargin &&
      birdBounds.left < this.x + this.width - pipeMargin &&
      birdBounds.top < this.topHeight - 20 // Ajuste por el offset
    ) {
      return true;
    }
    
    // ─── Colisión con la tubería inferior ───
    const bottomTop = this.topHeight + this.gap;
    
    if (
      birdBounds.right > this.x + pipeMargin &&
      birdBounds.left < this.x + this.width - pipeMargin &&
      birdBounds.bottom > bottomTop + 20 // Ajuste por el offset
    ) {
      return true;
    }
    
    return false;
  }
  
  remove() {
    this.topElement?.remove();
    this.bottomElement?.remove();
  }
}