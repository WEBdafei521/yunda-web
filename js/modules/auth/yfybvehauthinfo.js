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
			listUrl: "auth/yfybvehauthinfo/list?authType=1",
			addUrl: "auth/yfybvehauthinfo/save",
			updateUrl: "auth/yfybvehauthinfo/update",
			deleteUrl: "auth/yfybvehauthinfo/delete",
			exportUrl: "auth/yfybvehauthinfo/export"
		},
		p:{
			addShow: hasPermission('auth:yfybvehauthinfo:save'),
			updateShow: hasPermission('auth:yfybvehauthinfo:update'),
			deleteShow: hasPermission('auth:yfybvehauthinfo:delete'),
			exportShow: hasPermission('auth:yfybvehauthinfo:export'),
			ocShow: deptFun.isOcShow()
		},
		showList: true,
		tableLoading: false,
		saveLoading: false,
		addOrUpdate: "添加",
		q:{
			orgCode:"",
			time:[],
			lpn:"",
            sname:"",
			dept: {
				oc:"",
				s:""
			}
		},
        car: false,
        driver: false,
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
                    //orgCode: getListLastVal( this.q.orgCode),
                    orgCode: OrgCodeFun.getOrgCodeByQ(_this.q.dept),
                    lpn: _this.q.lpn
                }
            }else{
                _this.driver = true;
                _this.car = false;
                var jsons = {
                    //orgCode: getListLastVal( this.q.orgCode),
                    orgCode: OrgCodeFun.getOrgCodeByQ(_this.q.dept),
                    sname:      _this.q.sname
                }
            }
			// var jsons = {
			// 	//orgCode: getListLastVal( this.q.orgCode),
			// 	orgCode: OrgCodeFun.getOrgCodeByQ(_this.q.dept),
			// 	lpn: _this.q.lpn
			// }
			if(_this.q.time != null &&  _this.q.time.length == 2){
				jsons.staTime = formatDate(_this.q.time[0])
				jsons.endTime = formatDate(_this.q.time[1])
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
		ocChange(data){
			let stations = OrgCodeFun.getStationsByPcode(data);
			this.q.dept.s = "";
			this.dept.s = stations;
		}
		
		
		
	}
});