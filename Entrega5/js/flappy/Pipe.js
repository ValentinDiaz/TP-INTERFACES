class Pipe {
  constructor(game) {
    this.game = game;
    this.width = 80;
    this.gap = game.config.pipeGap;
    this.x = game.gameArea.offsetWidth;
    this.scored = false;
    
    const minHeight = 100;
    const maxHeight = game.gameArea.offsetHeight - this.gap - 100;
    this.topHeight = Math.random() * (maxHeight - minHeight) + minHeight;
    
    this.createElement();
  }
  
  createElement() {
    this.topElement = document.createElement('div');
    this.topElement.style.position = 'absolute';
    this.topElement.style.width = `${this.width}px`;
    this.topElement.style.height = `${this.topHeight}px`;
    this.topElement.style.left = `${this.x}px`;
    this.topElement.style.top = '0';
    this.topElement.style.background = 'linear-gradient(to bottom, #00d4ff, #0099cc)';
    this.topElement.style.border = '3px solid #00d4ff';
    this.topElement.style.boxShadow = '0 0 20px rgba(0, 212, 255, 0.5)';
    this.topElement.style.borderRadius = '0 0 10px 10px';
    this.topElement.style.zIndex = '10';
    
    this.bottomElement = document.createElement('div');
    const bottomHeight = this.game.gameArea.offsetHeight - this.topHeight - this.gap;
    this.bottomElement.style.position = 'absolute';
    this.bottomElement.style.width = `${this.width}px`;
    this.bottomElement.style.height = `${bottomHeight}px`;
    this.bottomElement.style.left = `${this.x}px`;
    this.bottomElement.style.bottom = '0';
    this.bottomElement.style.background = 'linear-gradient(to top, #00d4ff, #0099cc)';
    this.bottomElement.style.border = '3px solid #00d4ff';
    this.bottomElement.style.boxShadow = '0 0 20px rgba(0, 212, 255, 0.5)';
    this.bottomElement.style.borderRadius = '10px 10px 0 0';
    this.bottomElement.style.zIndex = '10';
    
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
    
    if (birdBounds.right > this.x && 
        birdBounds.left < this.x + this.width &&
        birdBounds.top < this.topHeight) {
      return true;
    }
    
    const bottomTop = this.topHeight + this.gap;
    if (birdBounds.right > this.x && 
        birdBounds.left < this.x + this.width &&
        birdBounds.bottom > bottomTop) {
      return true;
    }
    
    return false;
  }
  
  remove() {
    if (this.topElement && this.topElement.parentNode) {
      this.topElement.remove();
    }
    if (this.bottomElement && this.bottomElement.parentNode) {
      this.bottomElement.remove();
    }
  }
}