class Game {
  constructor() {
    this.gameState = "menu";
    this.gameArea = document.getElementById("gameArea");
    this.gameElements = document.getElementById("gameElements");
    this.gameUI = document.getElementById("gameUI");

    this.isRunning = false;
    this.score = 0;
    this.lives = 1;
    this.moves = 0;

    this.bird = null;
    this.pipes = [];
    this.animatedElements = [];

    this.config = {
      gravity: 0.5,
      jumpStrength: -10,
      birdSpeed: 3,
      pipeSpeed: 3,
      pipeGap: 200,
      pipeSpawnInterval: 2000,
    };

    this.lastPipeSpawn = 0;
    this.gameLoopId = null;
    this.isInvincible = false;

    this.collectibles = []; // Array para los coleccionables
    this.collectibleSpawnTimer = 0;
    this.collectibleSpawnInterval = 1000; // Cada 3 segundos intenta spawnear
  }

  init() {
    console.log("🎮 Inicializando juego...");
    this.bird = new Bird(this);
    this.setupControls();
    this.updateUI();
  }

  start() {
    console.log("▶️ Iniciando juego...");
    this.isRunning = true;

    document.getElementById("menuInicio").classList.add("hidden");
    this.gameArea.classList.remove("hidden");
    this.gameUI.classList.remove("hidden");
    this.gameState = "playing";

    this.lastPipeSpawn = Date.now();
    this.gameLoop();
  }

  gameLoop() {
    if (!this.isRunning) return;

    const currentTime = Date.now();

    this.bird.update();

    // Spawner de tuberías
    if (currentTime - this.lastPipeSpawn > this.config.pipeSpawnInterval) {
      this.spawnPipe();
      this.lastPipeSpawn = currentTime;
    }

    // Actualizar tuberías
    this.pipes.forEach((pipe, index) => {
      pipe.update();

      if (pipe.isOffScreen()) {
        pipe.remove();
        this.pipes.splice(index, 1);
      }

      if (pipe.checkCollision(this.bird)) {
        if (!this.isInvincible) {
          this.handleCollision();
        }
      }

      if (!pipe.scored && pipe.isPassed(this.bird)) {
        pipe.scored = true;
        this.addScore(1);
      }
    });

    // Actualizar coleccionables
    this.updateCollectibles();

    // Spawner de coleccionables
    this.spawnCollectibles();

    this.animatedElements.forEach((element) => element.update());

    this.checkBoundaries();
    this.updateUI();

    this.gameLoopId = requestAnimationFrame(() => this.gameLoop());
  }

  spawnPipe() {
    const pipe = new Pipe(this);
    this.pipes.push(pipe);
  }

  updateCollectibles() {
    this.collectibles.forEach((item, index) => {
      item.update();

      // Verificar colisión con el pájaro
      if (item.checkCollision(this.bird)) {
        item.collect(this.bird);
      }

      // Eliminar si salió de pantalla
      if (item.isOffScreen()) {
        item.remove();
        this.collectibles.splice(index, 1);
      }
    });
  }

  spawnCollectibles() {
    this.collectibleSpawnTimer += 16;

    if (this.collectibleSpawnTimer >= this.collectibleSpawnInterval) {
      this.collectibleSpawnTimer = 0;

      // Cambiar la probabilidad a 100% para testing
      if (Math.random() < 1.0) {
        // ← Cambiar de 0.3 a 1.0
        // Cambiar el ratio para que salgan más power-ups
        const type = Math.random() < 0.2 ? "coin" : "powerup"; // ← Cambiar de 0.7 a 0.2 (80% power-ups)

        const minY = 100;
        const maxY = this.gameArea.offsetHeight - 100;
        const y = Math.random() * (maxY - minY) + minY;

        const x = this.gameArea.offsetWidth;

        const collectible = new Collectible(this, type, x, y);
        this.collectibles.push(collectible);

        console.log(`✨ Spawned ${type} at (${x}, ${y})`);
      }
    }
  }

  setupControls() {
    this.gameArea.addEventListener("click", () => {
      if (this.isRunning) {
        this.bird.jump();
        this.moves++;
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.code === "Space" && this.isRunning) {
        e.preventDefault();
        this.bird.jump();
        this.moves++;
      }
    });
  }

  checkBoundaries() {
    if (
      this.bird.y <= 0 ||
      this.bird.y >= this.gameArea.offsetHeight - this.bird.height
    ) {
      if (!this.isInvincible) {
        this.handleCollision();
      } else {
        this.bird.velocityY = -this.bird.velocityY * 0.5;
        this.bird.takeDamage();
      }
    }
  }

  handleCollision() {
    console.log("💥 Colisión detectada!");

    this.bird.setAnimation("dead");
    this.isRunning = false;
    this.gameState = "dead";

    this.lives--;
    this.updateUI();

    if (this.lives <= 0) {
      setTimeout(() => this.gameOver(), 1500);
    } else {
      setTimeout(() => {
        this.resetBirdPosition();
        this.isRunning = true;
        this.gameLoop();
      }, 1500);
    }
  }

  resetBirdPosition() {
    this.gameState = "playing";
    this.bird.reset();
    this.pipes.forEach((pipe) => pipe.remove());
    this.pipes = [];
    this.lastPipeSpawn = Date.now();
  }

  addScore(points) {
    this.score += points;
    this.updateUI();
    console.log(`⭐ Puntaje: ${this.score}`);
  }

  updateUI() {
    document.getElementById("score").textContent = this.score;
    document.getElementById("lives").textContent = this.lives;
    document.getElementById("movesCount").textContent = this.moves;
  }

  gameOver() {
    console.log("❌ Game Over!");
    this.isRunning = false;
    cancelAnimationFrame(this.gameLoopId);

    document.querySelectorAll(".parallax-layer").forEach((layer) => {
      layer.style.animationPlayState = "paused";
    });

    document.getElementById("finalScore").textContent = this.score;
    document.getElementById("gameOverScreen").classList.remove("hidden");
  }

  reset() {
    this.pipes.forEach((pipe) => pipe.remove());
    this.pipes = [];

    // Limpiar coleccionables
    this.collectibles.forEach((item) => item.remove());
    this.collectibles = [];
    this.collectibleSpawnTimer = 0;

    this.score = 0;
    this.lives = 1;
    this.moves = 0;
    this.lastPipeSpawn = 0;

    if (this.bird) {
      this.bird.reset();
    }

    // Reactivar animaciones del parallax
    document.querySelectorAll(".parallax-layer").forEach((layer) => {
      layer.style.animationPlayState = "running";
    });

    document.getElementById("gameOverScreen").classList.add("hidden");
    this.updateUI();
  }
}
