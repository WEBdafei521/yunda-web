var vm = new Vue({
	el:'#app',
	data:{
		url:{
			listUrl: "equipment/yfysguninfo/list",
			addUrl: "equipment/yfysguninfo/save",
			updateUrl: "equipment/yfysguninfo/update",
			deleteUrl: "equipment/yfysguninfo/delete",
			exportUrl: "equipment/yfysguninfo/export"
		},
		p:{
			addShow: hasPermission('equipment:yfysguninfo:save'),
			updateShow: hasPermission('equipment:yfysguninfo:update'),
			deleteShow: hasPermission('equipment:yfysguninfo:delete'),
			exportShow: hasPermission('equipment:yfysguninfo:export')
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
		addLine:{}
	},
	mounted() {
		this.query();
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
		query(){
			
			var _this = this
			var jsons = {
				id: this.q.id
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
			baseSave(_this)
		},
		exportData(){
			var _this = this;
			window.open(baseURL+ _this.url.exportUrl,'_blank')
			window.close()
		}
		
		
		
	}
});