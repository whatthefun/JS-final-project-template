var isBuild = false;

// 地圖
var bgImg = document.createElement("img");
bgImg.src = "images/map.png";

// 敵人
var enemyImg = document.createElement("img");
enemyImg.src = "images/slime.gif";

// 塔按鈕
var towerBtnImg = document.createElement("img");
towerBtnImg.src = "images/tower-btn.png";

// 塔
var towerImg = document.createElement("img");
towerImg.src = "images/tower.png"

var canvas = document.getElementById('game-canvas');
var ctx = canvas.getContext("2d");

// 敵人物件
var enemy = {
	x:32,
	y:480-32
};

// 滑鼠物件
var cursor = {
	x:640 - 32,
	y:480 - 32
}

// 塔物件
var tower = {
	x:640,
	y:480
}

function draw() {
	ctx.drawImage(bgImg, 0, 0);
	ctx.drawImage(enemyImg, enemy.x, enemy.y);
	ctx.drawImage(towerBtnImg, 640-64, 480-64, 64, 64);
	ctx.drawImage(towerImg, tower.x, tower.y);
	
	if (isBuild) {
		ctx.drawImage(towerImg, cursor.x - 16, cursor.y - 16);
	}
}

// draw();
setInterval(draw, 16);

$("#game-canvas").on("mousemove", function(event){
	
	cursor.x = event.offsetX;
	cursor.y = event.offsetY;
	
})

$("#game-canvas").on("click", function(){
	if (cursor.x > (640-64) && cursor.y > (480-64)) {
		isBuild = true;

		cursor.x = 640 - 32;
		cursor.y = 480 - 32;

		
	}else{
		if (isBuild) {
			tower.x = cursor.x - cursor.x%32;
			tower.y = cursor.y - cursor.y%32;
		}
		isBuild = false;
	}
	
})