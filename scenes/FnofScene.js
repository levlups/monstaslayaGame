export default class Fnofcene extends Phaser.Scene {
    constructor() {
        super({ key: 'FnofScene' });
	         this.camMove = { amplitude: 100, frequency: 0.005, time: 0 };
    }


    preload(){
		this.load.image("pepe", "assets/menu.png");
		this.load.image("flash", "assets/flashlight.png");
		  //  this.load.image('scare', 'assets/scare.gif');
			 this.load.spritesheet('scare', 'assets/scare.png', { frameWidth: 500, frameHeight: 500 });
			  this.load.spritesheet('screen', 'assets/screen.png', { frameWidth: 500, frameHeight: 500 });
		this.load.spritesheet("buttons", "UIpack_vector.svg",{ frameWidth: 230, frameHeight: 65 });
	}
    create() {

	     // Trigger the flickering effect
       // this.flickerCamera(5000, 0.5, 1, 50); // Flicker for 5 seconds
   this.anims.create({
                key: 'playGif',
                frames: this.anims.generateFrameNumbers('scare', { start: 0, end: 12 }),
                frameRate: 20,
                repeat: false
            });
			
			
			this.anims.create({
                key: 'playScreen',
                frames: this.anims.generateFrameNumbers('screen', { start: 0, end: 4 }),
                frameRate: 10,
                repeat: -1
            });


		//this.load.image("pepe", "pepe.png");
		//this.add.sprite(0, 0, 'pepe');
		const poster=this.add.sprite(400,400,"pepe").setOrigin(0.5)
		
		this.flashy=this.add.sprite(400,400,"flash").setOrigin(0.5)
		
		this.time.delayedCall(5000, function() {
                 var gif = this.add.sprite(400, 300, 'scare');
                gif.play('playGif');
            }, [], this);
			
			this.time.delayedCall(7000, function() {
                 var scr = this.add.sprite(400, 300, 'screen');
                scr.play('playScreen');
            }, [], this);
		
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
	  this.scene.start('FnofStart');
				 console.log("lol");
  });


	     //this.cameras.main.setBounds(0, 0, 800, 600);
       // this.cameras.main.setScroll(400, 300);

	     this.cameras.main.setBounds(0, 0, 1920, 1080);
        this.cameras.main.setScroll(960, 540);
			
	
   // Schedule the camera flickering every 5 seconds
        this.time.addEvent({
            delay: 10000,
            callback: () => {
                this.flickerCamera(5000, 0.5, 1, 50);
                this.time.delayedCall(2000, () => {
                    this.cameras.main.alpha = 1;
                });
            },
            loop: true
        });


    }

		     /* flickerCamera(minAlpha, maxAlpha, rate) {
        this.cameras.main.alpha = Phaser.Math.Between(minAlpha * 100, maxAlpha * 100) / 100;
    }*/

   

	     flickerCamera(duration, minAlpha, maxAlpha, rate) {
        let elapsed = 0;
        const interval = 100; // Time in ms between flickers
        let flickering = this.time.addEvent({
            delay: rate,
            callback: () => {
                this.cameras.main.alpha = Phaser.Math.Between(minAlpha * 100, maxAlpha * 100) / 100;
                elapsed += rate;
                if (elapsed >= duration) {
                    flickering.remove();
                    this.cameras.main.alpha = 1; // Reset to normal
                }
            },
            callbackScope: this,
            loop: true
        });
    }
    

	/*flickerCamera(duration, minAlpha, maxAlpha, rate) {
    let elapsed = 0;
    const interval = 100; // Time in ms between flickers
    let flickering = this.time.addEvent({
        delay: rate,
        callback: () => {
            this.cameras.main.alpha = Phaser.Math.Between(minAlpha * 100, maxAlpha * 100) / 100;
            elapsed += rate;
            if (elapsed >= duration) {
                flickering.remove();
                this.cameras.main.alpha = 1; // Reset camera alpha to normal after flickering ends
            }
        },
        callbackScope: this,
        loop: true
    });
}*/


	update(time, delta){
	

	 /*  this.camMove.time += delta;
        //let newX = 960 + this.camMove.amplitude * Math.sin(this.camMove.frequency * this.camMove.time);
		 let newX = 200 + this.camMove.amplitude * Math.sin(this.camMove.frequency * this.camMove.time);
        this.cameras.main.setScroll(newX, 0);*/
this.followMouseWithCamera();
			    
    }
	
	  followMouseWithCamera() {
		  
        // Get the mouse pointer position
        const pointer = this.input.activePointer;

        // Calculate the desired camera position
        let targetX = pointer.worldX - this.cameras.main.width / 2;
        let targetY = pointer.worldY - this.cameras.main.height / 2;

        // Clamp the target position to the world bounds
      //  targetX = Phaser.Math.Clamp(targetX, 0, this.cameras.main.worldView.width - this.cameras.main.width);
     //   targetY = Phaser.Math.Clamp(targetY, 0, this.cameras.main.worldView.height - this.cameras.main.height);

        // Smoothly move the camera towards the target position
        this.cameras.main.scrollX = Phaser.Math.Linear(this.cameras.main.scrollX, targetX, 0.1);
        this.cameras.main.scrollY = Phaser.Math.Linear(this.cameras.main.scrollY, targetY, 0.1);
		this.flashy.x=this.cameras.main.scrollX+400;
		this.flashy.y=this.cameras.main.scrollY+400;
    }



	

}


