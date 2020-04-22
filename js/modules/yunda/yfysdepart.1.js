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
		showList: true,
		title: null,
		yfySDepart: {parentId:0,type:1,orderNum:0},
		parentdepartname:null,
		parentdepartOrgCode:null
	},
    methods: {
        getyfySDepart: function(){
            //加载菜单树
            $.get(baseURL + "yunda/yfysdepart/list?type=0", function(r){
            	debugger
                ztree = $.fn.zTree.init($("#yfySDepartTree"), setting, r.list);
				var node;
				if(vm.parentdepartOrgCode == null){
					node = ztree.getNodeByParam("id", vm.yfySDepart.parentdepartid);
				}else{
					node = ztree.getNodeByParam("orgCode", vm.parentdepartOrgCode);
				}
                ztree.selectNode(node);
                vm.yfySDepart.parentdepartid = node.id;
                vm.parentdepartname = node.departname;
				var treeObj = $.fn.zTree.getZTreeObj("tree");
				var nodes = treeObj.getNodes();
				if (nodes.length>0) {
					for(var i=0;i<nodes.length;i++){
					treeObj.expandNode(nodes[i], true, false, false);
					}
				}
            })
        },
        add: function(){
			debugger
            vm.showList = false;
            vm.title = "新增";
			vm.yfySDepart = {parentdepartid:null,parentdepartname:null,parentdepartOrgCode:null};
			var selected = $('#jqGrid').bootstrapTreeTable('getSelections');
			if (selected.length == 0) {
				console.log(parent.vm.user.orgCode)
				vm.parentdepartOrgCode = parent.vm.user.orgCode;
			} else {
			    vm.yfySDepart.parentdepartid = selected[0].id;
			}
            vm.getyfySDepart();
        },
        update: function () {
			debugger
            var yfySDepartId = getyfySDepartId();
            if(yfySDepartId == null){
                return false;
            }

            $.get(baseURL + "yunda/yfysdepart/info/"+yfySDepartId, function(r){
               
				if(r.yfySDepart.parentdepartid == null){
                	alert('云达平台中心不允许修改') 
					return false;
                }
				
				vm.showList = false;
                vm.title = "修改";
                vm.yfySDepart = r.yfySDepart;
				vm.yfySDepart.parentdepartname = null;
                vm.getyfySDepart();
            });
        },
        del: function () {
            var yfySDepartId = getyfySDepartId();
            if(yfySDepartId == null){
                return false;
            }
            var ids = [yfySDepartId]
            confirm('确定要删除选中的记录？', function(){
                $.ajax({
                    type: "POST",
                    url: baseURL + "yunda/yfysdepart/delete",
                    contentType: "application/json",
                    data: JSON.stringify(ids),
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
            });
        },
        saveOrUpdate: function () {
            if(vm.validator()){
                return false;
            }

            var url = vm.yfySDepart.id == null ? "yunda/yfysdepart/save" : "yunda/yfysdepart/update";
            $.ajax({
                type: "POST",
                url: baseURL + url,
                contentType: "application/json",
                data: JSON.stringify(vm.yfySDepart),
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
        yfySDepartTree: function(){
            layer.open({
                type: 1,
                offset: '50px',
                skin: 'layui-layer-molv',
                title: "选择部门",
                area: ['300px', '450px'],
                shade: 0,
                shadeClose: false,
                content: jQuery("#yfySDepartLayer"),
                btn: ['确定', '取消'],
                btn1: function (index) {
                	debugger
                    var node = ztree.getSelectedNodes();
                    //选择上级菜单
                    vm.yfySDepart.parentdepartid = node[0].id;
                    vm.parentdepartname = node[0].departname;

                    layer.close(index);
                }
            });
        },
        reload: function () {
            vm.showList = true;
            YfySDepart.table.refresh();
        },
        validator: function () {
            if(isBlank(vm.yfySDepart.departname)){
                alert("部门名称不能为空");
                return true;
            }
        }
    }
});

var YfySDepart = {
    id: "jqGrid",
    table: null,
    layerIndex: null
};

/**
 * 初始化表格的列
 */
YfySDepart.initColumn = function () {
    var columns = [
    	{field: 'selectItem', radio: true},
    	//{field:'id', title: 'id'},
		{field:'departname', title: '名称'},
		//{field:'description', title: '描述'},
		//{field:'parentdepartid', title: '父部门ID'},
		//{field:'orgCode', title: '机构编码'},
		//{field:'orgType', title: '机构类型'},
		{field:'mobile', title: '手机号'},
		//{field:'fax', title: '传真'},
		{field:'address', title: '地址'},
		{field:'attn', title: '联系人'},
		{field:'servicedate', title: '服务到期时间'},
		//{field:'logo', title: '公司logo'},
		{field:'deptabbr', title: '简称'},
		{field:'email', title: '电子邮箱'},
		/* {field:'bankname', title: '开户行'},
		{field:'bankaccountno', title: '银行账户'},
		{field:'taxcode', title: '税号'},
		{field:'notes', title: '备注'} */
		/*{field:'e1', title: '备用1'},
		{field:'e2', title: '备用2'},
		{field:'e3', title: '备用3'}*/]
    return columns;
};


function getyfySDepartId() {
    var selected = $('#jqGrid').bootstrapTreeTable('getSelections');
    if (selected.length == 0) {
        alert("请选择一条记录");
        return null;
    } else {
        return selected[0].id;
    }
}
layui.use(['laydate','upload'], function(){
	  var laydate = layui.laydate;
	  var upload = layui.upload;
	  //执行一个laydate实例
	  laydate.render({
	    elem: '#servicedate' ,//指定元素
		type:'datetime',
		done: function(value, date){
			vm.yfySDepart.servicedate = value;
		}
	  });
	  
	  
	  var uploadInst = upload.render({
		    elem: '#Amount' //绑定元素
		    ,url: baseURL + "yunda/yfysdepart/uploadlogo"
		    ,done: function(res){
		    	debugger
		      if (res.code == 0) {
                  layer.msg(res.msg);
                  var uplogo = res.imageSrc;
                  $("#logo").val(uplogo);
            }else{
              layer.alert(res.message, {
                  title: '提示信息'
              }) 
            }
		    }
		    ,error: function(){
		      //请求异常回调
		    }
		});
	  
	  
	  
	});

$(function () {
    var colunms = YfySDepart.initColumn();
    var table = new TreeTable(YfySDepart.id, baseURL + "yunda/yfysdepart/list", colunms);
    table.setExpandColumn(1);
    table.setIdField("id");
    table.setCodeField("id");
    table.setParentCodeField("parentdepartid");
    table.setExpandAll(false);
    table.init();
    YfySDepart.table = table;
});
