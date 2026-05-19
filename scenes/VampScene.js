const GAME_WIDTH = 800;
const GAME_HEIGHT = 800;
const WORLD_WIDTH = 1800;
const WORLD_HEIGHT = 1400;

const PLAYER_SPEED = 235;
const ENEMY_BASE_SPEED = 58;
const HAMMER_SPEED = 520;
const WAVE_SECONDS = 30;

let player;
let cursors;

export default class VampScene extends Phaser.Scene {
    constructor() {
        super({ key: 'VampScene' });
    }

    preload() {
        this.load.image('background', 'assets/background.jpg');
        this.load.image('circle', 'assets/circle.png');
        this.load.spritesheet('player', 'assets/hero.png', { frameWidth: 180, frameHeight: 198 });
        this.load.spritesheet('enemy', 'assets/enemy.png', { frameWidth: 32, frameHeight: 32 });
        this.load.image('hammer', 'assets/hammer.png');
        this.load.image('whip', 'assets/whip.png');
        this.load.image('heart', 'assets/heart.png');
        this.load.image('gem', 'assets/coinGold.png');
        this.load.image('redParticle', 'assets/heart.png');
    }

    create() {
        this.resetRunState();
        this.createWorld();
        this.createPlayer();
        this.createAnimations();
        this.createWeapons();
        this.createGroups();
        this.createHud();
        this.createControls();
        this.createEffects();
        this.createTimers();
        this.spawnWave(true);
    }

    resetRunState() {
        this.currentLevel = 1;
        this.playerMaxHealth = 100;
        this.playerHealth = this.playerMaxHealth;
        this.playerExperience = 0;
        this.experienceToLevelUp = 120;
        this.heartCount = 0;
        this.waveTimeLeft = WAVE_SECONDS;
        this.hitCooldown = false;
        this.gameEnded = false;
        this.targetX = GAME_WIDTH / 2;
        this.targetY = GAME_HEIGHT / 2;
        this.whipAttached = false;
        this.isChoosingUpgrade = false;
        this.pendingUpgrades = 0;
        this.damageBonus = 0;
        this.attackDelay = 720;
        this.moveSpeed = PLAYER_SPEED;
        this.angle = 0;
        this.radius = 82;
        this.orbitSpeed = 0.055;
    }

    createWorld() {
        this.add.tileSprite(WORLD_WIDTH / 2, WORLD_HEIGHT / 2, WORLD_WIDTH, WORLD_HEIGHT, 'background')
            .setDepth(-10)
            .setAlpha(0.9);

        this.cameras.main.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
        this.physics.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    }

    createPlayer() {
        this.player = this.physics.add.sprite(WORLD_WIDTH / 2, WORLD_HEIGHT / 2, 'player');
        this.player.setDisplaySize(54, 60);
        this.player.setDepth(5);
        this.player.setCollideWorldBounds(true);
        this.player.body.setSize(90, 110).setOffset(45, 55);
        player = this.player;

        this.player2 = this.physics.add.sprite(WORLD_WIDTH / 2, WORLD_HEIGHT / 2, 'player');
        this.player2.setDisplaySize(54, 60);
        this.player2.setDepth(4);
        this.player2.setAlpha(0.65);
        this.player2.setTint(0x66ccff);

        this.cameras.main.startFollow(this.player, true, 0.12, 0.12);
    }

    createGroups() {
        this.enemies = this.physics.add.group();
        this.hammers = this.physics.add.group();
        this.loots = this.physics.add.group();
        this.gems = this.physics.add.group();
        this.projectiles = this.physics.add.group();

        this.physics.add.overlap(this.player, this.enemies, this.handlePlayerHit, null, this);
        this.physics.add.overlap(this.hammers, this.enemies, this.handleHammerHit, null, this);
        this.physics.add.overlap(this.orbitHammer, this.enemies, this.handleOrbitHit, null, this);
        this.physics.add.overlap(this.projectiles, this.enemies, this.handleHammerHit, null, this);
        this.physics.add.overlap(this.player, this.loots, this.collectHeart, null, this);
        this.physics.add.overlap(this.player, this.gems, this.collectGem, null, this);
    }

    createAnimations() {
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('player', { frames: [0, 1, 2, 3, 4, 5] }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('player', { frames: [5] }),
            frameRate: 10,
            repeat: -1
        });

