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
var validateMobile = (rule, value, callback) => {
	        if (value === '') {
	          callback(new Error('请输入手机号'));
	        } else {
	        	var phoneReg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/
	        	 if (!phoneReg.test(value)) {
	                 callback(new Error('格式有误'))
	               } else {
	                 callback()
	               }
	          callback();
	        }
	      };
// var validateEmail = (rule, value, callback) => {
//     if (value === '') {
//         callback(new Error('请输入邮箱号'));
//     } else {
//         var phoneReg =  /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
//         if (!phoneReg.test(value)) {
//             callback(new Error('格式有误'))
//         } else {
//             callback()
//         }
//         callback();
//     }
// };
  var validatePass = (rule, value, callback) => {
      debugger
	  if (value == '' && userId==null) {
		  callback(new Error('请输入密码'));
	  } else {
	  	if (userId!=null){
            callback();
		} else {
            // var passReg =  /^[a-zA-Z][a-zA-Z0-9_]{5,15}$/
//            var passReg =  /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/
            var passReg =  /^[0-9A-Za-z]{6,16}$/
            if (!passReg.test(value)) {
                callback(new Error('6~16位英文字母和数字'))
            } else {
                callback();
            }
		}
      }
  };
var validateUserName = (rule, value, callback) => {
    debugger
    if (value === '' && userId==null) {
        callback(new Error('请输入用户名'));
    } else {
    	if (userId!=null) {
            callback()
		}else {
//            var nameReg =  /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/
//              var nameReg =  /^[a-zA-Z][a-zA-Z0-9_]{4,15}$/
//             if (!nameReg.test(value)) {
//                 callback(new Error('6~16位英文字母和数字'))
//             } else {
                $.ajax({
                    type: "get",
                    url: baseURL + "sys/user/check?username="+value,
                    // data: jsons,
                    success: function(r){
                        if(r.code == 0){
                            callback()
                        }else{
                            callback(new Error('用户名已存在'))
                        }
                    }
                });
            }
		}
    }
// };
// var validateName = (rule, value, callback) => {
//     if (value === '') {
//         callback(new Error('请输入姓名'));
//     } else {
//         // var phoneReg =  /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/
//         var phoneReg =  /^[\u4E00-\u9FA5]{2,4}$/
//         if (!phoneReg.test(value)) {
//             callback(new Error('2~4个汉字'))
//         } else {
//             callback()
//         }
//         callback();
//     }
// };
var vm = new Vue({
	el:'#app',
	data:{
		url:{
			listUrl: "sys/user/list",
			addUrl: "sys/user/save",
			updateUrl: "sys/user/update",
			deleteUrl: "sys/user/delete",
			exportUrl: "sys/user/export",
			checkUrl: "sys/user/check"

		},
		p:{
            addShow: hasPermission('driver:sysuser:save'),
            updateShow: hasPermission('driver:sysuser:update'),
            deleteShow: hasPermission('driver:sysuser:delete'),
            exportShow: hasPermission('driver:sysuser:export')
        },
		showList: true,
		tableLoading: false,
		saveLoading: false,
		addOrUpdate: "",
        around: "",
		q:{
			status:"2",
			key:""
		},
		currentPage: 1,
		pageSizes: [10, 20, 50, 100],
		pageSize: 10,
		total: 0,
		tableData: [],
        selectData: [],
		tags:[],
		addLine:{
            about: "",
			tag: ""
		},

		orgCode: getLoginUser().orgCode,
		rules: {
			username: [
	            { required: true, trigger: 'blur',validator: validateUserName },
	          ],
            // name: [
            //     { required: true, trigger: 'blur',validator: validateName},
            // ],
	          password: [
        	  {required: true,trigger: 'blur',validator: validatePass },
        	  ],
        	  // email: [
    		  // { required: true, trigger: 'blur' },
    		  // ],
    		  mobile: [
			  { required: true,  trigger: 'blur',validator: validateMobile },
			  ],
		}
	},
	mounted() {
		this.query();
        // this.getAccount();
	},
	methods: {
		/* 列表按钮点击对应函数 */
		list() {
			const _this = this
            _this.around=""
			_this.showList = true
			_this.addLine = {}
			_this.addOrUpdate = ""
			userId=null
		},
		/* 添加按钮点击对应函数 */
		add() {
			const _this = this
            // var type = getUrlParam("type");
			// if (type==1){
            //     _this.around=true
			// }

			// -this.getTagList()
			// _this.$refs['addLine'].clearValidate();
		},
		query(){
			
			var _this = this

			debugger
			var a=deptFun.getDeptInfoByOrgCode(_this.orgCode)
			var b=getLoginUser()
			var add=_this.orgCode
			if (a.aroundType!="2"){
				_this.around=true
			}else {
                _this.around=false
			}
			var jsons = {
				key: this.q.name,
				status: '2',
			    type: '1'
			}
			_this.tableLoading = true
			baseGetData(_this,jsons)
			
		},
        numberSelect(val){
			debugger
            console.log(val)
            this.addLine.tag = val.id
            // this.addLine.controllerNo = val.controllerNo
        },
		updata(index,row){
			debugger
			var _this = this
            _this.showList = false
			_this.addLine = row
            _this.selectData.push({id:_this.addLine.tag,tagName:_this.addLine.tagName})
			userId=_this.addLine.userId;
			// alert(_this.addLine.about)
			// alert(_this.addLine.tag)
           // userId= _this.addLine.about
           // userId= _this.addLine.tag
			_this.getTagList(_this.addLine.userId);
			_this.addLine.id=_this.addLine.userId;
			_this.addLine.password=null;
			_this.addOrUpdate = "修改";
			_this.orgCode = _this.addLine.orgCode;
            var a=deptFun.getDeptInfoByOrgCode(_this.orgCode)
            if (a.aroundType!="1"){
                _this.around=true
            }else {
                _this.around=false
			}
            _this.showList = false

            _this.$refs['addLine'].clearValidate();
		},
		deleteRow(index,row){
			var _this = this
			var ids = [row.userId]
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
			debugger
			var _this = this;
			_this.addLine.status=2;
			var check = true;
			if(_this.addLine.password==null || _this.addLine.password ==''){
				_this.addLine.password=_this.addLine.password_bak;
			}
			_this.$refs[formName].validate((valid) => {
				debugger
		          if (valid) {
//		            alert('submit!');
		        	baseSave(_this)
		          } else {
		            console.log('error submit!!');
		            check = false;
		            return false;
		          }
		        });
		},
		exportData(){
			var _this = this;
			window.open(baseURL+ _this.url.exportUrl,'_blank')
			window.close()
		},
		getAccount(id){
			debugger
			var _this=this
			// var id=getLoginUser().userId
            $.ajax({
                type: "get",
                url: baseURL +"account/yfysaccount/info/"+id ,
                // data: jsons,
                success: function(r){
                    if(r.code == 0){
                    	debugger
                       _this.about=r.yfySAccount.status
                    }else{
                        callback(new Error('用户名已存在'))
                    }
                }
            });
		},
        getTagList(id){
            debugger
            var _this=this
            // var id=getLoginUser().userId
            $.ajax({
                type: "get",
                url: baseURL +"sys/user/getTags?id="+id ,
                // data: jsons,
                success: function(r){
                    if(r.code == 0){
                        debugger
                        _this.tags=r.list
                    }else{
                        callback(new Error('未获取tags'))
                    }
                }
            });
        },
	}

});