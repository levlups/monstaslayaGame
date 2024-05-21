
var backgroundMusic;
var zoomSpeed = 0.00001; // Adjust the zoom speed as needed

export default class NewsScene extends Phaser.Scene {
    constructor() {
        super({ key: 'NewsScene' });
	       

    }


    preload(){
		
		
		this.load.image("newspaper", "assets/newspaper.png");
		  // Load the audio file
    this.load.audio('backgroundMusic', 'assets/sounds/freddysong.mp3');
		 
			 
	}
    create() {
		
		this.continue1=   this.add.text(140, 440, 'MUSIC OFF', {  fill: '#ffffff' })
            .setOrigin(0.5, 0.5).setDepth(2).setStyle({
    fontSize: '32px',
    fontFamily: 'Arial',
    color: '#ffffff',
    align: 'center'
    
}).setInteractive();

this.continue1.on('pointerdown', () => {
				
				this.continue1.setText( 'MUSIC ON')
      //console.log("Button clicked");
	  //this.scene.start('FnofScene');
				 //console.log("lol");
  });

			this.freddy = this.add.sprite(400, 400, 'newspaper');
			this.freddy.displayHeight=500;
				this.freddy.displayWidth=500;
				
				    // Add the audio file to the game
    backgroundMusic = this.sound.add('backgroundMusic');

    // Play the audio file
    backgroundMusic.play();

    // Optionally, you can set loop to true if you want the music to loop
    backgroundMusic.setLoop(true);
			


    }
	
	 

		    
   

	
    
    




	update(time, delta){
   // Gradually increase the scale of the image
    this.freddy.scaleX += zoomSpeed;
    this.freddy.scaleY += zoomSpeed;
			    
    }
	
	



	

}


