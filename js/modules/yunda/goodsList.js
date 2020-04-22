var vm = new Vue({
	el: '#app',
	data: {
		showList: true,
		saveLoading: false,
		currentPage: 1,
		pageSizes: [10, 20, 50, 100],
		pageSize: 10,
		total: 500,
		loading: false,
		dialogFormVisible: false,
		formLabelWidth: '120px',
		tableData: [],
		formInline: {},
		updatePriceDialog: true,
		updatePriceForm: {},
		options: [{
			value: '车用燃油',
			label: '车用燃油',
			children: [{
					value: '汽油',
					label: '汽油',
					children: [{
							value: '92#',
							label: '92#'
						},
						{
							value: '95#',
							label: '95#'
						},
						{
							value: '98#',
							label: '98#'
						},
						{
							value: '90#',
							label: '90#'
						},
					]
				},
				{
					value: '柴油',
					label: '柴油',
					children: [{
							value: '0#',
							label: '0#'
						},
						{
							value: '-10#',
							label: '-10#'
						},
						{
							value: '-20#',
							label: '-20#'
						},
						{
							value: '-30#',
							label: '-30#'
						},
					]
				},
				{
					value: '其他',
					label: '其他'
				}
			]
		}],
		yqData: [{
			gunNo: '01',
			tankNo: '02',
			price: '6.5 元/升'
		},{
			gunNo: '02',
			tankNo: '02',
			price: '6.5 元/升'
		},{
			gunNo: '03',
			tankNo: '02',
			price: '6.5 元/升'
		}],
		multipleSelection: []
	},
	mounted() {
		this.onSubmit()
	},
	methods: {
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
					"departname": "加油站-" + num,
					"count": '600' + num + '升',
					"goodsName": '92#汽油',
					"state": '销售中',
					"goodsNo": '201' + i,
					"price": '7.5元/升',

				})
			}
			_this.tableData = data
		},
		onSubmit() {
			this.getTableData()
		},
		handleSizeChange(val) {

			console.log(this.currentPage);


			console.log("数量变化" + new Date().getTime())
			this.pageSize = val

			// 解决pageSize变化时，可能会导致的currentPage 不会变化
			if (this.currentPage * val <= this.total) {
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
		updatePrice(index, row) {
			this.updatePriceForm = row
			this.updatePriceDialog = true;
		},
		savePrice() {
			this.updatePriceDialog = false;
			this.$message({
				message: '调价成功',
				type: 'success'
			});
			this.getTableData();
		}



	}
});
