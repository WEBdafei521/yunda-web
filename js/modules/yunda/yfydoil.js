var vm = new Vue({
	el:'#app',
	data:{
		url:{
			listUrl: "yunda/yfydoil/list",
			addUrl: "yunda/yfydoil/save",
			updateUrl: "yunda/yfydoil/update",
			deleteUrl: "yunda/yfydoil/delete"
		},
		p:{
			addShow: hasPermission('yunda:yfydoil:save'),
			updateShow: hasPermission('yunda:yfydoil:update'),
			deleteShow: hasPermission('yunda:yfydoil:delete')
		},
		showList: true,
		tableLoading: false,
		saveLoading: false,
		addOrUpdate: "添加",
		q:{
			oilCode:"",
			oilName:""
		},
		currentPage: 1,
		pageSizes: [10, 20, 50, 100],
		pageSize: 10,
		total: 500,
		tableData: [], 
		addLine:{}
	},
	mounted() {
		this.query();
	},
	methods: {
		/* 列表按钮点击对应函数 */
		list() {
			const _this = this;
			_this.showList = true;
			_this.addLine = {}
			_this.addOrUpdate = "添加"
		},
		/* 添加按钮点击对应函数 */
		add() {
			const _this = this;
			_this.showList = false;
		},
		query(){
			
			var _this = this;
			var jsons = {
				oilCode: this.q.oilCode,
				oilName: this.q.oilName
			}
			_this.tableLoading = true;
			baseGetData(_this,jsons)
			
		},
		updata(index,row){
			var _this = this;
			_this.addLine = row
			_this.addOrUpdate = "修改"
			_this.add();
		},
		deleteRow(index,row){
			var _this = this;
			var ids = [row.id];
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
		}
		
		
		
	}
});