class Collectible {
  constructor(game, type, x, y) {
    this.game = game;
    this.type = type; // 'coin' o 'powerup'
    this.x = x;
    this.y = y;
    this.width = 40;
    this.height = 40;
    this.collected = false;
    this.rotation = 0;

    this.createElement();
  }

  createElement() {
    this.element = document.createElement("div");
    this.element.style.position = "absolute";

    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;
    this.element.style.zIndex = "15";
    if (this.type === "coin") {
      // Moneda con tu animación CSS
      this.element.className = "coin";
    } else if (this.type === "powerup") {
      this.element.className = "power-up";
    }

    this.game.gameElements.appendChild(this.element);
  }

  update() {
    // Mover hacia la izquierda
    this.x -= this.game.config.pipeSpeed;
    this.element.style.left = `${this.x}px`;

    // Flotación sutil para power-up
    if (this.type === "powerup") {
      this.rotation += 5;
      const bobbing = Math.sin((this.rotation * Math.PI) / 180) * 3;
      this.element.style.top = `${this.y + bobbing}px`;
    }
  }

  isOffScreen() {
    return this.x + this.width < 0;
  }

  checkCollision(bird) {
    if (this.collected) return false;

    const birdBounds = bird.getBounds();

    if (
      birdBounds.right > this.x &&
      birdBounds.left < this.x + this.width &&
      birdBounds.bottom > this.y &&
      birdBounds.top < this.y + this.height
    ) {
      this.collected = true;
      return true;
    }

    return false;
  }

  collect(bird) {
    // Animación de recolección
    this.element.style.transition = "all 0.3s ease-out";
    this.element.style.transform = "scale(1.5)";
    this.element.style.opacity = "0";

    setTimeout(() => {
      this.remove();
    }, 300);

    if (this.type === "coin") {
      // Sumar puntos y mostrar texto flotante
      this.game.addScore(5);
      this.game.showFloatingText(this.x, this.y, "+5", "#fbbf24"); // Amarillo para monedas
    } else if (this.type === "powerup") {
      // Mostrar texto de power-up
      this.game.addScore(2);
      this.game.showFloatingText(this.x, this.y, "POWER UP!", "#a78bfa"); // Morado para powerup


      // Activar power-up con animación de ataque
      this.activatePowerUp(bird);
    }
  }

  activatePowerUp(bird) {
    // Aplicar animación de ataque
    bird.el.classList.add("anim-atack");

    // Guardar la posición actual
    const fixedX = bird.x;
    const fixedY = bird.y;

    // Intervalo para forzar la posición cada frame
    const positionFixer = setInterval(() => {
      bird.x = fixedX;
      bird.y = fixedY;
      bird.el.style.left = `${fixedX}px`;
      bird.el.style.top = `${fixedY}px`;
    }, 10);

    // Remover animación y limpiar
    setTimeout(() => {
      clearInterval(positionFixer);
      bird.el.classList.remove("anim-atack");
    }, 400);

    // Destruir tubería más cercana
    this.destroyNearestPipe(bird);
  }

  destroyNearestPipe(bird) {
    let nearestPipe = null;
    let minDistance = Infinity;

    // Buscar tubería más cercana adelante del pájaro
    this.game.pipes.forEach((pipe) => {
      if (pipe.x > bird.x && pipe.x < bird.x + 400) {
        const distance = pipe.x - bird.x;
        if (distance < minDistance) {
          minDistance = distance;
          nearestPipe = pipe;
        }
      }
    });

    if (nearestPipe) {
      // Animación de destrucción
      nearestPipe.topElement.style.transition = "all 0.4s ease-out";
      nearestPipe.bottomElement.style.transition = "all 0.4s ease-out";

      nearestPipe.topElement.style.transform = "scale(0) rotate(180deg)";
      nearestPipe.bottomElement.style.transform = "scale(0) rotate(-180deg)";
      nearestPipe.topElement.style.opacity = "0";
      nearestPipe.bottomElement.style.opacity = "0";

      // Efecto de partículas
      this.createExplosionParticles(nearestPipe);

      setTimeout(() => {
        nearestPipe.remove();
        const index = this.game.pipes.indexOf(nearestPipe);
        if (index > -1) {
          this.game.pipes.splice(index, 1);
        }
      }, 400);
    }
  }

  createExplosionParticles(pipe) {
    for (let i = 0; i < 12; i++) {
      const particle = document.createElement("div");
      particle.style.position = "absolute";
      particle.style.width = "12px";
      particle.style.height = "12px";
      particle.style.left = `${pipe.x + pipe.width / 2}px`;
      particle.style.top = `${pipe.topHeight + pipe.gap / 2}px`;
      particle.style.background = "#00d4ff";
      particle.style.borderRadius = "50%";
      particle.style.boxShadow = "0 0 10px #00d4ff";
      particle.style.zIndex = "25";
      particle.style.imageRendering = "pixelated";

      const angle = (i / 12) * Math.PI * 2;
      const distance = 60 + Math.random() * 40;
      const endX = Math.cos(angle) * distance;
      const endY = Math.sin(angle) * distance;

      particle.style.transition =
        "all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
      this.game.gameElements.appendChild(particle);

      setTimeout(() => {
        particle.style.transform = `translate(${endX}px, ${endY}px) scale(0) rotate(${
          Math.random() * 360
        }deg)`;
        particle.style.opacity = "0";
      }, 10);

      setTimeout(() => particle.remove(), 600);
    }
  }

  remove() {
    this.element?.remove();
  }
}
