function getDate(){

   var myDate = new Date();

    //获取当前年
   var year = myDate.getFullYear();

   //获取当前月
   var month = myDate.getMonth() + 1;

    //获取当前日
    var date = myDate.getDate();
    var h = myDate.getHours(); //获取当前小时数(0-23)
    var m = myDate.getMinutes(); //获取当前分钟数(0-59)
    var s = myDate.getSeconds();

   //获取当前时间

   var now = year + '-' + conver(month) + "-" + conver(date) + " " + conver(h) + ':' + conver(m) + ":" + conver(s);
   return now;
}

//日期时间处理
function conver(s) {
return s < 10 ? '0' + s : s;
}
var c_unloadOilNum = (rule, value, callback) => {
	try {
		if (YDCP.isFalse(value)) {
			return callback(new Error('不能为空'));
		} else if (!YDCP.checkStr(value,'number')) {
			return callback(new Error('请输入数字'));
		} else {
			callback();
		}
	} catch (e) {
		return callback(new Error('请输入数字'));
	}
	
};
var vm = new Vue({
	el:'#app',
	data:{
		url:{
			listUrl: "oilRecord/yfyboilrecord/list",
			addUrl: "oilRecord/yfyboilrecord/save",
			updateUrl: "oilRecord/yfyboilrecord/update",
			deleteUrl: "oilRecord/yfyboilrecord/delete",
			exportUrl: "oilRecord/yfyboilrecord/export",
			getAddInfoUrl: "equipment/yfystank/list?page=1&limit=1000",
		},
		p:{
			addShow: hasPermission('oilRecord:yfyboilrecord:save'),
			updateShow: hasPermission('oilRecord:yfyboilrecord:update'),
			deleteShow: hasPermission('oilRecord:yfyboilrecord:delete'),
			exportShow: hasPermission('oilRecord:yfyboilrecord:export')
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
		tankOptions: [], 
		addLine:{
            purchaseDate: getDate()
		},
		loading:false,
		yfyBOilRecord: {
			user: '',
			region: '',
			num: 2
		},
		oilCode:'',
		oilCodeList:[],
		rules: {
			purchaseOrderNum: [
				{ required: true, message: '不能为空', trigger: 'blur' },
			],
			purchaseDate: [
				{ required: true, message: '不能为空', trigger: 'blur' },
			],
			unloadOiltank: [
				{ required: true, message: '不能为空', trigger: 'blur' },
			],
			unloadOilNum: [
				{ validator: c_unloadOilNum, trigger: 'blur' },
			],
			
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
		this.query();
//		this.initSelectData();
	},
	methods: {
		initSelectData(){
			
			var _this = this
			$.ajax({
		        url: baseURL+"yunda/yfybdeptoil/list",
		        type: 'post',
		        dataType: 'json',
		        async:false,
		        success: function(data) {
		        	
		        	if(data.code==0){
		    			var htmlOp="";
		    			_this.oilCodeList=data.page.list;
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
//			_this.showList = false
			const _this = this
			$.get(baseURL + _this.url.getAddInfoUrl, function(r){
				
				_this.tankOptions =r.page.list
				_this.showList = false
			});
		},
		query(){
			
			var _this = this
			var startTime="";
			var endTime="";
			if(_this.value2){
				startTime=gmtDate(_this.value2[0]);
				endTime=gmtDate(_this.value2[1]);
			}
			var jsons = {
				startTime: startTime,
				endTime: endTime,
				name: _this.yfyBOilRecord.name,
			}
			_this.tableLoading = true
			baseGetData(_this,jsons)
			
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
			_this.$refs['addLine'].validate((valid) => {
				if (valid) {
					baseSave(_this)
				} else {
					alert('请填写正确信息');
					return false;
				}
			});
		},
		exportData(){
			var _this = this;
			window.open(baseURL+ _this.url.exportUrl,'_blank')
			window.close()
		},
		selectTank(tankNo){
		    let obj = {};
		    obj = this.tankOptions.find((item)=>{//model就是上面的数据源
		    	if(item.tankNo == tankNo){
		    		this.addLine.unloadOiltankid=item.id;
		    	}
		    });
		    debugger
		    console.log(obj);
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