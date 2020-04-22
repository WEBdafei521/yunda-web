var tableIns;
$(function () {
	layui.use('table', function(){
		var table = layui.table;
		tableIns = table.render({
			elem: '#jqGrid'
			,height: 'full-70'
			,url: baseURL + 'yunda/yfybvehauthinfo/list'
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
			{field:'vehId', title: '车辆ID'},
			{field:'preAuthQuantity', title: '修改前授权量'},
			{field:'preAuthTimeType', title: '修改前授权周期 1.月 2.季度 3.年 9.不限'},
			{field:'preAuthSurplus', title: '修改前剩余授权量'},
			{field:'aftAuthQuantity', title: '修改后授权量'},
			{field:'aftAuthTimeType', title: '修改后授权周期 1.月 2.季度 3.年 9.不限'},
			{field:'updateUser', title: '修改人'},
			{field:'updateTime', title: '修改时间'},
			{field:'authQuantity', title: '临时授权量 '},
			{field:'authType', title: '类型 1.修改计划授权 2.临时授权'},
			  {filed:'id',title: '操作',templet: function(res){
					var op_html = "";
					op_html += hasPermission('yunda:yfybvehauthinfo:update') ? '<a class="btn btn-default  layui-btn-xs" onclick="vm.update('+res.id+')"><i class="fa fa-pencil-square-o"></i>&nbsp;修改</a>' : ''
					op_html += hasPermission('yunda:yfybvehauthinfo:delete') ? '<a class="btn btn-default layui-btn-xs" onclick="vm.del('+res.id+')"><i class="fa fa-trash-o"></i>&nbsp;删除</a>' : ''
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
		yfyBVehAuthInfo: {}
	},
	methods: {
		query: function () {
			vm.reload();
		},
		add: function(){
			vm.showList = false;
			vm.title = "新增";
			vm.yfyBVehAuthInfo = {};
		},
		update: function (id) {
			vm.showList = false;
            vm.title = "修改";
            
            vm.getInfo(id)
		},
		saveOrUpdate: function (event) {
			var url = vm.yfyBVehAuthInfo.id == null ? "yunda/yfybvehauthinfo/save" : "yunda/yfybvehauthinfo/update";
			$.ajax({
				type: "POST",
			    url: baseURL + url,
                contentType: "application/json",
			    data: JSON.stringify(vm.yfyBVehAuthInfo),
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
				    url: baseURL + "yunda/yfybvehauthinfo/delete",
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
			$.get(baseURL + "yunda/yfybvehauthinfo/info/"+id, function(r){
                vm.yfyBVehAuthInfo = r.yfyBVehAuthInfo;
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