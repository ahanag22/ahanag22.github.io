var AM = new AssetManager();
var dir = true;


function Animation(spritesheets, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
    this.spritesheets = spritesheets;
    this.spritesheet = spritesheets[0];
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.sheetWidth = sheetWidth;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.scale = scale;
}

Animation.prototype.change = function(spritesheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
    this.spritesheet = spritesheet;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.sheetWidth = sheetWidth;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.scale = scale;

}

Animation.prototype.drawFrame = function (tick, ctx, x, y) {
    
    this.elapsedTime += tick;
    if (this.isDone()) {
        if (this.loop) this.elapsedTime = 0;
    }
    var frame = this.currentFrame();
    var xindex = 0;
    var yindex = 0;
    xindex = frame % this.sheetWidth;
    yindex = Math.floor(frame / this.sheetWidth);

    ctx.drawImage(this.spritesheet,
                 xindex * this.frameWidth, yindex * this.frameHeight,  // source from sheet
                 this.frameWidth, this.frameHeight,
                 x, y,
                 this.frameWidth * this.scale,
                 this.frameHeight * this.scale);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

// no inheritance
function Background(game, spritesheets) {
    this.spritesheet = spritesheets[0];
    this.x = 0;
    this.y = 0;
    this.game = game;
    this.ctx = game.ctx;
};

Background.prototype.draw = function () {
    this.ctx.drawImage(this.spritesheet, this.x, this.y);
};

Background.prototype.update = function () {
};




function Princess(game, spritesheets) {
    this.animation = new Animation(spritesheets, 198, 301, 10, 0.2, 10, true, .5);
	this.jumpAnimation = new Animation(spritesheets, 198, 301, 10, 0.2, 10, true, .5);
    this.x = 0;
    this.y = 300;
    this.speed = 125;
    this.game = game;
    this.ctx = game.ctx;
    this.dir = true;
    this.walking = false;
    this.jump = false;
	this.ground = 300;
}

Princess.prototype.draw = function () {
    if (this.game.jumping) {
        this.jumpAnimation.drawFrame(this.game.clockTick, this.ctx, this.x + 17, this.y - 34);
  
    }else {
        this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    }
}


Princess.prototype.update = function () {
    if (this.x <= 0) {
		dir = false;

	}
	if (this.x >= 700 ) {
	    dir = true;
	   
	}
	if(dir){
	    this.x -= this.game.clockTick * this.speed;
		
	}
	if(!dir){
	    this.x += this.game.clockTick * this.speed;
		
	}
	
    if (this.game.jumping) {
        
            var jumpDistance = this.jumpAnimation.elapsedTime / this.jumpAnimation.totalTime;
            var totalHeight = 200;

        if (jumpDistance > 0.5)
            jumpDistance = 1 - jumpDistance;

        //var height = jumpDistance * 2 * totalHeight;
            var height = totalHeight*(-4 * (jumpDistance * jumpDistance - jumpDistance));
            this.y = this.ground - height;
        
        }
		if (this.y < 300) {
        this.y += 5; // After jump it drops.
    }
  
}



AM.queueDownload("./Background.jpg");
AM.queueDownload("./Princess.png");

AM.downloadAll(function () {
    console.log("hello");
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.start();

    backgroundSprites = [AM.getAsset("./Background.jpg")];
    princessSprites = [AM.getAsset("./Princess.png")];
   

    gameEngine.addEntity(new Background(gameEngine, backgroundSprites));
    
    gameEngine.addEntity(new Princess(gameEngine, princessSprites));

   

    console.log("All Done!");
});

