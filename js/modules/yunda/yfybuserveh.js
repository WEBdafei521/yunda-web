var tableIns;
var carList;
var userIdSel;
$(function () {
	layui.use('table', function(){
		var table = layui.table;
		/*tableIns = table.render({
			elem: '#jqGrid'
			,height: 'full-70'
			,url: baseURL + 'yunda/yfybuserveh/list'
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
			{type:'radio'},
			{field:'id', title: 'id'},
			{field:'userId', title: '员工ID'},
			{field:'vehId', title: '车辆ID'},
			  {filed:'id',title: '操作',templet: function(res){
					var op_html = "";
					op_html += hasPermission('yunda:yfybuserveh:update') ? '<a class="btn btn-default  layui-btn-xs" onclick="vm.update('+res.id+')"><i class="fa fa-pencil-square-o"></i>&nbsp;修改</a>' : ''
					op_html += hasPermission('yunda:yfybuserveh:delete') ? '<a class="btn btn-default layui-btn-xs" onclick="vm.del('+res.id+')"><i class="fa fa-trash-o"></i>&nbsp;删除</a>' : ''
					return op_html;
			  }}
			]],
			
		  });*/
		tableUser = table.render({
			elem: '#jqUserGrid'
			,height: 'full-70'
			,url:baseURL + 'sys/user/list?status=2&type=0'
			,page: { 
			  layout: ['limit', 'count', 'prev', 'page', 'next', 'skip'] 
			  ,groups: 1 
			  ,first: false 
			  ,last: false 
			},
			parseData: function(res){ 
				debugger
				return layui_table_parseData(res);
			}
			,cols: [[
			  {field:'username', title: '司机'}
			  ,{field:'mobile', title: '手机号'}
			  ,{filed:'id',title: '操作',templet: function(res){
					var op_html = "";
					op_html += hasPermission('yunda:yfybuserveh:update') ? '<a class="btn btn-default  layui-btn-xs" onclick="vm.match('+res.userId+')"><i class="fa fa-pencil-square-o"></i>&nbsp;匹配车辆</a>' : ''
					return op_html;
			  }}
			  /*,{field:'status', title: '状态',templet: function(res){
				  return res.status === 0 ? 
				  	'<span class="label label-danger">禁用</span>' : 
				  	'<span class="label label-success">正常</span>';
			  }}*/
			]],
			
		  });
		//监听行单击事件（单击事件为：rowDouble）
		  table.on('row(jqUserGrid)', function(obj){
			vm.updateDialog = true;
		    var data = obj.data;
			userIdSel=data.userId;
		    /*layer.alert(JSON.stringify(data), {
		      title: '当前行数据：'
		    });*/
		    
		    //标注选中样式
		    obj.tr.addClass('layui-table-click').siblings().removeClass('layui-table-click');
		    
		    //这里将员工和车辆的绑定关系查询出来，就不再员工那里一块查了，如果多了可能慢
		    $.ajax({
			    type: "POST",
			    url: baseURL + "yunda/yfybuserveh/list",
			    dataType: "json",
			    async:false,
			    data:{
			    	userId:userIdSel,
			    },
			    success: function(r){
			        debugger
			        var relationData = r.page.list;
			        var rightD=[];
			        carList.forEach((carl, index) => { 
			        	relationData.forEach((re, index2) => {
				        	if(carl.id==re.vehId){
				        		rightD.push(index);
				        	}
					      });
				      });
			        
			        vm.value=rightD;
			    }
			});
		    
		  });
	});
	setSelect("userId",baseURL+"yunda/yfybvehicle/list?page=1&limit=200");
});

