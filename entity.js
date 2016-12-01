var Prototype = function(className){
	var _class = (className==undefined)? "Object" : className;
	this.clone = function(){
		eval("var clone = new "+_class+"();");
		for (var attr in this) {
			if(typeof(this[attr])!="function" && (typeof(this[attr])!="object" || (attr == "image" || attr=="context" || attr=="camera" )) )
				clone[attr] = this[attr];
			else if(attr=="state")
				eval("clone.setState(new "+this[attr].name+"() )");
		}
		return clone;
	}
}

// Entidade para personagens e afins
var Entity = function(image, x, y, width, height, divsWidth, divsHeight, context, name){
	Sprite.call(this, image, x, y, width, height, divsWidth, divsHeight, context);
	Collision.call(this, 0, height/2, width, height/2);
	this.name=name;
	this.entities = [];
	this.camera;
	//~ this.map; // define position
	
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
	this.timeWorldO = Date.now(); // tempo global
	this.timeUpdateConst = TIME_UPDATE; // atualizacao do frame
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
	Prototype.call(this, "NPC");
	this.context = context;
	this.state;

	// controle de tempo e atualizacao do frame
	this.timeWorldO = [Date.now(), Date.now()]; // tempo global
	this.timeUpdateConst = [TIME_UPDATE*2.5, TIME_UPDATE*1.5]; // atualizacao do frame
	this.codePressed = 0;

	this.setState = function(state, context){
		this.state = state;
		this.state.setEntity(this, context);
	}
	/*
		Time control functions
	*/
	this.setNewTime = function(time){
		this.timeWorldO.push(Date.now());
		this.timeUpdateConst.push(TIME_UPDATE*time);
		return this.timeWorldO.length-1; // retorna o ID do novo cronometro
	}
	this.popTime = function(){
		return this.timeWorldO.pop();
	}
	this.timeUpdate = function(id){
		if(this.timeWorldO[id]+this.timeUpdateConst[id]<Date.now()){
			this.timeWorldO[id]=Date.now();  // quando atualizar execute acao
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
	this.changeState = function(state){
		this.state.exit();
		this.setState(state);		
		this.state.enter();
	}
	this.update = function(){
		//this.verifyCollision();
		this.state.doing();
		// this.move();
		this.draw();
	}
}

var Item = function(image, x, y, width, height, divsWidth, divsHeight, context, name){
	Entity.call(this,image, x, y, width, height, divsWidth, divsHeight, context, name);
	Prototype.call(this, "Item");
	
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
			gameStatus = GAME_INIT;
		}else
			gameStatus = GAME_LOADING;
	}
	// funcao que controla a atulizacao de frames, ela retorna true a cada atualizacao
	this.timeUpdate = function(){
		if(this.timeWorldO+this.timeUpdateConst<Date.now()){
			this.timeWorldO=Date.now();  // quando atualizar execute acao
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
			entity.fruitCount = (entity.fruitCount==undefined)? 1 : entity.fruitCount+1;
		}
	}
}

