// HUD element
var HUD_element = function(image, x, y, width, height, divsWidth, divsHeight, context){
	Sprite.call(this, image, x, y, width, height, divsWidth, divsHeight, context);
	Collision.call(this, x, y, width, height);	
}

// This are making
var HUD_Image = function(image, x, y, width, height, divsWidth, divsHeight, context){
	this.initial = new HUD_element(image, x, y, width, height, divsWidth, divsHeight, context);
	this.over = new HUD_element(image, x, y, width, height, divsWidth, divsHeight, context);
	this.current = this.initial;

	// Draw methods
	this.draw = function(){
		// Controle dos slides da animacao
		if(this.current.walking>0 && this.current.slide < this.current.slide_limit-1){
			if(this.current.timeUpdate()){
				this.current.slide=this.current.slide+1;
			}
		}else
			this.current.slide=0;
		
		this.current.context.drawImage(this.current.image, 
		(this.current.image.width/this.current.divsWidth)*this.current.slide, (this.current.image.height/this.current.divsHeight)*this.current.direction, 
		(this.current.image.width/this.current.divsWidth), (this.current.image.height/this.current.divsHeight),
		this.current.x, this.current.y,
		this.current.width, this.current.height);
	}
	
	// this.collisionEntity // method returns true or false
	// verify collisions
	this.collisionEntity = function(){
		// if this obj is than high position and its base is less high than other
		if(this.current.collisionY()<=mouse.clientY-my_sample.offsetTop && 
		this.current.collisionY()+this.current.cheight>=mouse.clientY-my_sample.offsetTop && 
		this.current.collisionX()<=mouse.clientX-my_sample.offsetLeft && 
		this.current.collisionX()+this.current.cwidth>=mouse.clientX-my_sample.offsetLeft ){
			return true;
		}
		return false;
	}
	// for other animations
	this.update = function(){
		if(this.collisionEntity(mouse)){
			this.current = this.over;
			
			if(this.name=="eu" ){ output.innerHTML	= "over";
				
			}
		}else{
			this.current = this.initial;
			if(this.name=="eu" ) output.innerHTML	= "out";
		}
		this.draw();
		
		this.current.context.save();
			this.current.context.globalAlpha = 0.4;
			this.current.context.fillStyle = "#c0d";
			//this.current.collisionDebug(this.current.context);
		this.current.context.restore();
	}
}
/*
var HUD_Form = function(image, x, y, width, height, divsWidth, divsHeight, context){
	Sprite.call(this, image, x, y, width, height, divsWidth, divsHeight, context);
	Collision.call(this, x, y, width, height);
	// Draw methods
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
		this.x, this.y,
		this.width, this.height);
	}
	// for other animations
	this.update = function(){
		this.draw();
	}
}
var HUD_element = function(x,y,width,height){
	Collision.call(this,x,y,width,height);
	this.imgs = []; // array of images
	this.forms = []; // array of forms
	// this.fonts = []; // array
	this.texts = []; // array
	
	this.update = function(){
		// draw in sequence forms, images and for last texts
		for(var i=0;i<this.forms.length;i++)
			this.forms[i].update();
		for(var i=0;i<this.imgs.length;i++)
			this.imgs[i].update();		
		for(var i=0;i<this.texts.length;i++)
			this.texts[i].update();		
	}
	// control collision with mouse (if is needed)
	this.mouseCollision = function(mouseOrX, Y){
		var x,y;
		if(Y==undefined){
			x = mouseOrX.clientX;
			y = mouseOrX.clientY;
		}else{
			x = mouseOrX;
			y = Y;
		}
		if(this.collisionY()<=y && this.collisionY()+this.cheight>=y && this.collisionX()<=x && this.collisionX()+this.cwidth>=x){
			return true;
		}else{
			return false;
		}
	}
}
*/
// Heads up display
var HUD = function(){
	this.elements = [];
	
	this.addStaticImage = function(image, x, y, width, height, divsWidth, divsHeight, context){
		this.elements.push(new HUD_Image(image, x, y, width, height, divsWidth, divsHeight, context));
	}
	// context.font = "italic bold 30px serif";
	this.update = function(){
		for(var i=0;i<this.elements.length;i++){
			this.elements[i].update();
		}
	}
	
}
