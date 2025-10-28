class Game {
    constructor(ctx, width, height, config, canvas, menuInicio, gameUI) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
        this.config = config;
        this.canvas = canvas;
        this.menuInicio = menuInicio;
        this.gameUI = gameUI;
        
        // Estado del juego
        this.tablero = null;
        this.fichaSeleccionada = null;
        this.movimientosValidos = [];
        this.piezasRestantes = 32;
        this.movimientos = 0;
        this.tiempoTranscurrido = 0;
        this.timerInterval = null;
        this.juegoActivo = true;
        this.animando = false;
        
        // Guardar referencia global
        window.juegoActual = this;
        
        // Inicializar
        this.inicializar();
    }
    
    inicializar() {
        // Crear tablero con las configuraciones
        this.tablero = new Tablero(
            this.ctx, 
            this.width, 
            this.height, 
            this.config
        );
        
        // Contar piezas iniciales
        this.piezasRestantes = this.tablero.contarPiezas();
        
        // Configurar eventos
        this.configurarEventos();
        
        // Iniciar timer
        this.iniciarTimer();
        
        // Actualizar stats iniciales
        this.actualizarStats();
        
        // Dibujar
        this.dibujar();
    }
    
    configurarEventos() {
        this.canvas.addEventListener('click', (e) => this.manejarClick(e));
    }
    
    manejarClick(e) {
        if (!this.juegoActivo || this.animando) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Obtener casilla clickeada
        const casilla = this.tablero.obtenerCasillaEnPosicion(x, y);
        
        if (!casilla) return;
        
        // Si hay una ficha seleccionada
        if (this.fichaSeleccionada) {
            // Verificar si es un movimiento válido
            const movimientoValido = this.movimientosValidos.find(
                m => m.destino === casilla
            );
            
            if (movimientoValido) {
                this.realizarMovimiento(movimientoValido);
            } else {
                // Si se clickea otra ficha con pieza
                if (casilla.tienePieza()) {
                    this.seleccionarFicha(casilla);
                } else {
                    // Deseleccionar
                    this.deseleccionarFicha();
                }
            }
        } else {
            // Seleccionar ficha si la casilla tiene pieza
            if (casilla.tienePieza()) {
                this.seleccionarFicha(casilla);
            }
        }
        
        this.dibujar();
    }
    
    seleccionarFicha(casilla) {
        this.fichaSeleccionada = casilla;
        this.movimientosValidos = this.tablero.obtenerMovimientosValidos(casilla);
        
        // Marcar casilla como seleccionada
        casilla.seleccionada = true;
    }
    
    deseleccionarFicha() {
        if (this.fichaSeleccionada) {
            this.fichaSeleccionada.seleccionada = false;
            this.fichaSeleccionada = null;
        }
        this.movimientosValidos = [];
    }
    
    realizarMovimiento(movimiento) {
        // Ejecutar movimiento en el tablero
        const exito = this.tablero.moverPieza(
            this.fichaSeleccionada,
            movimiento.destino,
            movimiento.saltada
        );
        
        if (exito) {
            // Actualizar estadísticas
            this.movimientos++;
            this.piezasRestantes = this.tablero.contarPiezas();
            this.actualizarStats();
            
            // Deseleccionar
            this.deseleccionarFicha();
            
            // Verificar fin del juego
            setTimeout(() => this.verificarFinJuego(), 100);
        }
    }
    
    verificarFinJuego() {
        // Verificar si hay movimientos disponibles
        const hayMovimientos = this.tablero.hayMovimientosDisponibles();
        
        if (!hayMovimientos) {
            this.juegoActivo = false;
            this.detenerTimer();
            this.finalizarJuego();
        }
    }
    
    finalizarJuego() {
        let titulo = '';
        let mensaje = '';
        
        if (this.piezasRestantes === 1) {
            titulo = '¡VICTORIA PERFECTA!';
            mensaje = `¡Increíble! Completaste el juego dejando solo 1 ficha.\n\n` +
                     `Movimientos: ${this.movimientos}\n` +
                     `Tiempo: ${formatTime(this.tiempoTranscurrido)}`;
        } else if (this.piezasRestantes <= 3) {
            titulo = '¡EXCELENTE!';
            mensaje = `¡Muy bien jugado! Quedaron ${this.piezasRestantes} fichas.\n\n` +
                     `Movimientos: ${this.movimientos}\n` +
                     `Tiempo: ${formatTime(this.tiempoTranscurrido)}`;
        } else if (this.piezasRestantes <= 5) {
            titulo = '¡BUEN INTENTO!';
            mensaje = `Quedaron ${this.piezasRestantes} fichas.\n\n` +
                     `Movimientos: ${this.movimientos}\n` +
                     `Tiempo: ${formatTime(this.tiempoTranscurrido)}`;
        } else {
            titulo = 'FIN DEL JUEGO';
            mensaje = `No quedan más movimientos posibles.\n` +
                     `Fichas restantes: ${this.piezasRestantes}\n\n` +
                     `Movimientos: ${this.movimientos}\n` +
                     `Tiempo: ${formatTime(this.tiempoTranscurrido)}`;
        }
        
        setTimeout(() => mostrarModal(titulo, mensaje), 300);
    }
    
    dibujar() {
        // Limpiar canvas
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // Dibujar fondo
        this.dibujarFondo();
        
        // Dibujar tablero
        this.tablero.dibujar();
        
        // Dibujar movimientos válidos si hay ficha seleccionada
        if (this.fichaSeleccionada && this.movimientosValidos.length > 0) {
            this.dibujarMovimientosValidos();
        }
    }
    
    dibujarFondo() {
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
        gradient.addColorStop(0, this.config.fondo.color1);
        gradient.addColorStop(1, this.config.fondo.color2);
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }
    
    dibujarMovimientosValidos() {
        this.movimientosValidos.forEach(movimiento => {
            const casilla = movimiento.destino;
            
            // Dibujar indicador de movimiento válido
            this.ctx.save();
            this.ctx.globalAlpha = 0.5;
            this.ctx.fillStyle = '#00ff00';
            this.ctx.beginPath();
            this.ctx.arc(casilla.x, casilla.y, casilla.radio * 0.6, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Dibujar borde pulsante
            this.ctx.strokeStyle = '#00ff00';
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            this.ctx.arc(casilla.x, casilla.y, casilla.radio + 5, 0, Math.PI * 2);
            this.ctx.stroke();
            this.ctx.restore();
        });
    }
    
    iniciarTimer() {
        this.tiempoTranscurrido = 0;
        this.timerInterval = setInterval(() => {
            if (this.juegoActivo) {
                this.tiempoTranscurrido++;
                this.actualizarStats();
            }
        }, 1000);
    }
    
    detenerTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }
    
    actualizarStats() {
        actualizarStats(this.piezasRestantes, this.movimientos, this.tiempoTranscurrido);
    }
    
    reiniciar() {
        // Detener timer anterior
        this.detenerTimer();
        
        // Resetear variables
        this.fichaSeleccionada = null;
        this.movimientosValidos = [];
        this.movimientos = 0;
        this.tiempoTranscurrido = 0;
        this.juegoActivo = true;
        this.animando = false;
        
        // Reinicializar tablero
        this.tablero.reiniciar();
        this.piezasRestantes = this.tablero.contarPiezas();
        
        // Reiniciar timer
        this.iniciarTimer();
        
        // Actualizar stats
        this.actualizarStats();
        
        // Redibujar
        this.dibujar();
    }
    
    detener() {
        this.juegoActivo = false;
        this.detenerTimer();
        
        // Limpiar eventos
        this.canvas.replaceWith(this.canvas.cloneNode(true));
        
        // Actualizar referencia al canvas
        this.canvas = document.querySelector('#canvas');
    }
}