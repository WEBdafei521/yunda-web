
var vm = new Vue({
	el:'#app_main',
	data:{
		departInfo:{},
		list_controller:[],
		list_serviceDate:[],
		list_tank:[],
		list_tank_alarm:[],
		list_companyList:[],
		departName:'',
		 oilStationFlag:true,
		 oilCompanyFlag:false,
		 oilAdminFlag:false,
		 isOilAdmin:false
	},
	methods: {
		getMainInfo: function () {
			var _this = this;
			// debugger
			var loginUser = getLoginUser();
			var orgCode = loginUser.orgCode;
			//由于目前层级结构的划分，默认orgCode为8位的，就是石油公司的管理员账户
			var type="0";//表示是加油站管理人员
			if(orgCode.length==8){
				type="1";
				 _this.oilStationFlag=false;
				 _this.oilCompanyFlag=true;
				 _this.isOilAdmin=false;
			}else if(orgCode.length==4){
				
				type="2";
				 _this.oilStationFlag=false;
				 _this.oilCompanyFlag=false;
				 _this.oilAdminFlag=true;
				 _this.isOilAdmin=true;
				 $("#headInfo").attr("class","adminShow");
			}else{
				//no do
			}
			
            $.ajax({
                type: "POST",
                url: baseURL + "yunda/yfysdepart/initMainInfo?type="+type,
                dataType: "json",
                success: function(r){
									_this.departInfo = r.departInfo;
					
                	_this.list_controller = r.list_controller ? r.list_controller:[];
                	_this.list_serviceDate = r.list_serviceDate;
                	_this.list_tank = r.list_tank;
                	_this.list_tank_alarm = r.list_tank_alarm;
									_this.list_companyList = r.list_companyList;
									var arr=r.list_controller
									if(arr && type=="2"){
										for(var item of arr){
											item.longitude=item.lon;
											item.latitude=item.lat;
										}
										var useArr=[];
										arr.forEach(function(item, index, arr){
											if(item.lon!=0 && item.lat!=0){
												useArr.push(item);
											}
										});
										sessionStorage.setItem("position",JSON.stringify(useArr))
									}
                }
            });
		},
		dataFormatter: function(row, column) {
			var gunNo = row[column.property]+"";
		      if (gunNo)  {
		          if (gunNo.length==1) {
		            return "0"+gunNo;
		          }
		      }
		      return gunNo;
		}
	},
	created: function(){
		this.getMainInfo();
	},
	updated: function(){
	},
	
});
