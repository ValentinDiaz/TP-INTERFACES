class Bird {
  constructor(game) {
    this.game = game;
    this.el = document.getElementById("bird");

    this.x = 100;
    this.y = 200;
    this.velocityY = 0;

    this.currentAnimation = "flap";
    
    // Establecer posición inicial
    this.el.style.left = `${this.x}px`;
    this.el.style.top = `${this.y}px`;
  }

  setAnimation(name) {
    console.log("setAnimation llamado:", name); // Debug
    
    if (this.currentAnimation === name) return;

    // Remover clase anterior
    this.el.classList.remove("anim-dead");

    // Aplicar nueva animación
    if (name === "dead") {
      this.el.classList.add("anim-dead");
    }

    this.currentAnimation = name;
  }

  jump() {
    if (this.game.gameState !== "playing") return;
    this.velocityY = -10;
  }

  update() {
    if (this.game.gameState !== "playing") return;

    this.velocityY += this.game.config.gravity;
    this.y += this.velocityY;

    this.el.style.left = `${this.x}px`;
    this.el.style.top = `${this.y}px`;

    if (this.y < 0) {
      this.y = 0;
      this.velocityY = 0;
    }

    const gameAreaHeight = this.game.gameArea.offsetHeight;
    const birdHeight = 64 * 1.4;

    if (this.y + birdHeight > gameAreaHeight) {
      this.y = gameAreaHeight - birdHeight;
      this.velocityY = 0;
    }
  }

explode() {
  console.log("Explode llamado - aplicando dead");
  
  // Forzar el cambio incluso si ya está en dead
  this.currentAnimation = null; // Resetear para forzar el cambio
  
  // Remover la animación anterior completamente
  this.el.style.animation = 'none';
  this.el.classList.remove('anim-dead');
  
  // Forzar reflow del navegador
  void this.el.offsetWidth;
  
  // Aplicar la animación de muerte
  this.el.classList.add('anim-dead');
  this.currentAnimation = "dead";
}

  reset() {
    this.x = 100;
    this.y = 200;
    this.velocityY = 0;

    this.el.style.left = `${this.x}px`;
    this.el.style.top = `${this.y}px`;
    
    // Asegurarse de remover la clase dead
    this.el.classList.remove("anim-dead");
    this.setAnimation("flap");
  }

  getBounds() {
    const padding = 8;

    return {
      x: this.x + padding,
      y: this.y + padding,
      width: 16 * 5 - padding * 2,
      height: 64 * 1.4 - padding * 2,
    };
  }
}