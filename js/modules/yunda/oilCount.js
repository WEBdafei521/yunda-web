function getInitTime(){
	var nowdate = new Date();
    //获取系统前一个月的时间
    return nowdate.setMonth(nowdate.getMonth()-1);
}
//全部引入
var vm = new Vue({
	el: '#app',
	data: {
		url:{
			listUrl: "yunda/yfytoiltrade/list",
			addUrl: "yunda/yfytoiltrade/save",
			updateUrl: "yunda/yfytoiltrade/update",
			deleteUrl: "yunda/yfytoiltrade/delete",
			exportUrl: "yunda/yfytoiltrade/exportTodayYFY",
			exportDetailUrl: "yunda/yfytoiltrade/export"
		},
		p:{
			addShow: hasPermission('oilTrade:yfytoiltrade:save'),
			updateShow: hasPermission('oilTrade:yfytoiltrade:update'),
			deleteShow: hasPermission('oilTrade:yfytoiltrade:delete'),
			exportShow: hasPermission('oilTrade:yfytoiltrade:export')
		},
		loading: false,
		tableData: [],
		showList: true,
		saveLoading: false,
		q:{
			id:""
		},
		currentPage: 1,
		pageSizes: [10, 20, 50, 100],
		pageSize: 10,
		total: 0,
		tableData: [], 
		addLine:{},
		oilCodeList:[],
		oilCode:'',
		driverList:[],
		userId:'',
		carList:[],
		lpn:'',
		//这俩是为了接收page中的额外数据
		otherInfo:true,
		otherInfoArray:{},
		formInline: {
			user: '',
			region: '',
			num: 2,
			time:[getInitTime(),new Date()]
		},
		pickerOptions: {
	          shortcuts: [{
	            text: '最近一周',
	            onClick(picker) {
	              const end = new Date();
	              const start = new Date();
	              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
	              picker.$emit('pick', [start, end]);
	            }
	          }, {
	            text: '最近一个月',
	            onClick(picker) {
	              const end = new Date();
	              const start = new Date();
	              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
	              picker.$emit('pick', [start, end]);
	            }
	          }, {
	            text: '最近三个月',
	            onClick(picker) {
	              const end = new Date();
	              const start = new Date();
	              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
	              picker.$emit('pick', [start, end]);
	            }
	          }]
	        },
		value2: '',
	},
	mounted() {
//		this.initEcharts();
		this.initSelectData();
		this.query();
	},
	methods: {
		initSelectData(){
			
			var _this = this
			/*$.ajax({
		        url: baseURL+"yunda/yfybdeptoil/list",
		        type: 'post',
		        dataType: 'json',
		        async:false,
		        success: function(data) {
		        	
		        	if(data.code==0){
		    			var htmlOp="";
		    			_this.oilCodeList=data.page.list;
		            	for (var i = 0; i < data.page.list.length; i++) {
		            		htmlOp += '<option value="'+data.page.list[i].id+'">'+data.page.list[i].lpn+'</option>';
		            	}
		        	}
		        }
			});*/
			$.ajax({
				url: baseURL+"sys/user/list",
				type: 'post',
				dataType: 'json',
				async:false,
				data:{
					page:1,
					limit:1000,
					status:'2'
				},
				success: function(data) {
					
					if(data.code==0){
						var htmlOp="";
						_this.driverList=data.page.list;
						/*for (var i = 0; i < data.page.list.length; i++) {
		            		htmlOp += '<option value="'+data.page.list[i].id+'">'+data.page.list[i].lpn+'</option>';
		            	}*/
					}
				}
			});
			$.ajax({
				url: baseURL+"yunda/yfybvehicle/list",
				type: 'post',
				dataType: 'json',
				async:false,
				data:{
					page:1,
					limit:1000,
				},
				success: function(data) {
					
					if(data.code==0){
						var htmlOp="";
						_this.carList=data.page.list;
						/*for (var i = 0; i < data.page.list.length; i++) {
		            		htmlOp += '<option value="'+data.page.list[i].id+'">'+data.page.list[i].lpn+'</option>';
		            	}*/
					}
				}
			});
		},
		initEcharts(){
			var _this = this
			var startTime= _this.formInline.time ? _this.formInline.time[0]:null;
			var endTime= _this.formInline.time ? _this.formInline.time[1]:null;
			var jsons = {
					startTime: dateFormat(startTime,"yyyy-MM-dd hh:mm:ss"),
					endTime: dateFormat(endTime,"yyyy-MM-dd hh:mm:ss"),
					driver: _this.userId,
					lpn: _this.lpn,
			}
			var carOilData=[];
			var carOilDataNum=[];
			$.ajax({
		        url: baseURL+"yunda/yfytoiltrade/oilCountByCar",
		        type: 'post',
		        dataType: 'json',
		        data:jsons,
		        async:false,
		        success: function(data) {
		        	
		        	for (var i = 0; i < data.length; i++) {
		        		carOilData.push(data[i].lpn);
		        		carOilDataNum.push(data[i].qty);
					}
		        }
			});
			//基于准备好的dom，初始化echarts实例
			var myChart = echarts.init(document.getElementById('main'));
			// 绘制图表
			myChart.setOption({
			    title: {
			        text: '车辆用油'
			    },
			    tooltip: {},
			    xAxis: {
			        data: carOilData
			    },
			    yAxis: {},
			    series: [{
			        name: '销量',
			        type: 'bar',
			        data: carOilDataNum,
			        barWidth:20
			    }]
			});
			//基于准备好的dom，初始化echarts实例
			var myChart3 = echarts.init(document.getElementById('main3'));
			var userOilData=[];
			var userOilDataNum=[];
			$.ajax({
		        url: baseURL+"yunda/yfytoiltrade/oilCountByUser",
		        type: 'post',
		        dataType: 'json',
		        data:jsons,
		        async:false,
		        success: function(data) {
		        	
		        	for (var i = 0; i < data.length; i++) {
		        		userOilData.push(data[i].operatorName);
		        		userOilDataNum.push(data[i].qty);
					}
		        }
			});
			// 绘制图表
			myChart3.setOption({
				title: {
					text: '员工用油'
				},
				tooltip: {},
				xAxis: {
					data: userOilData
				},
				yAxis: {},
				series: [{
					name: '销量',
					type: 'bar',
					data: userOilDataNum,
					barWidth:20
				}]
			});
			var myChart2 = echarts.init(document.getElementById('main2'));
			var changeOilData=[];
			var changeOilData2=[];
			var changeOilDataNum=[];
			var paramJson=[];
			$.ajax({
		        url: baseURL+"yunda/yfytoiltrade/getOilChangeInfoByCar",
		        type: 'post',
		        dataType: 'json',
		        data:jsons,
		        async:false,
		        success: function(data) {
		        	
		        	for (var i = 0; i < data.length; i++) {
		        		if($.inArray(data[i].lpn, changeOilData)==-1){
		        			changeOilData.push(data[i].lpn);
		        		}
		        		if($.inArray(data[i].oilTime, changeOilData2)==-1){
		        			changeOilData2.push(data[i].oilTime);
		        		}
					}
		        	//$.inArray(value, array)
		        	/*{
			            name:'豫A787R4',
			            type:'line',
			            stack: '总量',
			            data:[120, 132, 101, 134, 90, 230, 210]
			        },*/
		        	//现在需要拼接折线图需要的数据了json数组
		        	
		        	for (var i = 0; i < changeOilData.length; i++) {
		        		//每一个车都需要一个json参数串
		        		var lpn=changeOilData[i];
		        		//值需要按照时间来给定值，没有的给0
		        		var dataArray=[];
		        		for (var k = 0; k < changeOilData2.length; k++) {
		        			var num=0;
		        			var oilTime = changeOilData2[k];
		        			for (var g = 0; g < data.length; g++) {
				        		if(data[g].oilTime==oilTime && data[g].lpn==lpn){
				        			num=data[g].qty;
				        			break;
				        		}
							}
		        			dataArray.push(num);
		        		}
		        		
		        		
		        		paramJson.push({
				            name:changeOilData[i],
				            type:'line',
				            stack: '总量',
				            data:dataArray
				        });
					}
		        }
			});
			// 绘制图表
			myChart2.setOption({
			    title: {
			        text: '用油变化图'
			    },
			    tooltip: {
			        trigger: 'axis'
			    },
			    legend: {
			        data:changeOilData
			    },
			    grid: {
			        left: '3%',
			        right: '4%',
			        bottom: '3%',
			        containLabel: true
			    },
			    toolbox: {
			        feature: {
			            saveAsImage: {}
			        }
			    },
			    xAxis: {
			        type: 'category',
			        boundaryGap: false,
			        data: changeOilData2
			    },
			    yAxis: {
			        type: 'value'
			    },
			    series: paramJson
			});
			
			var myChart4 = echarts.init(document.getElementById('main4'));
			var data = genData(userOilData,userOilDataNum);

			myChart4.setOption({
			    title : {
			        text: '员工加油金额占比',
			        subtext: '',
			        x:'center'
			    },
			    tooltip : {
			        trigger: 'item',
			        formatter: "{a} <br/>{b} : {c} ({d}%)"
			    },
			    legend: {
			        type: 'scroll',
			        orient: 'vertical',
			        right: 10,
			        top: 20,
			        bottom: 20,
			        data: data.legendData,

			        selected: data.selected
			    },
			    series : [
			        {
			            name: '姓名',
			            type: 'pie',
			            radius : '55%',
			            center: ['40%', '50%'],
			            data: data.seriesData,
			            itemStyle: {
			                emphasis: {
			                    shadowBlur: 10,
			                    shadowOffsetX: 0,
			                    shadowColor: 'rgba(0, 0, 0, 0.5)'
			                }
			            }
			        }
			    ]
			});




			function genData(userOilData,userOilDataNum) {
			    var legendData = [];
			    var seriesData = [];
			    var selected = {};
			    
			    for (var i = 0; i < userOilData.length; i++) {
			        name = userOilData[i];
			        legendData.push(name);
			        seriesData.push({
			            name: name,
			            value: userOilDataNum[i]
			        });
			        selected[name] = i < 6;
			    }
/*			    for (var i = 0; i < 50; i++) {
			    	name = Math.random() > 0.65
			    	? makeWord(4, 1) + '·' + makeWord(3, 0)
			    			: makeWord(2, 1);
			    	legendData.push(name);
			    	seriesData.push({
			    		name: name,
			    		value: Math.round(Math.random() * 100000)
			    	});
			    	selected[name] = i < 6;
			    }
*/
			    return {
			        legendData: legendData,
			        seriesData: seriesData,
			        selected: selected
			    };

			    function makeWord(max, min) {
			        var nameLen = Math.ceil(Math.random() * max + min);
			        var name = [];
			        for (var i = 0; i < nameLen; i++) {
			            name.push(nameList[Math.round(Math.random() * nameList.length - 1)]);
			        }
			        return name.join('');
			    }
			}
			
			
			
		},
		/* 列表按钮点击对应函数 */
		list() {
			const _this = this
			_this.showList = true
			_this.addLine = {}
			_this.addOrUpdate = "添加"
		},
		/* 添加按钮点击对应函数 */
		add() {
			const _this = this
			_this.showList = false
		},
		query(){
			debugger
			var _this = this
			var startTime= _this.formInline.time ? _this.formInline.time[0]:getInitTime();
			var endTime= _this.formInline.time ? _this.formInline.time[1]:new Date();
			_this.formInline.time=[startTime,endTime];
			var jsons = {
				startTime: dateFormat(startTime,"yyyy-MM-dd hh:mm:ss"),
				endTime: dateFormat(endTime,"yyyy-MM-dd hh:mm:ss"),
				driver: _this.userId,
				lpn: _this.lpn,
			}
			//oilCode: _this.oilCode,
			_this.tableLoading = true
			baseGetData(_this,jsons)
//			this.initEcharts();
		},
		toOil(){
			$.ajax({
		        url: baseURL+"yunda/yfytoiltrade/toOil",
		        type: 'post',
		        dataType: 'json',
		        data:{
		        	carId:'15',
		        	userId:'14',
		        	tankerId:'04030201',
		        },
		        async:true,
		        success: function(data) {
		        	alert(data.msg);
		        	debugger
		        	if(data.code=='-888'){
		        		$.ajax({
		    		        url: baseURL+"yunda/yfytoiltrade/applyOrder",
		    		        type: 'post',
		    		        dataType: 'json',
		    		        data:{
		    		        	carId:'15',
		    		        	userId:'14',
		    		        	tankerId:'04030201',
		    		        },
		    		        async:true,
		    		        success: function(data) {
		    		        	alert(data.msg);
		    		        	if(data.code=='-888'){
		    		        		
		    		        	}
		    		        }
		    			});
		        	}
		        }
			});
			
		},
		updata(index,row){
			var _this = this
			_this.addLine = row
			_this.addOrUpdate = "修改"
			_this.add()
		},
		deleteRow(index,row){
			var _this = this
			var ids = [row.id]
			baseDelete(_this,ids)
		},
		handleSizeChange(val) {
			var _this = this;
			var lock = false; 
			_this.pageSize = val;
			lock = basePageLock(_this,val);
			if(lock){
				_this.handleCurrentChange(_this.currentPage) 
			}
		},
		handleCurrentChange(val) {
			this.currentPage = val
			this.query();
		},
		save(){
			var _this = this;
			baseSave(_this)
		},
		exportData(type){
			var _this = this;
			var startTime= _this.formInline.time ? _this.formInline.time[0]:null;
			var endTime= _this.formInline.time ? _this.formInline.time[1]:null;
			startTime= dateFormat(startTime,"yyyy-MM-dd hh:mm:ss"),
			endTime= dateFormat(endTime,"yyyy-MM-dd hh:mm:ss"),
			window.open(baseURL+ _this.url.exportUrl+'?startTime='+startTime+'&endTime='+endTime+'&exportType='+type,'_blank')
			window.close()
		},
		exportDetail(){
			var _this = this;
			var startTime= _this.formInline.time ? _this.formInline.time[0]:null;
			var endTime= _this.formInline.time ? _this.formInline.time[1]:null;
			startTime= dateFormat(startTime,"yyyy-MM-dd hh:mm:ss"),
			endTime= dateFormat(endTime,"yyyy-MM-dd hh:mm:ss"),
			window.open(baseURL+ _this.url.exportDetailUrl+'?startTime='+startTime+'&endTime='+endTime,'_blank')
			window.close()
		},
		getSummaries(param) {
			const _this = this;
	        const { columns, data } = param;
	        const sums = ["合计","","","",_this.otherInfoArray.sumQty,_this.otherInfoArray.sumTradeMoney];

	        return sums;
	      }
	}
});
function gmtDate(str){
	if(str && str!=''){
		var d = new Date(str);  
	    var  resDate = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds(); 
	    return resDate;
	}else{
		return null;
	}
	
}
function dateFormat(str,fmt) { 
	if(str && str!=''){
		var d = new Date(str);
		var o = { 
			       "M+" : d.getMonth()+1,                 //月份 
			       "d+" : d.getDate(),                    //日 
			       "h+" : d.getHours(),                   //小时 
			       "m+" : d.getMinutes(),                 //分 
			       "s+" : d.getSeconds(),                 //秒 
			       "q+" : Math.floor((d.getMonth()+3)/3), //季度 
			       "S"  : d.getMilliseconds()             //毫秒 
			   }; 
			   if(/(y+)/.test(fmt)) {
			           fmt=fmt.replace(RegExp.$1, (d.getFullYear()+"").substr(4 - RegExp.$1.length)); 
			   }
			    for(var k in o) {
			       if(new RegExp("("+ k +")").test(fmt)){
			            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
			        }
			    }
	}else{
		return null;
	}
    
   return fmt; 
} 
