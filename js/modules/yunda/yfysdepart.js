var setting = {
	data: {
		simpleData: {
			enable: true,
			idKey: "id",
			pIdKey: "parentdepartid",
			rootPId: 0
		},
		key: {
			url: "nourl",
			name: "departname"
		}
	}
};
var ztree;

var vm = new Vue({
	el: '#app',
	data: {
		url: {
			listUrl: "yunda/yfysdepart/getDept",
			addUrl: "yunda/yfysdepart/save",
			updateUrl: "yunda/yfysdepart/update",
			deleteUrl: "yunda/yfysdepart/delete",
			exportUrl: "1111111111111111/yfysdepart/export",
			uploadActionUrl: "yunda/yfysdepart/uploadlogo"
		},
		p: {
			addShow: hasPermission('yunda:yfysdepart:save'),
			updateShow: hasPermission('yunda:yfysdepart:update'),
			deleteShow: hasPermission('yunda:yfysdepart:delete'),
			exportShow: hasPermission('1111111111111111:yfysdepart:export')
		},
		q:{},
		showList: true,
		tableLoading: false,
		saveLoading: false,
		addOrUpdate: "添加",
		tableData: [],
		addLine: {
			id:1,
			parentdepartid: 1,
            about: ''
		},
		parentdepartname: null,
		pickerOptions: {
			disabledDate(time) {
				return time.getTime() < Date.now();
			},
			shortcuts: [{
				text: '今天',
				onClick(picker) {
					picker.$emit('pick', new Date());
				}
			}, {
				text: '一个月后',
				onClick(picker) {
					const date = new Date();
					date.setMonth(date.getMonth() + 1);
					picker.$emit('pick', date);
				}
			}, {
				text: '半年后',
				onClick(picker) {
					const date = new Date();
					date.setMonth(date.getMonth() + 6);
					picker.$emit('pick', date);
				}
			}, {
				text: '一年后',
				onClick(picker) {
					const date = new Date();
					date.setMonth(date.getMonth() + 12);
					picker.$emit('pick', date);
				}
			}]
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
			//_this.addLine = {}
			_this.addOrUpdate = "添加"
		},
		/* 添加按钮点击对应函数 */
		add(ty) {
			const _this = this
			_this.showList = false
			if (ty == 'add') {
				let pid = _this.addLine.id;
				_this.addLine = {}
				_this.addLine.parentdepartid = pid;
			}
			
			_this.getyfySDepart()
		},
		query() {
			
			var _this = this
			_this.tableData = []
			_this.tableLoading = true
			$.ajax({
				type: "POST",
				url: baseURL + _this.url.listUrl,
				success: function(r) {
					_this.tableLoading = false;

					if (r.code == 0) {
						_this.tableData = r.dept;
						_this.addLine={
							id:1,
							parentdepartid: 1
						}
						
					} else {
						alert(r.msg);
					}
				}
			});

		},
		updata(index, row) {
			var _this = this
			_this.addLine = row
			_this.addLine.orgCode = row.org_code
			_this.addOrUpdate = "修改"
			_this.add('update')
		},
		deleteRow(index, row) {
			var _this = this
			var ids = [row.id]
			baseDelete(_this, ids)
		},
		save() {
			var _this = this;
			baseSave(_this)
		},
		exportData() {
			var _this = this;
			window.open(baseURL + _this.url.exportUrl, '_blank')
			window.close()
		},
		handleCurrentChange(val) {
			this.addLine = val
		},
		getyfySDepart: function() {
			//加载菜单树
			$.get(baseURL + "yunda/yfysdepart/list?type=0", function(r) {
				
				ztree = $.fn.zTree.init($("#yfySDepartTree"), setting, r.list);
				var node = ztree.getNodeByParam("id", vm.addLine.parentdepartid);
				ztree.selectNode(node);
				vm.parentdepartname = node.departname;
				// var treeObj = $.fn.zTree.getZTreeObj("tree");
				// var nodes = treeObj.getNodes();
				// if (nodes.length > 0) {
				// 	for (var i = 0; i < nodes.length; i++) {
				// 		treeObj.expandNode(nodes[i], true, false, false);
				// 	}
				// }
			})
		},
		yfySDepartTree: function() {
			layer.open({
				type: 1,
				offset: '50px',
				skin: 'layui-layer-molv',
				title: "选择部门",
				area: ['300px', '450px'],
//				shade: 0,
				shadeClose: false,
				content: jQuery("#yfySDepartLayer"),
				btn: ['确定', '取消'],
				btn1: function(index) {
					
					var node = ztree.getSelectedNodes();
					//选择上级菜单
					vm.addLine.parentdepartid = node[0].id;
					vm.parentdepartname = node[0].departname;
					layer.close(index);
				}
			});
		},
		uploadSuccess : function(response,file,fileList){
			debugger
		}



	}
});
