// Architurecture is a package for design pattern classes and other abstract classes or interfaces
/*
 *  Observer - Design Pattern
 * 	Subject, Observer
 */
var Subject = function(){
	this.observers = new Array();
	
	this.getObserver = function(name){
		for(var i in this.observers) 
			if(this.observers[i].getName() == name) 
				return this.observers[i];
		return function(){ this.update = function (){} };
	}
	this.addObserver = function(observer){
		this.observers.push(observer);
	}
	this.notifyAll = function(){
		throw new Error("Implement interface method");
	}
}

var Observer = function(subject, func, name){
	var _subject = subject; // private
	var _name = name;
	
	this.getName = function(){ return _name; }
	this.getSubject = function(){
		return _subject;
	}
	this.run = function(){ throw new Error("Implement interface method"); }
	this.update = (func==undefined)? function(){ /*throw new Error("Implement interface method");*/ } : func;
}

/*
 *  Eventos
 */ 
//var OnClickMouseOut = function(){};
var OnMouseEnter = function(subject, func){
	Observer.call(this, subject, func, "mouseenter");

	this.run = function(){		
		if(this.getSubject().over==false){
			console.log("mouseenter");
			this.getSubject().over = true;
			this.update();
		}
	}
}
var OnMouseOut = function(subject, func){
	Observer.call(this, subject, func, "mouseout");
	
	//this.getSubject().observers.push( new OnMouseEnter(this, function(){}) );
	this.run = function(){
		if(this.getSubject().over){
			console.log("mouseout");
			this.getSubject().over = false;
			this.update();
		}
	}
}
var OnClick = function(subject, func){
	Observer.call(this, subject, func, "click");
	this.clicked = false;
	this.run = function(){
		//this.getSubject().over = true;
		if(this.getSubject().over && this.clicked){
			this.clicked = false;
			this.update();	
		}
	}
}