        for (let i = 0; i < 4; i++) {
            this.anims.create({
                key: `enemyWalk${i}`,
                frames: this.anims.generateFrameNumbers('enemy', { frames: [i * 4, i * 4 + 1, i * 4 + 2, i * 4 + 3] }),
                frameRate: 8,
                repeat: -1
            });
        }

        this.player.anims.play('idle', true);
        this.player2.anims.play('idle', true);
    }

    createWeapons() {
        this.orbitHammer = this.physics.add.sprite(this.player.x, this.player.y, 'hammer');
        this.orbitHammer.setDisplaySize(36, 36);
        this.orbitHammer.setDepth(6);
        this.orbitHammer.name = 'orbitHammer';

        this.circle = this.add.image(this.player.x, this.player.y, 'circle')
            .setDisplaySize(210, 210)
            .setAlpha(0.16)
            .setDepth(1);
    }

    createHud() {
        const hudStyle = {
            fontFamily: 'Arial',
            fontSize: '22px',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 5
        };

        this.levelText = this.add.text(18, 18, 'Wave 1', hudStyle).setScrollFactor(0).setDepth(100);
        this.timeText = this.add.text(GAME_WIDTH - 18, 18, '00:30', hudStyle).setOrigin(1, 0).setScrollFactor(0).setDepth(100);
        this.scoreText = this.add.text(18, 48, 'XP 0 / 120', { ...hudStyle, fontSize: '18px' }).setScrollFactor(0).setDepth(100);
        this.heartText = this.add.text(GAME_WIDTH - 18, 48, 'Hearts x0', { ...hudStyle, fontSize: '18px' }).setOrigin(1, 0).setScrollFactor(0).setDepth(100);

        this.levelUpBarBackground = this.add.graphics().setScrollFactor(0).setDepth(99);
        this.levelUpBarFill = this.add.graphics().setScrollFactor(0).setDepth(100);
        this.healthBarBackground = this.add.graphics().setDepth(98);
        this.healthBar = this.add.graphics().setDepth(99);

        this.updateHud();
        this.updateHealthBar();
    }

    createControls() {
        cursors = this.input.keyboard.createCursorKeys();
        this.keys = this.input.keyboard.addKeys('W,A,S,D');

        this.input.on('pointerdown', (pointer) => {
            this.targetX = pointer.worldX;
            this.targetY = pointer.worldY;
        });

        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.start('MenuScene');
        });
    }

    createEffects() {
        this.particles = this.add.particles('redParticle');
        this.hitEmitter = this.particles.createEmitter({
            speed: { min: 60, max: 160 },
            scale: { start: 0.45, end: 0 },
            blendMode: 'ADD',
            lifespan: 450,
            on: false
        });
    }

    createTimers() {
        this.attackTimer = this.time.addEvent({
            delay: this.attackDelay,
            callback: this.shootHammer,
            callbackScope: this,
            loop: true
        });

        this.waveTimer = this.time.addEvent({
            delay: 1000,
            callback: this.tickWave,
            callbackScope: this,
            loop: true
        });

        this.spawnTimer = this.time.addEvent({
            delay: 4200,
            callback: () => this.spawnEnemies(Math.ceil(this.currentLevel / 2) + 1),
            callbackScope: this,
            loop: true
        });
    }

    update() {
        if (this.gameEnded || this.isChoosingUpgrade) {
            return;
        }

        this.updatePlayerMovement();
        this.updateEnemies();
        this.updateWeapons();
        this.updateLootMagnet();
        this.updateMultiplayerGhost();
        this.updateHealthBar();
        this.cleanupProjectiles();
    }

    updatePlayerMovement() {
        const left = this.keys.A.isDown || cursors.left.isDown;
        const right = this.keys.D.isDown || cursors.right.isDown;
        const up = this.keys.W.isDown || cursors.up.isDown;
        const down = this.keys.S.isDown || cursors.down.isDown;
        const keyboardActive = left || right || up || down;

        if (keyboardActive) {
            const x = (right ? 1 : 0) - (left ? 1 : 0);
            const y = (down ? 1 : 0) - (up ? 1 : 0);
            const direction = new Phaser.Math.Vector2(x, y).normalize().scale(this.moveSpeed);
            this.player.setVelocity(direction.x, direction.y);
            this.targetX = this.player.x;
            this.targetY = this.player.y;
        } else {
            const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.targetX, this.targetY);
            if (distance > 8) {
                this.physics.moveTo(this.player, this.targetX, this.targetY, this.moveSpeed);
            } else {
                this.player.setVelocity(0, 0);
            }
        }

        if (this.player.body.velocity.length() > 5) {
            this.player.anims.play('walk', true);
            this.player.flipX = this.player.body.velocity.x < 0;
        } else {
            this.player.anims.play('idle', true);
        }
    }

    updateEnemies() {
        this.enemies.children.iterate((enemy) => {
            if (!enemy || !enemy.active) {
                return;
            }

            const speed = enemy.speed || ENEMY_BASE_SPEED;
            this.physics.moveToObject(enemy, this.player, speed);
            enemy.flipX = enemy.body.velocity.x < 0;
        });
    }

    updateWeapons() {
        this.angle = (this.angle + this.orbitSpeed) % (Math.PI * 2);
        this.orbitHammer.x = this.player.x + this.radius * Math.cos(this.angle);
        this.orbitHammer.y = this.player.y + this.radius * Math.sin(this.angle);
        this.orbitHammer.rotation += 0.16;
        this.circle.setPosition(this.player.x, this.player.y);
    }

    updateLootMagnet() {
        this.pullCollectibles(this.loots, 150, 245);
        this.pullCollectibles(this.gems, 190, 285);
    }

    pullCollectibles(group, radius, speed) {
        group.children.iterate((loot) => {
            if (!loot || !loot.active) {
                return;
            }

            const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, loot.x, loot.y);
            if (distance < radius) {
                this.physics.moveToObject(loot, this.player, speed);
            } else {
                loot.setVelocity(0, 0);
            }
        });
    }

    updateMultiplayerGhost() {
        if (typeof sendMessage === 'function') {
            sendMessage(JSON.stringify({
                id: location.hash.substring(1),
                x: this.player.x,
                y: this.player.y,
                side: this.player.flipX,
                movingx: this.player.body.velocity.x,
                movingy: this.player.body.velocity.y
            }));
        }

        const other = window.otherplayer;
        if (!other || other.id === location.hash.substring(1)) {
            this.player2.setVisible(false);
            return;
        }

        this.player2.setVisible(true);
        this.player2.setPosition(other.x, other.y);
        this.player2.flipX = other.side;
        this.player2.anims.play(other.movingx !== 0 || other.movingy !== 0 ? 'walk' : 'idle', true);
    }

    cleanupProjectiles() {
        this.hammers.children.iterate((hammer) => {
            if (!hammer || !hammer.active) {
                return;
            }

            hammer.rotation += 0.25;
            if (hammer.createdAt && this.time.now - hammer.createdAt > 1800) {
                hammer.destroy();
            }
        });
    }

    shootHammer() {
        if (this.gameEnded || this.enemies.countActive(true) === 0) {
            return;
        }

        const closestEnemy = this.findClosestEnemy();
        if (!closestEnemy) {
            return;
        }

        const hammer = this.hammers.create(this.player.x, this.player.y, 'hammer');
        hammer.setDisplaySize(32, 32);
        hammer.setDepth(6);
        hammer.createdAt = this.time.now;
        this.physics.moveToObject(hammer, closestEnemy, HAMMER_SPEED);
    }

    findClosestEnemy() {
        let closestEnemy = null;
        let closestDistance = Infinity;

        this.enemies.children.iterate((enemy) => {
            if (!enemy || !enemy.active) {
                return;
            }

            const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, enemy.x, enemy.y);
            if (distance < closestDistance) {
                closestDistance = distance;
                closestEnemy = enemy;
            }
        });

        return closestEnemy;
    }

    spawnWave(isOpeningWave = false) {
        this.waveTimeLeft = WAVE_SECONDS;
        this.updateHud();
        this.spawnEnemies(this.currentLevel + (isOpeningWave ? 3 : 5));
        this.showFloatingText(this.player.x, this.player.y - 90, `Wave ${this.currentLevel}`, '#ffdf6e', 30);
    }

    spawnEnemies(amount) {
        for (let i = 0; i < amount; i++) {
            const spawn = this.getEdgeSpawnPoint();
            const type = Phaser.Math.Between(0, 3);
            const enemy = this.enemies.create(spawn.x, spawn.y, 'enemy');
            enemy.setDisplaySize(42, 42);
            enemy.setDepth(4);
            enemy.setCollideWorldBounds(true);
            enemy.body.setSize(22, 24).setOffset(5, 5);
            enemy.health = 16 + this.currentLevel * 8 + type * 4;
            enemy.maxHealth = enemy.health;
            enemy.speed = ENEMY_BASE_SPEED + this.currentLevel * 6 + type * 8;
            enemy.xp = 12 + this.currentLevel * 3 + type * 3;
            enemy.anims.play(`enemyWalk${type}`, true);
        }
    }

    getEdgeSpawnPoint() {
        const padding = 80;
        const side = Phaser.Math.Between(0, 3);
        const minX = Phaser.Math.Clamp(this.player.x - 520, padding, WORLD_WIDTH - padding);
        const maxX = Phaser.Math.Clamp(this.player.x + 520, padding, WORLD_WIDTH - padding);
        const minY = Phaser.Math.Clamp(this.player.y - 520, padding, WORLD_HEIGHT - padding);
        const maxY = Phaser.Math.Clamp(this.player.y + 520, padding, WORLD_HEIGHT - padding);

        if (side === 0) {
            return { x: Phaser.Math.Between(minX, maxX), y: Math.max(padding, minY) };
        }
        if (side === 1) {
            return { x: Phaser.Math.Between(minX, maxX), y: Math.min(WORLD_HEIGHT - padding, maxY) };
        }
        if (side === 2) {
            return { x: Math.max(padding, minX), y: Phaser.Math.Between(minY, maxY) };
        }
        return { x: Math.min(WORLD_WIDTH - padding, maxX), y: Phaser.Math.Between(minY, maxY) };
    }

    handleHammerHit(hammer, enemy) {
        if (!enemy.active) {
            return;
        }

        const damage = Phaser.Math.Between(18, 34) + this.currentLevel * 2 + this.damageBonus;
        enemy.health -= damage;
        this.showDamage(enemy.x, enemy.y, damage);
        this.flashEnemy(enemy);

        if (hammer && hammer.active) {
            hammer.destroy();
        }

        if (enemy.health <= 0) {
            this.killEnemy(enemy);
        }
    }

    handleOrbitHit(hammer, enemy) {
        if (!enemy.active || enemy.lastOrbitHit && this.time.now - enemy.lastOrbitHit < 450) {
            return;
        }

        enemy.lastOrbitHit = this.time.now;
        const damage = 8 + this.currentLevel + Math.floor(this.damageBonus / 2);
        enemy.health -= damage;
        this.showDamage(enemy.x, enemy.y, damage);
        this.flashEnemy(enemy);

        if (enemy.health <= 0) {
            this.killEnemy(enemy);
        }
    }

    killEnemy(enemy) {
        const x = enemy.x;
        const y = enemy.y;
        const xp = enemy.xp || 10;
        enemy.destroy();
        this.hitEmitter.explode(10, x, y);
        this.dropGem(x, y, xp);

        if (Math.random() < 0.18) {
            this.dropHeart(x, y);
        }
    }

    flashEnemy(enemy) {
        enemy.setTint(0xff6262);
        this.time.delayedCall(100, () => {
            if (enemy.active) {
                enemy.clearTint();
            }
        });
    }

    handlePlayerHit() {
        if (this.hitCooldown || this.gameEnded) {
            return;
        }

        this.hitCooldown = true;
        this.playerHealth = Math.max(0, this.playerHealth - 14);
        this.updateHealthBar();
        this.cameras.main.shake(180, 0.008);
        this.player.setTint(0xff5555);

        if (this.playerHealth <= 0) {
            this.endGame();
            return;
        }

        this.time.delayedCall(850, () => {
            this.hitCooldown = false;
            this.player.clearTint();
        });
    }

    dropHeart(x, y) {
        const heart = this.loots.create(x, y, 'heart');
        heart.setDisplaySize(24, 24);
        heart.setDepth(3);
        heart.setBounce(0.25);
    }

    dropGem(x, y, value) {
        const gem = this.gems.create(x, y, 'gem');
        gem.setDisplaySize(22, 22);
        gem.setDepth(3);
        gem.value = value;
        gem.setVelocity(Phaser.Math.Between(-55, 55), Phaser.Math.Between(-55, 55));
        this.tweens.add({
            targets: gem,
            scale: 1.2,
            duration: 420,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    collectHeart(player, heart) {
        heart.destroy();
        this.heartCount++;
        this.playerHealth = Math.min(this.playerMaxHealth, this.playerHealth + 18);
        this.showFloatingText(this.player.x, this.player.y - 72, '+HP', '#80ff9d', 18);
        this.updateHud();
        this.updateHealthBar();
    }

    collectGem(player, gem) {
        const value = gem.value || 10;
        gem.destroy();
        this.gainExperience(value);
    }

    tickWave() {
        if (this.gameEnded) {
            return;
        }

        this.waveTimeLeft--;
        if (this.waveTimeLeft <= 0) {
            this.currentLevel++;
            this.playerHealth = Math.min(this.playerMaxHealth, this.playerHealth + 20);
            this.enemies.clear(true, true);
            this.spawnWave();
        }

        this.updateHud();
    }

    gainExperience(amount) {
        this.playerExperience += amount;
        while (this.playerExperience >= this.experienceToLevelUp) {
            this.playerExperience -= this.experienceToLevelUp;
            this.experienceToLevelUp = Math.floor(this.experienceToLevelUp * 1.28);
            this.pendingUpgrades++;
        }

        if (this.pendingUpgrades > 0 && !this.isChoosingUpgrade) {
            this.showUpgradeChoices();
        }

        this.updateHud();
    }

    showUpgradeChoices() {
        if (this.isChoosingUpgrade || this.gameEnded || this.pendingUpgrades <= 0) {
            return;
        }

        this.isChoosingUpgrade = true;
        this.pendingUpgrades--;
        this.physics.pause();
        this.attackTimer.paused = true;
        this.waveTimer.paused = true;
        this.spawnTimer.paused = true;

        const overlay = this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x05050a, 0.76)
            .setScrollFactor(0)
            .setDepth(250);
        const title = this.add.text(GAME_WIDTH / 2, 190, 'Choose an upgrade', {
            fontFamily: 'Arial',
            fontSize: '38px',
            fill: '#fff4a3',
            stroke: '#000000',
            strokeThickness: 7
        }).setOrigin(0.5).setScrollFactor(0).setDepth(251);

        const options = [
            {
                title: 'Faster Hammer',
                body: 'Auto-attacks happen sooner.',
                apply: () => {
                    this.attackDelay = Math.max(320, this.attackDelay - 80);
                    this.attackTimer.delay = this.attackDelay;
                }
            },
            {
                title: 'Wider Orbit',
                body: 'Your spinning hammer covers more space.',
                apply: () => {
                    this.radius = Math.min(150, this.radius + 18);
                }
            },
            {
                title: 'Sharper Strikes',
                body: 'All hammer damage increases.',
                apply: () => {
                    this.damageBonus += 7;
                }
            },
            {
                title: 'Fleet Boots',
                body: 'Move faster through the horde.',
                apply: () => {
                    this.moveSpeed += 24;
                }
            },
            {
                title: 'Second Wind',
                body: 'Heal now and increase max health.',
                apply: () => {
                    this.playerMaxHealth += 16;
                    this.playerHealth = Math.min(this.playerMaxHealth, this.playerHealth + 46);
                }
            }
        ];

        Phaser.Utils.Array.Shuffle(options).slice(0, 3).forEach((option, index) => {
            this.createUpgradeCard(180 + index * 220, 400, option, [overlay, title]);
        });
    }

    createUpgradeCard(x, y, option, sharedNodes) {
        const card = this.add.container(x, y).setScrollFactor(0).setDepth(252);
        const bg = this.add.rectangle(0, 0, 190, 210, 0x171924, 0.96)
            .setStrokeStyle(3, 0xfff0a6)
            .setInteractive({ useHandCursor: true });
        const title = this.add.text(0, -58, option.title, {
            fontFamily: 'Arial',
            fontSize: '22px',
            fill: '#fff4a3',
            stroke: '#000000',
            strokeThickness: 4,
            align: 'center',
            wordWrap: { width: 160 }
        }).setOrigin(0.5);
        const body = this.add.text(0, 22, option.body, {
            fontFamily: 'Arial',
            fontSize: '17px',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3,
            align: 'center',
            wordWrap: { width: 150 }
        }).setOrigin(0.5);

        card.add([bg, title, body]);
        bg.on('pointerover', () => card.setScale(1.04));
        bg.on('pointerout', () => card.setScale(1));
        bg.on('pointerdown', () => {
            option.apply();
            sharedNodes.forEach((node) => node.destroy());
            card.scene.children.list
                .filter((child) => child.depth === 252)
                .forEach((child) => child.destroy());
            this.isChoosingUpgrade = false;
            this.updateHud();
            this.updateHealthBar();

            if (this.pendingUpgrades > 0) {
                this.showUpgradeChoices();
                return;
            }

            this.physics.resume();
            this.attackTimer.paused = false;
            this.waveTimer.paused = false;
            this.spawnTimer.paused = false;
        });
    }

    updateHud() {
        if (!this.levelText) {
            return;
        }

        this.levelText.setText(`Wave ${this.currentLevel}`);
        this.timeText.setText(this.formatTime(this.waveTimeLeft));
        this.scoreText.setText(`XP ${Math.floor(this.playerExperience)} / ${this.experienceToLevelUp}`);
        this.heartText.setText(`Hearts x${this.heartCount}`);

        this.levelUpBarBackground.clear();
        this.levelUpBarBackground.fillStyle(0x101018, 0.9);
        this.levelUpBarBackground.fillRect(0, GAME_HEIGHT - 18, GAME_WIDTH, 18);

        this.levelUpBarFill.clear();
        this.levelUpBarFill.fillStyle(0x49d17f, 1);
        const progress = Phaser.Math.Clamp(this.playerExperience / this.experienceToLevelUp, 0, 1);
        this.levelUpBarFill.fillRect(0, GAME_HEIGHT - 18, GAME_WIDTH * progress, 18);
    }

    updateHealthBar() {
        if (!this.healthBar || !this.player) {
            return;
        }

        this.healthBarBackground.clear();
        this.healthBarBackground.fillStyle(0x111111, 0.95);
        this.healthBarBackground.fillRoundedRect(this.player.x - 34, this.player.y - 52, 68, 10, 3);

        this.healthBar.clear();
        const percent = Phaser.Math.Clamp(this.playerHealth / this.playerMaxHealth, 0, 1);
        const color = percent > 0.45 ? 0x44e06f : 0xff4d4d;
        this.healthBar.fillStyle(color, 1);
        this.healthBar.fillRoundedRect(this.player.x - 32, this.player.y - 50, 64 * percent, 6, 2);
    }

    showDamage(x, y, amount) {
        this.showFloatingText(x, y, amount.toString(), '#ffffff', 18);
    }

    showFloatingText(x, y, text, color, size) {
        const label = this.add.text(x, y, text, {
            fontFamily: 'Arial',
            fontSize: `${size}px`,
            fill: color,
            stroke: '#000000',
            strokeThickness: 5
        }).setOrigin(0.5).setDepth(120);

        this.tweens.add({
            targets: label,
            y: y - 34,
            alpha: 0,
            duration: 850,
            ease: 'Cubic.easeOut',
            onComplete: () => label.destroy()
        });
    }

    endGame() {
        this.gameEnded = true;
        this.player.setVelocity(0, 0);
        this.enemies.clear(true, true);
        this.hammers.clear(true, true);
        this.loots.clear(true, true);
        this.gems.clear(true, true);

        const overlay = this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.68)
            .setScrollFactor(0)
            .setDepth(200);
        const title = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 82, 'You were overrun', {
            fontFamily: 'Arial',
            fontSize: '44px',
            fill: '#ff4f4f',
            stroke: '#000000',
            strokeThickness: 7
        }).setOrigin(0.5).setScrollFactor(0).setDepth(201);
        const stats = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 24, `Reached Wave ${this.currentLevel}`, {
            fontFamily: 'Arial',
            fontSize: '24px',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 5
        }).setOrigin(0.5).setScrollFactor(0).setDepth(201);
        const restart = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 58, 'Restart', {
            fontFamily: 'Arial',
            fontSize: '30px',
            fill: '#fff4a3',
            stroke: '#000000',
            strokeThickness: 6,
            padding: { x: 22, y: 12 }
        }).setOrigin(0.5).setScrollFactor(0).setDepth(201).setInteractive({ useHandCursor: true });

        restart.on('pointerover', () => restart.setScale(1.05));
        restart.on('pointerout', () => restart.setScale(1));
        restart.on('pointerdown', () => {
            overlay.destroy();
            title.destroy();
            stats.destroy();
            restart.destroy();
            this.scene.restart();
        });
    }

    formatTime(seconds) {
        const safeSeconds = Math.max(0, seconds);
        const minutes = Math.floor(safeSeconds / 60);
        const partInSeconds = safeSeconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(partInSeconds).padStart(2, '0')}`;
    }
}
