// Map and Tiles
var Tile = function(dy, dx, dims, img, context){
	this.dx = dx;
	this.dy = dy;
	this.sx = dims[0];
	this.sy = dims[1];

	this.img = img;
	this.context = context;
	
	this.draw = function(cx, cy){
		this.context.drawImage(img, this.sx*TILE_WIDTH, this.sy*TILE_WIDTH, TILE_WIDTH, TILE_HEIGHT, this.dx-cx, this.dy-cy, TILE_WIDTH, TILE_HEIGHT);
	}
}

// Map
var Map = function(src1, src2, map1, map2, context, camera){
	this.tileMap = [new Array(),new Array()];
	var img_level_1 = new Image();
	var img_level_2 = new Image();
	this.context = context;
	this.entities = new Array(); // a primeira entidade é o jogador, ou seja, this.entities[0]
	this.camera = camera; if(camera==undefined){ this.camera={}; this.camera.x = 0; this.camera.y = 0; };
	this.player;
	
	img_level_1.src = "img/" + src1; // imagem com url (image) do Character
	img_level_2.src = "img/" + src2; // imagem com url (image) do Character
	
	for(var i=0;i<map1.length;i++){
		this.tileMap[0][i] = new Array();
		this.tileMap[1][i] = new Array();
		for(var j=0;j<map1[i].length;j++){
			this.tileMap[0][i][j] = new Tile(i*TILE_WIDTH, j*TILE_HEIGHT, map1[i][j], img_level_1, this.context);
			this.tileMap[1][i][j] = new Tile(i*TILE_WIDTH, j*TILE_HEIGHT, map2[i][j], img_level_2, this.context);
		}
	}
		
	img_level_1.onload = function(){
		Image.spritesLoadedCount++;
		if(Image.spritesToLoad<=Image.spritesLoadedCount){
			gameStatus = GAME_INITING;
		}else
			gameStatus = GAME_LOADING;
	}

	img_level_2.onload = img_level_1.onload;
	
	
	/**********************************
	*********** METHODS ***************
	**********************************/
	// GETTERS AND SETTERS
	// add new entity in array
	this.addEntity = function(entity){
		this.entities.push(entity);
		entity.map = this;
		entity.camera = this.camera;
	}
	
	// add player in player reference and entity
	this.addPlayer = function(player){
		this.addEntity(player);
		this.player = player;
	}
	
	// set reference of entity each others
	this.setEntitiesRefs = function(){
		for(var i=0;i<this.entities.length;i++)
			for(var j=i+1;j<this.entities.length;j++){
				this.entities[i].entities.push(this.entities[j]);
				this.entities[j].entities.push(this.entities[i]);
			}
	}

	// UPDATE AND DRAWS
	// update camera for player
	this.updateCamera = function(){
		this.camera.x = this.player.x - canvas.width/2;
		this.camera.y = this.player.y - canvas.height/2;
		
		if(this.camera.x<0)
		this.camera.x = 0;

		if(this.camera.y<0)
		this.camera.y = 0;
	
		if(this.camera.x+canvas.width>(this.tileMap[0][0].length-1)*TILE_WIDTH)
			this.camera.x=(this.tileMap[0][0].length)*TILE_WIDTH-canvas.width;
		if(this.camera.y+canvas.height>(this.tileMap[0].length-1)*TILE_HEIGHT)
			this.camera.y=(this.tileMap[0].length)*TILE_HEIGHT-canvas.height;
	}
	
	// draw tiles
	this.draw = function(){
		// draw all tiles
		for(var i=0;i<this.tileMap[0].length;i++){
			for(var j=0;j<this.tileMap[0][i].length;j++){
				this.tileMap[0][i][j].draw(this.camera.x,this.camera.y);
				this.tileMap[1][i][j].draw(this.camera.x,this.camera.y);
			}
		}
	}
	
	// sort entities
	this.sortEntities = function(){
		var temp;
		for(var i=1;i<this.entities.length;i++)
			if(this.entities[i-1].y+this.entities[i-1].height>this.entities[i].y+this.entities[i].height){
				temp = this.entities[i-1];
				this.entities[i-1] = this.entities[i];
				this.entities[i] = temp;
			}
	}

	//  draw tile and camera
	this.update = function(){
		if(gameStatus!=GAME_PAUSE){
			this.draw(this.camera);
			this.updateCamera();
			
			this.sortEntities();
			// update entity
			for(var i=0;i<this.entities.length;i++){
				this.entities[i].update(this.camera); // update
			}
		}
	}
}