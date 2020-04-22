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
					"gunNo": num,
					"motherboardNo": num,
					"motherboardType": "SKIC",
					"linkAddress": 2,
					"pcPort": num +'0',
					"tankNo": num,
					"price": "8.6",
					"oil": '92#',
					"beginAccount": '0.00',
					"intelligentModuleNo":"YFY"+_this.getRandom(11) ,
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
		






	}
});
