var userId;
var validateAppid = (rule, value, callback) => {
    // debugger
    // if (type==0 && )
    // if (value==undefined){
    //     // callback(new Error('车牌号和卡号不能同时为空'))
    //     callback()
    // } else {
    //     if ((value == ''||value==undefined) && userId==null) {
    // debugger
    // if (type==1 ||type==2||userId!=null) {
    //     callback()
    // }else {
        if ((value == ''||value==undefined) && userId==null) {
            callback(new Error('不能为空'));
        }
        if (userId!=null) {
        // if (type==1 ||type==2||userId!=null) {
            callback()
        }else {
            $.ajax({
                type: "post",
                url: baseURL + "payment/yfyspayment/check",
                dataType: 'json',
                data: {
                    appid:value
                },
                success: function(r){
                    if(r.code == 0){
                        callback()
                    }else{
                        callback(new Error(r.msg))
                    }
                }
            });
        }
    }

var vm = new Vue({
	el:'#app',
	data:{
		url:{
			listUrl: "payment/yfyspayment/list",
			addUrl: "payment/yfyspayment/save",
			updateUrl: "payment/yfyspayment/update",
			deleteUrl: "payment/yfyspayment/delete",
			exportUrl: "payment/yfyspayment/export"
		},
		p:{
			addShow: hasPermission('payment:yfyspayment:save'),
			updateShow: hasPermission('payment:yfyspayment:update'),
			deleteShow: hasPermission('payment:yfyspayment:delete'),
			exportShow: hasPermission('payment:yfyspayment:export')
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
        operators: [],
		addLine:{},
		rules: {
			appid:[
				{required: true, trigger: 'blur',validator: validateAppid}
			]
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
            _this.getOperators()
			var jsons = {
				appid: this.q.id
			}
			_this.tableLoading = true
			baseGetData(_this,jsons)
			
		},
		updata(index,row){
			var _this = this
			_this.addLine = row
            userId=_this.addLine.id;
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
		},
		getOperators(){
		    var _this=this
            $.ajax({
                type: "get",
                url: baseURL + "payment/yfyspayment/getOperators",
                // contentType: "application/json",
                success: function(r){
                    if(r.code === 0){
                        _this.operators=r.list;
                    }else{
                        alert(r.msg);
                    }
                }
            });
		}



	}
});