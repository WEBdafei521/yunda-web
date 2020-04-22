var vm = new Vue({
	el:'#app',
	data:{
		updateDialog: false,
		update2Dialog: false,
		currentPage: 1,
		pageSizes: [10, 20, 50, 100],
		pageSize: 10,
		total: 500,
		loading: false,
		dialogFormVisible: false,
		formLabelWidth: '120px',
		tableData: [],
		formInline: {
			name: '',
			address: '',
			id: '',
			min: 0,
			max: 100
		},
		updateInline:{
			lpn: '',
			cycleData: '',
			cycle:[
				{
					value: '升/月',
					label: '升/月'
				},
				{
					value: '升/季度',
					label: '升/季度'
				},
				{
					value: '升/年',
					label: '升/年'
				},
				{
					value: '不限',
					label: '不限'
				}
			],
			planNumber:''
		},
		options: [{
					value: '云飞扬长椿路加油站',
					label: '云飞扬长椿路加油站',
					children: [
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
					]
				},
				{
					value: '云飞扬花公路路加油站',
					label: '云飞扬花公路路加油站',
					children: [
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
					]
				}]
			
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
					"id": 1,
					"departname": "云飞扬测试加油站-" + num,
					"lpn": '豫A'+ _this.getRandom(5),
					"oil": '柴油',
					"planNumber": 1000*(i+1),
					"cycle": '升/月',
					"surplus": _this.getRandom(3)+'升',
					"tankCapacity": '50L'
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
			const _this = this;
			console.log(index, row)
			_this.updateDialog = true
			_this.updateInline.lpn = row.lpn
			_this.updateInline.cycleData = row.cycle
			_this.updateInline.planNumber = row.planNumber
			
			
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
		},
		updateSubmit(){
			this.updateDialog = false;
			this.$message({
				message: '修改成功',
				type: 'success'
			});
			this.getTableData();
		},
		handle2Edit(index, row) {
			const _this = this;
			console.log(index, row)
			_this.update2Dialog = true
			_this.updateInline.lpn = row.lpn
			_this.updateInline.tankCapacity = row.tankCapacity
		},
		update2Submit(){
			this.update2Dialog = false;
			this.$message({
				message: '临时授权成功',
				type: 'success'
			});
			this.getTableData();
		},
		
	}
});