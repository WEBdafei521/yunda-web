var vm = new Vue({
	el:'#app',
	data:{
		url:{
			listUrl: "equipment/yfystank/list",
			addUrl: "equipment/yfystank/save",
			updateUrl: "equipment/yfystank/update",
			deleteUrl: "equipment/yfystank/delete",
			exportUrl: "equipment/yfystank/export",
			getAddTankInfoUrl: "equipment/yfystank/getAddTankInfo",
			
		},
		p:{
			addShow: hasPermission('equipment:yfystank:save'),
			updateShow: hasPermission('equipment:yfystank:update'),
			deleteShow: hasPermission('equipment:yfystank:delete'),
			exportShow: hasPermission('equipment:yfystank:export'),
			ocShow: deptFun.isOcShow()
		},
		showList: true,
		tableLoading: false,
		saveLoading: false,
		addOrUpdate: "添加",
		q:{
			orgCode: "",
			tankNo: "",
			goodsId: "",
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
		addLine:{},
		goodsOption:[],
		liquidLevelMeter:[],
		deptOptions: [],
		dept:{
			oc: [],
			s: []
		},
		deptProps:{
			label: "departname",
			value: "org_code"
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
			_this.addLine = {}
			_this.addOrUpdate = "添加"
		},
		/* 添加按钮点击对应函数 */
		add(ty) {
			const _this = this
			_this.showList = false
			
			
			$.get(baseURL + _this.url.getAddTankInfoUrl, function(r){
				if(ty == 'add'){
					_this.addLine.tankNo = r.data.tankNo
				}
				
				_this.goodsOption =r.data.goods
				_this.liquidLevelMeter =r.data.liquidLevelMeter
			});
			
			
		},
		query(){
			
			var _this = this
			var jsons = {
				//orgCode: getListLastVal( this.q.orgCode),
				orgCode: OrgCodeFun.getOrgCodeByQ(_this.q.dept),
				tankNo: this.q.tankNo,
				goodsId: this.q.goodsId
			}
			_this.tableLoading = true
			baseGetData(_this,jsons)
			
		},
		updata(index,row){
			var _this = this
			_this.addLine = row
			_this.addOrUpdate = "修改"
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
			baseSave(_this)
		},
		exportData(){
			var _this = this;
			window.open(baseURL+ _this.url.exportUrl,'_blank')
			window.close()
		},
		llmChange(data){
			
			const _this = this
			
			console.log(data)
			if(data === '0'){
				return
			}
			$.each(_this.liquidLevelMeter,function(index,value){
				if(value.id == data){
					_this.addLine.liquidLevelMeterNo = value.controllerNo
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