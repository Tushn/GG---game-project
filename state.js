var State = function(entity, context, name){
	Prototype.call(this, name);
	this.name = name;
	this.entity = entity;
	this.ctx = context;
	
	this.setEntity = function(entity, context){
		this.entity = entity;
		this.ctx = context;
	}
	
	this.enter = function(){}
	this.doing = function(){}
	this.exit = function(){}
}

var Rest = function(entity, context){
	State.call(this, entity, context, "Rest");
	this.idTime = undefined;
	
	this.enter = function(){
		this.entity.codePressed = 0; // olhar para baixo
		this.idTime = this.entity.setNewTime(1.5);
	}
	this.doing = function(){
		if(this.entity.timeUpdate(this.idTime)){
			this.entity.codePressed++;
		}
		this.entity.walking=0;
		
		if(this.entity.codePressed>=4){
			this.entity.changeState(new Wander());
		}
	}
	
	this.exit = function(){
		this.entity.codePressed = 0;
		this.entity.popTime();
	}
}

// Classe
var Wander = function(entity, context){
	State.call(this, entity, context, "Wander"); // herdando de State
	
	this.enter = function(){
		this.entity.fruitCount = 0;
	}
	
	this.doing = function(){
		if(this.entity.timeUpdate(1) && Math.random()>0.5){
			this.entity.codePressed = parseInt(Math.floor(Math.random()*4));
		}
		
		switch(this.entity.codePressed){
			case 0:
				this.entity.y += VELOCITY*0.4;
				break;
			case 1:
				this.entity.x -= VELOCITY*0.4;
				break;
			case 2:
				this.entity.x += VELOCITY*0.4;
				break;
			case 3:
				this.entity.y -= VELOCITY*0.4;
				break;
		}
		
		if(this.entity.x < 0)
			this.entity.x = 0;
		else if(this.x > canvas.width-this.entity.width)
			this.entity.x = canvas.width-this.entity.width;
		if(this.entity.y < 0)
			this.entity.y = 0;
		else if(this.entity.y > canvas.height-this.entity.height)
		////~ else if(this.entity.y > game.map.tileMap[0].length-this.entity.height)
			this.entity.y = canvas.height-this.entity.height;

		this.entity.walking = 1;
		
		if(this.entity.fruitCount>=4){
			this.entity.changeState(new Rest());
		}
	}
	
	this.exit = function(){
		
	}
}

