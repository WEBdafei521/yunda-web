var tableIns;
$(function () {
	layui.use('table', function(){
		var table = layui.table;
		tableIns = table.render({
			elem: '#jqGrid'
			,height: 'full-70'
			,url: baseURL + 'yunda/yfybdeptoilinfo/list'
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
			  			{field:'id', title: 'id'},
			{field:'orgCode', title: '部门'},
			{field:'oilCode', title: '油品CODE'},
			{field:'oldPrice', title: '老单价'},
			{field:'newPrice', title: '新价格'},
			{field:'updateUser', title: '修改人'},
			{field:'updateTime', title: '修改时间'},
			{field:'remarks', title: '备注'},
			  {filed:'id',title: '操作',templet: function(res){
					var op_html = "";
					op_html += hasPermission('yunda:yfybdeptoilinfo:update') ? '<a class="btn btn-default  layui-btn-xs" onclick="vm.update('+res.id+')"><i class="fa fa-pencil-square-o"></i>&nbsp;修改</a>' : ''
					op_html += hasPermission('yunda:yfybdeptoilinfo:delete') ? '<a class="btn btn-default layui-btn-xs" onclick="vm.del('+res.id+')"><i class="fa fa-trash-o"></i>&nbsp;删除</a>' : ''
					return op_html;
			  }}
			]],
			
		  });
	  
	  
	});
	
});

var vm = new Vue({
	el:'#app',
	data:{
		showList: true,
		title: null,
		yfyBDeptOilInfo: {}
	},
	methods: {
		query: function () {
			vm.reload();
		},
		add: function(){
			vm.showList = false;
			vm.title = "新增";
			vm.yfyBDeptOilInfo = {};
		},
		update: function (id) {
			vm.showList = false;
            vm.title = "修改";
            
            vm.getInfo(id)
		},
		saveOrUpdate: function (event) {
			var url = vm.yfyBDeptOilInfo.id == null ? "yunda/yfybdeptoilinfo/save" : "yunda/yfybdeptoilinfo/update";
			$.ajax({
				type: "POST",
			    url: baseURL + url,
                contentType: "application/json",
			    data: JSON.stringify(vm.yfyBDeptOilInfo),
			    success: function(r){
			    	if(r.code === 0){
						alert('操作成功', function(index){
							vm.reload();
						});
					}else{
						alert(r.msg);
					}
				}
			});
		},
		del: function (id) {
			confirm('确定要删除选中的记录？', function(){
				$.ajax({
					type: "POST",
				    url: baseURL + "yunda/yfybdeptoilinfo/delete",
                    contentType: "application/json",
				    data: JSON.stringify(ids),
				    success: function(r){
						if(r.code == 0){
							alert('操作成功', function(index){
								$("#jqGrid").trigger("reloadGrid");
							});
						}else{
							alert(r.msg);
						}
					}
				});
			});
		},
		getInfo: function(id){
			$.get(baseURL + "yunda/yfybdeptoilinfo/info/"+id, function(r){
                vm.yfyBDeptOilInfo = r.yfyBDeptOilInfo;
            });
		},
		reload: function (event) {
            vm.showList = true;
			tableIns.reload({
				where: {
					//'username': vm.q.username
				},
			})
		}
	}
});