export default class EmptyScene extends Phaser.Scene {
    constructor() {
        super({ key: 'EmptyScene' });
    }


    preload(){
		this.load.image("pepe", "assets/pepe.png");
	}
    create() {
		//this.load.image("pepe", "pepe.png");
		//this.add.sprite(0, 0, 'pepe');
		const poster=this.add.sprite(200,300,"pepe");
		poster.displayHeight = 600;
   // poster.displayWidth = 800;
        this.add.text(400, 300, 'This is an empty scene.', { font: '24px Arial', fill: '#ffff00' })
            .setOrigin(0.5, 0.5).setDepth(2);
			
			
			 this.time.delayedCall(5000, () => {
            this.scene.start('MainScene');
        });
    }
}
