// ===== CONFIGURATION DU JEU =====
const CONFIG = {
    WIDTH: 800,
    HEIGHT: 600,
    PLAYER_SIZE: 25,
    TREASURE_SIZE: 20,
    PIRATE_SIZE: 28,
    BOSS_SIZE: 45,
    MEGA_TREASURE_SIZE: 35,
    POWERUP_SIZE: 22,
    PLAYER_SPEED: 5,

    COLORS: {
        BG: '#1a4d2e',
        GRASS: '#2d6a4f',
        FOREST: '#0f3d1e',
        PLAYER: '#ffd700',
        PLAYER_OUTLINE: '#ff6b35',
        TREASURE: '#ff6b35',
        TREASURE_OUTLINE: '#ff4500',
        PIRATE: '#e63946',
        PIRATE_OUTLINE: '#8b0000',
        BOSS: '#8b0000',
        BOSS_OUTLINE: '#4a0000',
        MEGA_TREASURE: '#ffd700',
        MEGA_TREASURE_OUTLINE: '#ff8c00',
        POWERUP_SPEED: '#00ffff',
        POWERUP_SHIELD: '#9370db',
        TRUNK: '#3d2817',
        FOLIAGE: '#0f3d1e',
        FOLIAGE_OUTLINE: '#0a3d1a'
    },

    DIFFICULTIES: {
        easy: { pirates: 2, speed: 2, name: 'Facile' },
        normal: { pirates: 3, speed: 3, name: 'Normal' },
        hard: { pirates: 5, speed: 4, name: 'Difficile' }
    },

    EVENTS: {
        BOSS_SPAWN_CHANCE: 0.15, // 15% de chance tous les 5 points
        POWERUP_SPAWN_CHANCE: 0.25, // 25% de chance tous les 4 points
        BOSS_DURATION: 15000, // Boss reste 15 secondes
        POWERUP_DURATION: 5000 // Power-up dure 5 secondes
    }
};

// ===== VARIABLES GLOBALES =====
let canvas, ctx;
let currentScreen = 'menu';
let currentDifficulty = null;
let gameState = {
    running: false,
    paused: false,
    score: 0,
    player: { x: 0, y: 0 },
    treasure: { x: 0, y: 0 },
    pirates: [],
    forests: [],
    keysPressed: new Set(),
    // Événements spéciaux
    boss: null,
    megaTreasure: null,
    powerup: null,
    hasShield: false,
    hasSpeedBoost: false,
    shieldTimer: null,
    speedTimer: null
};

// ===== INITIALISATION =====
document.addEventListener('DOMContentLoaded', () => {
    initializeCanvas();
    initializeEventListeners();
    showScreen('menu');
    createStars();
});

function initializeCanvas() {
    canvas = document.getElementById('game-canvas');
    ctx = canvas.getContext('2d');
}

function initializeEventListeners() {
    // Menu principal
    document.getElementById('start-btn').addEventListener('click', () => {
        showScreen('difficulty');
    });

    // Sélection de difficulté
    document.querySelectorAll('.difficulty-button').forEach(btn => {
        btn.addEventListener('click', (e) => {
            currentDifficulty = e.target.dataset.difficulty;
            startGame();
        });
    });

    // Bouton pause
    document.getElementById('pause-btn').addEventListener('click', togglePause);

    // Menu pause
    document.getElementById('resume-btn').addEventListener('click', togglePause);
    document.getElementById('quit-btn').addEventListener('click', quitToMenu);

    // Menu game over
    document.getElementById('menu-btn').addEventListener('click', quitToMenu);

    // Contrôles clavier
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
}

// ===== GESTION DES ÉCRANS =====
function showScreen(screenName) {
    // Cacher tous les écrans
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });

    // Afficher l'écran demandé
    const screen = document.getElementById(`${screenName}-screen`);
    if (screen) {
        screen.classList.add('active');
        currentScreen = screenName;
    }
}

function showOverlay(overlayName) {
    const overlay = document.getElementById(`${overlayName}-menu`);
    if (overlay) {
        overlay.classList.add('active');
    }
}

function hideOverlay(overlayName) {
    const overlay = document.getElementById(`${overlayName}-menu`);
    if (overlay) {
        overlay.classList.remove('active');
    }
}

