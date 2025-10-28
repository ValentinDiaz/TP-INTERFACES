class Tablero {
  constructor(ctx, width, height, config) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.config = config;
    this.casillas = [];

    // Configuración del tablero
    this.filas = 7;
    this.columnas = 7;
    this.tamanoCasilla = 60;
    this.radioCasilla = 25;

    // Calcular offset para centrar el tablero
    this.offsetX = (width - this.columnas * this.tamanoCasilla) / 2;
    this.offsetY = (height - this.filas * this.tamanoCasilla) / 2;

    // Patrón del tablero en forma de cruz (1 = casilla válida, 0 = no existe)
    this.patron = [
      [0, 0, 1, 1, 1, 0, 0],
      [0, 0, 1, 1, 1, 0, 0],
      [1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 0, 1, 1, 1], // Centro vacío (fila 3, col 3)
      [1, 1, 1, 1, 1, 1, 1],
      [0, 0, 1, 1, 1, 0, 0],
      [0, 0, 1, 1, 1, 0, 0],
    ];

    this.inicializarCasillas();
  }

  inicializarCasillas() {
    this.casillas = [];

    for (let fila = 0; fila < this.filas; fila++) {
      this.casillas[fila] = [];

      for (let col = 0; col < this.columnas; col++) {
        // Verificar si esta posición es válida según el patrón
        if (this.patron[fila][col] === 1) {
          // Calcular posición en canvas
          const x =
            this.offsetX + col * this.tamanoCasilla + this.tamanoCasilla / 2;
          const y =
            this.offsetY + fila * this.tamanoCasilla + this.tamanoCasilla / 2;

          // Crear casilla
          const casilla = new Casilla(
            this.ctx,
            x,
            y,
            this.radioCasilla,
            fila,
            col
          );

          // Determinar si debe tener pieza (todas excepto el centro)
          const esCentro = fila === 3 && col === 3;

          if (!esCentro) {
            // Crear pieza con color aleatorio del tema
            casilla.colocarPieza(
              new Pieza(this.ctx, x, y, this.radioCasilla - 5, color)
            );
          }

          this.casillas[fila][col] = casilla;
        } else {
          // Posición inválida (fuera de la cruz)
          this.casillas[fila][col] = null;
        }
      }
    }
  }
}
