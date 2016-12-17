//首页轮播
$(function(){

	var index_slide=$(".index_slide .slide"),slide_con=index_slide.find(".slide_con li"),slide_index=index_slide.find(".slide_index li");
	var index=2;
	if(index_slide[0]){
		var timer=setInterval(function(){index++;autoSlide();},4000);
		index_slide.hover(function(){
			clearInterval(timer);
		},function(){
			timer=setInterval(function(){index++;autoSlide();},4000);
		});

		slide_index.mouseover(function(){
			var i=$(this).index();
			index=i;
			autoSlide();
		});
	}

	function autoSlide(){
		if(index>=slide_index.length) index=0;
		if($.support.msie&&parseInt($.support.version)<=8){
			slide_con.stop(true,true).eq(index).show().siblings().hide();
		}else{
			slide_con.stop(true,true).eq(index).fadeIn("slow").siblings().fadeOut("slow");
		}
		slide_index.stop(true,true).eq(index).addClass("hover").siblings().removeClass("hover");

	};

})