// ===== CRÉATION DES ÉTOILES (EFFET VISUEL) =====
function createStars() {
    const starsContainers = document.querySelectorAll('.stars-background');
    starsContainers.forEach(container => {
        for (let i = 0; i < 50; i++) {
            const star = document.createElement('div');
            star.style.position = 'absolute';
            star.style.width = `${Math.random() * 3 + 1}px`;
            star.style.height = star.style.width;
            star.style.backgroundColor = '#ffd700';
            star.style.borderRadius = '50%';
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            star.style.opacity = Math.random();
            container.appendChild(star);
        }
    });
}

// ===== DÉMARRAGE DU JEU =====
function startGame() {
    showScreen('game');

    const difficulty = CONFIG.DIFFICULTIES[currentDifficulty];

    // Réinitialiser l'état du jeu
    gameState = {
        running: true,
        paused: false,
        score: 0,
        player: {
            x: CONFIG.WIDTH / 2 - CONFIG.PLAYER_SIZE / 2,
            y: CONFIG.HEIGHT / 2 - CONFIG.PLAYER_SIZE / 2
        },
        treasure: { x: 0, y: 0 },
        pirates: [],
        forests: [],
        keysPressed: new Set(),
        pirateSpeed: difficulty.speed
    };

    // Mettre à jour l'affichage
    updateScore();
    document.getElementById('difficulty-text').textContent = `⚔️ ${difficulty.name}`;

    // Créer la carte
    createMap();

    // Placer le trésor
    spawnTreasure();

    // Créer les pirates
    for (let i = 0; i < difficulty.pirates; i++) {
        spawnPirate();
    }

    // Démarrer la boucle de jeu
    gameLoop();
}

// ===== CRÉATION DE LA CARTE =====
function createMap() {
    gameState.forests = [];

    // Distance minimale entre les arbres pour garantir des passages
    const MIN_TREE_DISTANCE = 80;

    // Fonction pour vérifier si un arbre est trop proche des autres
    function isTooClose(newTree) {
        return gameState.forests.some(existingTree => {
            const dx = newTree.x - existingTree.renderX;
            const dy = newTree.y - existingTree.renderY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            return distance < MIN_TREE_DISTANCE;
        });
    }

    // Zones de forêt principales (plus grandes)
    const forestZones = [
        { x: 50, y: 50, width: 180, height: 150 },
        { x: CONFIG.WIDTH - 230, y: 50, width: 180, height: 150 },
        { x: 50, y: CONFIG.HEIGHT - 200, width: 180, height: 150 },
        { x: CONFIG.WIDTH - 230, y: CONFIG.HEIGHT - 200, width: 180, height: 150 },
        { x: CONFIG.WIDTH / 2 - 120, y: CONFIG.HEIGHT / 2 - 100, width: 240, height: 200 }
    ];

    // Créer des arbres dans les zones principales avec espacement
    forestZones.forEach(zone => {
        const treeCount = Math.floor(Math.random() * 7) + 8; // Moins d'arbres (8-15)
        let attempts = 0;
        let treesPlaced = 0;

        while (treesPlaced < treeCount && attempts < 100) {
            const tree = {
                x: zone.x + Math.random() * (zone.width - 30),
                y: zone.y + Math.random() * (zone.height - 30)
            };

            // Vérifier si l'arbre n'est pas trop proche des autres
            if (!isTooClose(tree)) {
                gameState.forests.push({
                    x1: tree.x - 5,
                    y1: tree.y - 15,
                    x2: tree.x + 30,
                    y2: tree.y + 30,
                    renderX: tree.x,
                    renderY: tree.y
                });
                treesPlaced++;
            }
            attempts++;
        }
    });

    // Ajouter des arbres aléatoires partout sur la carte (pour remplir)
    const randomTrees = 15; // Moins d'arbres aléatoires (15 au lieu de 25)
    let randomAttempts = 0;
    let randomTreesPlaced = 0;

    while (randomTreesPlaced < randomTrees && randomAttempts < 200) {
        const tree = {
            x: Math.random() * (CONFIG.WIDTH - 100) + 50,
            y: Math.random() * (CONFIG.HEIGHT - 100) + 50
        };

        // Éviter de mettre des arbres trop près du centre (zone de spawn du joueur)
        const distFromCenter = Math.sqrt(
            Math.pow(tree.x - CONFIG.WIDTH / 2, 2) +
            Math.pow(tree.y - CONFIG.HEIGHT / 2, 2)
        );

        // Vérifier la distance du centre ET la distance des autres arbres
        if (distFromCenter > 100 && !isTooClose(tree)) {
            gameState.forests.push({
                x1: tree.x - 5,
                y1: tree.y - 15,
                x2: tree.x + 30,
                y2: tree.y + 30,
                renderX: tree.x,
                renderY: tree.y
            });
            randomTreesPlaced++;
        }
        randomAttempts++;
    }
}

