game = new Game(context);
game.map = new Map("level1.png", "level1.png", map, map2, context, game.camera);
player = new Character("rabbit.png",100,10,32*1.5,32*1.5,4,4,context,"player");
player.points = 0;
for(var i=0;i<35;i++)
	game.map.addEntity(new Item("cereza.png",(Math.randi(19)+1)*TILE_WIDTH,((Math.randi(19)+1)*TILE_HEIGHT),147/8,237/8,1,1,context));
game.map.addPlayer(player);
game.map.addEntity(new NPC("rabbit_yellow.png",100,210,32*1.5,32*1.5,4,4,context,"enemy"));
game.map.addEntity(new NPC("rabbit_dark.png",100,410,32*1.5,32*1.5,4,4,context,"enemy"));
game.map.addEntity(new NPC("rabbit_green.png",400,210,32*1.5,32*1.5,4,4,context,"enemy"));
game.map.addEntity(new NPC("rabbit_red.png",500,410,32*1.5,32*1.5,4,4,context,"enemy"));


function update(){
	game.update();
}

// update
var interval = setInterval(update, 35);

// Controles
function control_keydown(event){
	player.walking = 1;
	switch(event.keyCode){
		case LEFT:
			player.x -= VELOCITY;
			keypressed = 1;
			break;
		case RIGHT:
			player.x += VELOCITY;
			keypressed = 2;
			break;
		case UP:
			player.y -= VELOCITY;
			keypressed = 3;
			break;
		case DOWN:
			player.y += VELOCITY;
			keypressed = 0;
			break;
		case ENTER:
			if(gameStatus != GAME_PAUSE)
				gameStatus = GAME_PAUSE;
			else
				gameStatus = GAME_RUNNING;
			
			break;
	}
	player.codePressed[keypressed] = 1;
}
function control_keyup(event){
	player.walking -= 1;
	var keyout=4;
	switch(event.keyCode){
		case LEFT:
			player.x -= VELOCITY;
			keyout = 1;
			break;
		case RIGHT:
			player.x += VELOCITY;
			keyout = 2;
			break;
		case UP:
			player.y -= VELOCITY;
			keyout = 3;
			break;
		case DOWN:
			player.y += VELOCITY;
			keyout = 0;
			break;
	}
	if(keyout < 4)
		player.codePressed[keyout] = 0;
	keyout=4;
}
// event listeners
document.addEventListener("keydown", control_keydown, false);
document.addEventListener("keyup", control_keyup, false);