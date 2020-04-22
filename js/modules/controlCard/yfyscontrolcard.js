
var userId;
var type;
var validateLpn = (rule, value, callback) => {
    // debugger
	// if (type==0 && )
	// if (value==undefined){
    //     // callback(new Error('车牌号和卡号不能同时为空'))
    //     callback()
	// } else {
    //     if ((value == ''||value==undefined) && userId==null) {
    debugger
    if (type==1 ||type==2||userId!=null) {
        callback()
    }else {
        if ((value == ''||value==undefined) && userId==null) {
            callback(new Error('车牌号不为空'));
        }
            // if (userId!=null) {
            // if (type==1 ||type==2||userId!=null) {
            //     callback()
            // }
            else {
                $.ajax({
                    type: "post",
                    url: baseURL + "controlCard/yfyscontrolcard/check",
                    dataType: 'json',
                    data: {
                        lpn:value
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
	// }
}
var validateCardNumber = (rule, value, callback) => {
    // debugger
    // if (value==undefined){
    //     // callback(new Error('车牌号和卡号不能同时为空'))
    //     callback()
    // } else{
    debugger
    if (type==0 ||type==2||userId!=null ) {
           callback()
          }else {
             if ((value == ''||value==undefined) && userId==null) {
                     callback(new Error('卡号不为空'));
                  }
            // if (userId!=null ) {
           else {
                $.ajax({
                    type: "post",
                    url: baseURL + "controlCard/yfyscontrolcard/check",
                    dataType: 'json',
                    data: {
                        cardNumber:value
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
	// }
}
var validateUsername = (rule, value, callback) => {
    debugger
    // if (value==undefined){
    //     // callback(new Error('车牌号和卡号不能同时为空'))
    //     callback()
    // } else{
    if (type==1 ||type==0||userId!=null ) {
    // if (userId!=null ) {
        callback()
    }
     else {
        if ((value == ''||value==undefined) && userId==null) {
            callback(new Error('司机不为空'));
        }
       else {
            $.ajax({
                type: "post",
                url: baseURL + "controlCard/yfyscontrolcard/check",
                dataType: 'json',
                data: {
                    username:value
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
    // }
}
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
			listUrl: "controlCard/yfyscontrolcard/list",
			addUrl: "controlCard/yfyscontrolcard/save",
			updateUrl: "controlCard/yfyscontrolcard/update",
			deleteUrl: "controlCard/yfyscontrolcard/delete",
			exportUrl: "controlCard/yfyscontrolcard/export"
		},
		p:{
			addShow: hasPermission('controlCard:yfyscontrolcard:save'),
			updateShow: hasPermission('controlCard:yfyscontrolcard:update'),
			deleteShow: hasPermission('controlCard:yfyscontrolcard:delete'),
			exportShow: hasPermission('controlCard:yfyscontrolcard:export')
		},
		showList: true,
		tableLoading: false,
		saveLoading: false,
		addOrUpdate: "添加",
		q:{
			id:""
		},
		currentPage: 1,
        edit: false,
        edit1: false,
        pageSizes: [10, 20, 50, 100],
		pageSize: 10,
		total: 0,
		tableData: [], 
		addLine:{
            oilName: "",
			oilCode: ""
		},

		rules: {
            lpn: [
                { required: true, trigger: 'blur',validator: validateLpn },
            ],

            cardNumber: [
    			{ required: true, trigger: 'blur',validator: validateCardNumber },
			],
            username: [
                { required: true, trigger: 'blur',validator: validateUsername },
            ],
            authType: [
                { required: true, trigger: 'blur',message: '类型不能为空' },
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
			_this.addLine = {}
			_this.addOrUpdate = "添加"
            // location.reload();
		},
		/* 添加按钮点击对应函数 */
		add() {
			const _this = this
			_this.showList = false

            _this.getOil()
            _this.$refs['addLine'].clearValidate();
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
            userId=_this.addLine.id;
			_this.chan(_this.addLine.authType)
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
        chan(value){
		    var _this=this
            // _this.edit1=true
            // _this.edit2=true
            // _this.edit=true
		    debugger
		    if (value==0){
                _this.edit=true
                _this.edit1=false
            }else {
                if (value==2){
                    _this.edit1=true
                    _this.edit=false
                }
                // else {
                //     _this.edit2=false
                // }
            }

        },
		handleCurrentChange(val) {
			this.currentPage = val
			this.query();
		},
		save(formName){
			// debugger
			var _this = this;
            var check = true;
            // if(_this.addLine.password==null || _this.addLine.password ==''){
            //     _this.addLine.password=_this.addLine.password_bak;
            // }
            type=_this.addLine.authType
            _this.$refs[formName].validate((valid) => {
                // debugger
                if (  (_this.addLine.lpn==undefined ||_this.addLine.lpn=='') &&
                    (_this.addLine.cardNumber==undefined || _this.addLine.cardNumber=='')&&
                    (_this.addLine.username==undefined || _this.addLine.username=='')  ){
                    valid=false

                } else {
                    valid=true
                }
                if (valid) {
//		            alert('submit!');
                    baseSave(_this)
                } else {
                    console.log('error submit!!');
                    check = false;
                    return false;
                }
            });
			// baseSave(_this)
		},
		exportData(){
			var _this = this;
			window.open(baseURL+ _this.url.exportUrl,'_blank')
			window.close()
		},
        getOil: function(){

            const _this = this;
            // debugger
            //加载菜单树
            $.get(baseURL + "yunda/yfydoil/list?page=1&limit=200&languageId=2052", function(r){
                ztree = $.fn.zTree.init($("#oilTree"), setting, r.page.list);
                // console.log(_this.addLine.itemId)
                // if(_this.addLine.itemId != undefined){
                //     var node = ztree.getNodeByParam();
                //     // debugger
                //     ztree.selectNode(node);

                    // _this.addLine.itemId = node.oilCode;
                    // _this.addLine.oilCode = node.oilCode;
                    // // _this.addLine.goodsName = node.oilName;
                    // // _this.addLine.abbreviate = node.oilName;
                    // _this.addLine.oilName = node.oilName;
                // }
            })
        },
        oilTree: function(){

            const _this = this;
            // _this.addLine.orgCode = "A001A001"
            // debugger
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
                    // debugger
                    var node = ztree.getSelectedNodes();
				    // var _this=this
                    //选择
                    // _this.addLine.itemId = node[0].id;
                    _this.addLine.oilCode = node[0].oilCode;
                    // _this.addLine.goodsName = node[0].oilName;
                    // _this.addLine.abbreviate = node[0].oilName;
                    // _this.itemName = node[0].oilName;
                    _this.addLine.oilName = node[0].oilName;

                    layer.close(index);
                }
            });
        },
		
		
		
	}
});