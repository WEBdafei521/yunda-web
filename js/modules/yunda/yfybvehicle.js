
var validateCode = (rule, value, callback) => {
    console.log(value)
    if (value === '') {
        callback(new Error('不能为空'));
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
			listUrl: "yunda/yfybvehicle/list",
			addUrl: "yunda/yfybvehicle/save",
			updateUrl: "yunda/yfybvehicle/update",
			deleteUrl: "yunda/yfybvehicle/delete",
			exportUrl: "yunda/yfybvehicle/export",
			getAddTankInfoUrl: "equipment/yfystank/getAddTankInfo",
		},
		p:{
			addShow: hasPermission('yunda:yfybvehicle:save'),
			updateShow: hasPermission('yunda:yfybvehicle:update'),
			deleteShow: hasPermission('yunda:yfybvehicle:delete'),
			exportShow: hasPermission('yunda:yfybvehicle:export')
		},
		showList: true,
		tableLoading: false,
		saveLoading: false,
		addOrUpdate: "添加",
		q:{
			lpn:""
		},
		itemName:"",
		currentPage: 1,
		pageSizes: [10, 20, 50, 100],
		pageSize: 10,
		total: 0,
		tableData: [], 
		addLine:{
			oilCode:""
		},
		goodsOption:[],
		rules: {
		          lpn: [//需要验证的字段名，下面的只是栗子，有些不能同时存在一个验证内
		            { required: true, message: '必填项', trigger: 'blur' },
		          ],
		          oilCode: [//需要验证的字段名，下面的只是栗子，有些不能同时存在一个验证内
		        	  { required: true, message: '必选项', },
		        	  ],
		          tankCapacity: [
			            { required: true, message: '必填，且只能填数字', trigger: 'blur',type:'number' },
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
			_this.addLine = {
				oilCode:""
			}
			_this.addOrUpdate = "添加"
		},
		/* 添加按钮点击对应函数 */
		add() {
			debugger
			const _this = this
			_this.showList = false
			
			$.get(baseURL + _this.url.getAddTankInfoUrl, function(r){
				
				_this.goodsOption =r.data.goods
			});
			if(_this.addLine.oilCode){
				_this.addLine.oilCode = parseInt(_this.addLine.oilCode);
			}
			_this.$refs['addLine'].clearValidate();
			_this.getOil();
		},
		query(){
			
			var _this = this
			var jsons = {
				lpn: this.q.lpn
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
		save(formName){
			var _this = this;
			var check = true;
			_this.$refs[formName].validate((valid) => {
		          if (valid) {
//		            alert('submit!');
		          } else {
		            console.log('error submit!!');
		            check = false;
		            return false;
		          }
		        });
			if(check){
				baseSave(_this)
			}
		},
		exportData(){
			var _this = this;
			window.open(baseURL+ _this.url.exportUrl,'_blank')
			window.close()
		},
		oilChange(){
			var _this = this;
			_this.$refs['addLine'].clearValidate('oilCode');
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
					_this.addLine.oilCode = node.oilCode;
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
					_this.addLine.oilCode = node[0].oilCode;
					_this.itemName = node[0].oilName;
					
		            layer.close(index);
		        }
		    });
		},
		
		
		
	}
});