var vm = new Vue({
	el:'#app',
	data:{
		q:{
			username: null
		},
		showList: true,
		title: null,
		yfyBUserVeh: {},
		data:setDriverData(),
		value: [],
		updateDialog: false,
		currentPage: 1,
		pageSizes: [10, 20, 50, 100],
		pageSize: 10,
		total: 0,
	},
	methods: {
		query: function () {
			vm.reload();
		},
		add: function(){
			vm.showList = false;
			vm.title = "新增";
			vm.yfyBUserVeh = {};
		},
		update: function (id) {
			vm.showList = false;
            vm.title = "修改";
            
            vm.getInfo(id)
		},
		match: function (id) {
			vm.updateDialog = true;
			userIdSel=id;
		    
		    
		    //这里将员工和车辆的绑定关系查询出来，就不再员工那里一块查了，如果多了可能慢
		    $.ajax({
			    type: "POST",
			    url: baseURL + "yunda/yfybuserveh/list",
			    dataType: "json",
			    async:false,
			    data:{
			    	userId:userIdSel
			    },
			    success: function(r){
			        
			        var relationData = r.page.list;
			        var rightD=[];
			        carList.forEach((carl, index) => { 
			        	relationData.forEach((re, index2) => {
				        	if(carl.id==re.vehId){
				        		rightD.push(index);
				        	}
					      });
				      });
			        
			        vm.value=rightD;
			    }
			});
		    
		  },
		saveOrUpdate: function (event) {
			var url = vm.yfyBUserVeh.id == null ? "yunda/yfybuserveh/save" : "yunda/yfybuserveh/update";
			$.ajax({
				type: "POST",
			    url: baseURL + url,
                contentType: "application/json",
			    data: JSON.stringify(vm.yfyBUserVeh),
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
				    url: baseURL + "yunda/yfybuserveh/delete",
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
			$.get(baseURL + "yunda/yfybuserveh/info/"+id, function(r){
                vm.yfyBUserVeh = r.yfyBUserVeh;
            });
		},
		reload: function (event) {
            vm.showList = true;
            tableUser.reload({
				where: {
					'key': vm.q.username
				},
			})
		},
		filterMethod: function(query, item) {
	          return item.pinyin.indexOf(query) > -1;
	        },
	    
		closeDialog(){
			const _this = this;
			_this.updateDialog = false;
		},
		saveInfo(){
			//这里可以直接拿到 vm.value,根据这个遍历拿到右侧的数据
			var rightIndex=vm.value;
			var rightD=[];
			rightIndex.forEach((carl, index) => { 
				rightD.push({
					vehId: carList[carl].id,
			        userId: userIdSel
			      });
		      });
			
				var url = "yunda/yfybuserveh/save?userId="+userIdSel;
				$.ajax({
					type: "POST",
				    url: baseURL + url,
		            contentType: "application/json",
				    data: JSON.stringify(rightD),
				    success: function(r){
				    	if(r.code === 0){
							alert('操作成功', function(index){
//								vm.reload();
								vm.updateDialog = false;
							});
						}else{
							alert(r.msg);
						}
					}
				});
			
}
	}
});
function saveInfo_bak(){
	//这里可以直接拿到 vm.value,根据这个遍历拿到右侧的数据
	var rightIndex=vm.value;
	var rightD=[];
	rightIndex.forEach((carl, index) => { 
		rightD.push({
			vehId: carList[index].id,
	        userId: userIdSel
	      });
      });
	
		var url = "yunda/yfybuserveh/save?userId="+userIdSel;
		$.ajax({
			type: "POST",
		    url: baseURL + url,
            contentType: "application/json",
		    data: JSON.stringify(rightD),
		    success: function(r){
		    	if(r.code === 0){
					alert('操作成功', function(index){
//						vm.reload();
					});
				}else{
					alert(r.msg);
				}
			}
		});
	
}
function setDriverData(){
	
	var dataList;
	$.ajax({
	    type: "POST",
	    url: baseURL + "yunda/yfybvehicle/list",
	    dataType: "json",
	    async:false,
	    data:{
	    	page:1,
	    	limit:200
	    },
	    success: function(r){
	        carList = r.page.list;
	        dataList = r.page.list;
	    }
	});
	const data = [];
    dataList.forEach((car, index) => {
      data.push({
        label: car.lpn,
        key: index,
        pinyin: car.lpn
      });
    });
    return data;
}
