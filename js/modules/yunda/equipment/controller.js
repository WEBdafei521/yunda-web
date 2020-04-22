var vm = new Vue({
	el: '#app',
	data: {
		loading: false,
		tableData: [],
		showList: true,
		saveLoading: false,
		formInline: {

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
	},
	mounted() {
		this.getTableData()
	},
	methods: {
		// 获取表格中的数据，以及分页数据
		getTableData() {
			this.loading = true;
			setTimeout(() => {
				this.loading = false;
			}, 1000);
			const _this = this
			var data = []
			for (let i = 0; i < 5; i++) {

				let num = 1 + i;
				data.push({
					"id": num,
					"controllerNo": 'YFY' + _this.getRandom(12),
					"simNo": _this.getRandom(11),
					"simTime": '2020-07-07',
					"controllerType": '飞扬一号'
				})
			}
			_this.tableData = data
		},
		getRandom(n) {
			var str = "123456789";
			var s = "";
			for (var i = 0; i < n; i++) {
				var rand = Math.floor(Math.random() * str.length);
				s += str.charAt(rand);
			}
			return s;
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
			this.formInline = row
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
