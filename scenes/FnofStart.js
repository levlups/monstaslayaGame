
var enterKey;
export default class FnofStart extends Phaser.Scene {
    constructor() {
        super({ key: 'FnofStart' });
	         this.camMove = { amplitude: 100, frequency: 0.005, time: 0 };
			 this.cursors;
			 this.main;

    }


    preload(){
		
		this.load.image("flash", "assets/flashlight.png");
		this.load.image("freddy", "assets/freddy.png");
		 
			 this.load.spritesheet('scare', 'assets/scare.png', { frameWidth: 500, frameHeight: 500 });
			  this.load.spritesheet('screen', 'assets/screen.png', { frameWidth: 500, frameHeight: 500 });
			    this.load.spritesheet('lines', 'assets/lines.png', { frameWidth: 500, frameHeight: 500 });
		this.load.image("button-bg", "assets/button.png");
	}
    create() {

  // Create Enter key input
    enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

    

    // Add event listener for Enter key release
    enterKey.on('up', () => {
       this.scene.start('NewsScene');
    });
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
			this.anims.create({
                key: 'playLines',
                frames: this.anims.generateFrameNumbers('lines', { start: 0, end: 4 }),
                frameRate: 10,
                repeat: -1
            });
this.cursors = this.input.keyboard.createCursorKeys();

		
		
		  this.start=   this.add.text(100, 400,'START', {  fill: '#ffffff' })
            .setOrigin(0.5, 0.5).setDepth(2).setStyle({
    fontSize: '32px',
    fontFamily: 'Arial',
    color: '#ffffff',
    align: 'center'
    
});;

 this.continue1=   this.add.text(140, 440, 'CONTINUE', {  fill: '#ffffff' })
            .setOrigin(0.5, 0.5).setDepth(2).setStyle({
    fontSize: '32px',
    fontFamily: 'Arial',
    color: '#ffffff',
    align: 'center'
    
});;
		
		  this.signo=   this.add.text(40, 360, '>>', {  fill: '#ffffff' })
            .setOrigin(0.5, 0.5).setDepth(2).setStyle({
    fontSize: '32px',
    fontFamily: 'Arial',
    color: '#ffffff',
    align: 'center'
    
});;

 this.signo1=   this.add.text(100, 40, 'Five nights', {  fill: '#ffffff' })
            .setOrigin(0.5, 0.5).setDepth(2).setStyle({
    fontSize: '32px',
    fontFamily: 'Arial',
    color: '#ffffff',
    align: 'center'
    
});;

 this.signo2=   this.add.text(100, 80, 'at Freddys', {  fill: '#ffffff' })
            .setOrigin(0.5, 0.5).setDepth(2).setStyle({
    fontSize: '32px',
    fontFamily: 'Arial',
    color: '#ffffff',
    align: 'center'
    
});;
this.time.delayedCall(1000, function() {
                 var lino = this.add.sprite(400, 300, 'lines');
                lino.play('playLines');
				lino.displayHeight=800;
				  lino.displayWidth=800;
				    lino.setAlpha(0.5);
				//this.signo.y=500
            }, [], this);
		
		this.time.delayedCall(5000, function() {
                 var gif = this.add.sprite(400, 300, 'scare');
                gif.play('playGif');
				this.signo.y=500
            }, [], this);
			var freddy = this.add.sprite(400, 400, 'freddy');
			this.time.delayedCall(7000, function() {
                 var scr = this.add.sprite(400, 400, 'screen');
				 scr.displayHeight=800;
				  scr.displayWidth=800;
				  scr.setAlpha(0.5);
                scr.play('playScreen');
            }, [], this);
			
			
			
			// Add event listener for Enter key press
    enterKey.on('down', function(event) {
        this.scene.start('MainScene');
    });
		
		//poster.displayHeight = 600;
   // poster.displayWidth = 800;
  /*   const texto=   this.add.text(400, 400, 'Fnof', {  fill: '#ffffff' })
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

texto2.setStroke('#000000',5)*/

      /*  const button2 = this.add.image(400, 450,'button-bg').setInteractive();
			 button2.on('pointerdown', () => {
				
				 
      //console.log("Button clicked");
	  this.scene.start('FnofScene');
				 console.log("lol");
  });
 button2.displayHeight=40;
				 button2.displayWidth=200;*/

	
			
	
 


    }
	
	 

		    
   

	
    
    




	update(time, delta){
	  // Check if the down arrow key is being pressed
    if (this.cursors.down.isDown) {
        this.signo.setAlpha(0.5);  // Set the sprite to be 50% transparent when the down arrow is pressed
		this.signo.y=440;
    } 
	if (this.cursors.up.isDown) {
        this.signo.setAlpha(1);  // Set the sprite to be fully opaque when the down arrow is not pressed
		this.signo.y=400;
    }

			    
    }
	
	



	

}


