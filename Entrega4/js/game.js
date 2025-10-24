class Game {
  constructor(ctx, width, height) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;

  }

  dibujarFondo() {
    this.ctx.fillStyle = "#1e1e1e";
    this.ctx.fillRect(0, 0, this.width, this.height);
  }



}
