// Control state game
var Game = function(context){
	this.audios = new Array;
	this.context = context;
	this.map = {};
	this.screen_init = [];// tela inicial
	this.screen_end = [];// tela inicial
	
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
		//~ this.context.save();
			//~ this.context.fillStyle = "#f0f";
			//~ this.context.fillRect(0,0,my_sample.height,my_sample.width)
		//~ this.context.restore();
		
		switch(gameStatus){
			case GAME_LOADING: // load
				break;
			case GAME_INIT:
				// RUN initial screen
				for(var i in this.screen_init) this.screen_init[i].update();
				break;
			case GAME_INITING:
				clonePrototypeFactory();
				gameStatus = GAME_RUNNING;
				this.map.setEntitiesRefs();
				break;
			case GAME_RUNNING: // run
				this.run();
				break;
			case GAME_PAUSE: // run
				//this.map.pause();
				break;
		}
		this.context.fillRect(mouse.layerX-my_sample.offsetLeft, mouse.layerY-my_sample.offsetTop,30, 30);
	}
	this.clicked = function(){
		for(var i in this.screen_init)this.screen_init[i].getObserver("click").clicked = true;
	}
}
