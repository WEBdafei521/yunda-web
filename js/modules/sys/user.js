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


var tableIns;
$(function () {
	layui.use('table', function(){
		var table = layui.table;
	  
		tableIns = table.render({
			elem: '#jqGrid'
			,height: 'full-70'
			,url:baseURL + 'sys/user/list'
			,page: { 
			  layout: ['limit', 'count', 'prev', 'page', 'next', 'skip'] 
			  ,groups: 1 
			  ,first: false 
			  ,last: false 
			},
			parseData: function(res){ 
				return layui_table_parseData(res);
			}
			,cols: [[
			  /* {field:'userId', title: '用户ID', sort: true} */
			  {field:'username', title: '用户名',width: 120}
			  ,{field:'departName',width: 200, title: '石油公司/油站'}
			  ,{field:'roleName',width: 200, title: '角色'}
			  ,{field:'email',width: 180, title: '邮箱'}
			  ,{field:'mobile',width: 120, title: '手机号'}
			  ,{field:'status', title: '状态',width: 80,templet: function(res){
				  return res.status === 0 ? 
				  	'<span class="label label-danger">禁用</span>' : 
				  	'<span class="label label-success">正常</span>';
			  }}
			  ,{filed:'',title: '操作',width: 220,templet: function(res){
					var op_html = "";
					op_html += hasPermission('sys:user:update') ? 
					'<a class="btn btn-default  layui-btn-xs" style="width:50px;height:30px;text-align:center;line-height: 30px;background:#409eff;color:#fff;border:0;margin-right:5px;" onclick="vm.update('+res.userId+')"><i class="fa fa-pencil-square-o"></i>&nbsp;修改</a>'+
					'<a class="btn btn-default  layui-btn-xs" style="width:80px;height:30px;text-align:center;line-height: 30px;background:#409eff;color:#fff;border:0;margin-right:5px;" st onclick="vm.updatePassword('+res.userId+')"><i class="fa fa-pencil-square-o"></i>&nbsp;重置密码</a>'
					: ''
					if(res.roleName!='OIL_ADMIN_NODELETE' || getLoginUser().username == 'admin'){
						op_html += hasPermission('sys:user:delete') ? '<a class="btn btn-default layui-btn-xs" style="width:50px;height:30px;text-align:center;line-height: 30px;color:#fff;border:0;background:#f56c6c;" onclick="vm.del('+res.userId+')"><i class="fa fa-trash-o"></i>&nbsp;删除</a>' : ''
					}
					return op_html;
			  }}
			]],
			
		  });
	  
	  
	});
	
});

var vm = new Vue({
	el:'#app',
	data:{
		q:{
			username: null
		},
		showList: true,
		title:null,
		roleList:{},
		user:{
			status:1,
			roleIdList:[],
			updateMyself: false
		},
		departname: null,
		showRoleFlag: true,

		// currentPage: 1,
		// pageSizes: [10, 20, 50, 100],
		// pageSize: 10,
		// tableData:[],
		// loading:false
	},
	mounted(){
		// this.getDate()
	},
	methods: {
		getDate(){
			var _this=this;
			var jsons={};
			jsons.page= _this.currentPage;
			jsons.limit= _this.pageSize	;
			$.ajax({
				type: "GET",
				url: baseURL + "sys/user/list",
				contentType: "application/json;charset=UTF-8",
				data: {
					page: _this.currentPage,
					limit:_this.pageSize
				},
				success: function(res){
					if(res.code==0){
						_this.tableData=res.page.list
					}
				}
			})
		},
		query: function () {
			vm.reload();
		},
		add: function(){
			vm.showList = false;
			vm.title = "新增";
			vm.roleList = {};
			vm.user = {status:1,roleIdList:[]};
			
			//获取角色信息
			this.getRoleList();
			this.getyfySDepart();
		},
		update: function (userId) {
			
			var _this = this;
			vm.showRoleFlag=true;
			vm.user = {}
			$.get(baseURL + "sys/user/info/"+userId, function(r){
				var loginUser = getLoginUser();
				
				vm.user = r.user;
				vm.user.password = null;
				
				vm.showList = false;
				vm.title = "修改";
				//修改自身的信息，不允许修改角色和状态
				if(r.user.userId==loginUser.userId){
					vm.showRoleFlag=false;
					vm.user.updateMyself = true;
				}
				_this.getRoleList();
				_this.getyfySDepart();
				
			});
			
			
		},
		del: function (userId) {
			var userIds = [userId];
			confirm('确定要删除选中的记录？', function(){
				$.ajax({
					type: "POST",
				    url: baseURL + "sys/user/delete",
                    contentType: "application/json",
				    data: JSON.stringify(userIds),
				    success: function(r){
						if(r.code == 0){
							alert('操作成功', function(){
                                vm.reload();
							});
						}else{
							alert(r.msg);
						}
					}
				});
			});
		},
		saveOrUpdate: function () {
            if(vm.validator()){
                return ;
            }
			var url = vm.user.userId == null ? "sys/user/save" : "sys/user/update";
			$.ajax({
				type: "POST",
			    url: baseURL + url,
                contentType: "application/json",
			    data: JSON.stringify(vm.user),
			    success: function(r){
						console.log(r)
						console.log("------------------------------")
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
		getUser: function(userId){
			vm.user = {}
			$.get(baseURL + "sys/user/info/"+userId, function(r){
				vm.user = r.user;
				vm.user.password = null;
			});
		},
		getRoleList: function(){
			$.get(baseURL + "sys/role/select", function(r){
				vm.roleList = r.list;
			});
		},
		reload: function () {
			vm.showList = true;
			tableIns.reload({
				where: {
					'key': vm.q.username
				},
			})
		},
        validator: function () {
            if(isBlank(vm.user.username)){
                alert("用户名不能为空");
                return true;
            }
            if(isBlank(vm.user.email)){
                alert("邮箱不能为空");
                return true;
            }

            if(!validator.isEmail(vm.user.email)){
                alert("邮箱格式不正确");
                return true;
			}
        },
		getyfySDepart: function(){
		    //加载菜单树
		    $.get(baseURL + "yunda/yfysdepart/list?type=0", function(r){
		    	
		        ztree = $.fn.zTree.init($("#yfySDepartTree"), setting, r.list);
				
				
				var node = ztree.getNodeByParam("orgCode", vm.user.orgCode);
				
				if(node == null){
					vm.departname = null;
				}else{
					vm.departname = node.departname;
				}
		        ztree.selectNode(node);
		    })
		},
		yfySDepartTree: function(){
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
		            vm.user.orgCode = node[0].orgCode;
		            vm.departname = node[0].departname;
		            layer.close(index);
		        }
		    });
		},
		updatePassword:function(id){
			alert("重置密码")
		}
	}
});
