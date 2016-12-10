var fs = require("fs")
//顺序执行
/*var data = fs.readFileSync('input.txt');
console.log(data.toString());*/

var data =''

var newData = '我是新来的'
var writerStream = fs.createWriteStream('./js/source.js');
var xlsx = require("node-xlsx");
var excelName = 'addrs.xlsx'
var list = xlsx.parse('./data/'+excelName)
//从xlsx中获得数据
function getList(list){
	//console.log(list)
	var addrs = list[0].data
	var addrsArr = []
	for(var i=1;i<addrs.length;i++){
		console.log(addrs[i])
		var obj = {}
		obj.no=addrs[i][0];
		obj.show=addrs[i][1];
		obj.search=addrs[i][2];
		obj.point=[];
		addrsArr.push(obj)
	}
	var str = JSON.stringify(addrsArr)
	fs.writeFile('./js/source.js', 'var addrsArr='+str,  function(err) {
	   if (err) {
	       return console.error(err);
	   }
	   console.log("数据写入成功！");
	});
}
//搜索完成，提交数据，再次写入

getList(list)



console.log('end!')