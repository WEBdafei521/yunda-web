var setting = {
    data: {
        simpleData: {
            enable: true,
            idKey: "id",
            pIdKey: "parentdepartid",
            rootPId: 0
        },
        key: {
            url:"nourl",
            name:"departname"
        }
    }
};
var ztree;
var vm = new Vue({
    el: '#app',
    data: {
        url: {
            listUrl: "equipment/yfysequipment/list",
            addUrl: "equipment/yfysequipment/save",
            updateUrl: "equipment/yfysequipment/update",
            deleteUrl: "equipment/yfysequipment/delete",
            exportUrl: "equipment/yfysequipment/export"
        },
        p: {
            addShow: hasPermission('equipment:yfysequipment:save'),
            updateShow: hasPermission('equipment:yfysequipment:update'),
            deleteShow: hasPermission('equipment:yfysequipment:delete'),
            exportShow: hasPermission('equipment:yfysequipment:export')
        },
        showList: true,
        tableLoading: false,
        saveLoading: false,
        addOrUpdate: "添加",
        q: {
            id: ""
        },
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        pageSize: 10,
        total: 0,
        tableData: [],
        addLine: {
        	orgCode:""
        },
        departname: null,
        pickerOptions1: {
            shortcuts: [{
                text: '今天',
                onClick(picker) {
                    picker.$emit('pick', new Date());
                }
            }, {
                text: '昨天',
                onClick(picker) {
                    const date = new Date();
                    date.setTime(date.getTime() - 3600 * 1000 * 24);
                    picker.$emit('pick', date);
                }
            }, {
                text: '一周前',
                onClick(picker) {
                    const date = new Date();
                    date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                    picker.$emit('pick', date);
                }
            }]
        },
        value1: '',
        value2: '',
        equipmentType: [
            {
                value: '1',
                label: "油枪智能控制器"
            },
            {
                value: '2',
                label: "液位控制器"
            }
        ]
    },
    // equipmentType: [
    //     {
    //         value: '1',
    //         label: "油枪智能控制器"
    //     },
    //     {
    //         value: '2',
    //         label: "液位控制器"
    //     }
    // ]


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
			this.getyfySDepart();
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
			this.getyfySDepart();
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
		getyfySDepart: function(){
		    //加载菜单树
		    $.get(baseURL + "yunda/yfysdepart/list?type=0", function(r){
		    	
		        ztree = $.fn.zTree.init($("#yfySDepartTree"), setting, r.list);
				
				
				var node = ztree.getNodeByParam("orgCode", getLoginUser().orgCode);
				
				if(node == null){
					vm.departname = null;
				}else{
					vm.departname = node.departname;
				}
		        ztree.selectNode(node);
		    })
		},
		yfySDepartTree: function(){
			var _this = this;
		    layer.open({
		        type: 1,
		        offset: '50px',
		        skin: 'layui-layer-molv',
		        title: "选择石油公司/油站",
		        area: ['300px', '450px'],
//		        shade: 0,
		        shadeClose: false,
		        content: jQuery("#yfySDepartLayer"),
		        btn: ['确定', '取消'],
		        btn1: function (index) {
		            var node = ztree.getSelectedNodes();
		            //选择上级菜单
		            _this.addLine.orgCode = node[0].orgCode;
		            layer.close(index);
		        }
		    });
		}
		
		
		
	}
});