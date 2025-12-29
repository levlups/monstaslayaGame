/**
 * Author: Michael Hadley, mikewesthad.com
 * Asset Credits:
 *  - Tuxemon, https://github.com/Tuxemon/Tuxemon
 */



import EmptyScene from './scenes/EmptyScene.js';
import VampScene from './scenes/VampScene.js';
import MenuScene from './scenes/MenuScene.js';
import FnofScene from './scenes/FnofScene.js';
import FnofStart from './scenes/FnofStart.js';
import NewsScene from './scenes/NewsScene.js';
import DungeonScene from './scenes/DungeonScene.js';


let controls;
var player;
var cursors;
var camera;
var mainscene;
var lol;
var coins;
var coin;

class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'EmptyScene' });
    }

 preload() {
	
  this.load.image("tiles", "tuxmon32.png");
  this.load.tilemapTiledJSON("map", "tuxemon-town.json");
    this.load.atlas('player', 'assets/player.png', 'assets/player.json');
	
	 this.load.image('coin', "assets/coinGold.png");
	 
	 // Load sound
    this.load.audio('coinSound', 'assets/sounds/ventin.mp3');
}


 create() {
	 
	 
	   // Timer to switch to the empty scene after 10 seconds
        this.time.delayedCall(10000, () => {
            this.scene.start('VampScene');
        });
	 
	 
	 
  const map = this.make.tilemap({ key: "map" });
  this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  
  
   // Define W, A, S, D keys
  this.WKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
  this.AKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
  this.SKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
  this.DKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
  
  
  
   player = this.physics.add.sprite(723, 314, 'player');
  
  
    // Create a group for coins
  coins = this.physics.add.staticGroup();
 coins.create(600, 400, 'coin').setDepth(2); // First coin
  coins.create(600, 300, 'coin').setDepth(2); // Second coin
  
  
  var projectiles=this.physics.add.group();

  // Setting overlap for all coins in the group
  this.physics.add.overlap(player, coins, function(player, coin) {
      console.log('lol'); // This function is called when the player overlaps with any coin
	  //723, 314
	  player.x=923;
	  player.y=314;
      coin.destroy(); // Destroy the coin on overlap
  }, null, this);
	 
	 
	 
     lol = this.physics.add.sprite(300, 200, 'player');
	lol.setDepth(3);
	lol.displayHeight = 52;
    lol.displayWidth = 52;
	lol.setBounce(0.2);
   // player.setBounce(0.2); // our player will bounce from items
   // player.setCollideWorldBounds(true); // don't go out of the map    
   player.displayHeight = 52;
    player.displayWidth = 52;
 player.setBounce(0.2);
 //player.setCollideWorldBounds(true); // don't go out of the map   
  // Parameters are the name you gave the tileset in Tiled and then the key of the tileset image in
  // Phaser's cache (i.e. the name you used in preload)
  const tileset = map.addTilesetImage("tuxmon-sample-32px-extruded", "tiles");

  // Parameters: layer name (or index) from Tiled, tileset, x, y
  const belowLayer = map.createLayer("Below Player", tileset, 0, 0);
  const worldLayer = map.createLayer("World", tileset, 0, 0);
  const aboveLayer = map.createLayer("Above Player", tileset, 0, 0);
  aboveLayer.setDepth(4)
     worldLayer.setCollisionByExclusion([-1]);
  this.physics.add.collider(player, worldLayer);
  this.physics.add.collider(projectiles, worldLayer);
    player.setDepth(3);



mainscene=this;
  // Phaser supports multiple cameras, but you can access the default camera like this:
   camera = this.cameras.main;

  // Set up the arrows to control the camera
   cursors = this.input.keyboard.createCursorKeys();
  controls = new Phaser.Cameras.Controls.FixedKeyControl({
    camera: camera,
    left: cursors.left,
    right: cursors.right,
    up: cursors.up,
    down: cursors.down,
    speed: 0.1,
  });

  // Constrain the camera so that it isn't allowed to move outside the width/height of tilemap
  camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

  // Help text that has a "fixed" position on the screen
  this.add
    .text(16, 16, "Arrow keys to scroll", {
      font: "18px monospace",
      fill: "#ffffff",
      padding: { x: 20, y: 10 },
      backgroundColor: "#000000",
    })
    .setScrollFactor(0);
	
	// player walk animation
    this.anims.create({
        key: 'walk',
        frames: this.anims.generateFrameNames('player', {prefix: 'p1_walk', start: 1, end: 11, zeroPad: 2}),
        frameRate: 10,
        repeat: -1
    });
	
	 // idle with only one frame, so repeat is not neaded
    this.anims.create({
        key: 'idle',
        frames: [{key: 'player', frame: 'p1_stand'}],
        frameRate: 10,
    });

this.anims.create({
        key: 'idle',
        frames: [{key: 'lol', frame: 'p1_stand'}],
        frameRate: 10,
    });
	
	
		  this.input.on('pointerup', (pointer) => {
	 // coins.create(player.x, player.y, 'coin').setDepth(2);
	// coin = coins.create(player.x, player.y, 'coin').setDepth(2);
     coin =  projectiles.create(player.x, player.y, 'coin');
	//coins.add(coin)
	  const angle = Phaser.Math.Angle.Between(player.x, player.y, pointer.worldX, pointer.worldY);
    const speed = 400;  // Speed of the projectile
    const velocityX = Math.cos(angle) * speed;
    const velocityY = Math.sin(angle) * speed;
    coin.setVelocity(velocityX, velocityY); // Throws the coin to the right and upward
    coin.setGravityY(-500); // Optional: to make the coin fall back down due to gravity
	// Optional: destroy the coin after a certain time or based on a condition
	   this.createSpeechBubble.call(this, lol.x, lol.y - 60, "Stop fool!");
	    this.createSpeechBubble.call(this, player.x, player.y - 60, "Yayyy!");
    this.time.delayedCall(1000, function() {
      coin.destroy();
 });
    
    }, [], this);

	 // Load and configure sound
    var coinSound = this.sound.add('coinSound');
	 // Overlap setup
  this.physics.add.overlap(lol, projectiles, function (lol, coin) {
    coin.destroy(); // Destroy the coin on overlap
    lol.setTint(0xff0000); // Set lol to red tint
    lol.setVelocityY(-200); // Makes lol bounce upward
	console.log('toucher')
	coinSound.play()
    setTimeout(() =>{ 
	lol.clearTint()
	 lol.setVelocityY(0);
	}, 100); // Remove tint after 1 second
  }, null, this);


	
}

 update(time, delta) {
	 
	 
	 lol.anims.play('idle', true);	
	mainscene.scene.scene.cameras.main.centerOn(player.x, player.y);
	if (this.AKey.isDown || cursors.left.isDown)
    {
        player.body.setVelocityX(-200);
        player.anims.play('walk', true); // walk left
        player.flipX = true; // flip the sprite to the left
    }
    else if (this.DKey.isDown || cursors.right.isDown)
    {
        player.body.setVelocityX(200);
        player.anims.play('walk', true);
        player.flipX = false; // use the original sprite looking to the right
    }
   
    else if (this.WKey.isDown || cursors.up.isDown )
    {
        player.body.setVelocityY(-200); 
        player.anims.play('walk', true);		
    }
	else if (this.SKey.isDown || cursors.down.isDown )
    {
        player.body.setVelocityY(200);   
        player.anims.play('walk', true);		
    }
	else{
		player.body.setVelocityY(0);   
player.body.setVelocityX(0);
        player.anims.play('idle', true);		
	}

	 // Handling space bar press to throw a coin
 // if (Phaser.Input.Keyboard.JustDown(this.spaceBar)) {

 // }
  
  //console.log(player.x+" ="+player.y)
  // Apply the controls to the camera each update tick of the game
  //controls.update(delta);
}

 createSpeechBubble(x, y, text) {
    let bubbleWidth = 100;
    let bubbleHeight = 40;
    let bubblePadding = 10;
    let arrowHeight = 10;

    let bubble = this.add.graphics({ x: x, y: y });
    let textObject = this.add.text(0, 0, text, { fontFamily: 'Arial', fontSize: 16, color: '#000000', align: 'center' })
        .setOrigin(0.5, 0.5);

    // Calculate width and height for the text and background
    bubbleWidth = textObject.width + bubblePadding * 2;
    bubbleHeight = textObject.height + bubblePadding * 2;

    // Draw speech bubble
    bubble.fillStyle(0xffffff, 1);
    bubble.fillRoundedRect(-bubbleWidth / 2, -bubbleHeight - arrowHeight, bubbleWidth, bubbleHeight, 16);
    bubble.fillTriangle(
        -arrowHeight, -arrowHeight,
        arrowHeight, -arrowHeight,
        0, 0
    );

    textObject.setPosition(bubble.x, bubble.y - bubbleHeight / 2 - arrowHeight / 2);

    // Remove the speech bubble after a delay
    this.time.delayedCall(2000, () => {
        bubble.destroy();
        textObject.destroy();
    });
}
}

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 800,
  parent: "game-container",
  pixelArt: true,

   dom: {
        createContainer: true
    },
  physics: {
    default: "arcade",
    arcade: {
		debug:false,
      gravity: { y: 0 },
    },
  },
 scene: [DungeonScene,MainScene,FnofStart,MenuScene,VampScene,EmptyScene,FnofScene,NewsScene]
};

const game = new Phaser.Game(config);
