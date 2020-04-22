var vm = new Vue({
	el: '#app',
	data: {
		loading: false,
		tableData: [],
		showList: true,
		saveLoading: false,
		formInline: {
			user: '',
			region: '',
			num: 2
		}
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
					"beginAccount": '200.00',

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
		






	}
});
