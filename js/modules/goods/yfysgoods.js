
var c_goodsCode = (rule, value, callback) => {
	if (YDCP.isFalse(value)) {
		return callback(new Error('不能为空'));
	} else {
		callback();
	}
};
var c_goodsName = (rule, value, callback) => {
	if (YDCP.isFalse(value)) {
		return callback(new Error('不能为空'));
	} else {
		callback();
	}
};
var c_abbreviate = (rule, value, callback) => {
	if (YDCP.isFalse(value)) {
		return callback(new Error('不能为空'));
	}else {
		callback();
	}
};
var c_price = (rule, value, callback) => {
	if (YDCP.isFalse(value)) {
		return callback(new Error('不能为空'));
	}else if(!YDCP.checkStr(value, "double")){
		return callback(new Error('请输入正确格式'));
	}else if(value <= 0){
		return callback(new Error('请输入大于零的数值'));
	} else {
		callback();
	}
};
var c_goodsDetails = (rule, value, callback) => {
	if (YDCP.isFalse(value)) {
		return callback(new Error('不能为空'));
	} else {
		callback();
	}
};

var setting = {
    data: {
        simpleData: {
            enable: true,
            idKey: "oilCode",
            pIdKey: "parentCode",
            rootPId: null
        },
        key: {
            url:"nourl",
			name:"oilName"
        }
    }
};
var ztree;

var vm = new Vue({
	el:'#app',
	data:{
		url:{
			listUrl: "goods/yfysgoods/list",
			addUrl: "goods/yfysgoods/save",
			updateUrl: "goods/yfysgoods/update",
			deleteUrl: "goods/yfysgoods/delete",
			exportUrl: "goods/yfysgoods/export",
			getGunsByGoodsUrl: "goods/yfysgoods/getGunsByGoods/",
			modifyPriceUrl: "goods/yfysgoods/modifyPrice"
		},
		p:{
			addShow: hasPermission('goods:yfysgoods:save'),
			updateShow: hasPermission('goods:yfysgoods:update'),
			deleteShow: hasPermission('goods:yfysgoods:delete'),
			exportShow: hasPermission('goods:yfysgoods:export'),
			ocShow: deptFun.isOcShow()
		},
		showList: true,
		tableLoading: false,
		saveLoading: false,
		fullscreenLoading: false,
		addOrUpdate: "添加",
		q:{
			orgCode:"",
			goodsCode:"",
			goodsName:"",
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
		addLine:{
			abbreviate:""
		},
		rules: {
			goodsCode: [{
				validator: c_goodsCode,
				trigger: 'blur'
			}],
			goodsName: [{
				validator: c_goodsName,
				trigger: 'blur'
			}],
			abbreviate: [{
				validator: c_abbreviate,
				trigger: 'blur'
			}],
			price: [{
				validator: c_price,
				trigger: 'blur'
			}],
			goodsDetails: [{
				validator: c_goodsDetails,
				trigger: 'blur'
			}],
		},
		nowDate:"",
		itemName:"",
		departTypeName:departTypeName,
		updatePriceDialog: false,
		updatePriceForm: {},
		yqData: [],
		yqTableSelection: [],
		deptOptions: [],
		dept:{
			oc: [],
			s: []
		},
		deptProps:{
			label: "departname",
			value: "org_code"
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
			_this.getOil()
		},
		query(){
			
			var _this = this
			var jsons = {
				//orgCode: getListLastVal( this.q.orgCode),
				orgCode: OrgCodeFun.getOrgCodeByQ(_this.q.dept),
				goodsCode:_this.q.goodsCode,
				goodsName:_this.q.goodsName
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
		getOil: function(){
			
			const _this = this;
			
		    //加载菜单树
		    $.get(baseURL + "yunda/yfydoil/list?page=1&limit=200&languageId=2052", function(r){
				ztree = $.fn.zTree.init($("#oilTree"), setting, r.page.list);
				console.log(_this.addLine.itemId)
				if(_this.addLine.itemId != undefined){
					var node = ztree.getNodeByParam("id", _this.addLine.itemId);
					ztree.selectNode(node);
					
					_this.addLine.itemId = node.oilCode;
					_this.addLine.goodsCode = node.oilCode;
					_this.addLine.goodsName = node.oilName;
					_this.addLine.abbreviate = node.oilName;
					_this.itemName = node.oilName;
				}
		    })
		},
		oilTree: function(){
			
			const _this = this;
//			_this.addLine.orgCode = "A001A001"
			
		    layer.open({
		        type: 1,
		        offset: '50px',
		        title: "选择",
		        area: ['300px', '450px'],
//		        shade: 0,
		        shadeClose: false,
		        content: jQuery("#oilLayer"),
		        btn: ['确定', '取消'],
		        btn1: function (index) {
					
					
		            var node = ztree.getSelectedNodes();
		            //选择
					_this.addLine.itemId = node[0].id;
					_this.addLine.goodsCode = node[0].oilCode;
					_this.addLine.goodsName = node[0].oilName;
					_this.addLine.abbreviate = node[0].oilName;
					_this.itemName = node[0].oilName;
					
		            layer.close(index);
		        }
		    });
		},
		yqTableSelectionChange(val){
			this.yqTableSelection = val
		},
		updatePrice(index,row){
			
			const _this = this
			_this.updatePriceForm = {}
			
			_this.updatePriceForm.goodsName = row.goodsName
			_this.updatePriceForm.price = row.price
			_this.updatePriceForm.id = row.id
			$.get(baseURL + this.url.getGunsByGoodsUrl + "/" + row.id, function(r){
				_this.yqData = r.guns
				_this.updatePriceDialog = true
			})
		},
		savePrice(){
			this.fullscreenLoading = true;
			const _this = this
			let gunIds = ""
			_this.yqTableSelection.forEach(row => {
				gunIds += row.id+","
			});
			if(gunIds==""){
				alert("请先选择要调价的油枪！");
				_this.fullscreenLoading = false;
				return;
			}
			_this.updatePriceForm.gunIds = gunIds
			$.ajax({
				type: "POST",
			    url: baseURL + _this.url.modifyPriceUrl,
			    contentType: "application/json",
			    data: JSON.stringify(_this.updatePriceForm),
			    success: function(r){
			    	if(r.code === 0){
						_this.updatePriceDialog = false;
						_this.fullscreenLoading = false;
						alert(r.msg, function(index){
							_this.updatePriceForm = {}
							_this.query()
						});
					}else{
						alert(r.msg);
					}
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