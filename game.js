// POO
// Control state game
// Entity -> Character, items
var Game = function(context){
	this.audios = new Array;
	this.context = context;
	this.map = {};

	// this method is used in loop this game
	this.run = function(){
		// PINTAR FUNDO DE CINZA
		this.context.fillStyle = "#ccc";
		this.context.fillRect(0,0,canvas.width,canvas.height);
		this.map.update();
		
		// DESENHAR PONTUAÇÃO
		this.context.fillStyle = "#000";
		this.context.fillText(("Player: "+player.points+" Outros: "+enemies.points), 10, 40);
	}
	this.update = function(){
		switch(gameStatus){
			case GAME_LOADING: // load
				break;
			case GAME_INITING:
				this.map.setEntitiesRefs();
				gameStatus = GAME_RUNNING;
				break;
			case GAME_RUNNING: // run
				this.run();
				break;
			case GAME_PAUSE: // run
				//this.map.pause();
				break;
		}
	}
}