/**地图类 物体位置放置 游戏状态管理 碰撞管理*/

//图片资源
const resImgs=Object.freeze({
    floor: './image/floor.gif',//空地0
    wall: './image/wall.png',//墙1
    ball: './image/ball.png', //目标2
    box: './image/box.png', //箱子3
    down: './image/down.png',//4人 下
    left: './image/left.png',//左
    right: './image/right.png',//右
    up: './image/up.png',//上,
    overlap:'./image/overlap.png'//重叠

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
        this.level = $('level').value;//当前关卡 默认1
        this.stepLeft=parseInt($('step').innerText);//剩余步数
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
        this.curMan = images.down;//人当前朝向
        this.peopleset = {
            x: 0,
            y: 0
        }
        this.stepLeft=diffstep[parseInt($('diff').value)];
        $('step').innerHTML=diffstep[parseInt($('diff').value)];//重置步数
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
                }else if(this.grids[i][j]==5){
                    ctx.drawImage(images.overlap, gridWidth*j, gridHeight*i, gridWidth, gridHeight);
                }
                
            }
        }
    }
    //行走检测
    checkUnmovable(pre1, pre2){
        //撞墙
        if(this.grids[pre1.y][pre1.x] == 1) {
            return false;
        }
        //碰到箱子
        if(this.grids[pre1.y][pre1.x] == 3) {
            //箱子前面是箱子或者墙
            if(this.grids[pre2.y][pre2.x] == 3 || this.grids[pre2.y][pre2.x] == 1) {
                return false;
            }else if(this.grids[pre2.y][pre2.x] == 2){
                //箱子前面是目标
                this.grids[pre2.y][pre2.x] = 5;
            }else{
                //前面为空 把箱子移动
                this.grids[pre2.y][pre2.x] = 3;
            }
        }
        //无碰到
        this.grids[pre1.y][pre1.x] = 4;
        //从levels获取之前位置
        var cur = levels[this.level-1][this.peopleset.y][this.peopleset.x];
        //不是目标则变为空地
        if (cur != 2) {
            cur=0
        }
        //更新
        this.grids[this.peopleset.y][this.peopleset.x] = cur;
        console.log(this.grids);
        
        //可以移动返回true
        return true;
    }
    //判断胜利
    isWin(){
        for(var i = 0; i < this.grids.length; i++) {
            for(var j = 0; j < this.grids[i].length; j++) {
                //与原地图比较 看目标位置是否为箱子
                if(this.grids[i][j] != 3 && levels[this.level-1][i][j] == 2) {
                    return false;
                }
            }
        }        
        return true;
    }
    //切换关卡
    changelevel(){
        $('level').value++;
        this.level++;
        this.resetMap(this.level-1);
    }
    stepout(){
        //步数用完救输了
        if(this.stepLeft == 0) {
            return true;
        }
        else {
            return false;
        }
    }
    //移动
    //上下关
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
            this.stepLeft--;            
            $('step').innerHTML=this.stepLeft;
            this.drawMap();
        }
        if(this.isWin()) {
            //保证在移动后弹出提示框
            setTimeout(() => {
                var message=confirm("成功，是否继续下一关");
                if(message==true){
                    this.changelevel();
                }
            }, 0);
        }
        if(this.stepout()){
            var message=confirm("步数用尽挑战失败，是否重新挑战");
            if(message==true){
                this.resetMap(this.level);
            }
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
        $('step').innerHTML=diffstep[parseInt($('diff').value)];
        Sokoban.level=$('level').value;
        Sokoban.resetMap(Sokoban.level-1);
    };
    //上一关
    pre.onclick=function(){
        if(Sokoban.level==1){
            alert("没有上一关")
        }else{
            $('level').value--;
            Sokoban.level--;
        }
        Sokoban.resetMap(Sokoban.level-1);
    }
    //下一关
    next.onclick=function(){
        $('level').value++;
        Sokoban.level++;
        Sokoban.resetMap(Sokoban.level-1);
    }
    //重置
    reset.onclick=function(){
        Sokoban.resetMap(Sokoban.level-1);
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
