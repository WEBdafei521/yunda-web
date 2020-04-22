var vm = new Vue({
	el:'#app',
	data:{
		url:{
			listUrl: "equipment/yfysgun/list",
			addUrl: "equipment/yfysgun/save",
			updateUrl: "equipment/yfysgun/update",
			deleteUrl: "equipment/yfysgun/delete",
			exportUrl: "equipment/yfysgun/export",
			getAddInfoUrl: "equipment/yfysgun/saveInfo",
			updatePriceUrl: "equipment/yfysgun/updatePrice",
			updateConfigUrl: "devWorkModeInfo/yfysdevworkmodeinfo/saveByOrgCode",
			setConfigUrl: "equipment/yfysgun/setConfig",
			getWorkModeInfoUrl: "devWorkModeInfo/yfysdevworkmodeinfo/getByOrgCode",
		},
		p:{
			addShow: hasPermission('equipment:yfysgun:save'),
			updateShow: hasPermission('equipment:yfysgun:update'),
			deleteShow: hasPermission('equipment:yfysgun:delete'),
			exportShow: hasPermission('equipment:yfysgun:export'),
			updatePriceShow: hasPermission('equipment:yfysgun:update:price'),
			ocShow: deptFun.isOcShow()
		},
		showList: true,
		tableLoading: false,
		saveLoading: false,
		fullscreenLoading : false,
		updateConfigDialog : false,
		addOrUpdate: "添加",
		q:{
			orgCode: "",
			gunNo: "",
			tankNo: "",
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
//		addLine:{},
		controllerOptions:[],
		tankOptions:[],
		numberOptions:[],
		deptOptions: [],
		goodsOption:[],
		addLine: {
			sector:'0B',
			WList:'00',
			workMode:'00',
			gpsUpload:'01',
			statusUpload:'01',
			gpsUploadTime:60,
			statusUploadTime:30,
			statusFlag:true,
			gpsStatusFlag:true
			
		},
		dept:{
			oc: [],
			s: []
		},
		deptProps:{
			label: "departname",
			value: "org_code"
		},
		updatePriceDialog: false,
		updatePriceForm:{},
		workModeOptions:[
			{
				value:'00',
				label:"启用"
			},
			{
				value:'01',
				label:"停用"
			},
			/*{
				value:'02',
				label:"禁用使用卡模式"
			}*/
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
            { required: true, message: '这是必选项', trigger: 'blur' },
          ],
          tankNo: [
        	  { required: true, message: '这是必选项', trigger: 'blur' },
        	  ],
    	  typeNumber: [
    		  { required: true, message: '这是必选项', trigger: 'blur' },
    		  ],
	          
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
	},
	methods: {
		/* 列表按钮点击对应函数 */
		list() {
			const _this = this
			_this.showList = true
			_this.addLine = {
					sector:'00',
					WList:'00',
					workMode:'00',
					gpsUpload:'01',
					statusUpload:'01',
					gpsUploadTime:60,
					statusUploadTime:30,
					statusFlag:true,
					gpsStatusFlag:true
			}
			_this.addOrUpdate = "添加"
		},
		
		
		/* 添加按钮点击对应函数 */
		add(ty){
			const _this = this
			$.get(baseURL + _this.url.getAddInfoUrl, function(r){
				
				if(ty == 'add'){
					_this.addLine.gunNo = r.data.gunNo
				}
				_this.controllerOptions =r.data.controllerList
				_this.tankOptions =r.data.tankList
				_this.numberOptions =r.data.numberList
				_this.showList = false
			});
			
		},
		query(){
			
			var _this = this
			var jsons = {
				//orgCode: getListLastVal( this.q.orgCode),
				orgCode: OrgCodeFun.getOrgCodeByQ(_this.q.dept),
				gunNo: this.q.gunNo,
				tankNo: this.q.tankNo,
				controllerNo: this.q.controllerNo
			}
			_this.tableLoading = true
			baseGetData(_this,jsons)
			
		},
		updata(index,row){
			var _this = this
			_this.addLine = row
			_this.addOrUpdate = "修改"
				
			if(row.gpsUpload=='01'){
				_this.addLine.gpsStatusFlag=true;
			}
			if(row.statusUpload=='01'){
				_this.addLine.statusFlag=true;
			}
				
			_this.add("update")
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
		controllerSelect(val){
			console.log(val)
			this.addLine.controllerId = val.id
			this.addLine.controllerNo = val.controllerNo
		},
        numberSelect(val){
            console.log(val)
            this.addLine.typeNumber = val.number
            // this.addLine.controllerNo = val.controllerNo
        },
		tankSelect(val){
			console.log(val)
			this.addLine.tankId = val.id
			this.addLine.price = val.price
			this.addLine.tankNo = val.tankNo
			this.addLine.goodsName = val.goodsName
		},
		updataPrice(index,row){
			var _this = this
			_this.updatePriceForm={
				id: row.id,
				gunNo: row.gunNo,
				oldPrice: row.price,
				price: row.price,
				controllerNo:row.controllerNo
			}
			_this.updatePriceDialog = true
				
		},
		updateConfig(){
			var _this = this
			_this.updateConfigDialog = true;
			_this.controllerConfig.statusFlag=true;
			_this.controllerConfig.gpsStatusFlag=true;
			$.get(baseURL + _this.url.getWorkModeInfoUrl, function(r){
				if(r){
					_this.controllerConfig = r;
					if(r.gpsUpload=='01'){
						_this.controllerConfig.gpsStatusFlag=true;
					}
					if(r.statusUpload=='01'){
						_this.controllerConfig.statusFlag=true;
					}
				}
			});
		},
		saveConfig(){
			var _this = this;
			$.ajax({
				type: "POST",
				url: baseURL + _this.url.updateConfigUrl,
				contentType: "application/json",
				data: JSON.stringify(_this.controllerConfig),
				success: function(r){
					_this.fullscreenLoading = false;
					if(r.code === 0){
						alert('操作成功', function(index){
							_this.query()
						});
					}else{
						alert(r.msg);
					}
					_this.updateConfigDialog = false
				}
			});
		},
		setConfig(index,row){
			var _this = this;
			confirm('确定要下发配置吗？', function(){
				$.ajax({
					type: "POST",
				    url: baseURL + _this.url.setConfigUrl,
			        contentType: "application/json",
			        data: JSON.stringify(row),
				    success: function(r){
						if(r.code == 0){
							alert('操作成功', function(index){
								_this.query();
							});
						}else{
							alert(r.msg);
						}
					}
				});
			});
			
			
		},
		statusChange(data){
			if(data=='00'){
				this.addLine.statusFlag=false;
			}else{
				this.addLine.statusFlag=true;
			}
		},
		gpsStatusChange(data){
			if(data=='00'){
				this.addLine.gpsStatusFlag=false;
			}else{
				this.addLine.gpsStatusFlag=true;
			}
		},
		closeDialog(){
			
		},
		updatePriceSubmit(){
			console.log(this.updatePriceForm)
			const _this = this;
			_this.fullscreenLoading = true;
			$.ajax({
				type: "POST",
			    url: baseURL + _this.url.updatePriceUrl,
			    contentType: "application/json",
			    data: JSON.stringify(_this.updatePriceForm),
			    success: function(r){
			    	_this.fullscreenLoading = false;
			    	if(r.code === 0){
						alert('操作成功', function(index){
							_this.query()
						});
					}else{
						alert(r.msg);
					}
					_this.updatePriceDialog = false
				}
			});
			
		},
		ocChange(data){
			let stations = OrgCodeFun.getStationsByPcode(data);
			this.q.dept.s = "";
			this.dept.s = stations;
		}
		
		
		
	}
});