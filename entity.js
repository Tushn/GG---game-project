// Entidade para personagens e afins
var Entity = function(image, x, y, width, height, divsWidth, divsHeight, context, name){
	Sprite.call(this, image, x, y, width, height, divsWidth, divsHeight, context);
	Collision.call(this, 0, height/2, width, height/2);
	this.name=name;
	this.entities = [];
	this.camera;
	this.map; // define position
	
	this.verifyCollision = function(){
		for(var i=0;i<this.entities.length;i++)
			this.collisionEntity(this.entities[i]);
	}
	this.update = function(){
		this.verifyCollision();
	}
	this.collision_event = function(entity){}
}

var Character = function(image, x, y, width, height, divsWidth, divsHeight, context, name){
	Entity.call(this, image, x, y, width, height, divsWidth, divsHeight, context, name);

	// controle de tempo e atualizacao do frame
	var _timeWorldO = Date.now(); // tempo global
	var _timeUpdate = TIME_UPDATE; // atualizacao do frame
	this.codePressed = [0, 0, 0, 0];
	this.direction = 0;

	// desenho e controle da animacao
	this.draw = function(camera){
		// Controle dos slides da animacao
		if(this.walking>0 && this.slide < this.slide_limit-1){
			if(this.timeUpdate()){
				this.slide=this.slide+1;
			}
		}else
			this.slide=0;
		
		for(var i=0;i<4;i++) 
			if(this.codePressed[i]==1){
				this.direction = i;
				break;
			}
			
		
		if(this.x < 0)
			this.x = 0;
		else if(this.x > canvas.width-this.width)
			this.x = canvas.width-this.width;
		if(this.y < 0)
			this.y = 0;
		else if(this.y > canvas.height-this.height)
			this.y = canvas.height-this.height;
	
		this.context.drawImage(this.image, 
		(this.image.width/this.divsWidth)*this.slide, (this.image.height/this.divsHeight)*this.direction,
		(this.image.width/this.divsWidth), (this.image.height/this.divsHeight),
		this.x-this.camera.x, this.y-this.camera.y,
		this.width, this.height);
	}
	// for other animations
	this.update = function(){
		this.draw();
	}
}

var NPC = function(image, x, y, width, height, divsWidth, divsHeight, context, name){
	Entity.call(this, image, x, y, width, height, divsWidth, divsHeight, context, name);
	this.context = context;
	// controle de tempo e atualizacao do frame
	var _timeWorldO = [Date.now(), Date.now()]; // tempo global
	var _timeUpdate = [TIME_UPDATE*2.5, TIME_UPDATE*1.5]; // atualizacao do frame
	this.codePressed = 0;
	
	this.timeUpdate = function(id){
		if(_timeWorldO[id]+_timeUpdate[id]<Date.now()){
			_timeWorldO[id]=Date.now();  // quando atualizar execute acao
			return true;
		}
		return false;
	}

	// desenho e controle da animacao
	this.draw = function(){
		// Controle dos slides da animacao
		if(this.walking>0 && this.slide < this.slide_limit-1){
			if(this.timeUpdate(0)){
				this.slide=this.slide+1;
			}
		}else
			this.slide=0;
		
		this.direction = this.codePressed;
		
		this.context.drawImage(this.image, 
		(this.image.width/this.divsWidth)*this.slide, (this.image.height/this.divsHeight)*this.direction,
		(this.image.width/this.divsWidth), (this.image.height/this.divsHeight),
		this.x-this.camera.x, this.y-this.camera.y,
		this.width, this.height);
	}
	// Wander
	this.wander = function(){
		if(this.timeUpdate(1) && Math.random()>0.5){
			//this.stop_walk(this.code);
			this.codePressed = parseInt(Math.floor(Math.random()*4));
		}	
		//this.walk(this.code);
	}
	this.move = function(){
		this.wander();
		switch(this.codePressed){
			case 0:
				this.y += VELOCITY*0.4;
				break;
			case 1:
				this.x -= VELOCITY*0.4;
				break;
			case 2:
				this.x += VELOCITY*0.4;
				break;
			case 3:
				this.y -= VELOCITY*0.4;
				break;
		}
		
		if(this.x < 0)
			this.x = 0;
		else if(this.x > canvas.width-this.width)
			this.x = canvas.width-this.width;
		if(this.y < 0)
			this.y = 0;
		else if(this.y > canvas.height-this.height)
			this.y = canvas.height-this.height;
		this.walking = 1;
	}
	this.update = function(){
		this.move();
		this.draw();
	}
}

var Item = function(image, x, y, width, height, divsWidth, divsHeight, context, name){
	Entity.call(this,image, x, y, width, height, divsWidth, divsHeight, context, name);
	this.name=name;
	this.context = context;
	this.direction = 0; // 0-down, 1-left, 2-up, 3-right
	this.slide = 0;
	this.slide_limit=4; // padrao
	this.walking = 0;

	// escrita do metodo de load da imagem
	this.image.onload = function(){
		Image.spritesLoadedCount++;
		if(Image.spritesToLoad<=Image.spritesLoadedCount){
			gameStatus = GAME_INITING;
		}else
			gameStatus = GAME_LOADING;
	}
	// funcao que controla a atulizacao de frames, ela retorna true a cada atualizacao
	this.timeUpdate = function(){
		if(_timeWorldO+_timeUpdate<Date.now()){
			_timeWorldO=Date.now();  // quando atualizar execute acao
			return true;
		}
		return false;
	}
	// desenho e controle da animacao
	this.draw = function(){
		// Controle dos slides da animacao
		if(this.walking>0 && this.slide < this.slide_limit-1){
			if(this.timeUpdate()){
				this.slide=this.slide+1;
			}
		}else
			this.slide=0;
		
		this.context.drawImage(this.image, 
		(this.image.width/this.divsWidth)*this.slide, (this.image.height/this.divsHeight)*this.direction, 
		(this.image.width/this.divsWidth), (this.image.height/this.divsHeight),
		this.x-this.camera.x, this.y-this.camera.y,
		this.width, this.height);
	}
	// for other animations
	this.update = function(){
		this.verifyCollision();
		this.draw();
	}
	this.collision_event = function(entity){
		if(entity.name=="player"){
			for(var i=0;i<this.map.entities.length;i++)
				if(this.map.entities[i]==this)
					this.map.entities.splice(i,1);
			player.points++;	
		}else if(entity.name=="enemy"){
			for(var i=0;i<this.map.entities.length;i++)
				if(this.map.entities[i]==this)
					this.map.entities.splice(i,1);
			enemies.points++;
		}
	}
}
