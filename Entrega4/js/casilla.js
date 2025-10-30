class Casilla {
  constructor(ctx, x, y, radio, fila, col, color) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.radio = radio;
    this.fila = fila;
    this.col = col;
    this.pieza = null; // La pieza que contiene (o null si está vacía)
    this.seleccionada = false;
    this.color =color;// Para resaltar cuando está seleccionada
  }

  // Colocar una pieza en esta casilla
  colocarPieza(pieza) {
    this.pieza = pieza;
  }

  // Quitar la pieza de esta casilla
  quitarPieza() {
    this.pieza = null;
  }

  // Verificar si tiene una pieza
  tienePieza() {
    return this.pieza !== null;
  }

  // Obtener la pieza actual
  obtenerPieza() {
    return this.pieza;
  }

  // Verificar si un punto (x, y) está dentro de esta casilla
  contienePunto(x, y) {
    const distancia = Math.sqrt(
      Math.pow(x - this.x, 2) + Math.pow(y - this.y, 2)
    );
    return distancia <= this.radio;
  }

  // Dibujar la casilla
  dibujar() {
    this.ctx.save();

    // 1. Fondo sólido de la casilla
    this.ctx.fillStyle = this.color; // Color gris azulado
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radio, 0, Math.PI * 2);
    this.ctx.fill();

    // Borde brillante
    this.ctx.strokeStyle = "#5a5a6a";
    this.ctx.lineWidth = 3;
    this.ctx.stroke();

    this.ctx.restore();

    // 2. Si tiene pieza, dibujarla
    if (this.pieza) {
      this.pieza.dibujar();
    }

    // 3. Si está seleccionada, resaltar
    if (this.seleccionada) {
      this.ctx.save();

      this.ctx.strokeStyle = "#ffff00";
      this.ctx.lineWidth = 4;
      this.ctx.shadowBlur = 15;
      this.ctx.shadowColor = "#ffff00";

      this.ctx.beginPath();
      this.ctx.arc(this.x, this.y, this.radio + 5, 0, Math.PI * 2);
      this.ctx.stroke();

      this.ctx.restore();
    }
  }


  // Dibujar solo la casilla sin la pieza
dibujarSolo() {
    this.ctx.save();
    
    // Fondo de la casilla
    const gradient = this.ctx.createRadialGradient(
        this.x, this.y, this.radio * 0.3,
        this.x, this.y, this.radio
    );
    gradient.addColorStop(0, 'rgba(40, 40, 60, 0.8)');
    gradient.addColorStop(1, 'rgba(60, 60, 80, 0.9)');
    
    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radio, 0, Math.PI * 2);
    this.ctx.fill();
    
    this.ctx.strokeStyle = 'rgba(100, 100, 120, 0.6)';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
    
    this.ctx.restore();
}
}
