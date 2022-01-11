/* TODO:
 * Separar origem dos eventos dos itens carregados
 * 
*/
game = new Game(context);
game.screen_init.push(new HUD("backgroundscreen.png",0,0,640,640,1,1,context));
game.screen_init.push(new HUD("title.png",110,130,200,100,1,1,context));
game.screen_init[game.screen_init.length-1].observers.push(new OnMouseEnter(game.screen_init[game.screen_init.length-1], function(){console.log("ok")}));
game.screen_init[game.screen_init.length-1].observers.push(new OnMouseOut(game.screen_init[game.screen_init.length-1], function(){console.log("ok2")}));
game.screen_init[game.screen_init.length-1].observers.push(new OnClick(game.screen_init[game.screen_init.length-1], function(){console.log("Cliquei bixo!"); gameStatus=GAME_INITING; }));
//game.screen_init.elements[game.screen_init.elements.length-1].observers.push(new OnClickMouseClick(game.screen_init.elements[game.screen_init.elements.length-1], function(){console.log("okay")}));
game.screen_init[game.screen_init.length-1].over = new HUD("title.png",10,130,300,100,1,1,context);
/*game.screen_init.elements[game.screen_init.elements.length-1].over.clicked = function(){
	gameStatus = GAME_INITING;
}*/
game.map = new Map("level1.png", "level1.png", map, map2, context, game.camera);

player = new Character("rabbit.png",100,10,32*1.5,32*1.5,4,4,context,"player");
player.points = 0;
game.map.addPlayer(player);
game.map.makeEntity("item","cereza.png",(Math.randi(19)+1)*TILE_WIDTH,((Math.randi(19)+1)*TILE_HEIGHT),147/8,237/8,1,1,context,"fruit");
game.map.addEntity(new NPC("rabbit_dark.png",100,410,32*1.5,32*1.5,4,4,context,"enemy"));
game.map.entities[game.map.entities.length-1].setState(new Wander());
function clonePrototypeFactory(){
	// cerejas
	//~ game.map.reuseRandomPosition(45, 23, 23, 1); // numero de elementos, x, y, id
	game.map.reuseByNameRandomPosition(45, 15, 15, "fruit");
	// coelhos
	game.map.reuseByNameRandomPosition(2, 15, 15, "enemy"); // numero de elementos, x, y, name
}

/*game.map.addEntity(new Item("cereza.png",(Math.randi(19)+1)*TILE_WIDTH,((Math.randi(19)+1)*TILE_HEIGHT),147/8,237/8,1,1,context));
game.map.addEntity(new NPC("rabbit_yellow.png",100,210,32*1.5,32*1.5,4,4,context,"enemy"));
/*for(var i=0;i<35;i++)
	game.map.addEntity(new Item("cereza.png",(Math.randi(19)+1)*TILE_WIDTH,((Math.randi(19)+1)*TILE_HEIGHT),147/8,237/8,1,1,context));

game.map.addEntity(new NPC("rabbit_yellow.png",100,210,32*1.5,32*1.5,4,4,context,"enemy"));
game.map.entities[game.map.entities.length-1].setState(new Wander());
game.map.addEntity(new NPC("rabbit_dark.png",100,410,32*1.5,32*1.5,4,4,context,"enemy"));
game.map.entities[game.map.entities.length-1].setState(new Wander());
game.map.addEntity(new NPC("rabbit_green.png",400,210,32*1.5,32*1.5,4,4,context,"enemy"));
game.map.entities[game.map.entities.length-1].setState(new Wander());
game.map.addEntity(new NPC("rabbit_red.png",500,410,32*1.5,32*1.5,4,4,context,"enemy"));
game.map.entities[game.map.entities.length-1].setState(new Wander());*/

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
			// console.log('Kdown: LEFT')
			break;
		case RIGHT:
			player.x += VELOCITY;
			keypressed = 2;
			// console.log('Kdown: RIGHT')
			break;
		case UP:
			player.y -= VELOCITY;
			keypressed = 3;
			// console.log('Kdown: UP')
			break;
		case DOWN:
			player.y += VELOCITY;
			keypressed = 0;
			// console.log('Kdown: DOWN')
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

function click_out_page(){
	// Avoid error when: "Keyup event not firing when keydown is released after a click outside document"
	// remove a direction
	player.codePressed[0] = 0;
	player.codePressed[1] = 0;
	player.codePressed[2] = 0;
	player.codePressed[3] = 0;
	// remove a walking animation
	player.walking -= 1;
}

// event listeners
document.addEventListener("keydown", control_keydown, false);
document.addEventListener("keyup", control_keyup, false);
window.addEventListener('blur', click_out_page);
