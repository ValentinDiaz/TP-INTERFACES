class Bird {
  constructor(game) {
    this.game = game;
    this.el = document.getElementById("bird");

    this.x = 100;
    this.y = 200;
    this.velocityY = 0;
    this.currentAnimation = "flap";
     this.width = 80; // 16px × scaleX(5)  ← AGREGAR ESTA LÍNEA
    this.height = 89.6; // 64px × scaleY(1.4)  ← AGREGAR ESTA LÍNEA

    this.el.classList.add("anim-flap");
    this.el.style.left = `${this.x}px`;
    this.el.style.top = `${this.y}px`;
  }

  setAnimation(name) {
    console.log("setAnimation llamado:", name);

    if (this.currentAnimation === name) return;

    // Remover todas las animaciones
    this.el.classList.remove("anim-flap", "anim-dead");

    // Forzar reflow
    void this.el.offsetWidth;

    // Aplicar la animación correcta
    if (name === "dead") {
      this.el.classList.add("anim-dead");
    } else if (name === "flap") {
      this.el.classList.add("anim-flap");
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

  }

  explode() {
    this.setAnimation("dead"); // Usar setAnimation para consistencia
  }

  reset() {
    this.x = 100;
    this.y = 200;
    this.velocityY = 0;

    this.el.style.left = `${this.x}px`;
    this.el.style.top = `${this.y}px`;

    this.setAnimation("flap"); // Usar setAnimation
  }

  getBounds() {
    const padding = 8;
    const width = 16 * 5; // 16px × scaleX(5) = 80px
    const height = 64 * 1.3; // 64px × scaleY(1.4) = 89.6px

    const x = this.x + padding;
    const y = this.y + padding;
    const w = width - padding * 2;
    const h = height - padding * 2;

    return {
      x: x,
      y: y,
      width: w,
      height: h,
      left: x,
      right: x + w,
      top: y,
      bottom: y + h,
    };
  }
}
