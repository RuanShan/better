function build_fake_adv_users(){
var arr1 = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t"
			,"u","v","w","s","y","z"," "," "," "," "," "," "];

var arr2 = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t"
			,"u","v","w","s","y","z"," "," "," "," "," "," "];

var arr9 = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t"
			,"u","v","w","s","y","z"," "," "," "," "," "," "];

var arr10 = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t"
			,"u","v","w","s","y","z"," "," "," "," "," "," "];

var arr11 = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t"
			,"u","v","w","s","y","z"," "," "," "," "," "," "];

var arr12 = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t"
			,"u","v","w","s","y","z"," "," "," "," "," "," "];

var arr13 = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t"
			,"u","v","w","s","y","z"," "," "," "," "," "," "];
var arr3=["刚刚获利了$","刚刚获利了$","刚刚获利了$","刚刚获利了$","刚刚获利了$","刚刚获利了$","刚刚损失了$"];
var arr4=["50","100","340","420","44","369","256","595","600","755","652","425","356","125","188","158","235"];
var arr8=["1","3","5","10","16","18","20","22","23","28","30","45","47","50"];

	for(var i=1;i<6;i++) {
	var index1 = Math.floor((Math.random()*arr1.length));
	var index2 = Math.floor((Math.random()*arr2.length));
	var index9 = Math.floor((Math.random()*arr9.length));
	var index10 = Math.floor((Math.random()*arr10.length));
	var index11 = Math.floor((Math.random()*arr11.length));
	var index12 = Math.floor((Math.random()*arr12.length));
	var index13 = Math.floor((Math.random()*arr13.length));
	var index3 = Math.floor((Math.random()*arr3.length));
	var index4 = Math.floor((Math.random()*arr4.length));
	var index8 = Math.floor((Math.random()*arr8.length));

	var time1=arr1[index1];
	var time2=arr2[index2];
	var time9=arr2[index9];
	var time10=arr2[index10];
	var time11=arr2[index11];
	var time12=arr2[index12];
	var time13=arr2[index13];
	var time3=arr3[index3];
	var time4=arr4[index4];
	var time8=arr8[index8]+"分钟前";

	$("#a" + i).html(time1);
	$("#b" + i).html(time2);
	$("#c" + i).html(time9);
	$("#d" + i).html(time10);
	$("#e" + i).html(time11);
	$("#f" + i).html(time12);
	$("#g" + i).html(time13);
	$("#lisun" + i).html(time3);
	$("#ls"+ i).html(time4);
	$("#shij"+ i).html(time8);

	$("#a"+ i).css("color","#757575");
	$("#b"+ i).css("color","#757575");
	$("#c"+ i).css("color","#757575");
	$("#d"+ i).css("color","#757575");
	$("#e"+ i).css("color","#757575");
	$("#f"+ i).css("color","#757575");
	$("#g"+ i).css("color","#757575");
	$("#ck5"+ i).css("color","#6d84b4");
	$("#shij"+ i).css("color","#f3d34c");

		if(time3=="刚刚获利了$"){
		  $("#lisun" + i).css("color","green");
		  $("#ls"+ i).css("color","green");
		}else{
		  $("#lisun"+ i).css("color","red");
		  $("#ls"+ i).css("color","red");
		}

		var now=new Date();
		var year=now.getFullYear();
		var month=now.getMonth()+1;
		var date=now.getDate();
		var day=now.getDay();
		var hour=now.getHours();
		var minute=now.getMinutes();
		var sec=now.getSeconds();

		var time5=year+"年"+month+"月"+date+"日 ";
		var time6=hour+":"+minute+":"+sec;

		$("#ck5"+i).html(time5);
		$("#ck6"+i).html(time6);


	}



}
$(document).ready(function () {
  if( $("#fake_adv_users").is('*'))
  {
     setInterval("build_fake_adv_users()", 3000);
  }
});
