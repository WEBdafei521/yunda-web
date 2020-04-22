function getInitTime() {
    var nowdate = new Date();
    //获取系统前一个月的时间
    nowdate.setTime(nowdate.getTime() - 1000 * 3600 * 24);
    return nowdate;
}
function getUrlParam (name) {
		    var reg = new RegExp('(^|&)' + name + '=(.*)(&[^&=]+=)');
		    var regLast = new RegExp('(^|&)' + name + '=(.*)($)');
		    var r = window.location.search.substr(1).match(reg) || window.location.search.substr(1).match(regLast);
		    if (r != null) {
		      var l = r[2].match(/&[^&=]+=/)
		      if (l) {
		        return decodeURIComponent(r[2].split(l[0])[0]);
		      } else return decodeURIComponent(r[2]);
		    }
		    return null;
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
			exportUrl: "yunda/yfytoiltrade/exportToday",
			exportDetailUrl: "yunda/yfytoiltrade/export"
		},
		p:{
			addShow: hasPermission('oilTrade:yfytoiltrade:save'),
			updateShow: hasPermission('oilTrade:yfytoiltrade:update'),
			deleteShow: hasPermission('oilTrade:yfytoiltrade:delete'),
			exportShow: hasPermission('yunda:yfytoiltrade:exportyfy'),
			ocShow: deptFun.isOcShow()
		},
		loading: false,
		tableData: [],
		showList: true,
		driverShow: true,
		lpnShow: true,
		saveLoading: false,
		htmlStr:'',
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
        oilTankNoList:[],
		userId:'',
		carList:[],
		lpn:'',
		formInline: {
			user: '',
			region: '',
			num: 2,
			dept: {
				oc:"",
				s:""
			},
            time: getInitTime()
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
		value2: ''
            // new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 0 )]
	},
	mounted() {
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
			
			var _this = this
			$.ajax({
				// url: baseURL+"sys/user/list",
				url: baseURL+"equipment/yfystank/list?page=1&limit=1000",
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
						_this.oilTankNoList=data.page.list;
						/*for (var i = 0; i < data.page.list.length; i++) {
		            		htmlOp += '<option value="'+data.page.list[i].id+'">'+data.page.list[i].lpn+'</option>';
		            	}*/
					}
				}
			});
			// $.ajax({
			// 	url: baseURL+"yunda/yfybvehicle/list",
			// 	type: 'post',
			// 	dataType: 'json',
			// 	async:false,
			// 	data:{
			// 		page:1,
			// 		limit:1000,
			// 	},
			// 	success: function(data) {
			//
			// 		if(data.code==0){
			// 			var htmlOp="";
			// 			_this.carList=data.page.list;
			// 			/*for (var i = 0; i < data.page.list.length; i++) {
		    //         		htmlOp += '<option value="'+data.page.list[i].id+'">'+data.page.list[i].lpn+'</option>';
		    //         	}*/
			// 		}
			// 	}
			// });
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
			var _this = this
			var type = getUrlParam("type");
			if(type=='0' || type==0){
				_this.driverShow = false;
				_this.lpnShow = true;
			}else{
				_this.driverShow = true;
				_this.lpnShow = false;
			}
			debugger
			var startTime= _this.formInline.time ? _this.formInline.time[0]:null;
			var endTime= _this.formInline.time ? _this.formInline.time[1]:null;
			var selectOrgCode = _this.formInline.dept.s;
            time=_this.formInline.time
			var jsons = {
				// startTime: dateFormat(startTime,"yyyy-MM-dd"),
				// endTime: dateFormat(endTime,"yyyy-MM-dd hh:mm:ss"),
				// driver: _this.userId,
                time: dateFormat(time,"yyyy-MM-dd"),
				selectOrgCode: selectOrgCode,
                // time: this.formInline.time
			}
			//oilCode: _this.oilCode,
			_this.tableLoading = true
			$.ajax({
				url: baseURL+"yunda/yfytoiltrade/showExcelSation?exportType="+type,
				type: 'post',
				dataType: 'html',
				async:false,
				data:jsons,
				success: function(data) {
					_this.htmlStr=data;
				}
			});
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
		ocChange(data){
			let stations = OrgCodeFun.getStationsByPcode(data);
			this.formInline.dept.s = "";
			this.dept.s = stations;
		},
		exportData(){
			var _this = this;
            var time= _this.formInline.time;
            time=dateFormat(time,"yyyy-MM-dd");
            var selectOrgCode = _this.formInline.dept.s;
			window.open(baseURL+ _this.url.exportUrl+'?time='+time+'&selectOrgCode='+selectOrgCode+'&exportType=0','_blank')
			window.close()
		},
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
