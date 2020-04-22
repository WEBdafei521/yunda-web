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

var vm = new Vue({
	el:'#app',
	data:{
		url:{
			listUrl: "auth/yfybvehauth/list",
			addUrl: "auth/yfybvehauth/save",
			updateUrl: "auth/yfybvehauth/update",
			deleteUrl: "auth/yfybvehauth/delete",
			exportUrl: "auth/yfybvehauth/export",
			updateAuthUrl: "auth/yfybvehauth/updateAuth",
			addAuthUrl: "auth/yfybvehauth/addAuth",
		},
		p:{
			addShow: hasPermission('auth:yfybvehauth:save'),
			updateShow: hasPermission('auth:yfybvehauth:update'),
			deleteShow: hasPermission('auth:yfybvehauth:delete'),
			exportShow: hasPermission('auth:yfybvehauth:export'),
			ocShow: deptFun.isOcShow()
		},
		showList: true,
		tableLoading: false,
		saveLoading: false,
		addOrUpdate: "添加",
		departTypeName:departTypeName,
		q:{
			orgCode:"",
			lpn:"",
			sname:"",
			authTimeType:"",
			staNum:"",
			endNum:"",
			dept: {
				oc:"",
				s:""
			}
		},
		car: false,
		driver: false,
        edit: false,
		currentPage: 1,
		pageSizes: [10, 20, 50, 100],
		pageSize: 10,
		total: 0,
		tableData: [], 
		addLine:{},
		deptOptions: [],
		dept:{
			oc: [],
			s: []
		},
		deptProps:{
			label: "departname",
			value: "org_code"
		},
		updateDialog: false,
		update2Dialog: false,
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
		add() {
			const _this = this
			_this.showList = false
		},
		query(){
            var _this = this
            var type = getUrlParam("type");
            if(type=='0' || type==0){
                _this.driver = false;
                _this.car = true;
                var jsons = {
                    //orgCode: 		getListLastVal( this.q.orgCode),
                    orgCode: 		OrgCodeFun.getOrgCodeByQ(_this.q.dept),
                    lpn:			_this.q.lpn,
                    authTimeType:	_this.q.authTimeType
                    // sname:      _this.q.sname
                }
            }else{
                _this.driver = true;
                _this.car = false;
                var jsons = {
                    //orgCode: 		getListLastVal( this.q.orgCode),
                    orgCode: 		OrgCodeFun.getOrgCodeByQ(_this.q.dept),
                    // lpn:			_this.q.lpn,
                    authTimeType:	_this.q.authTimeType,
                    sname:      _this.q.sname
                }
            }
			debugger
			// var _this = this
			// var jsons = {
			// 	//orgCode: 		getListLastVal( this.q.orgCode),
			// 	orgCode: 		OrgCodeFun.getOrgCodeByQ(_this.q.dept),
			// 	lpn:			_this.q.lpn,
			// 	authTimeType:	_this.q.authTimeType
			// 	// sname:      _this.q.sname
			// }
			if(_this.q.staNum != 0){
				jsons.staNum = _this.q.staNum
			}
			if(_this.q.endNum != 0){
				jsons.endNum = _this.q.endNum
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
		},
		updateAuth(index,row){
			const _this = this;
			_this.addLine = row;
			_this.updateDialog = true;
		},
		addAuth(index,row){
			const _this = this;
			_this.addLine = row;
			_this.addLine.authQuantity = _this.addLine.tankCapacity;
			_this.update2Dialog = true;
		},
		authSubmit(ty){
			const _this = this;
			var url = ty == 1 ? _this.url.updateAuthUrl : _this.url.addAuthUrl;
			$.ajax({
				type: "POST",
			    url: baseURL + url,
			    contentType: "application/json",
			    data: JSON.stringify(_this.addLine),
			    success: function(r){
			    	if(r.code === 0){
						alert('操作成功', function(index){
							_this.updateDialog = false;
							_this.update2Dialog = false;
						});
					}else{
						alert(r.msg);
					}
				}
			});
		},
		closeDialog(){
			const _this = this;
			_this.addLine = {}
			_this.list();
			_this.query();
			_this.updateDialog = false;
			_this.update2Dialog = false;
		},
		ocChange(data){
			let stations = OrgCodeFun.getStationsByPcode(data);
			this.q.dept.s = "";
			this.dept.s = stations;
		}
		
	}
});