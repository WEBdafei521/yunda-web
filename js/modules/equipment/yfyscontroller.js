var vm = new Vue({
	el: '#app',
	data: {
		url: {
			listUrl: "equipment/yfyscontroller/list",
			addUrl: "equipment/yfyscontroller/save",
			updateUrl: "equipment/yfyscontroller/update",
			deleteUrl: "equipment/yfyscontroller/delete",
			exportUrl: "equipment/yfyscontroller/export",
			sendCommandUrl: "equipment/yfyscontroller/sendCommand",
			getAddTankInfoUrl: "equipment/yfystank/getAddTankInfo",
		},
		p: {
			addShow: hasPermission('equipment:yfyscontroller:save'),
			updateShow: hasPermission('equipment:yfyscontroller:update'),
			deleteShow: hasPermission('equipment:yfyscontroller:delete'),
			exportShow: hasPermission('equipment:yfyscontroller:export'),
			sendCommand: hasPermission('equipment:yfyscontroller:sendCommand'),
			ocShow: deptFun.isOcShow()
		},
		showList: true,
		tableLoading: false,
		saveLoading: false,
		updateConfigDialog : false,
		addOrUpdate: "添加",
		q: {
			orgCode: "",
			simNo: "",
			controllerNo: "",
			dept: {
				oc:"",
				s:""
			}
		},
		currentPage: 1,
		pageSizes: [10, 20, 50, 100],
		pageSize: 10,
		total: 0,
		tableData: [],
		addLine: {
			controllerType:'1'
		},
		goodsOption:[],
		controllerConfig: {
			sector:'00',
			WList:'00'
		},
		pickerOptions: {
			disabledDate(time) {
				return time.getTime() < Date.now();
			},
			shortcuts: [{
				text: '今天',
				onClick(picker) {
					picker.$emit('pick', new Date());
				}
			}, {
				text: '一个月后',
				onClick(picker) {
					const date = new Date();
					date.setMonth(date.getMonth() + 1);
					picker.$emit('pick', date);
				}
			}, {
				text: '半年后',
				onClick(picker) {
					const date = new Date();
					date.setMonth(date.getMonth() + 6);
					picker.$emit('pick', date);
				}
			}, {
				text: '一年后',
				onClick(picker) {
					const date = new Date();
					date.setMonth(date.getMonth() + 12);
					picker.$emit('pick', date);
				}
			}]
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
		controllerType:[
			{
				value:'1',
				label:"油枪智能控制器"
			},
			/*{
				value:'2',
				label:"液位控制器"
			}*/
		],
		workModeOptions:[
			{
				value:'00',
				label:"正常模式"
			},
			{
				value:'01',
				label:"锁机模式"
			},
			{
				value:'02',
				label:"禁用使用卡模式"
			}
		],
		GPSUploadOptions:[
			{
				value:'00',
				label:"不主动上传"
			},
			{
				value:'01',
				label:"主动上传"
			}
		],
		StatusuploadOptions:[
			{
				value:'00',
				label:"不传"
			},
			{
				value:'01',
				label:"传"
			}
		],
		rules: {
			controllerNo: [
            { required: true, message: '这是必填项', trigger: 'blur' },
          ]
		}
	},
	mounted() {
		this.query();
	},
	created(){
		//this.deptOptions = baseGetDept()
		this.dept = {
			oc: deptFun.getOilCompanies(),
			s: deptFun.getStations()
		}
		console.log(this.dept)
	},
	methods: {
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
		query() {
			var _this = this
			var jsons = {
				//orgCode: getListLastVal( this.q.orgCode),
				orgCode: OrgCodeFun.getOrgCodeByQ(_this.q.dept),
				simNo: this.q.simNo,
				controllerNo: this.q.controllerNo
			}
			_this.tableLoading = true
			baseGetData(_this, jsons)

		},
		updata(index, row) {
			var _this = this
			_this.addLine = row
			_this.addOrUpdate = "修改"
			_this.add()
		},
		updateConfig(index, row){
			var _this = this
			_this.controllerConfig.controllerId=row.id;
			_this.updateConfigDialog = true;
			_this.controllerConfig.statusFlag=true;
			_this.controllerConfig.gpsStatusFlag=true;
			$.get(baseURL + _this.url.getAddTankInfoUrl, function(r){
				_this.goodsOption =r.data.goods
			});
		},
		sendCommand() {
			var _this = this
			//下发指令
			confirm('确定要下发此配置？', function(){
				$.ajax({
					type: "POST",
				    url: baseURL + _this.url.sendCommandUrl,
			        contentType: "application/json",
				    data: JSON.stringify(_this.controllerConfig),
				    success: function(r){
						if(r.code == 0){
							alert('操作成功', function(index){
								_this.updateConfigDialog = false;
								_this.query();
							});
						}else{
							alert(r.msg);
						}
					}
				});
			});
		},
		deleteRow(index, row) {
			var _this = this
			var ids = [row.id]
			baseDelete(_this, ids)
		},
		handleSizeChange(val) {
			var _this = this;
			var lock = false;
			_this.pageSize = val;
			lock = basePageLock(_this, val);
			if (lock) {
				_this.handleCurrentChange(_this.currentPage)
			}
		},
		handleCurrentChange(val) {
			this.currentPage = val
			this.query();
		},
		save() {
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
		exportData() {
			var _this = this;
			window.open(baseURL + _this.url.exportUrl, '_blank')
			window.close()
		},
		ocChange(data){
			let stations = OrgCodeFun.getStationsByPcode(data);
			this.q.dept.s = "";
			this.dept.s = stations;
		},
		statusChange(data){
			if(data=='00'){
				this.controllerConfig.statusFlag=false;
			}else{
				this.controllerConfig.statusFlag=true;
			}
		},
		gpsStatusChange(data){
			if(data=='00'){
				this.controllerConfig.gpsStatusFlag=false;
			}else{
				this.controllerConfig.gpsStatusFlag=true;
			}
		},
		controllerFormatter(row, column){
			var type = row[column.property]+"";
		    if(type == 1 || type=='1'){
		    	return "油枪智能控制器";
		    }else{
		    	return "液位智能控制器";
		    }
		},
		controllerFormatter2(row, column){
			debugger
			var status1 = row[column.property]+"";
			var updateTime = row.updateTime;
			
			var d1 = new Date(Date.parse(updateTime)); 
			if(status1=='03' || status1=='' || !status1){
				return "掉线";
			}else if(new Date() - d1 > 1000*60*2 || !updateTime){
				return "掉线";
			}else{
				return "在线";
			}
			//目前只根据时间判断，2分钟
			
		},
	}
});
