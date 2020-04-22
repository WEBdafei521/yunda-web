//jqGrid的配置信息
$.jgrid.defaults.width = 1000;
$.jgrid.defaults.responsive = true;
$.jgrid.defaults.styleUI = 'Bootstrap';

//工具集合Tools
window.T = {};

// 获取请求参数
// 使用示例
// location.href = http://localhost/index.html?id=123
// T.p('id') --> 123;
var url = function(name) {
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r!=null)return  unescape(r[2]); return null;
};
T.p = url;

//请求前缀
//  var baseURL = "http://localhost:8080/";
var baseURL = "http://you.yunfeiyang.com:8080/"
//登录token
var token = localStorage.getItem("token");
if(token == null || token == 'null'){
    parent.location.href = '/login.html';
}

//jquery全局配置
$.ajaxSetup({
	dataType: "json",
	cache: false,
    headers: {
        'Access-Control-Allow-Origin':'*',
        'token': token,
    },
    xhrFields: {
	    withCredentials: true
    },
    complete: function(xhr) {
        //token过期，则跳转到登录页面
        var data = xhr.responseJSON;
        if(data!=undefined){
            if(data.code === 401){
                parent.location.href = '/login.html';
            }else if(data.code == 500){
				alert(data.msg)
				return false;
			}else if(data.code === 0 && data.token){
                localStorage.setItem("token", data.token);
            }
        }

    }
});

//jqgrid全局配置
$.extend($.jgrid.defaults, {
    ajaxGridOptions : {
        headers: {
            'Access-Control-Allow-Origin':"*",
            'token': token,
        }
    }
});

//权限判断
function hasPermission(permission) {
    if (window.parent.permissions.indexOf(permission) > -1) {
        return true;
    } else {
        return false;
    }
}

//重写alert
window.alert = function(msg, callback){
	parent.layer.alert(msg, function(index){
		parent.layer.close(index);
		if(typeof(callback) === "function"){
			callback("ok");
		}
	});
}

//重写confirm式样框
window.confirm = function(msg, callback){
	parent.layer.confirm(msg, {btn: ['确定','取消']},
	function(){//确定事件
		if(typeof(callback) === "function"){
			callback("ok");
		}
	});
}

//选择一条记录
function getSelectedRow() {
    var grid = $("#jqGrid");
    var rowKey = grid.getGridParam("selrow");
    if(!rowKey){
    	alert("请选择一条记录");
    	return ;
    }
    
    var selectedIDs = grid.getGridParam("selarrrow");
    if(selectedIDs.length > 1){
    	alert("只能选择一条记录");
    	return ;
    }
    console.log(selectedIDs[0])
    return selectedIDs[0];
}

//选择多条记录
function getSelectedRows() {
    var grid = $("#jqGrid");
    var rowKey = grid.getGridParam("selrow");
    if(!rowKey){
    	alert("请选择一条记录");
    	return ;
    }
    
    return grid.getGridParam("selarrrow");
}

//判断是否为空
function isBlank(value) {
    return !value || !/\S/.test(value)
}

//将后台返回数据解析为layui 数据表格 table 组件规定的数据格式
function layui_table_parseData(res){
	
	if(res.code != 0){
		//如果状态不为0 ， 那就没有res.page.totalCount和res.page.list，
		//为了防止报错，所以只设置code和msg 
		return {"code": res.code,"msg": res.msg}
	}
	return {
	  "code": res.code,
	  "msg": res.msg, 
	  "count": res.page.totalCount, 
	  "data": res.page.list 
	}
}

function selectDept(){
	
}

function baseGetData(_this,jsons){
	// console.log(jsons)
	jsons.page= _this.currentPage
	jsons.limit= _this.pageSize	
	
	$.ajax({
		type: "POST",
	    url: baseURL + _this.url.listUrl,
	    data: jsons,
	    success: function(r){
				
			_this.tableLoading = false;
			
	    	if(r.code == 0){
				_this.tableData = r.page.list;
				_this.total = r.page.totalCount;
				if(_this.otherInfo){//看页面是否配置了，是否在查询中塞了其他数据
					_this.otherInfoArray=r.page;
				}
			}else{
				alert(r.msg);
			}
		}
	});
}
function baseDelete(_this,ids){
	
	// console.log(baseURL + _this.url.deleteUrl)
	parent.vm.isshow = true;
	parent.vm.dialogVisible = true;
	parent.vm.that =_this;
	parent.vm.ids = ids;
	parent.vm.inputs = "";
	// confirm('确定要删除选中的记录？', function(){
		// localStorage.setItem("ids", ids);
		// $.ajax({
		// 	type: "POST",
		//     url: baseURL + _this.url.deleteUrl,
	    //     contentType: "application/json",
		//     data: JSON.stringify(ids),
		//     success: function(r){
		// 		if(r.code == 0){
		// 			alert('操作成功', function(index){
		// 				_this.query();
		// 			});
		// 		}else{
		// 			alert(r.msg);
		// 		}
		// 	}
		// });
	// });
}
function baseSave(_this){
	var url = _this.addLine.id == null ? _this.url.addUrl : _this.url.updateUrl;
	$.ajax({
		type: "POST",
	    url: baseURL + url,
	    contentType: "application/json",
	    data: JSON.stringify(_this.addLine),
	    success: function(r){
	    	if(r.code === 0){
					_this.addLine = {};
					_this.list();
					_this.query();
				alert("操作成功");
			}else{
				alert(r.msg);
			}
		}
	});
}
function basePageLock(_this,val){
	return _this.currentPage * val  <= _this.total || (_this.currentPage * val  > _this.total && (_this.currentPage - 1) * val < _this.total);
}


