export default class Fnofcene extends Phaser.Scene {
    constructor() {
        super({ key: 'Fnof' });
    }


    preload(){
		this.load.image("pepe", "assets/menu.png");
		this.load.spritesheet("buttons", "UIpack_vector.svg",{ frameWidth: 230, frameHeight: 65 });
	}
    create() {
		//this.load.image("pepe", "pepe.png");
		//this.add.sprite(0, 0, 'pepe');
		const poster=this.add.sprite(400,400,"pepe").setOrigin(0.5)
		
		//poster.displayHeight = 600;
   // poster.displayWidth = 800;
     const texto=   this.add.text(400, 400, 'Fnof', {  fill: '#ffffff' })
            .setOrigin(0.5, 0.5).setDepth(2).setStyle({
    fontSize: '32px',
    fontFamily: 'Arial',
    color: '#ffffff',
    align: 'center'
    
});;

texto.setStroke('#000000',5)

 const texto2=   this.add.text(400, 450, 'start', {  fill: '#ffffff' }).setOrigin(0.5, 0.5).setDepth(2).setStyle({
    fontSize: '32px',
    fontFamily: 'Arial',
    color: '#ffffff',
    align: 'center'
    
});;

texto2.setStroke('#000000',5)

        const button2 = this.add.sprite(400, 450, 'buttons', 'button-bg', 128, 110, 64, 64).setInteractive();
			 button2.on('pointerdown', () => {
      //console.log("Button clicked");
	  this.scene.start('Fnof');
  });
			
			
			/* this.time.delayedCall(5000, () => {
            //this.scene.start('MainScene');
        });*/
    }
}


