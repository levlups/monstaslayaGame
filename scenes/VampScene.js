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
        this.load.spritesheet('skeletonMob', 'assets/skeleton_sheet.png', { frameWidth: 112, frameHeight: 200 });
        this.load.spritesheet('creeperMob', 'assets/creeper_sheet.png', { frameWidth: 112, frameHeight: 200 });
        this.load.image('hammer', 'assets/hammer.png');
        this.load.image('sword', 'assets/sword.png');
        this.load.image('whip', 'assets/whip.png');
        this.load.image('heart', 'assets/heart.png');
        this.load.image('gem', 'assets/coinGold.png');
        this.load.spritesheet('chest', 'assets/chest_sheet.png', { frameWidth: 16, frameHeight: 16 });
        this.load.image('redParticle', 'assets/heart.png');
        this.load.image('powerFurnaceCart', 'assets/powerups/furnace_minecart.png');
        this.load.image('powerGhastEgg', 'assets/powerups/ghast_spawn_egg.png');
        this.load.image('powerGhastTear', 'assets/powerups/ghast_tear.png');
        this.load.image('powerFoxEgg', 'assets/powerups/fox_spawn_egg.png');
        this.load.image('powerFrogEgg', 'assets/powerups/frog_spawn_egg.png');
        this.load.image('powerFriendSherd', 'assets/powerups/friend_pottery_sherd.png');
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
        this.invulnerable = false;
        this.damageBonus = 0;
        this.attackDelay = 720;
        this.moveSpeed = PLAYER_SPEED;
        this.lootMagnetRadius = 150;
        this.gemMagnetRadius = 190;
        this.angle = 0;
        this.radius = 82;
        this.orbitSpeed = 0.055;
        this.extraOrbiters = [];
        this.activePowerupIcons = [];
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
        this.powerups = this.physics.add.group();
        this.chests = this.physics.add.group();
        this.projectiles = this.physics.add.group();

        this.physics.add.overlap(this.player, this.enemies, this.handlePlayerHit, null, this);
        this.physics.add.overlap(this.hammers, this.enemies, this.handleHammerHit, null, this);
        this.physics.add.overlap(this.orbitHammer, this.enemies, this.handleOrbitHit, null, this);
        this.physics.add.overlap(this.projectiles, this.enemies, this.handleHammerHit, null, this);
        this.physics.add.overlap(this.player, this.loots, this.collectHeart, null, this);
        this.physics.add.overlap(this.player, this.gems, this.collectGem, null, this);
        this.physics.add.overlap(this.player, this.powerups, this.collectPowerup, null, this);
        this.physics.add.overlap(this.player, this.chests, this.openChest, null, this);
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

        this.anims.create({
            key: 'skeletonWalk',
            frames: this.anims.generateFrameNumbers('skeletonMob', { start: 0, end: 5 }),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'creeperWalk',
            frames: this.anims.generateFrameNumbers('creeperMob', { start: 0, end: 5 }),
            frameRate: 9,
            repeat: -1
        });

        this.anims.create({
            key: 'chestIdle',
            frames: this.anims.generateFrameNumbers('chest', { start: 0, end: 3 }),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'chestOpen',
            frames: this.anims.generateFrameNumbers('chest', { start: 4, end: 7 }),
            frameRate: 10,
            repeat: 0
        });
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
        this.activePowerupContainer = this.add.container(GAME_WIDTH / 2, 34).setScrollFactor(0).setDepth(130);

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

        this.powerupTimer = this.time.addEvent({
            delay: 15000,
            callback: this.spawnPowerup,
            callbackScope: this,
            loop: true
        });

        this.time.delayedCall(2500, this.spawnPowerup, [], this);
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

        this.extraOrbiters.forEach((orbiter, index) => {
            if (!orbiter.active) {
                return;
            }

            const offset = this.angle + ((index + 1) * Math.PI * 0.66);
            orbiter.x = this.player.x + (this.radius + 34) * Math.cos(offset);
            orbiter.y = this.player.y + (this.radius + 34) * Math.sin(offset);
            orbiter.rotation -= 0.19;
        });
    }

    updateLootMagnet() {
        this.pullCollectibles(this.loots, this.lootMagnetRadius, 245);
        this.pullCollectibles(this.gems, this.gemMagnetRadius, 285);
        this.pullCollectibles(this.powerups, this.gemMagnetRadius + 30, 260);
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

        const hammer = this.hammers.create(this.player.x, this.player.y, 'sword');
        hammer.setDisplaySize(32, 32);
        hammer.setDepth(6);
        hammer.createdAt = this.time.now;
        hammer.rotation = Phaser.Math.Angle.Between(this.player.x, this.player.y, closestEnemy.x, closestEnemy.y) + Math.PI / 4;
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
            const skeletonChance = this.currentLevel >= 2 ? Math.min(0.14 + this.currentLevel * 0.03, 0.34) : 0;
            const creeperChance = this.currentLevel >= 3 ? Math.min(0.10 + this.currentLevel * 0.025, 0.28) : 0;
            const roll = Math.random();
            const isCreeper = roll < creeperChance;
            const isSkeleton = !isCreeper && roll < creeperChance + skeletonChance;
            const texture = isCreeper ? 'creeperMob' : (isSkeleton ? 'skeletonMob' : 'enemy');
            const enemy = this.enemies.create(spawn.x, spawn.y, texture);
            enemy.setDepth(4);
            enemy.setCollideWorldBounds(true);

            if (isCreeper) {
                enemy.mobType = 'creeper';
                enemy.setDisplaySize(48, 78);
                enemy.body.setSize(44, 150).setOffset(34, 42);
                enemy.health = 24 + this.currentLevel * 8;
                enemy.speed = ENEMY_BASE_SPEED + 34 + this.currentLevel * 8;
                enemy.xp = 22 + this.currentLevel * 5;
                enemy.exploding = false;
                enemy.anims.play('creeperWalk', true);
            } else if (isSkeleton) {
                enemy.mobType = 'skeleton';
                enemy.setDisplaySize(54, 76);
                enemy.body.setSize(58, 150).setOffset(27, 42);
                enemy.health = 44 + this.currentLevel * 15;
                enemy.speed = ENEMY_BASE_SPEED + this.currentLevel * 4;
                enemy.xp = 28 + this.currentLevel * 6;
                enemy.anims.play('skeletonWalk', true);
            } else {
                enemy.mobType = 'ghoul';
                enemy.setDisplaySize(42, 42);
                enemy.body.setSize(22, 24).setOffset(5, 5);
                enemy.health = 16 + this.currentLevel * 8 + type * 4;
                enemy.speed = ENEMY_BASE_SPEED + this.currentLevel * 6 + type * 8;
                enemy.xp = 12 + this.currentLevel * 3 + type * 3;
                enemy.anims.play(`enemyWalk${type}`, true);
            }

            enemy.maxHealth = enemy.health;
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

    explodeCreeper(enemy) {
        if (!enemy.active || enemy.exploding) {
            return;
        }

        enemy.exploding = true;
        enemy.setVelocity(0, 0);
        enemy.setTint(0xd8ff62);
        this.cameras.main.shake(140, 0.006);

        const x = enemy.x;
        const y = enemy.y;
        const blast = this.add.circle(x, y, 24, 0x9cff5f, 0.45).setDepth(7);
        this.tweens.add({
            targets: blast,
            radius: 86,
            alpha: 0,
            duration: 260,
            ease: 'Cubic.easeOut',
            onComplete: () => blast.destroy()
        });

        const distance = Phaser.Math.Distance.Between(x, y, this.player.x, this.player.y);
        if (distance < 86 && !this.invulnerable) {
            this.playerHealth = Math.max(0, this.playerHealth - 28);
            this.updateHealthBar();
            this.player.setTint(0xff5555);
            this.time.delayedCall(220, () => this.player.clearTint());
            if (this.playerHealth <= 0) {
                this.endGame();
            }
        }

        enemy.destroy();
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
        const mobType = enemy.mobType;
        enemy.destroy();
        this.hitEmitter.explode(10, x, y);
        this.dropGem(x, y, xp);

        if (mobType === 'skeleton') {
            this.spawnChest(x, y);
        } else if (Math.random() < 0.18) {
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
        if (this.hitCooldown || this.invulnerable || this.gameEnded) {
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


    spawnChest(x, y) {
        if (this.gameEnded || !this.chests || x === undefined || y === undefined) {
            return;
        }

        const chestX = Phaser.Math.Clamp(x, 80, WORLD_WIDTH - 80);
        const chestY = Phaser.Math.Clamp(y, 80, WORLD_HEIGHT - 80);
        const chest = this.chests.create(chestX, chestY, 'chest');
        chest.setDisplaySize(42, 42);
        chest.setDepth(3);
        chest.body.setSize(28, 24).setOffset(2, 5);
        chest.opening = false;
        chest.anims.play('chestIdle', true);

        this.tweens.add({
            targets: chest,
            y: chestY - 5,
            duration: 850,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        this.showFloatingText(chestX, chestY - 42, 'Chest!', '#fff4a3', 18);
    }

    openChest(player, chest) {
        if (!chest.active || chest.opening) {
            return;
        }

        chest.opening = true;
        chest.body.enable = false;
        chest.setVelocity(0, 0);
        this.tweens.killTweensOf(chest);
        chest.anims.play('chestOpen', true);
        this.cameras.main.shake(160, 0.004);
        this.showFloatingText(chest.x, chest.y - 50, 'Treasure!', '#fff4a3', 22);

        const sparkleColor = 0xfff4a3;
        for (let i = 0; i < 12; i++) {
            const angle = (Math.PI * 2 * i) / 12;
            const sparkle = this.add.circle(chest.x, chest.y, 4, sparkleColor, 0.95).setDepth(8);
            this.tweens.add({
                targets: sparkle,
                x: chest.x + Math.cos(angle) * Phaser.Math.Between(32, 74),
                y: chest.y + Math.sin(angle) * Phaser.Math.Between(24, 58),
                alpha: 0,
                scale: 0.2,
                duration: 520,
                ease: 'Cubic.easeOut',
                onComplete: () => sparkle.destroy()
            });
        }

        this.time.delayedCall(320, () => {
            this.dropPowerup(chest.x, chest.y - 18);
            this.dropGem(chest.x - 20, chest.y + 12, 35 + this.currentLevel * 7);
            this.dropGem(chest.x + 20, chest.y + 12, 35 + this.currentLevel * 7);
        });

        this.time.delayedCall(900, () => chest.destroy());
    }
    getPowerupTypes() {
        return [
            { key: 'powerFurnaceCart', label: 'Furnace Rush', tint: '#ff9f43' },
            { key: 'powerGhastEgg', label: 'Ghast Burst', tint: '#f2f2f2' },
            { key: 'powerGhastTear', label: 'Ghast Shield', tint: '#9bf4ff' },
            { key: 'powerFoxEgg', label: 'Fox Fury', tint: '#ff7a2f' },
            { key: 'powerFrogEgg', label: 'Frog Magnet', tint: '#78ff7a' },
            { key: 'powerFriendSherd', label: 'Friend Orbit', tint: '#d98d64' }
        ];
    }

    spawnPowerup() {
        if (this.gameEnded || this.isChoosingUpgrade) {
            return;
        }

        const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
        const distance = Phaser.Math.Between(180, 420);
        const x = Phaser.Math.Clamp(this.player.x + Math.cos(angle) * distance, 80, WORLD_WIDTH - 80);
        const y = Phaser.Math.Clamp(this.player.y + Math.sin(angle) * distance, 80, WORLD_HEIGHT - 80);
        this.dropPowerup(x, y);
    }

    dropPowerup(x, y) {
        const type = Phaser.Utils.Array.GetRandom(this.getPowerupTypes());
        const powerup = this.powerups.create(x, y, type.key);
        powerup.powerupKey = type.key;
        powerup.powerupLabel = type.label;
        powerup.powerupTint = type.tint;
        powerup.setDisplaySize(30, 30);
        powerup.setDepth(4);
        powerup.setVelocity(Phaser.Math.Between(-35, 35), Phaser.Math.Between(-35, 35));

        this.tweens.add({
            targets: powerup,
            y: y - 8,
            duration: 600,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    collectPowerup(player, powerup) {
        const key = powerup.powerupKey;
        const label = powerup.powerupLabel;
        const tint = powerup.powerupTint;
        powerup.destroy();
        this.showFloatingText(this.player.x, this.player.y - 94, label, tint, 22);
        this.applyPowerup(key, label, tint);
    }

    applyPowerup(key, label, tint) {
        if (key === 'powerFurnaceCart') {
            this.showActivePowerupIcon(key, label, tint, 8000);
            this.temporaryStat('moveSpeed', 110, 8000);
            this.player.setTint(0xff9f43);
            this.time.delayedCall(8000, () => this.player.clearTint());
            return;
        }

        if (key === 'powerGhastEgg') {
            this.showActivePowerupIcon(key, label, tint, 1800);
            this.shootRadialHammers(12);
            return;
        }

        if (key === 'powerGhastTear') {
            this.showActivePowerupIcon(key, label, tint, 5500);
            this.invulnerable = true;
            this.playerHealth = Math.min(this.playerMaxHealth, this.playerHealth + 35);
            this.updateHealthBar();
            this.player.setTint(0x9bf4ff);
            this.time.delayedCall(5500, () => {
                this.invulnerable = false;
                this.player.clearTint();
            });
            return;
        }

        if (key === 'powerFoxEgg') {
            this.showActivePowerupIcon(key, label, tint, 9000);
            this.temporaryStat('damageBonus', 18, 9000);
            this.attackTimer.delay = Math.max(260, this.attackTimer.delay - 180);
            this.time.delayedCall(9000, () => {
                this.attackTimer.delay = this.attackDelay;
            });
            return;
        }

        if (key === 'powerFrogEgg') {
            this.showActivePowerupIcon(key, label, tint, 9000);
            this.temporaryStat('gemMagnetRadius', 360, 9000);
            this.temporaryStat('lootMagnetRadius', 260, 9000);
            return;
        }

        if (key === 'powerFriendSherd') {
            this.showActivePowerupIcon(key, label, tint, 12000);
            this.addFriendOrbiter();
        }
    }

    showActivePowerupIcon(key, label, tint, duration) {
        if (!this.activePowerupContainer) {
            return;
        }

        const slot = this.add.container(0, 0);
        const bg = this.add.rectangle(0, 0, 42, 42, 0x101018, 0.86)
            .setStrokeStyle(2, Phaser.Display.Color.HexStringToColor(tint).color);
        const icon = this.add.image(0, -2, key).setDisplaySize(28, 28);
        const barBack = this.add.rectangle(0, 24, 34, 5, 0x05050a, 0.9);
        const barFill = this.add.rectangle(-17, 24, 34, 5, Phaser.Display.Color.HexStringToColor(tint).color, 1)
            .setOrigin(0, 0.5);

        slot.add([bg, icon, barBack, barFill]);
        slot.powerupLabel = label;
        this.activePowerupContainer.add(slot);
        this.activePowerupIcons.push(slot);
        this.layoutActivePowerupIcons();

        this.tweens.add({
            targets: barFill,
            scaleX: 0,
            duration,
            ease: 'Linear'
        });

        this.time.delayedCall(duration, () => {
            this.activePowerupIcons = this.activePowerupIcons.filter((item) => item !== slot);
            slot.destroy();
            this.layoutActivePowerupIcons();
        });
    }

    layoutActivePowerupIcons() {
        const spacing = 50;
        const startX = -((this.activePowerupIcons.length - 1) * spacing) / 2;
        this.activePowerupIcons.forEach((slot, index) => {
            slot.setPosition(startX + index * spacing, 0);
        });
    }
    temporaryStat(statName, boostAmount, duration) {
        this[statName] += boostAmount;
        this.time.delayedCall(duration, () => {
            this[statName] -= boostAmount;
        });
    }

    shootRadialHammers(amount) {
        for (let i = 0; i < amount; i++) {
            const angle = (Math.PI * 2 * i) / amount;
            const hammer = this.hammers.create(this.player.x, this.player.y, 'hammer');
            hammer.setDisplaySize(32, 32);
            hammer.setDepth(6);
            hammer.createdAt = this.time.now;
            hammer.setVelocity(Math.cos(angle) * HAMMER_SPEED, Math.sin(angle) * HAMMER_SPEED);
        }
    }

    addFriendOrbiter() {
        const orbiter = this.physics.add.sprite(this.player.x, this.player.y, 'powerFriendSherd');
        orbiter.setDisplaySize(34, 34);
        orbiter.setDepth(6);
        this.extraOrbiters.push(orbiter);
        this.physics.add.overlap(orbiter, this.enemies, this.handleOrbitHit, null, this);

        this.time.delayedCall(12000, () => {
            this.extraOrbiters = this.extraOrbiters.filter((item) => item !== orbiter);
            orbiter.destroy();
        });
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
        this.powerupTimer.paused = true;
        if (this.chestTimer) this.chestTimer.paused = true;

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
                icon: 'hammer',
                body: 'Auto-attacks happen sooner.',
                apply: () => {
                    this.attackDelay = Math.max(320, this.attackDelay - 80);
                    this.attackTimer.delay = this.attackDelay;
                }
            },
            {
                title: 'Wider Orbit',
                icon: 'circle',
                body: 'Your spinning hammer covers more space.',
                apply: () => {
                    this.radius = Math.min(150, this.radius + 18);
                }
            },
            {
                title: 'Sharper Strikes',
                icon: 'sword',
                body: 'All hammer damage increases.',
                apply: () => {
                    this.damageBonus += 7;
                }
            },
            {
                title: 'Fleet Boots',
                icon: 'powerFurnaceCart',
                body: 'Move faster through the horde.',
                apply: () => {
                    this.moveSpeed += 24;
                }
            },
            {
                title: 'Second Wind',
                icon: 'heart',
                body: 'Heal now and increase max health.',
                apply: () => {
                    this.playerMaxHealth += 16;
                    this.playerHealth = Math.min(this.playerMaxHealth, this.playerHealth + 46);
                }
            }
        ];

        this.activeUpgradeCards = [];
        this.activeUpgradeKeyCleanups = [];
        Phaser.Utils.Array.Shuffle(options).slice(0, 3).forEach((option, index) => {
            const card = this.createUpgradeCard(180 + index * 220, 400, option, [overlay, title], index + 1);
            this.activeUpgradeCards.push(card);
        });
    }

    createUpgradeCard(x, y, option, sharedNodes, slotNumber) {
        const card = this.add.container(x, y).setScrollFactor(0).setDepth(252);
        const bg = this.add.rectangle(0, 0, 190, 210, 0x171924, 0.96)
            .setStrokeStyle(3, 0xfff0a6);
        const icon = this.add.image(0, -66, option.icon).setDisplaySize(42, 42);
        const title = this.add.text(0, -22, option.title, {
            fontFamily: 'Arial',
            fontSize: '22px',
            fill: '#fff4a3',
            stroke: '#000000',
            strokeThickness: 4,
            align: 'center',
            wordWrap: { width: 160 }
        }).setOrigin(0.5);
        const body = this.add.text(0, 42, option.body, {
            fontFamily: 'Arial',
            fontSize: '17px',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3,
            align: 'center',
            wordWrap: { width: 150 }
        }).setOrigin(0.5);
        const shortcut = this.add.text(0, 82, `Press ${slotNumber}`, {
            fontFamily: 'Arial',
            fontSize: '15px',
            fill: '#fff4a3',
            stroke: '#000000',
            strokeThickness: 3,
            align: 'center'
        }).setOrigin(0.5);

        card.add([bg, icon, title, body, shortcut]);
        card.setSize(190, 210);
        card.setInteractive(new Phaser.Geom.Rectangle(-95, -105, 190, 210), Phaser.Geom.Rectangle.Contains);

        const choose = () => this.chooseUpgrade(option, sharedNodes);
        const hitZone = this.add.zone(x, y, 210, 230)
            .setScrollFactor(0)
            .setDepth(253)
            .setInteractive({ useHandCursor: true });
        card.hitZone = hitZone;
        card.on('pointerover', () => card.setScale(1.04));
        card.on('pointerout', () => card.setScale(1));
        card.on('pointerdown', choose);
        bg.setInteractive(new Phaser.Geom.Rectangle(-95, -105, 190, 210), Phaser.Geom.Rectangle.Contains);
        bg.on('pointerdown', choose);
        hitZone.on('pointerover', () => card.setScale(1.04));
        hitZone.on('pointerout', () => card.setScale(1));
        hitZone.on('pointerdown', choose);
        const shortcutKeys = [
            Phaser.Input.Keyboard.KeyCodes.ONE,
            Phaser.Input.Keyboard.KeyCodes.TWO,
            Phaser.Input.Keyboard.KeyCodes.THREE
        ];
        const shortcutKey = this.input.keyboard.addKey(shortcutKeys[slotNumber - 1]);
        shortcutKey.once('down', choose);
        this.activeUpgradeKeyCleanups.push(() => shortcutKey.off('down', choose));
        return card;
    }

    chooseUpgrade(option, sharedNodes) {
        if (!this.isChoosingUpgrade) {
            return;
        }

        this.activeUpgradeKeyCleanups.forEach((cleanup) => cleanup());
        this.activeUpgradeKeyCleanups = [];
        option.apply();
        sharedNodes.forEach((node) => node.destroy());
        this.activeUpgradeCards.forEach((card) => {
            if (card.hitZone) {
                card.hitZone.destroy();
            }
            card.destroy();
        });
        this.activeUpgradeCards = [];
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
        this.powerupTimer.paused = false;
        if (this.chestTimer) this.chestTimer.paused = false;
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
        this.powerups.clear(true, true);
        this.chests.clear(true, true);
        this.extraOrbiters.forEach((orbiter) => orbiter.destroy());
        this.extraOrbiters = [];
        this.activePowerupIcons.forEach((slot) => slot.destroy());
        this.activePowerupIcons = [];
        this.layoutActivePowerupIcons();

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

























