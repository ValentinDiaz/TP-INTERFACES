class Pieza {
    constructor(ctx, x, y, radio, imagen) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.radio = radio;
        this.imagen = imagen; // Image object ya cargado
    }
    
    dibujar() {
        this.ctx.save();
        
        // Crear clip circular para la imagen
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radio, 0, Math.PI * 2);
        this.ctx.closePath();
        this.ctx.clip();
        
        // Dibujar imagen
        this.ctx.drawImage(
            this.imagen,
            this.x - this.radio,
            this.y - this.radio,
            this.radio * 2,
            this.radio * 2
        );
        
        this.ctx.restore();
        
        // Opcional: borde decorativo
        this.ctx.strokeStyle = '#fff';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radio, 0, Math.PI * 2);
        this.ctx.stroke();
    }
}