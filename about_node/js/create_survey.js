/*用于生成html 标签专用js*/
//下划线的方法 加载html DOM 驼峰方法 绑定方法
//下面修改 题号  换行时需要修改题号，删除时需要修改题号
(function ($) {
	 $.fn.survey = function (method) {
	      // Method calling and initialization logic
	      if (methods[method]) {
	          return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
	      } else {
	          return methods.init.apply(this, arguments);
	      }
	  };
	 
	var defaultOpt = {
		title: "请输入题目",
		rowNum: 0,
		type: "radio",
		count: 0,
		//头部数组，理应由外部传入
	       headerarr: [
			{
				type:"radio",
				data:"单选"
			},
			{
				type:"checkbox",
				data:"多选"
			},
			{
				type:"filled",
				data:"填空"
			},
			{
				type:"img",
				data:"添加图片"
			},
			{
				type:"info",
				data:"个人信息"
			},
		],
	       btnObj:{
			sw:"编辑",
			del:"删除",
			up:"上移",
			dn:"下移",
			top:"最上",
			bom:"最下"
		},
		data:[]
	}

	var edit = function () {

	};
	var settings;
	var count=1
	var isMove=false;
	var initPosition = {};
	var that//当前引用对象
	var panel
	//以下为可用的方法
	var methods = {
		init: function(options){
			settings = $.extend({}, defaultOpt, options || {});
			that = this
			load_header();//头部DOM
			headerBindingEvent();//头部事件
			load_zone();//加载问题区域
			panel = $('.survey-panel');
			load_tips();//添加问卷说明
		},
		add: function(){
			console.log("这里是其他方法")
		}
	}

	function load_header(){
		var html='';
		html = nav_all(settings.headerarr);
		that.append(html)
	}
	function nav_all(arr){
		var str=''
		str = '<ul class="m-edit-bar f-cb survey-handle-sur-bar">'
		if(arr){
			for(var i=0;i<arr.length;i++){
				str+='<li class="u-edit-item">';
				str+='<a class="survey-handle" sv-type="'+arr[i].type+'">';
				str+=arr[i].data;
				str+='</a>';
				str+='</li>';
			}
		}else{
			str +=''
		}
		str += '</ul>';
		return str
	}
	//头部事件添加，点击得到所需添加的类型
	function headerBindingEvent(){
		$('.survey-handle').on('click',function(){
			var type = $(this).attr('sv-type');
			//console.log(settings)
			settings.rowNum++;
			settings.count++;
			var obj={
				type:type,
				rows: settings.rowNum,
				nums:2,
				btnObj:settings.btnObj,
				height:0,
				id:"sv-id"+(count++)
			}
			//console.log(obj)
			obj = addSubject(obj);
			//console.log(obj)
			settings.data.push(obj)
			//console.log(settings)
		})
	}
	function itemBindingEvent(settings){
		//显示锚点
		$('.survey-items').on('mouseover',function(){
			
			$(this).find('.u-anchor-tips').show()
		}).on('mouseout',function(){
			$(this).find('.u-anchor-tips').hide()
		})
		//绑定锚点
		$('.u-anchor-tips').off('click').on('click',function(){
			if($(this).hasClass('z-act')){
				$(this).removeClass('z-act').html('在此题后插入新题')
			}else{
				$('.u-anchor-tips').each(function(index,el){
					$(el).removeClass('z-act').html('在此题后插入新题')
				})
				$(this).addClass('z-act').html('取消插入点')
			}
		})
		//选中效果
		$('.survey-items').off('mousedown').off('mousemove').off('mouseup').off('mouseover').on('mousedown',function(e){
			isMove = true;
			initPosition = $(this).offset()
		}).on('mousemove',function(e){
			if(isMove){
				var thisoffset = $(this).offset();
				$(this).css('visibility','hidden')
				$(this).addClass('z-hide')
				/*var w = $(this).width();
				var h = $(this).height();*/
				var fadeObj = {
					w:$(this).width(),
					h:$(this).height(),
					x:thisoffset.left,
					y:thisoffset.top,
					id:$(this).attr('sv-id')
				}
				/*var x=e.pageX
				var y=e.pageY
				var x2=e.clientX 
				var y2=e.clientY 
				console.log('pageX'+x)
				console.log('pageY'+y)
				console.log('clientX'+x2)
				console.log('clientY'+y2)*/

				// console.log(obj)
				var _fade = new_fade(fadeObj)
				$(this).after(_fade)
			}
		}).on('mouseup', function(event) {
			event.preventDefault();
			isMove = false;
		}).on('mouseover', function(event) {
			event.preventDefault();
			//console.log('我在上面')
		});;
		$('body').off('mousemove').on('mousemove','.survey-fade',function(e){
			$(this).offset({top:e.pageY-50})
			var nowPosition = $(this).offset()
			//console.log(nowPosition)
			//var thisObj = settings.data
			var _id = $(this).attr('sv-fade-id')
			var thisItem = getObjBySvid(_id)
			var preItem = getPreobjBySvid(_id)
			var nexItem = getNexobjBySvid(_id)
			var up = juageUp(nowPosition);
			//console.log(up)
			if(up){
				var isChange=changeIndex(up,nowPosition,preItem)
				//console.log(isChange)
				if(isChange){
					var $change=_getChange(thisItem,preItem)
					//console.log($change)
					$change.before($('.z-hide'))
					initPosition.top = initPosition.top - preItem.height;

				}
			}else{
				var isChange=changeIndex(up,nowPosition,nexItem)
				//console.log(isChange)
				if(isChange){
					var $change=_getChange(thisItem,nexItem)
					//console.log($change)
					$change.after($('.z-hide'))
					//alert(1)
					initPosition.top = initPosition.top + nexItem.height;
				}
			}
		})
		$('body').off('mouseup').on('mouseup','.survey-fade',function(e){
			// console.log($(this).parent().find('.survey-items').length)
			// console.log($(this).parent().find('.survey-items:hidden').css('visibility'))
			$(this).parent().find('.z-hide').css('visibility','visible').removeClass('z-hide')
			$(this).remove();
			isMove = false;
			//在此更新序号变化 order num
			updataOrderNum(settings);
		})

	}
	//按键绑定事件 item生成后绑定 注意绑定所有的按键
	function btnBindingEvent(){
		$('body').off('click').on('click','.survey-tool-del',function(){
			//获得 当前的sv-id
			var svid = getSvidByjQEle($(this))
			//console.log(svid)
			console.log(settings)
			delObjBySvid(svid)
			console.log(settings)
			var $this = getItemByjQEle($(this))
			$this.remove();
			//在此更新序号变化 order num
			updataOrderNum(settings);
		})
		$('body').off('click').on('click','.survey-tool-up',function(){
		//在此向上一个
		})
		$('body').off('click').on('click','.survey-tool-dn',function(){
		//在此向下一个
		})
		$('body').off('click').on('click','.survey-tool-top',function(){
		//在此最上
		})
		$('body').off('click').on('click','.survey-tool-bom',function(){
		//在此最下
		})
	}
	//传入参数 settings 不对其进行改变
	function updataOrderNum(settings){
		$('.survey-no').each(function(index,el){
			var svid = getSvidByjQEle($(el));
			var thisObj = getObjBySvid(svid);
			$(el).html(thisObj.rows +'.')
		})
	}
	//通过当前的 $元素 获取 sv-id 
	function getSvidByjQEle($el){
		var svid = ''
		//console.log($el.parents('.survey-items'))
		if($el.hasClass('.survey-items')){
			svid = $el.attr('sv-id')
		}else if($el.parents('.survey-items').length == 1){
			svid = $el.parents('.survey-items').attr('sv-id')
		}else{
			console.log('获取svid的方法错误')
		}
		return svid
	}
	//通过当前的 $元素 获取 本item $元素
	function getItemByjQEle($el){
		var $item = ''
		if($el.hasClass('.survey-items')){
			$item = $el
		}else if($el.parents('.survey-items').length ==1){
			$item = $el.parents('.survey-items')
		}else{
			console.log('获取$item的方法错误')
		}
		return $item
	}
	//删除指定sv-id的settings中的obj
	function delObjBySvid(_id){
		var index = -1
		var re = false
		for(var i=0;i<settings.data.length;i++){
			if(settings.data[i].id == _id){
				index = i
			}
		}
		if(index >= 0){
			delTheOthers(index,settings.data[index].rows)
			settings.data.splice(index,1)
			
			re = true
		}else{
			console.log('删除settings中的obj方法错误，无此id的元素')
			re = false
		}
		return re
	}
	//删除后对settings的操作，包括， 修改rowsNum 修改所有超过此rows的选项
	function delTheOthers(index,rows){
		settings.rowNum --
		for(var i=0;i<settings.data.length;i++){
			if(settings.data[i].rows > rows){
				settings.data[i].rows --;
			}
		}
	}
	//通过当前元素sv-id获得对应元素obj
	function getObjBySvid(_id){
		var thisObj = {}
		for(var i=0;i<settings.data.length;i++){
			if(settings.data[i].id == _id){
				thisObj = settings.data[i]
			}
		}
		return	thisObj
	}
	//通过当前元素sv-id获得前一个元素obj
	function getPreobjBySvid(_id){
		var preObj = {}
		var thisObj = {}
		for(var i=0;i<settings.data.length;i++){
			if(settings.data[i].id == _id){
				thisObj = settings.data[i]
			}
		}

		for(var i=0;i<settings.data.length;i++){
			if(settings.data[i].rows == (thisObj.rows - 1)){
				preObj = settings.data[i]
			}
		}

		return	preObj
	}
	//通过当前元素sv-id获得后一个元素obj
	function getNexobjBySvid(_id){
		var nexObj = {}
		var thisObj = {}
		for(var i=0;i<settings.data.length;i++){
			if(settings.data[i].id == _id){
				thisObj = settings.data[i]
			}
		}

		for(var i=0;i<settings.data.length;i++){
			if(settings.data[i].rows == (thisObj.rows + 1)){
				nexObj = settings.data[i]
			}
		}
		return	nexObj
	}
	/*//通过当前元素obj获得rows
	function getOrderByObj(obj){
		return	obj.rows
	}*/
	//判断鼠标上划还是下滑
	function juageUp(nowPosition){
		var isup = nowPosition.top<initPosition.top?true:false
		//console.log('nowPosition'+nowPosition.top)
		//console.log('initPosition'+initPosition.top)
		//console.log(nowPosition.top<initPosition.top)
		return  isup
	}
	//判断 是否换位置?
	function changeIndex(isup,nowPosition,aimItem){
		var isChange = false
		var aimHeight = aimItem.height+37
		//console.log(aimItem.height)
		if(isup){
			nowPosition.top <= (initPosition.top - aimHeight)?isChange = true:''
			
		}else{
			nowPosition.top >= (initPosition.top + aimHeight)?isChange = true:''
		}
		return isChange
	}
	//判断 跟哪一个换位置？
	function _getChange(thisItem,aimItem){
		
		var svid = aimItem.id;
		var temp = thisItem.rows;
		thisItem.rows = aimItem.rows;
		aimItem.rows = temp;
		var $change = $('[sv-id="'+svid+'"]')
		return $change
	}
	//新建 一个虚假层
	function new_fade(fadeObj){
		var _fade = $('<div />').addClass('survey-fade').attr('sv-fade-id',fadeObj.id).css({
			"width":fadeObj.w,
			"height":fadeObj.h+37,
			"background" : "#fda420",
			"position": "absolute",
			"top":fadeObj.y,
			"left":fadeObj.x,
			"opacity": "0.5",
		       "filter": "alpha(opacity=50)",
		       "z-index": "10"
		})
		return _fade
	}
	//通过类型 添加问题
	function addSubject(obj){
		switch(obj.type){
			case "radio":
				obj = add_choice(obj)
				break;
			case "checkbox":
				obj = add_choice(obj)
				break;
			default: 
				console.log("暂无此功能");
				break;
		}
		itemBindingEvent();
		btnBindingEvent();
		return obj
	}
	//添加问题区域
	function load_zone(){
		var html = ' <div class="m-qus-zone survey-zone">'
		html += '<div class="m-preview survey-panel">'
		html += '</div>'
		html +='</div>'
		that.append(html)
	}
	//添加问卷说明
	function load_tips(){
		var html='<div class="m-items" >'
                     html +=  '<div class="m-tips u-input-tips">'
                     html+= '添加问卷说明'
                     html+= '</div>'
                   	html+= ' </div>';
			panel.append(html)
	}
	//获得中文注释
	function getChn(type){
		var changeObj= {
			"radio":"单选",
			"checkbox":"多选",
			"filled":"填空",
			"img":"添加图片",
			"info":"个人信息"
			}
			//console.log(changeObj[type])
			return changeObj[type]+'题'
		}
	//生成题干 需要行号 类型 适用于所有类型
	function new_title(obj){
		var _title = $('<div />').addClass('m-title-qus f-cb')
				var _no = $('<div />').addClass('u-no survey-no f-fl').html(obj.rows+'.')
				var _qus = $('<div />').addClass('u-qus f-fl')
					var _z_qus = $('<span />').addClass('z-qus').html('请在此输入问题标题')
					var _x = $('<span />').addClass('s-red').html('&nbsp;*')
					var _z_type = $('<span />').addClass('z-type').html('&nbsp;['+getChn(obj.type)+']')
		_qus.append(_z_qus).append(_x).append(_z_type)
		_title.append(_no).append(_qus)
		return _title	
	}
	//生成选项 需要所需选项，类型，name 适用于单选多选
	function new_content(obj){
		var _table = $('<div />').addClass('m-table-qus')
				var _content = $('<ul />').addClass('u-content')
				for(var i=1; i<=obj.nums; i++){
					var _li1 = $('<li />')
						var _input1 = $('<input />').addClass('u-input u-input-check').attr('type',obj.type).attr('name',obj.name)
						var _label1 = $('<span />').addClass('u-input-label').html('选项'+i)
						_li1.append(_input1).append(_label1)
						_content.append(_li1)
				}
		_table.append(_content)
		return _table
	}
	
		
	//生成工具栏
	function new_toolBar(obj){
		var _handle = $('<div />').addClass('m-handle f-cb')
			var _l_anchor = $('<div />').addClass('z-anchor f-fl')
				var _tips = $('<p />').addClass('u-anchor-tips').html('在此题后插入新题')
			var _r_box = $('<ul />').addClass('u-qus-btn-box f-fl f-cb')
				for(var key in obj.btnObj){
					var _cell1 = $('<li />').addClass('u-qus-btn-cell')
					var _btn1 = $('<a />').addClass('u-qus-btn').addClass(' survey-tool-'+key).html(obj.btnObj[key])
					_cell1.append(_btn1)
					_r_box.append(_cell1)
				}
				_l_anchor.append(_tips)
				_handle.append(_l_anchor).append(_r_box)
			return 	_handle
	}
	//添加单选||多选 需要类型，行号，默认选项数量 适用于单选多选
	function add_choice(obj){
		var name = 'survey'+obj.type+obj.rows
		var _item = $('<div />').addClass('m-items survey-items').attr('sv-id',obj.id)
			var _title =  new_title(obj)
			var _table = new_content(obj)
		var _handle=new_toolBar(obj)
		_item.append(_title).append(_table).append(_handle).appendTo(panel)
		obj.height = _item.height()
		return obj
	}
})(jQuery);
