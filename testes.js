var Poxa = function(){
	Prototype.call(this, "Poxa");
	this.name = "Okay";
	this.p = 122;
	this.r = 51;
	
	this.getR = function(){ return this.r; }
    this.setR = function(ri){ this.r= ri; }
}

var p1 = new Poxa();
p1.p = 45;
p1.setR(45);
var p2 = p1.clone();
p2.getR()
p2.setR(-999)
p1.getR()