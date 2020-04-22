var vm = new Vue({
	el:'#app',
	data:{
		currentPage: 1,
		pageSizes: [10, 20, 50, 100],
		pageSize: 10,
		total: 11,
		loading: false,
		formLabelWidth: '120px',
		pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
		tableData: [],
		formInline: {
			name: '',
			address: '',
			id: ''
		},
		options: [
			{
				value: '豫A787R5',
				label: '豫A787R5'
			},
			{
				value: '豫A787R6',
				label: '豫A787R6'
			},
			{
				value: '豫A787R7',
				label: '豫A787R7'
			},
			{
				value: '豫A787R8',
				label: '豫A787R8'
			},
			{
				value: '豫B787R5',
				label: '豫B787R5'
			},
			{
				value: '豫B787R6',
				label: '豫B787R6'
			},
			{
				value: '豫B787R7',
				label: '豫B787R7'
			},
			{
				value: '豫B787R8',
				label: '豫B787R8'
			},
		],
	},
	mounted() {
		this.onSubmit()
	},
	methods: {
		// 获取表格中的数据，以及分页数据
		getTableData() {
			
			/* this.$message('油站名：'+this.formInline.name); */
			console.log(this.formInline)
			
			
			this.loading = true;
			setTimeout(() => {
				this.loading = false;
			}, 1000);
		
			const _this = this
		
			var data = []
		
			let staCount = (_this.currentPage - 1) * _this.pageSize
		
			for (let i = 0; i < _this.pageSize; i++) {
		
				let num = staCount + i
		
				
		
		
		
				data.push({
					"id": num,
					"lpn": '豫A'+ _this.getRandom(5),
					"planNumber": 1000*(i+1),
					"cycle": '升/月',
					"userName": '张三',
					"updateTime": "2018-09-01",
					"remarks": "需要修改授权",
					
				})
			}
			_this.tableData = data
		},
		getRandom(n){
			var str = "123456789";
				var s = "";
				for(var i = 0; i < n; i++){
					var rand = Math.floor(Math.random() * str.length);
					s += str.charAt(rand);
			}
			return s;
		},
		onSubmit() {
			this.getTableData()
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
		handleEdit(index, row) {
			console.log(index, row);
			this.$confirm('检测到未保存的内容，是否在离开页面前保存修改？', '编辑', {
					distinguishCancelAndClose: true,
					confirmButtonText: '保存',
					cancelButtonText: '放弃修改'
				})
				.then(() => {
					this.$message({
						type: 'info',
						message: '保存修改'
					});
				})
				.catch(action => {
					this.$message({
						type: 'info',
						message: action === 'cancel' ?
							'放弃保存并离开页面' : '停留在当前页面'
					})
				});
		},
		handleDelete(index, row) {
			console.log(index, row);
			this.$message({
				type: 'info',
				message: row.goodsName + ',' + row.goodsNo + '已经下架！'
			});
		},
		update() {
			if (this.form.name == "") {
				this.$message.error('姓名不能为空');
				return;
			}
			this.$message({
				message: '修改成功',
				type: 'success'
			});
			this.dialogFormVisible = false;
		}
	}
});