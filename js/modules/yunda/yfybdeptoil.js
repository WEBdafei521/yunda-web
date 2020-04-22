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
var tableIns;
$(function () {
	layui.use('table', function(){
		var table = layui.table;
		tableIns = table.render({
			elem: '#jqGrid'
			,height: 'full-70'
			,url: baseURL + 'yunda/yfybdeptoil/list'
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
			  			/* {field:'id', title: 'id'}, */
			{field:'orgCode', title: '部门'},
			{field:'oilCode', title: '油品CODE'},
			{field:'oilName', title: '油品名'},
			{field:'abbreviate', title: '简称'},
			{field:'price', title: '单价'},
			{field:'languageId', title: '国际化'},
			/* {field:'updateUser', title: '修改人'},
			{field:'updateTime', title: '修改时间'}, */
			  {filed:'id',title: '操作',templet: function(res){
					var op_html = "";
					op_html += hasPermission('yunda:yfybdeptoil:update') ? '<a class="btn btn-default  layui-btn-xs" onclick="vm.update('+res.id+')"><i class="fa fa-pencil-square-o"></i>&nbsp;修改</a>' : '',
					op_html += hasPermission('yunda:yfybdeptoil:modify_price') ? '<a class="btn btn-default  layui-btn-xs" onclick="vm.update_price('+res.id+')"><i class="fa fa-pencil-square-o"></i>&nbsp;调价</a>' : ''
					op_html += hasPermission('yunda:yfybdeptoil:delete') ? '<a class="btn btn-default layui-btn-xs" onclick="vm.del('+res.id+')"><i class="fa fa-trash-o"></i>&nbsp;删除</a>' : ''
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
		yfyBDeptOil: {}
	},
	methods: {
		getOil: function(){
		    //加载菜单树
		    $.get(baseURL + "yunda/yfydoil/list?page=1&limit=200&languageId=2052", function(r){
		        ztree = $.fn.zTree.init($("#oilTree"), setting, r.page.list);
				var node = ztree.getNodeByParam("oilCode", vm.yfyBDeptOil.oilCode);
				ztree.selectNode(node);
				vm.yfyBDeptOil.oilName = node.oilName;
		    })
		},
		query: function () {
			vm.reload();
		},
		add: function(){
			vm.showList = false;
			vm.title = "新增";
			vm.yfyBDeptOil = {};
			vm.yfyBDeptOil = {oilCode:1000};
			vm.getOil();
		},
		update: function (id) {
			vm.showList = false;
            vm.title = "修改";
            
            vm.getInfo(id)
		},
		saveOrUpdate: function (event) {
			var url = vm.yfyBDeptOil.id == null ? "yunda/yfybdeptoil/save" : "yunda/yfybdeptoil/update";
			$.ajax({
				type: "POST",
			    url: baseURL + url,
                contentType: "application/json",
			    data: JSON.stringify(vm.yfyBDeptOil),
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
				    url: baseURL + "yunda/yfybdeptoil/delete",
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
			$.get(baseURL + "yunda/yfybdeptoil/info/"+id, function(r){
                vm.yfyBDeptOil = r.yfyBDeptOil;
            });
		},
		reload: function (event) {
            vm.showList = true;
			tableIns.reload({
				where: {
					//'username': vm.q.username
				},
			})
		},
		oilTree: function(){
		    layer.open({
		        type: 1,
		        offset: '50px',
		        skin: 'layui-layer-molv',
		        title: "选择菜单",
		        area: ['300px', '450px'],
//		        shade: 0,
		        shadeClose: false,
		        content: jQuery("#oilLayer"),
		        btn: ['确定', '取消'],
		        btn1: function (index) {
		            var node = ztree.getSelectedNodes();
		            //选择上级菜单
		            vm.yfyBDeptOil.oilCode = node[0].oilCode;
		            vm.yfyBDeptOil.oilName = node[0].oilName;
					vm.yfyBDeptOil.languageId = node[0].languageId;
		            layer.close(index);
		        }
		    });
		},
		update_price: function(id){
			vm.getInfo(id);
			var update_price_layer = layer.open({
			    type: 1,
			    offset: '50px',
			    skin: '',
			    title: "调价",
			    area: ['450px', '380px'],
			    shade: 0.01,
			    shadeClose: false,
			    content: jQuery("#update_price_Layer"),
			    btn: ['确定', '取消'],
			    btn1: function (index) {
					$.ajax({
						type: "POST",
					    url: baseURL + "yunda/yfybdeptoil/modify_price",
						dataType: "json",
					    data: {
							id : vm.yfyBDeptOil.id,
							price : vm.yfyBDeptOil.price,
							newPrice : vm.yfyBDeptOil.newPrice,
							remarks : vm.yfyBDeptOil.remarks
						},
					    success: function(r){
							if(r.code == 0){
								alert('操作成功', function(index){
									layer.close(update_price_layer);
									vm.reload();
								});
							}else{
								alert(r.msg);
							}
						}
					});
			    }
			});
		}
	}
});