function baseGetDept(){
	var url = baseURL + "yunda/yfysdepart/getDept";
	var deptData = [];
	$.ajax({
		type: "POST",
	    url: url,
		async: false,
	    success: function(r){
	    	if(r.code == 0){
				deptData = r.dept;
			}else{
				alert(r.msg);
			}
		}
	});
	return deptData;
}

// 取出数组中最后一个元素的值，如果数组为空，返回空字符串
function getListLastVal(val){
	var size = val.length;
	if (size > 0) {
		return val[size-1]
	}else{
		return "";
	}
}

function formatDate(value) {
	
	var date = new Date(value);
	var year = date.getFullYear();
	var month = padDate(date.getMonth()+1);
	var day = padDate(date.getDate());
	var hours = padDate(date.getHours());
	var minutes = padDate(date.getMinutes());
	var seconds = padDate(date.getSeconds());
	return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
}
function padDate(value){
	return value <10 ? '0' + value:value;
}


function getLoginUser(){
	var user = JSON.parse(localStorage.getItem("yd_user_info"))
	return user;
}
function getUserDept(){
	
}

var deptFun = {
	/** 获取登录用户的部门信息 */
	getDeptInfo: function(){
		let dept = JSON.parse(localStorage.getItem("yd_user_dept"))
		return dept;
	},
	/**  读取部门信息BY code */
	getDeptInfoByOrgCode: function(orgCode){
		let dept = this.getDeptInfo();
		let r = {};
		$.each(dept,function(index,item){
			if(item.orgCode === orgCode){
				r = item
			}
		});
		return r;
	},
	/**  读取石油公司信息 */
	getOilCompanies: function(){
		let dept = this.getDeptInfo();
		let oc = [];
		$.each(dept,function(index,item){
			if(item.orgType === '1'){
				oc.push(item)
			}
		});
		return oc;
	},
	/** 读取加油站信息 */
	getStations: function(){
		let dept = this.getDeptInfo();
		let s = [];
		$.each(dept,function(index,item){
			if(item.orgType === '2'){
				s.push(item)
			}
		});
		return s;
	},
	/** 是否显示石油公司查询条件 */
	isOcShow: function(){
		let oc = this.getOilCompanies();
		let is = false;
		if(oc.length > 1){
			is = true
		}
		return is;
	}
}
var OrgCodeFun = {
	/** 通过石油公司的OrgCode获取石油公司对象 */
	getOcObjByCode: function(orgCode){
		let oc = deptFun.getOilCompanies();
		let r = {};
		$.each(oc,function(index,item){
			if(item.orgCode === orgCode){
				r = item
			}
		});
		return r;
	},
	/** 根据石油公司OrgCode获取该石油公司的加油站 */
	getStationsByPcode: function(pCode){
		if(pCode.length === 0){
			return ""
		}
		let ocObj = this.getOcObjByCode(pCode);
		const pId = ocObj.id;
		let s = deptFun.getStations();
		let r = [];
		$.each(s,function(index,item){
			if(item.parentdepartid === pId){
				r.push(item)
			}
		});
		return r;
	},
	/** 获取查询条件中的OrgCode */
	getOrgCodeByQ: function(dept){
		var is = deptFun.isOcShow()
		if(!is){
			return dept.s
		}
		if(dept.s.length > 0){
			return dept.s
		}
		return dept.oc
	}
}
var departTypeName="石油公司";
var orgType=deptFun.getDeptInfoByOrgCode(getLoginUser().orgCode).orgType;
if(orgType=='0'){
	departTypeName="石油公司/加油站";
}else if(orgType=='1'){
	departTypeName="石油公司";
}else if(orgType=='2'){
	departTypeName="加油站";
}else if(orgType=='3'){
	departTypeName="部门";
}