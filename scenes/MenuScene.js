export default class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    preload() {
        this.load.image('menu', 'assets/menu.png');
    }

    create() {
        this.add.image(400, 400, 'menu').setOrigin(0.5).setDisplaySize(800, 800);
        this.add.rectangle(400, 400, 800, 800, 0x000000, 0.36);

        const title = this.add.text(400, 128, 'MONSTA SLAYA', {
            fontFamily: 'Arial',
            fontSize: '54px',
            fill: '#fff4a3',
            stroke: '#000000',
            strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        this.tweens.add({
            targets: title,
            y: 120,
            duration: 1300,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        this.add.text(400, 194, 'Farmer by day. Monsta slaya by night.', {
            fontFamily: 'Arial',
            fontSize: '24px',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 5,
            align: 'center'
        }).setOrigin(0.5);

        this.createButton(400, 322, 'Start Survival', () => this.scene.start('VampScene'));
        this.createButton(400, 408, 'Night Shift', () => this.scene.start('FnofScene'));

        this.add.text(400, 548, 'Move with WASD or arrows. Click to move. Survive the waves.', {
            fontFamily: 'Arial',
            fontSize: '18px',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4,
            align: 'center',
            wordWrap: { width: 620 }
        }).setOrigin(0.5);
    }

    createButton(x, y, label, callback) {
        const button = this.add.container(x, y);
        const bg = this.add.rectangle(0, 0, 280, 72, 0x211d2a, 0.92)
            .setStrokeStyle(3, 0xfff0a6)
            .setInteractive({ useHandCursor: true })
            .setOrigin(0.5);
        const text = this.add.text(0, -2, label, {
            fontFamily: 'Arial',
            fontSize: '24px',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 5
        }).setOrigin(0.5);

        button.add([bg, text]);
        bg.on('pointerover', () => button.setScale(1.05));
        bg.on('pointerout', () => button.setScale(1));
        bg.on('pointerdown', callback);
        return button;
    }
}
