// Constantes e variaveis globais
var canvas = document.getElementById("my_sample");
var context = canvas.getContext("2d");
context.font = "italic bold 30px serif";
var game = {}; // loaded in 'load.js'
var keypressed;
var gameStatus = 0;
var player, enemies = {}; enemies.points = 0;

// Constantes
// const TIME_UPDATE = 35;
const TIME_UPDATE = 135;
const GAME_RUNNING = 0;
const GAME_LOADING = 1;
const GAME_INITING = 2;
const GAME_INIT = 20;
const GAME_PAUSE = 155;
const VELOCITY = 10;

const TILE_WIDTH = 32;
const TILE_HEIGHT = 32;

// keyboard
const LEFT = 37;
const UP = 38;
const RIGHT = 39;
const DOWN = 40;
const ENTER = 13;

// mouse control
var element_over;

my_sample.onclick = function(){
	game.clicked();
}
// Static variable for load Images
Image.spritesLoadedCount = 0;
Image.spritesToLoad = 0;

// Gera valor inteiro no intervalo I = [0,n]
Math.randi = function(n){
	return Math.round(Math.random()*(n+1));
}

/* -----------------------------------------------
 -------------------- SPRITE ---------------------
 ----------------------------------------------- */
var Sprite = function(image, x, y, width, height, divsWidth, divsHeight, context, camera){
	this.image = new Image();	this.image.src = "img/" + image; // imagem com url (image) do Character
	Image.spritesToLoad++;
	
	this.divsWidth = divsWidth; this.divsHeight = divsHeight;
	this.width = width;	this.height = height; // altura e largura do Character
	this.sw; this.sh;
	this.camera = camera;
	if(this.camera===undefined){
		this.camera = {};
		this.camera.x = 0;
		this.camera.y = 0;
	}
	this.timeWorldO = Date.now(); // tempo global
	this.timeUpdateConst = TIME_UPDATE; // atualizacao do frame
	
	this.x = x;	this.y = y; // posicao x e y do Character no mundo
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
		this.x-this.camera.x, this.y-this.camera.y ,
		this.width, this.height);
	}
	// for other animations
	this.update = function(){
		this.draw();
	}
}

/* -----------------------------------------------
 --------------------- FONT ----------------------
 ----------------------------------------------- */
var Font = function(font, x, y, tam, context){
	this.font = font;
	this.x = x;	 this.y = y;
	this.tam = tam+"px";

	this.context = context;

	this.width = 0;
	this.height = 0;

	this.draw = function(){
		this.context.fillText((this.tam+" "+this.font), this.x, this.y);
	}
 }
/* -----------------------------------------------
 ------------------- COLLISION -------------------
 ----------------------------------------------- */
var Collision = function(x,y,width,height){
	this.cx = x;
	this.cy = y;
	this.cwidth = width;
	this.cheight = height;
	
	// getters
	this.collisionY = function(){	return this.y + this.cy; }
	this.collisionX = function(){ return this.x + this.cx; }
	this.cHeight = function(){ return this.collisionY()+this.cheight; }
	this.cWidth = function(){ return this.collisionX()+this.cwidth; }
	// verify collisions
	this.collisionEntity = function(entity){
		var col_y=false, result = false;
		// if this obj is than high position and its base is less high than other
		if(this.collisionY()<entity.collisionY()){
			if(this.collisionY()+this.cheight>entity.collisionY())
				col_y = true;
		}else{ // if this obj is more high 
			if(this.collisionY()<entity.collisionY()+entity.cheight)
				col_y = true;
		}
		if(col_y){
			if(this.collisionX()<entity.collisionX()){
				if(this.collisionX()+this.cwidth>entity.collisionX())
					result = true;
			}else{
				if(this.collisionX()<entity.collisionX()+entity.cwidth)
					result = true;
			}
		}
		if(result){
			this.collision_event(entity);
			entity.collision_event(this);
			return true;
		}
		return false;
	}
	
	this.collisionDebug = function(context){
		context.fillRect(this.cx, this.cy, this.cwidth, this.cheight);
	}
	// metodo abstrato
	this.collisionEvent = function(entity){
		// implemente-o
	}
}

