window.onload = function(){
		//更换高于低于背景色
		var divs = document.getElementsByClassName("div1");
		var len = divs.length;
		for(var i=0;i<len;i++){
			divs[i].onclick = function(){
				for(var j=0;j<len;j++){
					divs[j].style.backgroundColor = "#666";
				}
				this.style.backgroundColor = "#3a3a3a";
			};
		}

	//更换欧元美元背景图
	var divs1 = document.getElementsByClassName("div2");
		var len1 = divs1.length;
		for(var y=0;y<len1;y++){
			divs1[y].onclick = function(){
				for(var u=0;u<len1;u++){
					divs1[u].style.backgroundImage = "url(images/jiaoyi/zishen_12.png)";
				}
				this.style.backgroundImage = "url(images/jiaoyi/zishen_16.png)";
			};
		}

		//更换时间背景图
		var divs2 = document.getElementsByClassName("jian");
		var len2 = divs2.length;
		for(var a=0;a<len2;a++){
			divs2[a].onclick = function(){
				for(var b=0;b<len2;b++){
					divs2[b].style.backgroundImage = "url(images/jiaoyi/zishen_39.png)";
				}
				this.style.backgroundImage = "url(images/jiaoyi/zishen_42.png)";
			};
		}

		//显示div
		//var divs3 = document.getElementsByClassName("div4");
		//var len3 = divs3.length;
		//for(var g=0;g<len3;g++){
		//divs3[g].onclick = function(){
		//		for(var h=0;h<len3;h++){

		//			di[h].style.display = "none)";
		//		}
		//		var di = document.getElementsByClassName("div4_1");
		//		di[g].style.display = "block";
		//	};
		//}


	//创建一个showhidediv的方法，直接跟ID属性
	function showhidediv(id){
	var div41=document.getElementById("div41_1");
	var div42=document.getElementById("div42_2");
	var div43=document.getElementById("div43_3");
	var div44=document.getElementById("div44_4");
	if (id == 'div41') {
	   if (div41.style.display=='none') {
	    div41.style.display='block';
	    div42.style.display='none';
	    div43.style.display='none';
	    div44.style.display='none';
	   }
	} else if(id == 'div42'){
	   if (div42.style.display=='none') {
	    div41.style.display='none';
	    div42.style.display='block';
	    div43.style.display='none';
	    div44.style.display='none';
	   }
	   }
	  else if(id == 'div43'){
	   if (div43.style.display=='none') {
	    div41.style.display='none';
	    div42.style.display='none';
	    div43.style.display='block';
	    div44.style.display='none';
	   }
	   }

	   else if(id == 'div44'){
	   if (div44.style.display=='none') {
	    div41.style.display='none';
	    div42.style.display='nene';
	    div43.style.display='none';
	    div44.style.display='block';
	   }
	   }
	}
}
