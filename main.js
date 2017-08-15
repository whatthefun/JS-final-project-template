var isBuild = false;
var FPS = 60;
var clock = 0;
var enemies = [];
var towers = [];
var hp = 100;
var money = 50;
var score = 0;

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

// 靶
var crosshairImg = document.createElement("img");
crosshairImg.src = "images/crosshair.png";

var canvas = document.getElementById('game-canvas');
var ctx = canvas.getContext("2d");
ctx.font="24px Arial";
ctx.fillStyle="white";

// 敵人類別
function Enemy(){
	this.x = 96,
	this.y = 480-32,
	this.speedX = 0, 
	this.speedY = -(64/FPS),
	this.pathDes = 0,
	this.hp = 10;
	this.move = function(){
		this.x += this.speedX;
		this.y += this.speedY;
		if (isCollided(enemyPath[this.pathDes].x, enemyPath[this.pathDes].y, this.x, this.y, 64/FPS, 64/FPS)) {
			if(enemyPath.length-1 == this.pathDes){
				this.hp = 0;
				hp -=10;
			}else{
				this.x = enemyPath[this.pathDes].x;
				this.y = enemyPath[this.pathDes].y;

				this.pathDes++;

				if (this.x > enemyPath[this.pathDes].x) {
					this.speedX = -(64/FPS);
				}else if (this.x < enemyPath[this.pathDes].x) {
					this.speedX = 64/FPS;
				}else{
					this.speedX = 0;
				}

				if (this.y > enemyPath[this.pathDes].y) {
				this.speedY = -(64/FPS);
				}else if (this.y < enemyPath[this.pathDes].y) {
					this.speedY = 64/FPS;
				}else{
					this.speedY = 0;
				}
			}
		}
	};
};

// 塔類別
function Tower() {
	this.x = 640,
	this.y = 480,
	this.range = 96,
	this.aimingEnemyId = null,
	this.fireRate = 1,
	this.readyToShootTime = 1,
	this.damage = 5,
	this.searchEnemy = function(){
		this.readyToShootTime -= 1/FPS;
		for(var i = 0; i <enemies.length; i++){
			var distance = Math.sqrt(Math.pow(this.x - enemies[i].x, 2) + Math.pow(this.y - enemies[i].y, 2));
			if (distance <= this.range) {
				this.aimingEnemyId = i;
				if (this.readyToShootTime <= 0) {
					this.shoot(i);
					this.readyToShootTime = this.fireRate;
				}
				return;
			}
		}
		this.aimingEnemyId = null;
	},
	this.shoot = function(id){
		ctx.strokeStyle = "red";
		ctx.lineWidth = 3;

		ctx.beginPath();
		ctx.moveTo(this.x + 16, this.y + 16);
		ctx.lineTo(enemies[id].x + 16, enemies[id].y + 16);
		ctx.stroke();
		enemies[id].hp -= this.damage;
	}
};


// 敵人路徑物件
var enemyPath = [
	{x:96, y:64},
	{x:384, y:64},
	{x:384, y:192},
	{x:224, y:192},
	{x:224, y:320},
	{x:544, y:320},
	{x:544, y:96}
];

// 滑鼠物件
var cursor = {
	x:640 - 32,
	y:480 - 32
};


function draw() {
	score++;
	if (clock%80 == 0) {
		var newEnemy = new Enemy();
		enemies.push(newEnemy);
	}
	ctx.drawImage(bgImg, 0, 0);
	// 紀錄
	ctx.fillText("HP: " + hp, 16, 32);
	ctx.fillText("Score: " + score, 16, 56);
	ctx.fillText("Money: " + money, 16, 80);
	// 敵人
	for (var i = 0; i < enemies.length; i++) {
		if (enemies[i].hp <= 0) {
			enemies.splice(i, 1);
			money += 3;
			score += 50;
		}else{
			enemies[i].move();
			ctx.drawImage(enemyImg, enemies[i].x, enemies[i].y);	
		}
	}
	
	ctx.drawImage(towerBtnImg, 640-64, 480-64, 64, 64);
	// 防禦塔
	for(var i = 0; i < towers.length; i++){
		towers[i].searchEnemy();	
		if (towers[i].aimingEnemyId != null) {
			ctx.drawImage(crosshairImg, enemies[towers[i].aimingEnemyId].x, enemies[towers[i].aimingEnemyId].y);
		}
		ctx.drawImage(towerImg, towers[i].x, towers[i].y);
	}
	
	if (isBuild) {
		ctx.drawImage(towerImg, cursor.x - 16, cursor.y - 16);
	}

	if (hp <= 0) {
		ctx.textAlign = "center";
		ctx.font = "64px Arial";
		ctx.fillText("GAME OVER", 320, 240);
		ctx.font = "48px Arial";
		ctx.fillText("YOU GOT: " + score, 320, 150);
		clearInterval(intervalId);
	}
	clock++;
}

function isCollided ( pointX, pointY, targetX,
	 targetY, targetWidth, targetHeight ) {
	if(     pointX >= targetX
        &&  pointX <= targetX + targetWidth
        &&  pointY >= targetY
        &&  pointY <= targetY + targetHeight
	){
        return true;
	} else {
        return false;
	}
}


// draw();
var intervalId = setInterval(draw, 1000/FPS);

$("#game-canvas").on("mousemove", function(event){
	
	cursor.x = event.offsetX;
	cursor.y = event.offsetY;
	
})

$("#game-canvas").on("click", function(){
	if (cursor.x > (640-64) && cursor.y > (480-64) && money >= 25) {
		isBuild = true;

		// cursor.x = 640 - 32;
		// cursor.y = 480 - 32;
	}else{
		if (isBuild) {
			money -=25;
			var tower = new Tower();
			tower.x = Math.floor(cursor.x/32)*32;
			tower.y = Math.floor(cursor.y/32)*32;
			towers.push(tower);
		}
		isBuild = false;
	}
})