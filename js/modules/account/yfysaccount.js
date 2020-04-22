var validateAddBlance = (rule, value, callback) => {
    if (value === '') {
        callback(new Error("不能为空，请选择"))
    }else {
        callback()
    }
};
var vm = new Vue({
	el:'#app',
	data:{
		url:{
			listUrl: "account/yfysaccount/list",
			// listUrl: "account/yfysaccount/getAccount",
			addUrl: "account/yfysaccount/save",
			updateUrl: "account/yfysaccount/update",
			deleteUrl: "account/yfysaccount/delete",
			exportUrl: "account/yfysaccount/export"
		},
		p:{
			addShow: hasPermission('account:yfysaccount:save'),
			updateShow: hasPermission('account:yfysaccount:update'),
			deleteShow: hasPermission('account:yfysaccount:delete'),
			exportShow: hasPermission('account:yfysaccount:export')
		},
		showList: true,
        upList: false,
		tableLoading: false,
		saveLoading: false,
		addOrUpdate: "",
		q:{
			id:""
		},
		currentPage: 1,
		pageSizes: [10, 20, 50, 100],
		pageSize: 10,
		total: 0,
		tableData: [], 
		addLine:{
            addBlance: ''
		},
        rules: {
            addBlance: [
                {required: true, trigger: 'blur', message: '请输入充值金额'},
            ],
        }
	},
	mounted() {
		this.query();
	},
	methods: {
		/* 列表按钮点击对应函数 */
		list() {
			const _this = this
			_this.showList = true
            _this.upList = false
			_this.addLine = {}
			_this.addOrUpdate = ""
		},
		/* 添加按钮点击对应函数 */
		add() {
			const _this = this
			_this.showList = false
		},
		query(){
			
			var _this = this
			var jsons = {
				username: this.q.id
			}
			_this.tableLoading = true
			baseGetData(_this,jsons)
			
		},
		updata(index,row){
			var _this = this
			_this.addLine = row
			_this.addOrUpdate = "充值"
			_this.upList = true
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
		save(formName){
			var _this = this;
            var check=true;
            _this.$refs[formName].validate((valid) => {
                debugger
                if (valid) {
//		            alert('submit!');
                } else {
                    console.log('error submit!!');
                    check = false;
                    return false;
                }
            });
            if (check){
                baseSave(_this)
			}

		},
		exportData(){
			var _this = this;
			window.open(baseURL+ _this.url.exportUrl,'_blank')
			window.close()
		},
        updateStatusRow(index, row) {
            var _this = this
            var id = [row.id]
            _this.addLine = row
            var status = row.lockStatus == '0' ? "解锁":"锁定";
            confirm('确定要'+status+'此账户吗？', function() {
                debugger
                _this.addLine.lockStatus=Math.abs(parseInt(row.lockStatus)-1);
                $.ajax({
                    type: "POST",
                    url: baseURL + _this.url.updateUrl,
                    contentType: "application/json",
                    data: JSON.stringify(_this.addLine),
                    success: function(r) {
                        if (r.code == 0) {
                            alert('操作成功', function(index) {
                                _this.query();
                            });
                        } else {
                            alert(r.msg);
                        }
                    }
                });
            });
        },


		
		
		
	}
});