// ===== APPARITION DU TRÉSOR =====
function spawnTreasure() {
    let attempts = 0;
    while (attempts < 50) {
        const x = Math.random() * (CONFIG.WIDTH - CONFIG.TREASURE_SIZE - 40) + 20;
        const y = Math.random() * (CONFIG.HEIGHT - CONFIG.TREASURE_SIZE - 40) + 20;

        if (!isInForest(x, y, CONFIG.TREASURE_SIZE, CONFIG.TREASURE_SIZE)) {
            gameState.treasure = { x, y };
            return;
        }
        attempts++;
    }
}

// ===== APPARITION DES PIRATES =====
function spawnPirate() {
    let attempts = 0;
    while (attempts < 50) {
        const x = Math.random() * (CONFIG.WIDTH - CONFIG.PIRATE_SIZE);
        const y = Math.random() * (CONFIG.HEIGHT - CONFIG.PIRATE_SIZE);

        const distFromPlayer = Math.sqrt(
            Math.pow(x - gameState.player.x, 2) +
            Math.pow(y - gameState.player.y, 2)
        );

        if (distFromPlayer > 150 && !isInForest(x, y, CONFIG.PIRATE_SIZE, CONFIG.PIRATE_SIZE)) {
            const speed = gameState.pirateSpeed;
            gameState.pirates.push({
                x, y,
                vx: Math.random() > 0.5 ? speed : -speed,
                vy: Math.random() > 0.5 ? speed : -speed
            });
            return;
        }
        attempts++;
    }
}

// ===== VÉRIFICATION COLLISION FORÊT =====
function isInForest(x, y, width, height) {
    return gameState.forests.some(forest =>
        x < forest.x2 && x + width > forest.x1 &&
        y < forest.y2 && y + height > forest.y1
    );
}

// ===== GESTION DES TOUCHES =====
function handleKeyDown(e) {
    const key = e.key.toLowerCase();

    // Pause avec P ou Échap
    if (key === 'p' || key === 'escape') {
        if (gameState.running && currentScreen === 'game') {
            togglePause();
        }
        return;
    }

    // Touches de mouvement
    if (['z', 'q', 's', 'd'].includes(key)) {
        gameState.keysPressed.add(key);
    }
}

function handleKeyUp(e) {
    const key = e.key.toLowerCase();
    gameState.keysPressed.delete(key);
}

// ===== MOUVEMENT DU JOUEUR =====
function movePlayer() {
    const oldX = gameState.player.x;
    const oldY = gameState.player.y;
    let newX = oldX;
    let newY = oldY;

    if (gameState.keysPressed.has('z')) newY -= CONFIG.PLAYER_SPEED;
    if (gameState.keysPressed.has('s')) newY += CONFIG.PLAYER_SPEED;
    if (gameState.keysPressed.has('q')) newX -= CONFIG.PLAYER_SPEED;
    if (gameState.keysPressed.has('d')) newX += CONFIG.PLAYER_SPEED;

    // Limites de l'écran
    newX = Math.max(0, Math.min(CONFIG.WIDTH - CONFIG.PLAYER_SIZE, newX));
    newY = Math.max(0, Math.min(CONFIG.HEIGHT - CONFIG.PLAYER_SIZE, newY));

    // Vérifier collision avec forêt
    if (!isInForest(newX, newY, CONFIG.PLAYER_SIZE, CONFIG.PLAYER_SIZE)) {
        gameState.player.x = newX;
        gameState.player.y = newY;
    }
}

