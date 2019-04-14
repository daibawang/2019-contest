/**公共部分*/

function $(str){
    return document.getElementById(str)
}
//初始化关卡选择
var selectid=$('level');
for(var i=0;i<levels.length;i++){
    selectid.options.add(new Option(i,i));
}
// 地图的canvas元素
const mapcvs=$('canvas');

// canvas的2d context
const ctx=mapcvs.getContext('2d');

//行列单元格个数
const colCnt = 16;
const rowCnt = 16;

//一个单元格宽
const gridWidth = 35;
const gridHeight = 35;

//canvas宽高
mapcvs.height = colCnt*gridWidth;
mapcvs.width = rowCnt*gridHeight;









