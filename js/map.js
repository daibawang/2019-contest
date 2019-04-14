/**地图类 物体位置放置 游戏状态管理 碰撞管理*/

//图片资源
const resImgs=Object.freeze({
    ball: './image/ball.png', //目标2
    floor: './image/floor.gif',//空地0
    box: './image/box.png', //箱子3
    wall: './image/wall.png',//墙1
    down: './image/down.png',//下
    left: './image/left.png',//左
    right: './image/right.png',//右
    up: './image/up.png',//上
});

//预加载
var images={};
for(var i in resImgs){
    var img=new Image();
    img.src=resImgs[i];
    images[i]=img;
}
//{ball: img, floor: img, box: img, down: img, left: img, …}
class SokobanMap{

    //初始化地图(默认关卡为1)
    constructor(){
        this.level = 0;//当前关卡 默认1
        // this.objects = []; //需要绘制的物体
        // this.goals = []; //终点
        // this.walls = {}; //墙
        this.stepLeft=0;//可动步数
        this.flexbox=0; //可动箱子
        this.grids=[];  //所有格子
        this.curMan = images.down;//人当前朝向
        this.peopleset = {
            x: 0,
            y: 0
        }
    }

    //重置地图
    resetMap(level){
        this.grids=[];  //所有格子
        this.stepLeft=0;
        for(var i=0;i<levels[level].length;i++){
            this.grids.push([]);
            for(var j=0;j<levels[level][i].length;j++){
                this.grids[i].push(levels[level][i][j]);
                if(levels[level][i][j]==3){
                    this.flexbox++;
                }
            }
        }
        this.drawMap();
    }

    //绘制地图
    drawMap(){
        //绘制地图
        for(var i = 0; i < rowCnt; i++) {
            for(var j = 0; j < colCnt; j++) {
                //绘制背景
                ctx.drawImage(images.floor, gridWidth*j, gridHeight*i, gridWidth, gridHeight);
                //绘制其他元素 1 墙 2目标 3箱子
                if(this.grids[i][j]==1){
                    ctx.drawImage(images.wall, gridWidth*j, gridHeight*i, gridWidth, gridHeight);
                }else if(this.grids[i][j]==2){
                    ctx.drawImage(images.ball, gridWidth*j, gridHeight*i, gridWidth, gridHeight);
                }else if(this.grids[i][j]==3){
                    ctx.drawImage(images.box, gridWidth*j, gridHeight*i, gridWidth, gridHeight);
                }else if(this.grids[i][j]==4){
                    this.peopleset.x=j;
                    this.peopleset.y=i;
                    ctx.drawImage(this.curMan, gridWidth*j, gridHeight*i, gridWidth, gridHeight);
                }
            }
        }
    }
    //换关
    goLevel(){
        var nextLevel = $('level').value;
        console.log(nextLevel)
        this.resetMap(nextLevel-1);
    }
    //行走检测
    checkUnmovable(pre1, pre2){
        //出界
            if(pre1.x < 0 || pre1.x > rowCnt-1 || pre1.y < 0 || pre1.y > colCnt-1) {
            return false;
        }
        //撞墙
        if(this.grids[pre1.y][pre1.x] == 1) {
            return false;
        }
        //碰到箱子
        if(this.grids[pre1.y][pre1.x] == 3) {
            //箱子前面是箱子或者墙
            if(this.grids[pre2.y][pre2.x] == 3 || this.grids[pre2.y][pre2.x] == 1) {
                return false;
            }
            //前面为空 把箱子移动
            this.grids[pre2.y][pre2.x] = 3;
        }
        //一般情况
        this.grids[pre1.y][pre1.x] = 4;
        //从levels获取之前位置
        var v = levels[this.level][this.peopleset.y][this.peopleset.x];
        //不是目标则变为空地
        if (v != 2) {
            this.grids[this.peopleset.y][this.peopleset.x] = v;
        }
        //更新
        // this.grids[this.peopleset.y][this.peopleset.x] = v;
        //可以移动返回true
        return true;
    }
    //判断胜利
    isWin(){
        for(var i = 0; i < this.grids.length; i++) {
            for(var j = 0; j < this.grids[i].length; j++) {
                //与原地图比较 看目标位置是否为箱子
                if(this.grids[i][j] != 3 && levels[this.level][i][j] == 2) {
                    return false;
                }
            }
        }
        return true;
    }
    // stepLeft(){
    //     //步数用完救输了
    //     if(this.moveSteps == this.steps[this.difficult]) {
    //         return true;
    //     }
    //     else {
    //         return false;
    //     }
    // }
    //移动
    //上下关
    goxlLevel(n){
        if(n==0&&this.level==0){
            alert("没有上一关");
        }else{
            if(n == 0) {
                this.level--;
                console.log(this.level)
                this.goLevel();
            }
            else {
                this.level++;
                this.goLevel();
            }
        }
    }
    push(dir){
        var pre1 , pre2;
        switch(dir) {
            case 'left':
                this.curMan = images.left;
                pre1 = {x: this.peopleset.x-1, y: this.peopleset.y};
                pre2 = {x: this.peopleset.x-2, y: this.peopleset.y};
                break;
            case 'right':
                this.curMan = images.right;
                pre1 = {x: this.peopleset.x+1, y: this.peopleset.y};
                pre2 = {x: this.peopleset.x+2, y: this.peopleset.y};
                break;
            case 'up':
                this.curMan = images.up;
                pre1 = {x: this.peopleset.x, y: this.peopleset.y-1};
                pre2 = {x: this.peopleset.x, y: this.peopleset.y-2};
                break;
            case 'down':
                this.curMan = images.down;
                pre1 = {x: this.peopleset.x, y: this.peopleset.y+1};
                pre2 = {x: this.peopleset.x, y: this.peopleset.y+2};
                break;
        }
        if(this.checkUnmovable(pre1, pre2)) {
            this.drawMap();
        }

        if(this.isWin()) {
            //保证在移动后弹出提示框
            setTimeout(() => {
                alert('胜利');
                this.goxlLevel(1);
            }, 0);
        }
    }

    

}
window.onload=function(){

    var btn = $('btn');
    var pre=$('pre');
    var next=$('next');
    var reset=$('reset');
    var Sokoban = new SokobanMap();
    Sokoban.resetMap(0);
    Sokoban.drawMap();
    btn.onclick = function() {
        Sokoban.goLevel();
    };
    pre.onclick=function(){
        Sokoban.goxlLevel(0);
    }
    next.onclick=function(){
        Sokoban.goxlLevel(1);
    }
    reset.onclick=function(){
        Sokoban.goLevel();
    }
        //移动事件
        window.onkeydown = function(ev) {
            if(ev.key.toLowerCase() == 'w') {
                Sokoban.push('up');
            }
            else if(ev.key.toLowerCase() == 'd') {
                Sokoban.push('right');
            }
            else if(ev.key.toLowerCase() == 's') {
                Sokoban.push('down');
            }
            else if(ev.key.toLowerCase() == 'a') {
                Sokoban.push('left');
            }
        }
}
