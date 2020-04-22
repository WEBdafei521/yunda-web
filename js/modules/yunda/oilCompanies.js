var c_departname = (rule, value, callback) => {
	if (YDCP.isFalse(value)) {
		return callback(new Error('不能为空'));
	} /*else if (!YDCP.checkStr(value, "chinese")) {
		return callback(new Error('请输入中文'));
	}*/ else if (value.length > 50) {
		return callback(new Error('长度不能大于50'));
	} else {
		callback();
	}
};
var c_deptabbr = (rule, value, callback) => {
	if (YDCP.isFalse(value)) {
		return callback(new Error('不能为空'));
	} /*else if (!YDCP.checkStr(value, "chinese")) {
		return callback(new Error('请输入中文'));
	}*/ else if (value.length > 10) {
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
function getUrlParam (name) {
    var reg = new RegExp('(^|&)' + name + '=(.*)(&[^&=]+=)');
    var regLast = new RegExp('(^|&)' + name + '=(.*)($)');
    var r = window.location.search.substr(1).match(reg) || window.location.search.substr(1).match(regLast);
    if (r != null) {
        var l = r[2].match(/&[^&=]+=/)
        if (l) {
            return decodeURIComponent(r[2].split(l[0])[0]);
        } else return decodeURIComponent(r[2]);
    }
    return null;
}

var vm = new Vue({
	el: '#app',
	data: {
		url: {
			listUrl: "yunda/yfysdepart/getList/oilCompanies",
			addUrl: "yunda/yfysdepart/save/oilCompanies",
			updateUrl: "yunda/yfysdepart/update/oilCompanies",
			deleteUrl: "yunda/yfysdepart/delete/oilCompanies/",
			exportUrl: "yunda/yfysdepart/export",
			getDepartNo: "yunda/yfysdepart/get/departNo",
			uploadActionUrl: baseURL +"yunda/yfysdepart/uploadlogo?token="+token
		},
		p: {
			addShow: hasPermission('yunda:yfysdepart:save:oilCompanies'),
			updateShow: hasPermission('yunda:yfysdepart:update:oilCompanies'),
			deleteShow: hasPermission('yunda:yfysdepart:delete:oilCompanies'),
			exportShow: hasPermission('yunda:yfysdepart:export')
		},
		showList: true,
		tableLoading: false,
		saveLoading: false,
		addOrUpdate: "添加",
		listName: "",
		q: {
			departname: ""
		},
		currentPage: 1,
		pageSizes: [10, 20, 50, 100],
		pageSize: 10,
		total: 0,
        companies: false,
        operators: false,
		arrount: false,
		tableData: [],
		addLine: {
			e3:"",
		},
		imageUrl: '',
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
		},
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
			_this.addLine = {
					e3:"",
			}
			_this.addOrUpdate = "添加"

		},
		/* 添加按钮点击对应函数 */
		add() {
			const _this = this
            var type = getUrlParam("type");
            var aroundType=deptFun.getDeptInfoByOrgCode(getLoginUser().orgCode).aroundType
			if (aroundType=='1'){
                _this.arrount=true
			}
            if(type=='0' || type==0){
                if(!_this.addLine.e3){
                    $.get(baseURL + _this.url.getDepartNo+"?type=1", function(r){

                        _this.addLine.e3 = r.departNo;
                    });
                }
			}else {
                if(!_this.addLine.e3){
                    $.get(baseURL + _this.url.getDepartNo+"?type=4", function(r){

                        _this.addLine.e3 = r.departNo;
                    });
                }
			}

			_this.showList = false;
		},
		query() {

			var _this = this
            var type = getUrlParam("type");
            if(type=='0' || type==0){
                _this.operators = false;
                _this.companies = true;
                _this.listName = "石油公司列表"
                var jsons = {
                    departname: this.q.departname
                }
                _this.tableLoading = true
				_this.url.listUrl="yunda/yfysdepart/getList/oilCompanies"
                baseGetData(_this, jsons)
            }else {
                _this.operators = true;
                _this.companies = false;
                _this.listName = "运营商列表"
                var jsons = {
                    departname: this.q.departname
                }
                _this.tableLoading = true
                _this.url.listUrl="yunda/yfysdepart/getList/oilOperators"
                baseGetData(_this, jsons)
            }
			// var jsons = {
			// 	departname: this.q.departname
			// }
			// _this.tableLoading = true
			// baseGetData(_this, jsons)

		},
		updata(index, row) {
			var _this = this
			_this.addLine = row
			_this.imageUrl=_this.addLine.logo
			_this.addOrUpdate = "修改"
			_this.add()
		},
		updateStatusRow(index, row) {
			var _this = this
			var id = [row.id]
			_this.addLine = row
			var status = row.status == '0' ? "启用":"停用";
            var type = getUrlParam("type");
            if(type=='0' || type==0){
                confirm('确定要'+status+'此石油公司吗？', function() {
                    _this.addLine.status=Math.abs(parseInt(row.status)-1);
                    _this.url.updateUrl="yunda/yfysdepart/update/oilCompanies"
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
            }else {
                confirm('确定要'+status+'此运营商吗？', function() {
                    _this.addLine.status=Math.abs(parseInt(row.status)-1);
                    _this.url.updateUrl="yunda/yfysdepart/update/oilCompanies"
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
            }

		},
		handleSizeChange(val) {
			var _this = this;
			var lock = false;
			_this.pageSize = val;
			lock = basePageLock(_this, val);
			if (lock) {
				_this.handleCurrentChange(_this.currentPage)
			}
		},
		handleCurrentChange(val) {
			this.currentPage = val
			this.query();
		},
		save() {
			var _this = this;
			_this.$refs['addLine'].validate((valid) => {
				if (valid) {
                    var type = getUrlParam("type");
                    if(type=='0' || type==0){
                        _this.url.addUrl="yunda/yfysdepart/save/oilCompanies"
                        _this.url.updateUrl="yunda/yfysdepart/update/oilCompanies"
                        baseSave(_this)
                    }else {
                        _this.url.addUrl="yunda/yfysdepart/save/oilOperators"
                        _this.url.updateUrl="yunda/yfysdepart/update/oilCompanies"
                        baseSave(_this)
                    }
				} else {
					alert('请填写正确信息');
					return false;
				}
			});
		},
		exportData() {
			var _this = this;
			window.open(baseURL + _this.url.exportUrl, '_blank')
			window.close()
		},
		uploadSuccess : function(response,file,fileList){
			debugger
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
