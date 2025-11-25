class Pipe {
    constructor(game) {
      this.game = game;
      this.pipeWidth = 300; // ✅ ancho real de la imagen
      this.pipeHeight = 320; // ✅ alto real de la imagen
      this.gap = game.config.pipeGap;
      this.x = game.gameArea.offsetWidth;
      this.scored = false;

      const minHeight = 150;
      const maxHeight = game.gameArea.offsetHeight - this.gap - 150;
      this.topHeight = Math.random() * (maxHeight - minHeight) + minHeight;

      this.createElement();
    }

  createElement() {
    // █████ TUBERÍA SUPERIOR (VOLTEADA) █████
    this.topElement = document.createElement("img");
    this.topElement.src = "assets/bird/pipe.png";
    this.topElement.style.position = "absolute";
    this.topElement.style.width = `${this.pipeWidth}px`;
    this.topElement.style.height = `${this.pipeHeight}px`;
    this.topElement.style.left = `${this.x}px`;
    this.topElement.style.top = `${this.topHeight - this.pipeHeight}px`;
    this.topElement.style.transform = "scaleY(-1)";
    this.topElement.style.imageRendering = "pixelated";
    this.topElement.style.zIndex = "10";
    this.topElement.draggable = false;

    // █████ TUBERÍA INFERIOR █████
    this.bottomElement = document.createElement("img");
    this.bottomElement.src = "assets/bird/pipe.png";
    this.bottomElement.style.position = "absolute";
    this.bottomElement.style.width = `${this.pipeWidth}px`;
    this.bottomElement.style.height = `${this.pipeHeight}px`;
    this.bottomElement.style.left = `${this.x}px`;
    this.bottomElement.style.top = `${this.topHeight + this.gap}px`;
    this.bottomElement.style.imageRendering = "pixelated";
    this.bottomElement.style.zIndex = "10";
    this.bottomElement.draggable = false;

    this.game.gameElements.appendChild(this.topElement);
    this.game.gameElements.appendChild(this.bottomElement);
  }

  update() {
    this.x -= this.game.config.pipeSpeed;
    this.topElement.style.left = `${this.x}px`;
    this.bottomElement.style.left = `${this.x}px`;
  }

  isOffScreen() {
    return this.x + this.pipeWidth < 0; // ✅ Usar pipeWidth
  }

  isPassed(bird) {
    return this.x + this.pipeWidth < bird.x && !this.scored; // ✅ Usar pipeWidth
  }

  checkCollision(bird) {
    const birdBounds = bird.getBounds();

    // ✅ MÁRGENES PARA IGNORAR PARTES TRANSPARENTES DE LA IMAGEN
    // Ajusta estos valores según tu imagen real
    const horizontalMargin = 80; // ignora los bordes laterales transparentes
    const verticalMargin = 40; // ignora partes superior/inferior transparentes

    // Tubo superior - área sólida real
    const topPipeTop = this.topHeight - this.pipeHeight + verticalMargin;
    const topPipeBottom = this.topHeight - verticalMargin;
    const topPipeLeft = this.x + horizontalMargin;
    const topPipeRight = this.x + this.pipeWidth - horizontalMargin;

    // Tubo inferior - área sólida real
    const bottomPipeTop = this.topHeight + this.gap + verticalMargin;
    const bottomPipeBottom =
      this.topHeight + this.gap + this.pipeHeight - verticalMargin;
    const bottomPipeLeft = this.x + horizontalMargin;
    const bottomPipeRight = this.x + this.pipeWidth - horizontalMargin;

    // Colisión con tubo superior
    if (
      birdBounds.right > topPipeLeft &&
      birdBounds.left < topPipeRight &&
      birdBounds.top < topPipeBottom &&
      birdBounds.bottom > topPipeTop
    ) {
      return true;
    }

    // Colisión con tubo inferior
    if (
      birdBounds.right > bottomPipeLeft &&
      birdBounds.left < bottomPipeRight &&
      birdBounds.top < bottomPipeBottom &&
      birdBounds.bottom > bottomPipeTop
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
