// This are making
// Heads up display
var HUD = function(image, x, y, width, height, divsWidth, divsHeight, context, camera){
	Sprite.call(this, image, x, y, width, height, divsWidth, divsHeight, context);
		
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
