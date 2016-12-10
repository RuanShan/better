//= require application
//= require jquery.qrcode.min
$(function () {
  $('.calendar').datetimepicker({format: "YYYY-MM-DD"});
  $('.mcalendar').datetimepicker({viewMode: "months", format: "YYYY-MM"});

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

});
