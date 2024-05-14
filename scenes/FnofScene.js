export default class Fnofcene extends Phaser.Scene {
    constructor() {
        super({ key: 'FnofScene' });
	         this.camMove = { amplitude: 100, frequency: 0.005, time: 0 };
    }


    preload(){
		this.load.image("pepe", "assets/menu.png");
		this.load.spritesheet("buttons", "UIpack_vector.svg",{ frameWidth: 230, frameHeight: 65 });
	}
    create() {

	     // Trigger the flickering effect
       // this.flickerCamera(5000, 0.5, 1, 50); // Flicker for 5 seconds


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
	

	   this.camMove.time += delta;
        //let newX = 960 + this.camMove.amplitude * Math.sin(this.camMove.frequency * this.camMove.time);
		 let newX = 200 + this.camMove.amplitude * Math.sin(this.camMove.frequency * this.camMove.time);
        this.cameras.main.setScroll(newX, 0);

			    
    }



	

}


