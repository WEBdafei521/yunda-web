var tableIns;
$(function () {
	layui.use('table', function(){
		var table = layui.table;
		tableIns = table.render({
			elem: '#jqGrid'
			,height: 'full-70'
			,url: baseURL + 'appid/yfysappid/list'
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
			{field:'appid', title: 'APPID'},
			{field:'appsecret', title: 'appSecret'},
			{field:'companyname', title: '公司名'},
			{field:'remarks', title: '备注'},
			{field:'contact', title: '联系人'},
			{field:'tel', title: '联系电话'},
			{field:'email', title: '联系邮箱'},
			  {filed:'id',title: '操作',templet: function(res){
					var op_html = "";
					op_html += hasPermission('appid:yfysappid:update') ? '<a class="btn btn-default  layui-btn-xs" onclick="vm.update('+res.id+')"><i class="fa fa-pencil-square-o"></i>&nbsp;修改</a>' : ''
					op_html += hasPermission('appid:yfysappid:delete') ? '<a class="btn btn-default layui-btn-xs" onclick="vm.del('+res.id+')"><i class="fa fa-trash-o"></i>&nbsp;删除</a>' : ''
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
		yfySAppid: {}
	},
	methods: {
		query: function () {
			vm.reload();
		},
		add: function(){
			vm.showList = false;
			vm.title = "新增";
			vm.yfySAppid = {};
		},
		update: function (id) {
			vm.showList = false;
            vm.title = "修改";
            
            vm.getInfo(id)
		},
		saveOrUpdate: function (event) {
			var url = vm.yfySAppid.id == null ? "appid/yfysappid/save" : "appid/yfysappid/update";
			$.ajax({
				type: "POST",
			    url: baseURL + url,
                contentType: "application/json",
			    data: JSON.stringify(vm.yfySAppid),
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
		    var ids = [id];
			confirm('确定要删除选中的记录？', function(){
				$.ajax({
					type: "POST",
				    url: baseURL + "appid/yfysappid/delete",
                    contentType: "application/json",
				    data: JSON.stringify(ids),
				    success: function(r){
						if(r.code == 0){
							alert('操作成功', function(index){
								vm.reload();
							});
						}else{
							alert(r.msg);
						}
					}
				});
			});
		},
		getInfo: function(id){
			$.get(baseURL + "appid/yfysappid/info/"+id, function(r){
                vm.yfySAppid = r.yfySAppid;
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