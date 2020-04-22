
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
			listUrl: "yunda/yfytoiltrade/list?type=1",
			addUrl: "yunda/yfytoiltrade/save",
			updateUrl: "yunda/yfytoiltrade/update",
			deleteUrl: "yunda/yfytoiltrade/delete",
			exportUrl: "yunda/yfytoiltrade/exportToday",
			getAddInfoUrl: "equipment/yfystank/list?page=1&limit=1000",
			getAddInfoUrlGun: "/equipment/yfysgun/list?page=1&limit=1000",
			exportDetailUrl: "yunda/yfytoiltrade/export"
		},
		p:{
			addShow: hasPermission('oilTrade:yfytoiltrade:save'),
			updateShow: hasPermission('oilTrade:yfytoiltrade:update'),
			deleteShow: hasPermission('oilTrade:yfytoiltrade:delete'),
			exportShow: hasPermission('oilTrade:yfytoiltrade:export'),
			exportShow: hasPermission('oilTrade:yfytoiltrade:export'),
			ocShow: deptFun.isOcShow()
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
		oilCodeList:[],
		oilCode:'',
		driverList:[],
		gunOptions:[],
		tankOptions:[],
		userId:'',
		oilGunNo:'',
		oilTankNo:'',
		carList:[],
		lpn:'',
		//这俩是为了接收page中的额外数据
		otherInfo:true,
		otherInfoArray:{},
		loading: false,
		tableData: [],
		showList: true,
		saveLoading: false,
		formInline: {
			user: '',
			region: '',
			num: 2,
			dept: {
				oc:"",
				s:""
			},
            time:[getInitTime(),new Date()]
		},
		deptOptions: [],
		dept:{
			oc: [],
			s: []
		},
		deptProps:{
			label: "departname",
			value: "org_code"
		},
        timeShow:'',
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
	created(){
		//this.deptOptions = baseGetDept()
		this.dept = {
			oc: deptFun.getOilCompanies(),
			s: deptFun.getStations()
		}
	},
	methods: {
		initSelectData(){
			debugger
			var _this = this
			$.get(baseURL + _this.url.getAddInfoUrl, function(r){
				_this.tankOptions =r.page.list
//				_this.showList = false
			});
			$.get(baseURL + _this.url.getAddInfoUrlGun, function(r){
				_this.gunOptions =r.page.list
//				_this.showList = false
			});
		},
		initEcharts(){
			var _this = this
			var startTime= _this.formInline.time ? _this.formInline.time[0]:null;
			var endTime= _this.formInline.time ? _this.formInline.time[1]:null;
			var oilGunNo= _this.oilGunNo ? _this.oilGunNo:null;
			var oilTankNo= _this.oilTankNo ? _this.oilTankNo:null;
			var jsons = {
				startTime: dateFormat(startTime,"yyyy-MM-dd hh:mm:ss"),
				endTime: dateFormat(endTime,"yyyy-MM-dd hh:mm:ss"),
				oilGunNo:oilGunNo,
				oilTankNo:oilTankNo,
			}
			var gunOilData=[];
			var gunOilDataNum=[];
			jsons.option="gunNo";
			$.ajax({
		        url: baseURL+"yunda/yfytoiltrade/getoilCountByParam",
		        type: 'post',
		        dataType: 'json',
		        data:jsons,
		        async:false,
		        success: function(data) {
		        	debugger
		        	for (var i = 0; i < data.length; i++) {
		        		gunOilData.push(data[i].gunNo);
		        		gunOilDataNum.push(data[i].qty);
					}
		        }
			});
			//基于准备好的dom，初始化echarts实例
			var myChart = echarts.init(document.getElementById('main'));
			// 绘制图表
			myChart.setOption({
			    title: {
			        text: '油枪加油统计'
			    },
			    tooltip: {},
			    xAxis: {
			        data: gunOilData
			    },
			    yAxis: {},
			    series: [{
			        name: '销量',
			        type: 'bar',
			        data: gunOilDataNum,
			        barWidth:20
			    }]
			});
			//基于准备好的dom，初始化echarts实例
			var myChart3 = echarts.init(document.getElementById('main3'));
			var oilTankOilData=[];
			var oilTankOilDataNum=[];
			jsons.option="oilTankNo";
			$.ajax({
		        url: baseURL+"yunda/yfytoiltrade/getoilCountByParam",
		        type: 'post',
		        dataType: 'json',
		        data:jsons,
		        async:false,
		        success: function(data) {
		        	debugger
		        	for (var i = 0; i < data.length; i++) {
		        		oilTankOilData.push(data[i].oilTankNo);
		        		oilTankOilDataNum.push(data[i].qty);
					}
		        }
			});
			// 绘制图表
			myChart3.setOption({
				title: {
					text: '油罐加油统计'
				},
				tooltip: {},
				xAxis: {
					data: oilTankOilData
				},
				yAxis: {},
				series: [{
					name: '销量',
					type: 'bar',
					data: oilTankOilDataNum,
			        barWidth:20
				}]
			});
			var myChart2 = echarts.init(document.getElementById('main2'));
			var changeOilData=[];
			var changeOilData2=[];
			var changeOilDataNum=[];
			var paramJson=[];
			jsons.option="gunNo,oilTime";
			$.ajax({
		        url: baseURL+"yunda/yfytoiltrade/getoilCountByParam",
		        type: 'post',
		        dataType: 'json',
		        data:jsons,
		        async:false,
		        success: function(data) {
		        	debugger
		        	for (var i = 0; i < data.length; i++) {
		        		if($.inArray(data[i].gunNo, changeOilData)==-1){
		        			changeOilData.push(data[i].gunNo);
		        		}
		        		if($.inArray(data[i].oilTime, changeOilData2)==-1){
		        			changeOilData2.push(data[i].oilTime);
		        		}
					}
		        	//现在需要拼接折线图需要的数据了json数组
		        	for (var i = 0; i < changeOilData.length; i++) {
		        		//每一个车都需要一个json参数串
		        		var gunNo=changeOilData[i];
		        		//值需要按照时间来给定值，没有的给0
		        		var dataArray=[];
		        		for (var k = 0; k < changeOilData2.length; k++) {
		        			var num=0;
		        			var oilTime = changeOilData2[k];
		        			for (var g = 0; g < data.length; g++) {
				        		if(data[g].oilTime==oilTime && data[g].gunNo==gunNo){
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
			        text: '加油趋势图'
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
			var data = genData(gunOilData,gunOilDataNum);

			myChart4.setOption({
			    title : {
			        text: '油枪加油金额占比',
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
			            name: '油枪',
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
			    // debugger
			    for (var i = 0; i < userOilData.length; i++) {
			        name = userOilData[i];
			        legendData.push(name);
			        seriesData.push({
			            name: name,
			            value: userOilDataNum[i]
			        });
			        selected[name] = i < 6;
			    }
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
			// debugger
			var _this = this
			var startTime= _this.formInline.time ? _this.formInline.time[0]:null;
			var endTime= _this.formInline.time ? _this.formInline.time[1]:null;
			var oilGunNo= _this.oilGunNo ? _this.oilGunNo:null;
			var oilTankNo= _this.oilTankNo ? _this.oilTankNo:null;
			var selectOrgCode = _this.formInline.dept.s? _this.formInline.dept.s:_this.formInline.dept.oc;
			var jsons = {
				startTime: dateFormat(startTime,"yyyy-MM-dd hh:mm:ss"),
				endTime: dateFormat(endTime,"yyyy-MM-dd hh:mm:ss"),
				oilGunNo:oilGunNo,
				oilTankNo:oilTankNo,
				selectOrgCode: selectOrgCode,
			}
			_this.tableLoading = true
			baseGetData(_this,jsons)
//			this.initEcharts();
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
		/*exportData(){
			var _this = this;
			window.open(baseURL+ _this.url.exportUrl,'_blank')
			window.close()
		},*/
		ocChange(data){
			// debugger
			let stations = OrgCodeFun.getStationsByPcode(data);
			this.formInline.dept.s = "";
			this.dept.s = stations;
		},
		exportData(){
			var _this = this;
			var startTime= _this.formInline.time ? _this.formInline.time[0]:null;
			var endTime= _this.formInline.time ? _this.formInline.time[1]:null;
			startTime= dateFormat(startTime,"yyyy-MM-dd hh:mm:ss");
			endTime= dateFormat(endTime,"yyyy-MM-dd hh:mm:ss");
			var gunNo = _this.oilGunNo;
			var oilTankNo = _this.oilTankNo;
			window.open(baseURL+ _this.url.exportUrl+'?startTime='+startTime+'&endTime='+endTime+'&option=gunNo,price'+'&gunNo='+gunNo+'&oilTankNo='+oilTankNo,'_blank')
			window.close()
		},
		exportData(type){
			var _this = this;
			var startTime= _this.formInline.time ? _this.formInline.time[0]:null;
			var endTime= _this.formInline.time ? _this.formInline.time[1]:null;
			startTime= dateFormat(startTime,"yyyy-MM-dd hh:mm:ss");
			endTime= dateFormat(endTime,"yyyy-MM-dd hh:mm:ss");
			//说明是期间报
			if(type==1 || type=='1'){
				if(startTime==null || endTime==null){
					alert("请选择开始时间和结束时间！");
					return;
				}
			}
			window.open(baseURL+ _this.url.exportUrl+'?startTime='+startTime+'&endTime='+endTime+'&exportType='+type,'_blank')
			window.close()
		},
		exportDetail(){
			var _this = this;
			var startTime= _this.formInline.time ? _this.formInline.time[0]:null;
			var endTime= _this.formInline.time ? _this.formInline.time[1]:null;
			startTime= dateFormat(startTime,"yyyy-MM-dd hh:mm:ss");
			endTime= dateFormat(endTime,"yyyy-MM-dd hh:mm:ss");
			var selectOrgCode = _this.formInline.dept.s;
			window.open(baseURL+ _this.url.exportDetailUrl+'?&startTime='+startTime+'&endTime='+endTime+'&selectOrgCode='+selectOrgCode,'_blank')
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