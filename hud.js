// HUD - "Heads Up Display" is a controller for interface like buttons and legends
// HUD state is unique state, it has sprite animation and collision
// HUD_state belongs to HUD_element

// HUD_element has many HUD states
var HUD_element = function(image, x, y, width, height, divsWidth, divsHeight, context, verify){
	this.clicked = function(){} // abstract method for event click, [DEPRECTATED]
}

// Heads up display
var HUD = function(image, x, y, width, height, divsWidth, divsHeight, context, verify){
	Sprite.call(this, image, x, y, width, height, divsWidth, divsHeight, context);
	Collision.call(this, 0, 0, width, height);	
	Subject.call(this);
	this.text = new Font("Arial", 0, 0, 12, context);
	this.status;
	
	this.addElement = function(image, x, y, width, height, divsWidth, divsHeight, context){
		this.elements.push(new HUD_element(image, x, y, width, height, divsWidth, divsHeight, context));
	}
	this.draw = function(){
		// Controle dos slides da animacao
		if(this.walking>0 && this.slide < this.slide_limit-1)
			if(this.timeUpdate())
				this.slide++;
		else
			this.slide=0;
		
		this.context.drawImage(this.image, 
		(this.image.width/this.divsWidth)*this.slide, (this.image.height/this.divsHeight)*this.direction, 
		(this.image.width/this.divsWidth), (this.image.height/this.divsHeight),
		this.x, this.y,
		this.width, this.height);
		this.text.draw();
	}
	
	this.collisionEntity = function(){
		// if this obj is than high position and its base is less high than other
		if(this.collisionY()<=mouse.layerY-my_sample.offsetTop && 
		this.collisionY()+this.cheight>=mouse.layerY-my_sample.offsetTop && 
		this.collisionX()<=mouse.layerX-my_sample.offsetLeft && 
		this.collisionX()+this.cwidth>=mouse.layerX-my_sample.offsetLeft ){
			return true;
		}
		return false;
	}	
	this.update = function(){
		if(this.collisionEntity()){
			element_over=this;
			for(var i in this.observers)
				if(this.observers[i].getName()!="mouseout")
					this.observers[i].run();
		}else{
			try{
				this.getObserver("mouseout").run();
			}catch(e){
			}
		}
		
		this.draw();
	}
	this.notifyAll = function(){
		for(var i in this.observers) this.observers[i].update();
	}
}
