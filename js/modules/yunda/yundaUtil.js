//layui下拉框赋值方法
function setSelect(el,url){
	$.ajax({
        url: url,
        type: 'post',
        dataType: 'json',
        async:false,
        success: function(data) {
        	debugger
        	if(data.code==0){
    			var htmlOp="";
            	for (var i = 0; i < data.page.list.length; i++) {
            		htmlOp += '<option value="'+data.page.list[i].id+'">'+data.page.list[i].lpn+'</option>';
            	}
            	$("#"+el).append(htmlOp);
        	}
        }
});
}
//layui下拉框赋值方法,油品的，目前没想好咋处理不同的字段的，先分开吧
function setSelect2(el,url){
	$.ajax({
		url: url,
		type: 'post',
		dataType: 'json',
		async:false,
		success: function(data) {
			debugger
			if(data.code==0){
				var htmlOp="";
				for (var i = 0; i < data.data.goods.length; i++) {
					htmlOp += '<option value="'+data.data.goods[i].goodsCode+'">'+data.data.goods[i].goodsName+'</option>';
				}
				$("#"+el).append(htmlOp);
			}
		}
	});
}