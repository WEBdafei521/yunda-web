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
var userId;
var validateCardNo = (rule, value, callback) => {
    debugger
    if ((value == ''||value==undefined) && userId==null) {
            callback(new Error('不为空'));
        } else {
    	if (userId!=null){
            callback()
		} else {
            $.ajax({
                type: "post",
                url: baseURL + "card/yfyscard/check",
                dataType: 'json',
                data: {
                    cardNo:value
                },
                success: function(r){
                    if(r.code == 0){
                        callback()
                    }else{
                        callback(new Error(r.msg))
                    }
                }
            });
		}

        }
    };
var validateStatus = (rule, value, callback) => {
    if (value == '') {
        callback(new Error("不能为空，请选择"))
    }else {
        callback()
    }
};
var validateMappingStatus = (rule, value, callback) => {
    if (value ===''|| value==undefined) {
        callback(new Error("不能为空，请选择"))
    }else {
        callback()
    }
};
var validateInnerStatus = (rule, value, callback) => {
    debugger
    if (value ==='' || value==undefined) {
        callback(new Error("不能为空，请选择"))
    }else {
        callback()
    }
};




var vm = new Vue({
	el:'#app',
	data:{
		url:{
			listUrl: "card/yfyscard/list",
			listTypeUrl: "card/yfyscard/listByType",
			addUrl: "card/yfyscard/save",
			updateUrl: "card/yfyscard/update",
			deleteUrl: "card/yfyscard/delete",
			exportUrl: "card/yfyscard/export",
            getDepartNo: "yunda/yfysdepart/get/departNo?type=3",
            setWhiteListUrl: "card/yfyscard/setStaffCard"
		},
		p:{
			addShow: hasPermission('card:yfyscard:save'),
			updateShow: hasPermission('card:yfyscard:update'),
			deleteShow: hasPermission('card:yfyscard:delete'),
			exportShow: hasPermission('card:yfyscard:export')
		},
		showList: true,
        rfid: false,
        mi: false,
		tableLoading: false,
		saveLoading: false,
        inner:"",
		addOrUpdate: "添加",
		q:{
			id:""
		},
		currentPage: 1,
		pageSizes: [10, 20, 50, 100],
		pageSize: 10,
		total: 0,
		tableData: [],
		selectData: [],
		addLine:{
            cardType: "",
            status: "",
            mappingStatus: "",
            innerStatus: "",
		},
		rules:{
            cardNo:[
                { required: true, trigger: 'blur',validator: validateCardNo },
			],
            status:[
                { required: true,validator: validateStatus },
            ],
            e1:[
                { required: true, validator: validateMappingStatus },
            ],
            userId:[
                { required: true,validator: validateInnerStatus },
            ],
		}
	},
	mounted() {
		this.query();
		this.getListByType();
	},
	methods: {
        getListByType() {
            debugger
            var _this = this
            var type = getUrlParam("type");
            // if(type=='1' || type==1){
            var jsons = {
                cardType: '2',
                innerType: '0'
            }
            $.ajax({
                type: "POST",
                url: baseURL + "card/yfyscard/listByType",
                // contentType: "application/json",
                data: jsons,
                success: function (r) {
                    if (r.code === 0) {
                        _this.selectData = r.list;
                    } else {
                        alert(r.msg);
                    }
                }
            });

            //}else {
            //     var jsons = {
            //         cardType: type
            //     }
            //     $.ajax({
            //         type: "POST",
            //         url: baseURL + "card/yfyscard/listByType",
            //         // contentType: "application/json",
            //         data: jsons,
            //         success: function(r){
            //             if(r.code === 0){
            //                 _this.selectData=r.list;
            //             }else{
            //                 alert(r.msg);
            //             }
            //         }
            //     });

        },
        //下发白名单
        setWhiteList(){
            var _this = this;
            $.ajax({
                type: "POST",
                url: baseURL + _this.url.setWhiteListUrl,
                contentType: "application/json",
                success: function(r) {
                    if (r.code == 0) {
                        alert('下发成功', function(index) {
                            _this.query();
                        });
                    } else {
                        alert(r.msg);
                    }
                }
            });
        },
        /* 列表按钮点击对应函数 */
        list() {
            debugger
            const _this = this
            _this.showList = true
            _this.addLine = {}
            var type = getUrlParam("type");
            _this.addLine.cardType = type
            // _this.addLine.mappingStatus="1"
            // _this.addLine.status="1"
            // _this.addLine.cardType="1"
            _this.getListByType()
            _this.addOrUpdate = "添加"
        },
        /* 添加按钮点击对应函数 */
        add() {
            const _this = this
            // _this.innerStatus='0'
            _this.addLine.cardType='2'
            _this.showList = false
            _this.$refs['addLine'].clearValidate();
        },
        query() {

            var _this = this
            var jsons = {
                cardType: '2',
                unInnerStatus: '2'
            }
            _this.tableLoading = true
            baseGetData(_this, jsons)

        },
        updata(index, row) {
            debugger
            var _this = this
            _this.addLine = row
            // _this.selectData=[{id:_this.addLine.vehId,lpn:_this.addLine.lpn}]
            _this.selectData.push({id: _this.addLine.vehId, lpn: _this.addLine.lpn})
            userId = _this.addLine.id
            if (_this.addLine.innerStatus==1){
                _this.inner=true
            }else {
                _this.inner=false
                _this.addLine.e1=''
            }
            _this.addOrUpdate = "换卡"
            _this.add()
        },
        chan(value){
            var _this=this
            if (value==1){
                _this.inner=true
            }else {
                _this.inner=false
                }
        },
        deleteRow(index, row) {
            var _this = this
            var ids = [row.id]
            baseDelete(_this, ids)
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
        save(formName) {
            debugger
            var _this = this;
            var check = true;
            _this.$refs[formName].validate((valid) => {

                if (valid) {
//		            alert('submit!');
                } else {
                    console.log('error submit!!');
                    check = false;
                    return false;
                }
            });
            if (check) {
                // baseSave(_this)
                debugger
                var url = _this.addLine.id == null ? _this.url.addUrl : _this.url.updateUrl;
                $.ajax({
                    type: "POST",
                    url: baseURL + url,
                    contentType: "application/json",
                    data: JSON.stringify(_this.addLine),
                    success: function (r) {
                        if (r.code === 0) {
                            // _this.addLine = {};
                            _this.list();
                            _this.query();
                            _this.getListByType()
                            alert("操作成功");
                        } else {
                            alert(r.msg);
                        }
                    }
                });
            }
        },
        exportData() {
            var _this = this;
            window.open(baseURL + _this.url.exportUrl, '_blank')
            window.close()
        },
        updateStatusRow(index, row) {
            var _this = this
            var id = [row.id]
            _this.addLine = row
            var status = row.status == '0' ? "启用" : "停用";
            confirm('确定要' + status + '此卡吗？', function () {
                _this.addLine.status = Math.abs(parseInt(row.status) - 1);
                $.ajax({
                    type: "POST",
                    url: baseURL + _this.url.updateUrl,
                    contentType: "application/json",
                    data: JSON.stringify(_this.addLine),
                    success: function (r) {
                        if (r.code == 0) {
                            alert('操作成功', function (index) {
                                _this.query();
                            });
                        } else {
                            alert(r.msg);
                        }
                    }
                });
            });
        }
    }
});