var userId;
var validateMobile = (rule, value, callback) => {
	console.log(value)
	        if (value === '') {
	          callback(new Error('请输入手机号'));
	        } else {
	        	var phoneReg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/
	        	 if (!phoneReg.test(value)) {
	                 callback(new Error('格式有误'))
	               } else {
	                 callback()
	               }
	          callback();
	        }
	      };
var validateCode = (rule, value, callback) => {
    console.log(value)
    if (value === '') {
        callback(new Error('不能为空'));
    } else {
        callback();
    }
};
  var validatePass = (rule, value, callback) => {
		console.log(value)
	  if (value == undefined && vm.addLine.userId == null) {
		  callback(new Error('请输入密码'));
	  } else {
		  if( vm.addLine.userId == null){
			  if ((value.length<6 || value.length>18)){
					callback(new Error('请输入6-18位字母或数字'));
				} else {
					callback();
				} 
		  }else{
			  callback();
		  }
			
	  }
  };
  var validateRole = (rule, value, callback) => {
	  if (value == '') {
		  callback(new Error('请选择角色'));
	  } else {
		  callback();
	  }
  };
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
	el:'#app',
	data:{
		url:{
			listUrl: "sys/user/list",
			addUrl: "sys/user/save",
			updateUrl: "sys/user/update",
			deleteUrl: "sys/user/delete",
			exportUrl: "sys/user/export"
		},
		p:{
			addShow: hasPermission('sys:user:save'),
			updateShow: hasPermission('sys:user:update'),
			deleteShow: hasPermission('sys:user:delete'),
			exportShow: hasPermission('sys:user:export')
		},
		showList: true,
		tableLoading: false,
		saveLoading: false,
		addOrUpdate: "添加",
		currentPage: 1,
		pageSizes: [10, 20, 50, 100],
		pageSize: 10,
		total: 0,
		tableData: [], 
		
		q:{
			username: null
		},
		roleList:{},
		addLine:{
			status:1,
			roleIdList:[],
			updateMyself: false,
			orgCode:''
		},
		departname: null,
		showRoleFlag: true,
		statusSel: [
            {
                value: 0,
                label: "禁用"
            },
            {
                value: 1,
                label: "正常"
            }
        ],
        rules: {
			username: [
	            { required: true, message: '不能为空', trigger: 'blur' },
	          ],
	          password: [
        	  { trigger: 'blur',validator: validatePass },
        	  ],
        	  email: [
    		  { required: true, message: '请填写正确数据',type:'email', trigger: 'blur' },
    		  ],
    		  mobile: [
			  { required: true,  trigger: 'blur',validator: validateMobile },
			  ],
			  orgCode: [
				  { required: true,  message: '不能为空' },
			  ],
			  roleIdList: [
				  { required: true,  trigger: 'blur',validator: validateRole},
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
			_this.addLine = {
				status:1,
				roleIdList:[],
				updateMyself: false,
				orgCode:''
			}
			_this.addOrUpdate = "添加"
		},
		/* 添加按钮点击对应函数 */
		add() {
			const _this = this;
			_this.showList = false;
			//获取角色信息
			_this.getRoleList();
			_this.getyfySDepart();
			_this.$refs['addLine'].clearValidate();
		},
		query(){
			debugger
			var _this = this
			var jsons = {
				key: _this.q.username,
				status: '1'
			}
			_this.tableLoading = true
			baseGetData(_this,jsons)
			
		},
		updata(index,row){
			var _this = this
			debugger
			$.get(baseURL + "sys/user/info/"+row.userId, function(r){
				var loginUser = getLoginUser();
				
				_this.addLine = r.user;
				_this.addLine.password = null;
				
				//修改自身的信息，不允许修改角色和状态
				if(_this.addLine.userId==loginUser.userId){
					vm.showRoleFlag=false;
					_this.addLine.updateMyself = true;
				}
				_this.addLine.id = r.user.userId;
			});
			
			
			_this.addOrUpdate = "修改"
			_this.add()
		},
		deleteRow(index,row){
			var _this = this
			var ids = [row.userId]
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
				debugger
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
		getRoleList: function(){
			$.get(baseURL + "sys/role/select", function(r){
				vm.roleList = r.list;
			});
		},
		getyfySDepart: function(){
		    //加载菜单树
		    $.get(baseURL + "yunda/yfysdepart/list?type=0", function(r){
		    	
		        ztree = $.fn.zTree.init($("#yfySDepartTree"), setting, r.list);
				
				
				var node = ztree.getNodeByParam("orgCode", vm.addLine.orgCode);
				
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
		            vm.addLine.orgCode = node[0].orgCode;
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