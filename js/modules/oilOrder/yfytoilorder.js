var vm = new Vue({
	el:'#app',
	data:{
		url:{
			listUrl: "oilOrder/yfytoilorder/list",
			addUrl: "oilOrder/yfytoilorder/save",
			updateUrl: "oilOrder/yfytoilorder/update",
			deleteUrl: "oilOrder/yfytoilorder/delete",
			exportUrl: "oilOrder/yfytoilorder/export"
		},
		p:{
			addShow: hasPermission('oilOrder:yfytoilorder:save'),
			updateShow: hasPermission('oilOrder:yfytoilorder:update'),
			deleteShow: hasPermission('oilOrder:yfytoilorder:delete'),
			exportShow: hasPermission('oilOrder:yfytoilorder:export')
		},
		showList: true,
		tableLoading: false,
		saveLoading: false,
		addOrUpdate: "添加",
		q:{
			id:""
		},
		currentPage: 1,
		pageSizes: [10, 20, 50, 100],
		pageSize: 10,
		total: 0,
		tableData: [], 
		judgeOrder: [
			{
				key:"暂不处理",
				val:"4"
			},
			{
				key:"通过",
				val:"5"
			},{
				key:"不通过",
				val:"6"
			}
		], 
		addLine:{
			result:"5"
		},
		judgeOrderDialog:false,
		loading:false,
		closeDialog:false,
		fullscreenLoading:false,
		driverList:[],
		userId:'',
		carList:[],
		lpn:'',
		formInline: {
			user: '',
			region: '',
			num: 2,
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
	},
	mounted() {
		this.query();
		this.initSelectData();
	},
	methods: {
		initSelectData(){
			var _this = this
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
			var startTime= _this.formInline.time ? _this.formInline.time[0]:null;
			var endTime= _this.formInline.time ? _this.formInline.time[1]:null;
			var jsons = {
				startTime: dateFormat(startTime,"yyyy-MM-dd hh:mm:ss"),
				endTime: dateFormat(endTime,"yyyy-MM-dd hh:mm:ss"),
				driver: _this.userId,
				lpn: _this.lpn,
			}
			_this.tableLoading = true
			baseGetData(_this,jsons)
			
		},
		updata(index,row){
			debugger
			var _this = this
			_this.addLine = row
			_this.judgeOrderDialog=true
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
			var url = _this.addLine.id == null ? _this.url.addUrl : _this.url.updateUrl;
			$.ajax({
				type: "POST",
			    url: baseURL + url,
			    contentType: "application/json",
			    data: JSON.stringify(_this.addLine),
			    success: function(r){
			    	if(r.code === 0){
						alert('操作成功', function(index){
						_this.judgeOrderDialog=false;
						});
						_this.query();
					}else{
						alert(r.msg);
					}
				}
			});
		},
		exportData(){
			var _this = this;
			window.open(baseURL+ _this.url.exportUrl,'_blank')
			window.close()
		},
		dataFormatter: function(row, column) {
			var tradeflag = row[column.property]+"";
			var tradeStr="";
		      if(tradeflag=='4'){
		    	  tradeStr="待审核";
		      }else if(tradeflag=='6'){
		    	  tradeStr="未通过";
		      }else{
		    	  tradeStr="已通过";
		      }
		      return tradeStr;
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