function getInitOpenTime(str){
	var a = str.split(":");
	var nowdate = new Date();
	nowdate.setHours(a[0]);
	nowdate.setMinutes(a[1]);
    return nowdate;
}
var c_departname = (rule, value, callback) => {
	if (YDCP.isFalse(value)) {
		return callback(new Error('不能为空'));
	} else if (value.length > 50) {
		return callback(new Error('长度不能大于50'));
	} else {
		callback();
	}
};

var c_deptabbr = (rule, value, callback) => {
	if (YDCP.isFalse(value)) {
		return callback(new Error('不能为空'));
	} else if (value.length > 10) {
		return callback(new Error('长度不能大于10'));
	} else {
		callback();
	}
};
var c_attn = (rule, value, callback) => {
	if (YDCP.isFalse(value)) {
		return callback(new Error('不能为空'));
	} else if (!YDCP.checkStr(value, "chinese")) {
		return callback(new Error('请输入中文'));
	} else if (value.length > 10) {
		return callback(new Error('长度不能大于10'));
	} else {
		callback();
	}
};
var c_mobile = (rule, value, callback) => {
	if (YDCP.isFalse(value)) {
		return callback(new Error('不能为空'));
	} else if (!YDCP.checkStr(value, "phone")) {
		return callback(new Error('请输入正确格式手机号'));
	} else {
		callback();
	}
};
var c_email = (rule, value, callback) => {
	if (YDCP.isFalse(value)) {
		callback();
	} else if (!YDCP.checkStr(value, "email")) {
		return callback(new Error('请输入正确格式邮箱'));
	} else {
		callback();
	}
};
var c_servicedate = (rule, value, callback) => {
	if (YDCP.isFalse(value)) {
		return callback(new Error('不能为空'));
	} else {
		callback();
	}
};
var c_bankname = (rule, value, callback) => {
	callback();
};
var c_bankaccountno = (rule, value, callback) => {
	callback();
};
var c_fax = (rule, value, callback) => {
	callback();
};
var c_taxcode = (rule, value, callback) => {
	callback();
};
var c_address = (rule, value, callback) => {
	if (YDCP.isFalse(value)) {
		return callback(new Error('不能为空'));
	} else if (value.length > 200) {
		return callback(new Error('长度不能大于200'));
	} else {
		callback();
	}
};
var c_notes = (rule, value, callback) => {
	if (YDCP.isFalse(value)) {
		callback();
	} else if (value.length > 200) {
		return callback(new Error('长度不能大于200'));
	} else {
		callback();
	}
};
var c_city = (rule, value, callback) => {
	if (YDCP.isFalse(value)) {
		callback();
	} else {
		callback();
	}
};
var vm = new Vue({
	el:'#app',
	data:{
		url:{
			listUrl: "yunda/yfysdepart/getList/station",
			addUrl: "yunda/yfysdepart/save/station",
			updateUrl: "yunda/yfysdepart/update/station",
			deleteUrl: "yunda/yfysdepart/delete/station/",
			exportUrl: "yunda/yfysdepart/export",
			getDepartNo: "yunda/yfysdepart/get/departNo?type=2",
			uploadActionUrl: baseURL +"yunda/yfysdepart/uploadlogo?token="+token
		},
		p:{
			addShow: hasPermission('yunda:yfysdepart:save:station'),
			updateShow: hasPermission('yunda:yfysdepart:update:station'),
			deleteShow: hasPermission('yunda:yfysdepart:delete:station'),
			exportShow: hasPermission('yunda:yfysdepart:export')
		},
		showList: true,
		tableLoading: false,
		saveLoading: false,
		addOrUpdate: "添加",
		q:{
			departname:""
		},
		currentPage: 1,
		pageSizes: [10, 20, 50, 100],
		pageSize: 10,
		total: 0,
		tableData: [], 
		imageUrl: '',
		arrount: false,
		addLine:{
			e1:"",
			e2:"",
			e3:"",
			e4:"",
			address:"",
			openTime: [getInitOpenTime("08:00"), getInitOpenTime("22:00")],
		},
		addr:{
			provice:{},
			city:{},
			county:{}
		},
		addrOriginal:{
			provice:[],
			city:[],
			county:[],
			provinceName:"",
			cityName:"",
		},
		rules: {
			departname: [{
				validator: c_departname,
				trigger: 'blur'
			}],
			deptabbr: [{
				validator: c_deptabbr,
				trigger: 'blur'
			}],
			attn: [{
				validator: c_attn,
				trigger: 'blur'
			}],
			mobile: [{
				validator: c_mobile,
				trigger: 'blur'
			}],
			email: [{
				validator: c_email,
				trigger: 'blur'
			}],
			servicedate: [{
				validator: c_servicedate,
				trigger: 'blur'
			}],
			bankname: [{
				validator: c_bankname,
				trigger: 'blur'
			}],
			bankaccountno: [{
				validator: c_bankaccountno,
				trigger: 'blur'
			}],
			fax: [{
				validator: c_fax,
				trigger: 'blur'
			}],
			taxcode: [{
				validator: c_taxcode,
				trigger: 'blur'
			}],
			address: [{
				validator: c_address,
				trigger: 'blur'
			}],
			notes: [{
				validator: c_notes,
				trigger: 'blur'
			}],
			province: [{
				validator: c_city,
				trigger: 'blur'
			}],
			
		},
		statusText:"添加",
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
	created(){
		/*$.ajax({
			type: "POST",
		    url: "../../js/list.json",
		    success: function(r){
				debugger
				
			}
		});*/
		const _this = this
		var provinceJson=[];
		$.getJSON("../../js/province.json",function(data){ 
			$.each(data,function(infoIndex,info){
				provinceJson.push({
					"key":info,
					"val":infoIndex
				});
			})
			_this.addr = {
				province: provinceJson,
			}
		})
		
		$.getJSON("../../js/city.json",function(data){ 
				_this..city = data;
		})
		$.getJSON("../../js/county.json",function(data){ 
			_this.addrOriginal.county = data;
		})
	},
	methods: {
		/* 列表按钮点击对应函数 */
		list() {
			const _this = this
			_this.statusText = "添加"
			_this.showList = true
			_this.addLine = {
					e1:"",
					e2:"",
					e3:"",
					e4:"",
					address:"",
					openTime: [new Date(2016, 9, 10, 8, 00), new Date(2016, 9, 10, 22, 00)],
			}
			_this.addOrUpdate = "添加"
		},
		/* 添加按钮点击对应函数 */
		add() {
			const _this = this
            var aroundType=deptFun.getDeptInfoByOrgCode(getLoginUser().orgCode).aroundType
            if (aroundType=='1'){
                _this.arrount=true
            }
			if(!_this.addLine.e3){
				$.get(baseURL + _this.url.getDepartNo, function(r){
					
					_this.addLine.e3 = r.departNo;
				});
			}
			_this.showList = false;
		},
		query(){
			
			var _this = this
			var jsons = {
				departname: this.q.departname
			}
			_this.tableLoading = true
			baseGetData(_this,jsons)
			
		},
		updata(index,row){
			var _this = this
			_this.statusText= "修改"
				
			_this.ocChange(row.e1);
			_this.ocChange2(row.e2);
			
			_this.addLine = row
			_this.imageUrl=_this.addLine.logo
			_this.addOrUpdate = "修改"
			var opentime = _this.addLine.openTime.split("-");
			_this.addLine.openTime=[getInitOpenTime(opentime[0]),getInitOpenTime(opentime[1])];
			
			_this.add()
		},
		deleteRow(index,row){
			var _this = this
			var id = [row.id]
			confirm('确定要删除选中的记录？', function(){
				$.ajax({
					type: "POST",
				    url: baseURL + _this.url.deleteUrl+id,
				    success: function(r){
						if(r.code == 0){
							alert('操作成功', function(index){
								_this.query();
							});
						}else{
							alert(r.msg);
						}
					}
				});
			});
		},
		updateStatusRow(index, row) {
			var _this = this
			var id = [row.id]
			_this.addLine = row
			var status = row.status == '0' ? "启用":"停用";
			confirm('确定要'+status+'此加油站吗？', function() {
				_this.addLine.status=Math.abs(parseInt(row.status)-1);
				$.ajax({
					type: "POST",
					url: baseURL + _this.url.updateUrl,
					contentType: "application/json",
					data: JSON.stringify(_this.addLine),
					success: function(r) {
						if (r.code == 0) {
							alert('操作成功', function(index) {
								_this.query();
							});
						} else {
							alert(r.msg);
						}
					}
				});
			});
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
		save(){
			var _this = this;
			debugger
			var startTime= _this.addLine.openTime ? _this.addLine.openTime[0].getHours()+":"+_this.addLine.openTime[0].getMinutes():"08:00";
			var endTime= _this.addLine.openTime ? _this.addLine.openTime[1].getHours()+":"+_this.addLine.openTime[1].getMinutes():"22:00";
			_this.addLine.openTime=startTime+"-"+endTime;
			_this.$refs['addLine'].validate((valid) => {
				if (valid) {
					baseSave(_this)
				} else {
					alert('请填写正确信息');
					return false;
				}
			});
		},
		exportData(){
			var _this = this;
			window.open(baseURL+ _this.url.exportUrl,'_blank')
			window.close()
		},
		ocChange(data){
			const _this = this
			
			var obj = {};
		    obj = _this.addr.province.find(item =>{
		        return item.val === data 
		    });
//		    _this.addrOriginal.provinceName = obj.key
		    _this.addLine.address = obj.key;
		    _this.addLine.cityStr=obj.key;
			
			_this.addLine.e2="";
			var cityJson=[];
			var addrOriginal = _this.addrOriginal.city;
			$.each(addrOriginal,function(infoIndex,info){
				if(infoIndex==data){
					$.each(info,function(infoIndex2,info2){
						cityJson.push({
							"key":info2,
							"val":infoIndex2
						});
					})
				}
			})
			_this.addr.city=cityJson;
		},
		ocChange2(val){
			debugger
			const _this = this
			var obj = {};
		    obj = _this.addr.city.find(item =>{
		        return item.val === val 
		    });
		    _this.addrOriginal.cityName = obj.key;
		    
		    var countyJson=[];
			var addrOriginal = _this.addrOriginal.county;
			$.each(addrOriginal,function(infoIndex,info){
				if(infoIndex.substring(0,2)==val.substring(0,2)){
					
					$.each(info,function(infoIndex2,info2){
						if(infoIndex2.substring(0,4)==val.substring(0,4)){
							$.each(info2,function(infoIndex3,info3){
								countyJson.push({
									"key":info3,
									"val":infoIndex3
								});
							})
						}
					})
					
				}
			})
			_this.addr.county=countyJson;
		    
		    
		    _this.addLine.address = _this.addLine.cityStr+_this.addrOriginal.cityName;
		},
		ocChange3(val){
			debugger
			const _this = this
			var obj = {};
			obj = _this.addr.county.find(item =>{
				return item.val === val 
			});
			_this.addrOriginal.countyName = obj.key;
			
			_this.addLine.address = _this.addLine.cityStr+_this.addrOriginal.cityName+_this.addrOriginal.countyName;
		},
		handleAvatarSuccess(res, file) {
			this.addLine.logo=res.imageSrc;
	      this.imageUrl = URL.createObjectURL(file.raw);
	    },
      beforeAvatarUpload(file) {
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return  isLt2M;
      }
		
	}
});

