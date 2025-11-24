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
      [1, 1, 1, 1, 1, 1, 1], // Centro vacío (fila 3, col 3)
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
        if (this.patron[fila][col] === 1) {
          const x =
            this.offsetX + col * this.tamanoCasilla + this.tamanoCasilla / 2;
          const y =
            this.offsetY + fila * this.tamanoCasilla + this.tamanoCasilla / 2;

          const casilla = new Casilla(
            this.ctx,
            x,
            y,
            this.radioCasilla,
            fila,
            col,
            this.config.colorCasilla
          );

          // Determinar si debe tener pieza (todas excepto el centro)
          const esCentro = fila === 3 && col === 3;

          if (!esCentro) {
            // Usar la MISMA imagen para todas las fichas
            const imagen = this.config.imagenFicha;
            casilla.colocarPieza(
              new Pieza(this.ctx, x, y, this.radioCasilla - 5, imagen)
            );
          }

          this.casillas[fila][col] = casilla;
        } else {
          this.casillas[fila][col] = null;
        }
      }
    }
  }

  //fucnoin para contar las piezas restantes
  contarPiezas() {
    let contador = 0;
    for (let fila = 0; fila < this.filas; fila++) {
      for (let col = 0; col < this.columnas; col++) {
        const casilla = this.casillas[fila][col];
        if (casilla && casilla.tienePieza()) {
          contador++;
        }
      }
    }

    return contador;
  }

  //funcion para dibujar el tablero
  dibujar() {
    for (let fila = 0; fila < this.filas; fila++) {
      for (let col = 0; col < this.columnas; col++) {
        const casilla = this.casillas[fila][col];
        if (casilla) {
          casilla.dibujar();
        }
      }
    }
  }

  obtenerCasillaEnPosicion(x, y) {
    for (let fila = 0; fila < this.filas; fila++) {
      for (let col = 0; col < this.columnas; col++) {
        const casilla = this.casillas[fila][col];
        if (casilla && casilla.contienePunto(x, y)) {
          return casilla;
        }
      }
    }
    return null;
  }

 obtenerMovimientosValidos(casillaOrigen, piezasComidas = [], esLlamadaInicial = true) {
  const movimientos = [];
  const fila = casillaOrigen.fila;
  const col = casillaOrigen.col;

  const direcciones = [
    { df: -2, dc: 0, mf: -1, mc: 0 }, // Arriba
    { df: 2, dc: 0, mf: 1, mc: 0 },   // Abajo
    { df: 0, dc: -2, mf: 0, mc: -1 }, // Izquierda
    { df: 0, dc: 2, mf: 0, mc: 1 },   // Derecha
  ];

  direcciones.forEach((dir) => {
    const filaDestino = fila + dir.df;
    const colDestino = col + dir.dc;
    const filaSaltada = fila + dir.mf;
    const colSaltada = col + dir.mc;

    if (
      this.esPosicionValida(filaDestino, colDestino) &&
      this.esPosicionValida(filaSaltada, colSaltada)
    ) {
      const casillaDestino = this.casillas[filaDestino][colDestino];
      const casillaSaltada = this.casillas[filaSaltada][colSaltada];

      if (
        casillaDestino &&
        !casillaDestino.tienePieza() &&
        casillaSaltada &&
        casillaSaltada.tienePieza() &&
        !piezasComidas.includes(casillaSaltada)
      ) {
        const nuevasPiezasComidas = [...piezasComidas, casillaSaltada];

         movimientos.push({
            destino: casillaDestino,
            saltadas: [casillaSaltada],
            camino: [casillaDestino],
          });

        // Buscar saltos adicionales (recursión sin flag inicial)
        const saltosAdicionales = this.obtenerMovimientosValidos(
          casillaDestino,
          nuevasPiezasComidas,
          false // No es llamada inicial
        );

       

        if (saltosAdicionales.length > 0) {
          saltosAdicionales.forEach((saltoAdicional) => {
            movimientos.push({
              destino: saltoAdicional.destino,
              saltadas: [casillaSaltada, ...saltoAdicional.saltadas],
              camino: [casillaDestino, ...saltoAdicional.camino],
            });
          });
        } 
      }
    }
  });

 

  return movimientos;
}

  // Verificar si una posición es válida
  esPosicionValida(fila, col) {
    return (
      fila >= 0 &&
      fila < this.filas &&
      col >= 0 &&
      col < this.columnas &&
      this.casillas[fila][col] !== null
    );
  }

  // Ejecutar un movimiento
  moverPieza(casillaOrigen, casillaDestino, casillaSaltada) {
  if (!casillaOrigen.tienePieza()) return false;

  // Obtener la pieza
  const pieza = casillaOrigen.obtenerPieza();

  // Actualizar posición de la pieza
  pieza.x = casillaDestino.x;
  pieza.y = casillaDestino.y;

  // Mover pieza al destino
  casillaDestino.colocarPieza(pieza);

  // Quitar pieza del origen
  casillaOrigen.quitarPieza();

  // si es un arreglo 
  if (casillaSaltada.length>0) {
    // Si es un array (saltos múltiples)
    casillaSaltada.forEach((casilla, index) => {
      if (casilla && casilla.tienePieza()) {
        casilla.quitarPieza();
      }
    });
  } else if (casillaSaltada) {
    // Si es una sola casilla (salto simple)
    if (casillaSaltada.tienePieza()) {
      casillaSaltada.quitarPieza();
    }
  } 
  return true;
}

  // Verificar si hay movimientos disponibles en todo el tablero
  hayMovimientosDisponibles() {
    for (let fila = 0; fila < this.filas; fila++) {
      for (let col = 0; col < this.columnas; col++) {
        const casilla = this.casillas[fila][col];
        if (casilla && casilla.tienePieza()) {
          const movimientos = this.obtenerMovimientosValidos(casilla);
          if (movimientos.length > 0) {
            return true;
          }
        }
      }
    }
    return false;
  }

  // Reiniciar el tablero
  reiniciar() {
    this.inicializarCasillas();
  }
}
