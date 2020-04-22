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
	el:'#app',
	data:{
		url:{
			listUrl: "goods/yfystag/list",
			addUrl: "goods/yfystag/save",
			updateUrl: "goods/yfystag/update",
			deleteUrl: "goods/yfystag/delete",
			exportUrl: "goods/yfystag/export"
		},
		p:{
			addShow: hasPermission('goods:yfystag:save'),
			updateShow: hasPermission('goods:yfystag:update'),
			deleteShow: hasPermission('goods:yfystag:delete'),
			exportShow: hasPermission('goods:yfystag:export')
		},
		showList: true,
		tableLoading: false,
		saveLoading: false,
		addOrUpdate: "添加",
		q:{
			id:""
		},
		currentPage: 1,
		pageSizes: [10, 20, 50, 100],
		pageSize: 10,
		tag: false,
		goodTag: false,
		total: 0,
		userId: 0,
		tableData: [],
		goods: [],
		tags: [],
		addLine:{
            tagId: "",
            goodId: "",
            tagName: "",
            tagPrice: "",
		},
        rules: {
            tagName: [
                { required: true, trigger: 'blur',message: "请输入标签名" },
            ],
            // name: [
            //     { required: true, trigger: 'blur',validator: validateName},
            // ],
            tagId: [
                {required: true,trigger: 'blur',message: "请选择标签"},
            ],
            goodId: [
                { required: true, trigger: 'blur',message: "请选择油品" },
            ],
            tagPrice: [
                { required: true,  trigger: 'blur',message: "请输入标签价格" },
            ],
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
			_this.addLine = {}
			_this.userId=0
			_this.addOrUpdate = "添加"
		},
		/* 添加按钮点击对应函数 */
		add() {

			const _this = this

			_this.showList = false
		},
		query(){
			
			var _this = this
            _this.getGoods();
            var type = getUrlParam("type");
            var jsons = {
                id: this.q.id,
                type: type
            }
			if (type==0){
                    _this.tag=true,
                    _this.goodTag=false,

                _this.tableLoading = true
                baseGetData(_this,jsons)
			} else {
                _this.getTags();
                _this.tag=false,
				_this.goodTag=true,
                _this.tableLoading = true
                baseGetData(_this,jsons)
			}
		},
		updata(index,row){
			var _this = this
			debugger
			_this.addLine = row
			// alert(_this.addLine.tagId)
            // _this.addLine.tagId=row.tagId
            // _this.addLine.goodId=row.goodId
			_this.addOrUpdate = "修改"
			_this.userId=1
			_this.add()
		},
		deleteRow(index,row){
			var _this = this
			var ids = [row.id]
			baseDelete(_this,ids)
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
		save(formName){

			var _this = this;
            var _this = this;
            var check=true;
            _this.$refs[formName].validate((valid) => {
                debugger
                if (valid) {
//		            alert('submit!');
                } else {
                    console.log('error submit!!');
                    check = false;
                    return false;
                }
            });
            if (check) {
                var type = getUrlParam("type");
                if (type == 0) {
                    baseSave(_this)
                } else {
                    debugger
                    var ul = _this.userId == 0 ? "goods/yfystag/saveGoodTag" : "goods/yfystag/updateGoodTag";
                    $.ajax({
                        type: "POST",
                        url: baseURL + ul,
                        data: {
                            goodId: _this.addLine.goodId,
                            tagId: _this.addLine.tagId,
                            tagPrice: _this.addLine.tagPrice,
                            id: _this.addLine.id
                        },
                        success: function (r) {
                            if (r.code == 0) {
                                _this.addLine = {};
                                _this.list();
                                _this.query();
                                alert("操作成功");
                            } else {
                                alert(r.msg);
                            }
                        }
                    });
                }
            }
		},
		exportData(){
			var _this = this;
			window.open(baseURL+ _this.url.exportUrl,'_blank')
			window.close()
		},
        getGoods(){
			var _this=this

            $.ajax({
                type: "get",
                url: baseURL + "goods/yfysgoods/getGoods",

                success: function(r){
                    if(r.code == 0){
                        _this.goods = r.list;
                        if(_this.otherInfo){//看页面是否配置了，是否在查询中塞了其他数据
                            _this.otherInfoArray=r.page;
                        }
                    }else{
                        alert(r.msg);
                    }
                }
            });
		},
        getTags(){
            var _this=this
            var jsons={
                page: 1,
                limit: 50
            };
            $.ajax({
                type: "POST",
                url: baseURL + "goods/yfystag/list",
                data: jsons,
                success: function(r){
                    if(r.code == 0){
                        _this.tags = r.page.list;
                        if(_this.otherInfo){//看页面是否配置了，是否在查询中塞了其他数据
                            _this.otherInfoArray=r.page;
                        }
                    }else{
                        alert(r.msg);
                    }
                }
            });
        }
		
		
		
	}
});