var vm = new Vue({
	el: '#app',
	data: {
		loading: false,
		tableData: [],
		oilCode:'',
		currentPage: 1,
		pageSizes: [10, 20, 50, 100],
		pageSize: 10,
		total: 500,
		oilCodeList:[],
		showList: true,
		saveLoading: false,
		yfyBOilRecord: {
			user: '',
			region: '',
			num: 2
		},
		pickerOptions: {
			disabledDate(time) {
				return time.getTime() > Date.now();
			},
			shortcuts: [{
				text: '半年后',
				onClick(picker) {
					const date = new Date();
					date.setMonth(date.getMonth() + 6);
					date.setTime(date.getTime());
					picker.$emit('pick', date);
				}
			}, {
				text: '一年后',
				onClick(picker) {
					const date = new Date();
					date.setFullYear(date.getFullYear() + 1);
					date.setTime(date.getTime());
					picker.$emit('pick', date);
				}
			}]
		},
		value2: '',
	},
	
	mounted() {
		this.getTableData()
		this.initSelectData()
	},
	methods: {
		initSelectData(){
			debugger
			var _this = this
			$.ajax({
		        url: baseURL+"yunda/yfybdeptoil/list",
		        type: 'post',
		        dataType: 'json',
		        async:false,
		        success: function(data) {
		        	debugger
		        	if(data.code==0){
		    			var htmlOp="";
		    			_this.oilCodeList=data.page.list;
		            	/*for (var i = 0; i < data.page.list.length; i++) {
		            		htmlOp += '<option value="'+data.page.list[i].id+'">'+data.page.list[i].lpn+'</option>';
		            	}*/
		        	}
		        }
			});
		},
		// 获取表格中的数据，以及分页数据
		getTableData() {
			this.loading = true;
			setTimeout(() => {
				this.loading = false;
			}, 1000);
		
			const _this = this
		
			var data = []
		
			let staCount = (_this.currentPage - 1) * _this.pageSize
		
			for (let i = 0; i < _this.pageSize; i++) {

				let num = 1 + i

				data.push({
					"id": num,
					"tankNo": num,
					"oil": '92#',
					"tankHeight": '1800.00',
					"tankMaxCapacity": '22000.00',
					"tankCapacityPercentage": '100',
					"levelNo": '1',
					"intelligentModuleNo": '0',

					
					"purchaseOrderNum": '2019072315465656',
					"businessDate": '2019-07-22 12:12:05',
					"carrier": '200.00',
					"primaryVolume": '200.00',
					"shift": '200.00',
					"oiltankCarNo": '200',
					"meteringStaff": '200.00',
					"purchaseDate": '200.00',
					"carrierDriver": '200.00',
					"unloadOiltank": '200.00',
					"supplier": '郑州高新区石油公司',
					"preUnloadOilhight": '200.00',
					"preUnloadWaterhight": '200.00',
					"preUnloadOiltem": '200.00',
					"preUnloadingOil": '200.00',
					"duringOil": '200.00',
					"unloadOil": '200.00',
					"unloadOilhight": '200.00',
					"unloadWaterhight": '200.00',
					"unloadOiltem": '200.00',
					"startTime": '2019-07-22 12:12:05',
					"endTime": '2019-07-22 12:12:05',
					"unloadOilNum": '200.00',
					
				})
			}
			_this.tableData = data
		},
		list() {
			const _this = this;
			_this.showList = true
			_this.getTableData()
		},
		add() {
			const _this = this;
			_this.showList = false;
			this.loading = true;
			setTimeout(() => {
				this.loading = false;
			}, 1000);
		},
		onSubmit() {
			console.log('submit!');
		},
		handleSizeChange(val) {
			
			console.log(this.currentPage);
			
			
			console.log("数量变化" + new Date().getTime())
			this.pageSize = val
			
			// 解决pageSize变化时，可能会导致的currentPage 不会变化
			if(this.currentPage * val  <= this.total){
				this.$message('error：');
				this.handleCurrentChange(this.currentPage) 
			}
			
		},
		handleCurrentChange(val) {
			console.log("页码变化" + new Date().getTime())
			this.currentPage = val
			this.getTableData();
		},
		save() {
			
			const _this = this;
			
			_this.saveLoading = true
			setTimeout(() => {
			  _this.saveLoading = false
			  this.$message({
			  	message: '保存成功',
			  	type: 'success'
			  });
			  _this.showList = true
			  _this.getTableData()
			  
			}, 1000);
			
		  },
			handleEdit(index, row) {
				this.yfyBOilRecord = row
				this.add()
			},
			handleDel(index, row) {
				
				const _this = this;
				
				_this.$confirm('是否删除'+ row.controllerNo +'?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					_this.$message({
						type: 'success',
						message: '删除成功!'
					});
					_this.getTableData()
				}).catch(() => {
					console.log("取消删除")
				});
			}






	}
});
