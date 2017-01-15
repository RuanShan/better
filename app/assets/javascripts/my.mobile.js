//= require application
//= require jquery.easing.min
//= require jquery.simplesidebar
//= require swiper.jquery.min
//= require user.mobile

$( document ).ready(function() {
	if( $('#invite_qrcode').is('*'))
  {
		jQuery('#invite_qrcode').empty().qrcode({
	    text: Better.routes.invitable_sign_up(),
	    minVersion: 5,
	    //error correction level: must be 'H', or we can't scan
	    ecLevel: 'H',
	    //empty space
	    quiet: 2,
	    radius: 0.5,
	    size: 300,
	    //add background, color or image
			background: "#ffffff",
	    //background: document.getElementById("code_img"),
	    //add label, ecLevel: 'H', minVersion: 5+ work, label too large may not work
	    mode: 2,
	    label: 'Ballmer Asia',
	    fontname: 'sans',
	    fontcolor: '#FF9818',
	    //add image
	    //mode: 4,
	    //image: document.getElementById("code_img"),
	    //label or img size, position
	    mSize: 0.1,
	    mPosX: 0.5,
	    mPosY: 0.5
	  });
  }


	 var swiper = new Swiper('.swiper-container', {
			pagination: '.swiper-pagination',
	        slidesPerView: 1,
	        centeredSlides: false,
	        spaceBetween: 1,
			paginationClickable: true,
	    });

	})
	  

	//$( '.sidebar' ).simpleSidebar({
	//	settings: {
	//		opener: '#open-sbl',
	//		wrapper: '.wrapper',
	//		animation: {
	//			duration: 500,
	//			easing: 'easeOutQuint'
	//		}
	//	},
	//	sidebar: {
	//		align: 'left',
	//		width: 200,
	//		closingLinks: 'a',
	//	}
	//});
	$(".subNav").click(function(){
  			// 修改数字控制速度， slideUp(500)控制卷起速度
  			$(this).next(".navContent").slideToggle(500);
  });
	$(".subNavlink").click(function(){
			var url=	$(this).next(".navContent").children("li").children("a").attr("href");
      window.location.href=url;
	});
	$(".fanhui").click(function(){
  			window.location.href = Better.referrer;
  });

	$('.nav__trigger').on('click', function(e){
			 e.preventDefault();
			 $(this).parent().toggleClass('nav--active');
	});

	function adjust_deposit_iss_ins_cd()
	{
		if( $('#deposit_payment_method_id').val() == '1'){
			$('.deposit_iss_ins_cd').show();
		}else{
			$('.deposit_iss_ins_cd').hide();
		}
		if ( $('#deposit_payment_method_id').val() == '3' || $('#deposit_payment_method_id').val() == '5'){
			alert("内排期间，暂停使用");
			$('#deposit_payment_method_id').val('1');
			adjust_deposit_iss_ins_cd();
		}
	}
	if( $('#deposit_payment_method_id').is('*')){
		adjust_deposit_iss_ins_cd();
		$('#deposit_payment_method_id').change(function(){
			adjust_deposit_iss_ins_cd();
		})
	}

  $(".sign_up_wrapper .chuangjiankaihu").click(function(){
  	var classes = $(this).attr("class");
		$(this).attr("class",classes+" active");
  });

});

function bigger(one){
	$('.dailiright_down').hide();
  $('#shougerenb').find("table").find("tr").each(function(index){
		var index_content = $("#"+one).find("td").eq(index).html();
    $(this).find("td").eq(1).html(index_content);
  });
	$('#shougerenb').show();
	$(".fanhui").unbind("click");
	$('.fanhui').click(function(){
  	$('#shougerenb').hide();
		$('.dailiright_down').show();
		$(this).unbind("click");
		$(this).click(function(){
			window.location.href = Better.referrer;
		});
  });
}