// ===== MOUVEMENT DES PIRATES =====
function movePirates() {
    gameState.pirates.forEach(pirate => {
        let newX = pirate.x + pirate.vx;
        let newY = pirate.y + pirate.vy;

        // Rebond sur les murs
        if (newX <= 0 || newX >= CONFIG.WIDTH - CONFIG.PIRATE_SIZE) {
            pirate.vx = -pirate.vx;
            newX = pirate.x + pirate.vx;
        }
        if (newY <= 0 || newY >= CONFIG.HEIGHT - CONFIG.PIRATE_SIZE) {
            pirate.vy = -pirate.vy;
            newY = pirate.y + pirate.vy;
        }

        // Vérifier collision avec forêt AVANT de bouger
        if (isInForest(newX, newY, CONFIG.PIRATE_SIZE, CONFIG.PIRATE_SIZE)) {
            // Essayer de contourner l'obstacle
            const tryX = pirate.x + pirate.vx;
            const tryY = pirate.y;
            const tryX2 = pirate.x;
            const tryY2 = pirate.y + pirate.vy;

            if (!isInForest(tryX, tryY, CONFIG.PIRATE_SIZE, CONFIG.PIRATE_SIZE)) {
                // Peut bouger en X seulement
                pirate.vy = -pirate.vy;
                newX = tryX;
                newY = tryY;
            } else if (!isInForest(tryX2, tryY2, CONFIG.PIRATE_SIZE, CONFIG.PIRATE_SIZE)) {
                // Peut bouger en Y seulement
                pirate.vx = -pirate.vx;
                newX = tryX2;
                newY = tryY2;
            } else {
                // Complètement bloqué - inverser les deux directions
                pirate.vx = -pirate.vx;
                pirate.vy = -pirate.vy;
                newX = pirate.x + pirate.vx;
                newY = pirate.y + pirate.vy;
            }
        }

        // Mettre à jour la position
        pirate.x = newX;
        pirate.y = newY;
    });

    // Mouvement du boss s'il existe
    if (gameState.boss) {
        moveBoss();
    }
}

// ===== MOUVEMENT DU BOSS (plus intelligent) =====
function moveBoss() {
    const boss = gameState.boss;

    // Le boss suit le joueur
    const dx = gameState.player.x - boss.x;
    const dy = gameState.player.y - boss.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 0) {
        const speed = boss.speed;
        boss.vx = (dx / distance) * speed;
        boss.vy = (dy / distance) * speed;
    }

    let newX = boss.x + boss.vx;
    let newY = boss.y + boss.vy;

    // Limites
    newX = Math.max(0, Math.min(CONFIG.WIDTH - CONFIG.BOSS_SIZE, newX));
    newY = Math.max(0, Math.min(CONFIG.HEIGHT - CONFIG.BOSS_SIZE, newY));

    // Éviter les forêts
    if (!isInForest(newX, newY, CONFIG.BOSS_SIZE, CONFIG.BOSS_SIZE)) {
        boss.x = newX;
        boss.y = newY;
    }
}

// ===== VÉRIFICATION DES COLLISIONS =====
function checkCollisions() {
    const px1 = gameState.player.x;
    const py1 = gameState.player.y;
    const px2 = px1 + CONFIG.PLAYER_SIZE;
    const py2 = py1 + CONFIG.PLAYER_SIZE;

    // Collision avec pirates (Game Over)
    for (let pirate of gameState.pirates) {
        if (isOverlap(
            px1, py1, px2, py2,
            pirate.x, pirate.y, pirate.x + CONFIG.PIRATE_SIZE, pirate.y + CONFIG.PIRATE_SIZE
        )) {
            gameOver();
            return;
        }
    }

    // Collision avec trésor
    const tx1 = gameState.treasure.x;
    const ty1 = gameState.treasure.y;
    const tx2 = tx1 + CONFIG.TREASURE_SIZE;
    const ty2 = ty1 + CONFIG.TREASURE_SIZE;

    if (isOverlap(px1, py1, px2, py2, tx1, ty1, tx2, ty2)) {
        gameState.score++;
        updateScore();
        spawnTreasure();

        // Ajouter un pirate tous les 3 points
        if (gameState.score % 3 === 0) {
            spawnPirate();
        }
    }
}

