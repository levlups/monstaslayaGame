export default class Fnofcene extends Phaser.Scene {
    constructor() {
        super({ key: 'FnofScene' });
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
	  this.scene.start('FnofScene');
  });
			
			
			/* this.time.delayedCall(5000, () => {
            //this.scene.start('MainScene');
        });*/
     // Define the camera's world bounds
        this.physics.world.setBounds(0, 0, 1920, 1080); // Adjust dimensions to match your game's requirements

        // Optionally set up objects to focus on during the pan
        this.startingPoint = { x: 100, y: 540 }; // Starting focus point of the camera
        this.endingPoint = { x: 1820, y: 540 }; // Ending focus point of the camera

        // Start the camera at a specific point
        this.cameras.main.setScroll(this.startingPoint.x, this.startingPoint.y);

        // Start a camera pan using the pan method after a delay or an event
        this.time.delayedCall(1000, this.startCameraPan, [], this);


	    
    }

	   startCameraPan() {
        // Pan the camera to the ending point over 3000 milliseconds
        this.cameras.main.pan(this.endingPoint.x, this.endingPoint.y, 3000, 'Power2.easeInOut', false, function(camera, progress) {
            if (progress === 1) {
                console.log('Pan complete!'); // Optional: do something when the pan completes
            }
        });
    }

}


