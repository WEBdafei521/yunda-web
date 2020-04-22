$(function () {
    $("#jqGrid").jqGrid({
        url: baseURL + 'sys/role/list',
        datatype: "json",
        colModel: [			
			// { label: '角色ID', name: 'roleId', index: "role_id", width: 45, key: true },
			{ label: '角色名称', name: 'roleName', index: "role_name", width: 75 },
			{ label: '备注', name: 'remark', width: 100 },
			{ label: '创建时间', name: 'createTime', index: "create_time", width: 80}
        ],
		viewrecords: true,
        height: 385,
        rowNum: 10,
		rowList : [10,30,50],
        rownumbers: true, 
        rownumWidth: 25, 
        autowidth:true,
        multiselect: true,
        pager: "#jqGridPager",
        jsonReader : {
            root: "page.list",
            page: "page.currPage",
            total: "page.totalPage",
            records: "page.totalCount"
        },
        prmNames : {
            page:"page", 
            rows:"limit", 
            order: "order"
        },
        gridComplete:function(){
        	//隐藏grid底部滚动条
			$("#jqGrid").closest(".ui-jqgrid-bdiv").css({ "overflow-x" : "hidden" }); 
		},
		loadComplete: function () {             
			//debugger;
			//在表格加载完成后执行
			var ids = $("#jqGrid").jqGrid("getDataIDs");//获取所有行的id
			var rowDatas = $("#jqGrid").jqGrid("getRowData");//获取所有行的数据
			for(var ii=0;ii <= rowDatas.length;ii++){
				$("#"+ids[ii]+ " td").css("border","0");
			}
		},
		gridComplete: function(){
			              $('#list').closest("div.ui-jqgrid-view")
			                 .children("div.ui-jqgrid-titlebar")
			                 .css("text-align", "center")
			                 .children("span.ui-jqgrid-title")
			                 .css("float", "none");
			         }
    });
});

var setting = {
	data: {
		simpleData: {
			enable: true,
			idKey: "menuId",
			pIdKey: "parentId",
			rootPId: -1
		},
		key: {
			url:"nourl"
		}
	},
	check:{
		enable:true,
		nocheckInherit:true
	}
};
var ztree;
	
var vm = new Vue({
	el:'#app',
	data:{
		q:{
			roleName: null
		},
		showList: true,
		title:"添加角色",
		role:{},
		tableData:[],
		tableLoading: false,

		currentPage: 1,
		totalCount:"",
		limit:"10"
	},
	mounted(){
		var _this = this;
		_this.getTableData()
	},
	methods: {
		handleSizeChange(val) {
			_this.limit = val;
			_this.getTableData();
			console.log(`每页 ${val} 条`);
		},
		handleCurrentChange(val) {
			var _this = this;
			_this.currentPage = val;
			_this.getTableData();
			console.log(`当前页: ${val}`);
		},
		query: function () {
			vm.reload();
			vm.title = "添加角色";
		},
		getTableData(){
			var _this = this;
			$.ajax({
					type: "POST",
					url: baseURL + "sys/role/list",
					datatype: "json",
					data:{
						page:_this.currentPage,
						limit:_this.limit
					},
					success: function(r){
						_this.tableData = r.page.list;
						_this.tableLoading = true;
						_this.currentPage = r.page.currPage;
						_this.totalCount = r.page.totalCount;
				}
			});
			
		},
		add: function(){
			
			vm.showList = false;
			vm.title = "添加角色";
			vm.role = {};
			vm.getMenuTree(null);
		},
		update: function (e) {
			var roleId = e.target.id;
			if(roleId == null){
				return ;
			}
			vm.showList = false;
            vm.title = "修改角色";
            vm.getMenuTree(roleId);
		},
		del: function (e) {
			var arr=[];
			arr.push(e.target.id)
			var roleIds = arr;
			if(roleIds == null){
				return ;
			}
			
			confirm('确定要删除选中的记录？', function(){
				$.ajax({
					type: "POST",
				    url: baseURL + "sys/role/delete",
                    contentType: "application/json",
				    data: JSON.stringify(roleIds),
				    success: function(r){
						if(r.code == 0){
							alert('操作成功', function(index){
								vm.reload();
								vm.getTableData();
							});
						}else{
							alert(r.msg);
						}
					}
				});
			});
		},
		getRole: function(roleId){
            $.get(baseURL + "sys/role/info/"+roleId, function(r){
            	vm.role = r.role;
                
                //勾选角色所拥有的菜单
    			var menuIds = vm.role.menuIdList;
    			for(var i=0; i<menuIds.length; i++) {
    				var node = ztree.getNodeByParam("menuId", menuIds[i]);
    				ztree.checkNode(node, true, false);
    			}
    		});
		},
		saveOrUpdate: function () {
            if(vm.validator()){
                return ;
            }

			//获取选择的菜单
			var nodes = ztree.getCheckedNodes(true);
			var menuIdList = new Array();
			for(var i=0; i<nodes.length; i++) {
				menuIdList.push(nodes[i].menuId);
			}
			vm.role.menuIdList = menuIdList;
			
			var url = vm.role.roleId == null ? "sys/role/save" : "sys/role/update";
			$.ajax({
				type: "POST",
			    url: baseURL + url,
                contentType: "application/json",
			    data: JSON.stringify(vm.role),
			    success: function(r){
			    	if(r.code === 0){
						alert('操作成功', function(){
							vm.reload();
						});
					}else{
						alert(r.msg);
					}
				}
			});
		},
		getMenuTree: function(roleId) {
			//加载菜单树
			$.get(baseURL + "sys/menu/list", function(r){
				ztree = $.fn.zTree.init($("#menuTree"), setting, r);
				//展开所有节点
				ztree.expandAll(true);
				
				if(roleId != null){
					vm.getRole(roleId);
				}
			});
	    },
	    reload: function () {
	    	vm.showList = true;
			var page = $("#jqGrid").jqGrid('getGridParam','page');
			$("#jqGrid").jqGrid('setGridParam',{ 
                postData:{'key': vm.q.roleName},
                page:page
            }).trigger("reloadGrid");
		},
        validator: function () {
            if(isBlank(vm.role.roleName)){
                alert("角色名不能为空");
                return true;
            }
        }
	}
});