function isOverlap(x1, y1, x2, y2, x3, y3, x4, y4) {
    return !(x2 < x3 || x1 > x4 || y2 < y3 || y1 > y4);
}

// ===== RENDU =====
function render() {
    // Fond uni simple
    ctx.fillStyle = CONFIG.COLORS.BG;
    ctx.fillRect(0, 0, CONFIG.WIDTH, CONFIG.HEIGHT);

    // Forêts (arbres)
    gameState.forests.forEach(forest => {
        const x = forest.renderX;
        const y = forest.renderY;

        // Tronc
        ctx.fillStyle = CONFIG.COLORS.TRUNK;
        ctx.fillRect(x + 10, y + 15, 10, 15);

        // Feuillage (plusieurs cercles)
        ctx.fillStyle = CONFIG.COLORS.FOREST;
        ctx.strokeStyle = CONFIG.COLORS.FOLIAGE_OUTLINE;
        ctx.lineWidth = 1;

        const foliagePositions = [
            [-5, -10], [5, -10], [0, -15], [-8, -5], [8, -5]
        ];

        foliagePositions.forEach(([dx, dy]) => {
            ctx.beginPath();
            ctx.arc(x + dx + 12.5, y + dy + 12.5, 12.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        });
    });

    // Trésor (étoile)
    drawStar(
        gameState.treasure.x + CONFIG.TREASURE_SIZE / 2,
        gameState.treasure.y + CONFIG.TREASURE_SIZE / 2,
        5, 10, 4,
        CONFIG.COLORS.TREASURE,
        CONFIG.COLORS.TREASURE_OUTLINE
    );

    // Pirates
    gameState.pirates.forEach(pirate => {
        ctx.fillStyle = CONFIG.COLORS.PIRATE;
        ctx.strokeStyle = CONFIG.COLORS.PIRATE_OUTLINE;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(
            pirate.x + CONFIG.PIRATE_SIZE / 2,
            pirate.y + CONFIG.PIRATE_SIZE / 2,
            CONFIG.PIRATE_SIZE / 2,
            0, Math.PI * 2
        );
        ctx.fill();
        ctx.stroke();
    });

    // Joueur
    ctx.fillStyle = CONFIG.COLORS.PLAYER;
    ctx.strokeStyle = CONFIG.COLORS.PLAYER_OUTLINE;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(
        gameState.player.x + CONFIG.PLAYER_SIZE / 2,
        gameState.player.y + CONFIG.PLAYER_SIZE / 2,
        CONFIG.PLAYER_SIZE / 2,
        0, Math.PI * 2
    );
    ctx.fill();
    ctx.stroke();
}

// Fonction pour dessiner une étoile
function drawStar(cx, cy, spikes, outerRadius, innerRadius, fillColor, strokeColor) {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);

    for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
    }

    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();

    ctx.fillStyle = fillColor;
    ctx.fill();
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 2;
    ctx.stroke();
}

// ===== MISE À JOUR DU SCORE =====
function updateScore() {
    document.getElementById('score-text').textContent = `💰 Score: ${gameState.score}`;
}

// ===== PAUSE =====
function togglePause() {
    if (!gameState.running) return;

    gameState.paused = !gameState.paused;

    if (gameState.paused) {
        showOverlay('pause');
    } else {
        hideOverlay('pause');
    }
}

// ===== GAME OVER =====
function gameOver() {
    gameState.running = false;
    document.getElementById('final-score').textContent = gameState.score;
    showOverlay('gameover');
}

// ===== RETOUR AU MENU =====
function quitToMenu() {
    gameState.running = false;
    gameState.paused = false;
    hideOverlay('pause');
    hideOverlay('gameover');
    showScreen('menu');
}

// ===== BOUCLE DE JEU =====
function gameLoop() {
    if (!gameState.running) return;

    if (!gameState.paused) {
        movePlayer();
        movePirates();
        checkCollisions();
    }

    render();

    requestAnimationFrame(gameLoop);
}
