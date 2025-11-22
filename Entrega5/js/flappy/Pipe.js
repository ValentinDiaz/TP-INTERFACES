class Pipe {
  constructor(game) {
    this.game = game;
    this.width = 100; // ancho fijo
    this.gap = game.config.pipeGap;
    this.x = game.gameArea.offsetWidth;
    this.scored = false;

    const minHeight = 100;
    const maxHeight = game.gameArea.offsetHeight - this.gap - 100;
    this.topHeight = Math.random() * (maxHeight - minHeight) + minHeight;

    this.createElement();
  }
  createElement() {
    // █████ TUBERÍA SUPERIOR PIXEL ART DE HIELO █████
    this.topElement = document.createElement("div");
    this.topElement.style.position = "absolute";
    this.topElement.style.width = `${this.width}px`;
    this.topElement.style.height = `${this.topHeight}px`;
    this.topElement.style.left = `${this.x}px`;
    this.topElement.style.top = "0";

    // Patrón hielo pixel-art: bloques irregulares SIN rayas
    this.topElement.style.background = `
    repeating-linear-gradient(
      to bottom,
      #b9ecff 0px, #b9ecff 4px,
      #d4f5ff 4px, #d4f5ff 8px,
      #a0def9 8px, #a0def9 12px,
      #c2f0ff 12px, #c2f0ff 16px
    )
  `;

    // Bordes y brillos como bloque congelado
    this.topElement.style.boxShadow = `
    inset 0 0 0 4px #e9fcff,   /* borde claro hielo */
    inset 4px 4px 0 #ffffff,   /* brillo superior izquierdo */
    inset -4px -4px 0 #91d7ff, /* sombra inferior derecha */
    0 6px 0 #76b7e8             /* borde extra abajo para efecto bloque */
  `;

    this.topElement.style.border = "4px solid #8ad9ff";
    this.topElement.style.borderBottom = "8px solid #6ab7d8";
    this.topElement.style.borderRadius = "0 0 10px 10px";
    this.topElement.style.imageRendering = "pixelated";
    this.topElement.style.zIndex = "10";

    // █████ TUBERÍA INFERIOR PIXEL ART DE HIELO █████
    const bottomHeight =
      this.game.gameArea.offsetHeight - this.topHeight - this.gap;

    this.bottomElement = document.createElement("div");
    this.bottomElement.style.position = "absolute";
    this.bottomElement.style.width = `${this.width}px`;
    this.bottomElement.style.height = `${bottomHeight}px`;
    this.bottomElement.style.left = `${this.x}px`;
    this.bottomElement.style.bottom = "0";

    // Misma textura de hielo
    this.bottomElement.style.background = `
    repeating-linear-gradient(
      to bottom,
      #b9ecff 0px, #b9ecff 4px,
      #d4f5ff 4px, #d4f5ff 8px,
      #a0def9 8px, #a0def9 12px,
      #c2f0ff 12px, #c2f0ff 16px
    )
  `;

    this.bottomElement.style.boxShadow = `
    inset 0 0 0 4px #e9fcff,
    inset 4px 4px 0 #ffffff,
    inset -4px -4px 0 #91d7ff,
    0 -6px 0 #76b7e8
  `;

    this.bottomElement.style.border = "4px solid #8ad9ff";
    this.bottomElement.style.borderTop = "8px solid #6ab7d8";
    this.bottomElement.style.borderRadius = "10px 10px 0 0";
    this.bottomElement.style.imageRendering = "pixelated";
    this.bottomElement.style.zIndex = "10";

    // Insertar
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

    // Colisión con tubo superior
    if (
      birdBounds.right > this.x + pipeMargin &&
      birdBounds.left < this.x + this.width - pipeMargin &&
      birdBounds.top < this.topHeight
    ) {
      return true;
    }

    // Colisión con tubo inferior
    const bottomTop = this.topHeight + this.gap;

    if (
      birdBounds.right > this.x + pipeMargin &&
      birdBounds.left < this.x + this.width - pipeMargin &&
      birdBounds.bottom > bottomTop
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
