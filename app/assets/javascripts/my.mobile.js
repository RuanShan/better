//= require application
//= require jquery.easing.min
//= require jquery.simplesidebar
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
	    label: 'better',
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

	$( '.sidebar' ).simpleSidebar({
		settings: {
			opener: '#open-sbl',
			wrapper: '.wrapper',
			animation: {
				duration: 500,
				easing: 'easeOutQuint'
			}
		},
		sidebar: {
			align: 'left',
			width: 200,
			closingLinks: 'a',
		}
	});
  $(".subNav").click(function(){
  			// 修改数字控制速度， slideUp(500)控制卷起速度
  			$(this).next(".navContent").slideToggle(500);
  });
});

function bigger(one){
	$('.dailiright_down').hide();
  $('#shougerenb').find("table").find("tr").each(function(index){
		var index_content = $("#"+one).find("td").eq(index).html();
    $(this).find("td").eq(1).html(index_content);
  });
	$('#shougerenb').show();
	$('.fanhui').click(function(){
  	$('#shougerenb').hide();
		$('.dailiright_down').show();
  });
}
