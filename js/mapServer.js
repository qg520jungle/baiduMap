$(function(){
  // 百度地图API功能
  var map = new BMap.Map("l-map");          // 创建地图实例
  var point = new BMap.Point(120.219375,30.259244);  // 创建点坐标
  var _city = $('#curCity').text()
  //H {lng: 120.219375, lat: 30.259244}
  map.centerAndZoom(point, 11);                 // 初始化地图，设置中心点坐标和地图级别
  map.enableScrollWheelZoom();
  map.addControl(new BMap.NavigationControl());  //添加默认缩放平移控件
  
  
  function showOneAddr(output){
    var data_info = []
    for(var i=0;i<addrsArr.length;i++){
      var arr = []
      arr.push(addrsArr[i].search)
      arr.push('地址：'+output[i])
      arr.push(addrsArr[i].point)
      data_info.push(arr)
    }
    console.log(data_info)
    
      console.log(data_info.length)
    for(var i=0;i<addrsArr.length;i++){
      // 创建地址解析器实例
     // var myGeo = new BMap.Geocoder();
      var _point = {}
      // 将地址解析结果显示在地图上,并调整地图视野
     // myGeo.getPoint(data_info[i][0], function(point){
        //if (point) {
          _point =point
          var marker = new BMap.Marker(new BMap.Point(addrsArr[i].point[0],addrsArr[i].point[1]));  // 创建标注
          var content = output[i];
          map.addOverlay(marker);               // 将标注添加到地图中
          addClickHandler(content,marker);
      //  }else{
     //     alert("您选择地址没有解析到结果!");
    //    }
     // }, "杭州市");
      
    }
  }
  var flag = false
  //批量地址解析
  function addrChange(){
    var data_info = []
    var myGeo = new BMap.Geocoder();
    var i = 0;
    var time = setInterval(function(){
      if(i < addrsArr.length){
        addrsArr[i].point = getPoint(myGeo,addrsArr[i].search)
        console.log(addrsArr)
        i++
      }else{
        flag = true
      }
    },400);
  }
  function getPoint(myGeo,search){
    var _point = []
    console.log(search)
    myGeo.getPoint(search, function(point){
      console.log(point)
        if (point) {
          _point.push(point.lng)
          _point.push(point.lat)
          
        }else{
          alert("您选择地址没有解析到结果!");
        }
      }, "杭州市");
    return _point
  }
  function addClickHandler(content,marker){
    marker.addEventListener("click",function(e){
      openInfo(content,e)}
    );
  }
  var opts = {
        width : 250,     // 信息窗口宽度
        height: 80,     // 信息窗口高度
        title : "信息窗口" , // 信息窗口标题
        enableMessage:true//设置允许信息窗发送短息
      };
  function openInfo(content,e){
    var p = e.target;
    var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
    var infoWindow = new BMap.InfoWindow(content,opts);  // 创建信息窗口对象 
    map.openInfoWindow(infoWindow,point); //开启信息窗口
  }

/*  addrChange()
  var time2 = setInterval(function(){
      if(flag){
        //获取addrsArr 中地址重复复的是指地址为相加的
        var output = judgeTheSame();
        showOneAddr(output)
        clearInterval(time2)
      }
    },400);*/
  function judgeTheSame(){
    var output = []
    var temp = []
    temp.length = addrsArr.length
    for(var i=0;i<addrsArr.length;i++){
      var str = '<div>公司名称:'+addrsArr[i].show+'</div>'
      temp[i] = str
    }
    for(var i=0;i<addrsArr.length;i++){
      var _point = addrsArr[i].point
      var add = temp[i]
      for(var j=0;j<addrsArr.length;j++){
        if(i!=j&&_point[0] == addrsArr[j].point[0]&&_point[1] == addrsArr[j].point[1]){
          add += temp[j]
        }
      }
      output.push(add)
    }
    return output
  }
})