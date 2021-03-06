// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require underscore-min
//= require eventsource.min
// require promise-min
// require tether.min
//= require bootstrap-sprockets
//= require moment
//= require moment/zh-cn
//= require bootstrap-datetimepicker
//= require select2
//= require jquery-validate/jquery.validate.min
//= require jquery-validate/messages_zh
//= require jquery-validate/extend
//= require base
//= require cable
//= require ext-min
//= require better
//= require jquery.countdown
//= require swiper.jquery.min
//= require jquery.simplemodal
//= require highstock
//= require forex.base
//= require forex_chart_new
//= require new/all
//= require fake_data
// require forex.chart.plus

$(function(){
  $('.calendar').datetimepicker({format: "YYYY-MM-DD"});
  $('.time_calendar').datetimepicker({
    format: "HH:mm"

  });
 
  $("#mobile_trade_qrcode").click(function(){
    $(this).hide();
  })
  if( $('#mobile_trade_qrcode').is('*'))
  {
    jQuery('#mobile_trade_qrcode').empty().qrcode({
      text: "http://www.ballmerasia.com/info/templets/default/shouji_index.htm",
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

  $(".weixinxin").click(function(){
    $(".xiann").toggle();
  })
  $(".btnOpen").click(function(){
    $(".floatR").show();
    $(".btnOpen").hide();
    $(".btnCtn").show();
  })
  $(".btnCtn").click(function(){
    $(".floatR").hide();
    $(".btnCtn").hide();
    $(".btnOpen").show();
  })


  $("#obtainVerifyCode").click(function(){
    if($("#user_phone").length>0){
      var phone = $("#user_phone").val();
    }else {
      var phone = $("#phone").val();
    }
    var captcha = $("#captcha").val();
    $.ajax({url:'/sms/create_verify_code',
      type:'POST',
      data:{
        phone: phone,
        _rucaptcha: captcha
      }
    })
  })

  $('#broker_next_step').on('click', function(){
      var broker_form = $("#bsign_up_form");
      broker_form.validate(brokerValidate)
      if(broker_form.valid()){
         $('#msg_2').show();$('#msg_1').hide();
      }
  })

  $("#bsign_up_form").validate(brokerValidate);
  $("#sign_up_form").validate(userValidate);

  $('form.new_deposit').validate({
     rules: {
       'deposit[amount]': { min: 0.01 }
     }
  })
  $('#new_deposit, form.new_deposit').submit(function(event){
    //event.stopPropagation();
    //alert("支付系统调试中！");
  })

  $("a#signal_classic").click(function(){
    alert("系统内排，暂不提供！");
  })
  $("a#signal_rss").click(function(){
    alert("系统内排，暂不提供！");
  })
})

var userValidate = {
  rules: {
    'user[email]': {
      required: true,
      email: true
    },
    'user[password]': {
      required: true,
      isPassword: true,
      rangelength:[6,15]
    },
    'user[password_confirmation]': {
      required: true,
      equalTo: '#sign_up_form #user_password'
    },
    'user[first_name]': {
      required: true,
      stringCheck: true,
      byteRangeLength:[2,16]
    },
    'user[last_name]': {
      stringCheck: true,
      byteRangeLength:[2,16]
    },
    'user[phone]': {
      required: true,
      isMobile: true
    },
    'user[id_number]': {
      required: true,
      isIdCardNo: true
    },
    'user[website]': {
      url:true
    },
    'user[birthday]': {
      isBirthday: true
    },
    'user[qq]': {
      qq: true
    },
    'user[validate_code]': {
      required: true,
      rangelength:[5,6]
    },

    'user[user_banks_attributes][0][name]': {
      required: true,
    },
    'user[user_banks_attributes][0][card_number]': {
      required: true,
    },
    'user[user_banks_attributes][0][address]': {
      required: true,
    },
    'user[user_banks_attributes][0][payee]': {
      required: true,
    }

  },
  errorPlacement:function(error,element) {
    var position = element.position();
    //alert(position.top);
    error.css({
      "position" : "absolute",
      "line-height" : "20px",
      "top" : position.top+30,
      "left": position.left
    })
    error.addClass("label label-danger");
    error.appendTo(element.parent());
  }

}

var brokerValidate = {
  rules: {
    'broker[email]': {
      required: true,
      email: true
    },
    'broker[password]': {
      required: true,
      isPassword: true,
      rangelength:[6,15]
    },
    'broker[password_confirmation]': {
      required: true,
      isPassword: true,
      rangelength:[6,12],
      equalTo: "#bsign_up_form #broker_password"
    },
    'broker[first_name]': {
      required: true,
      stringCheck: true,
      byteRangeLength:[2,16]
    },
    'broker[last_name]': {
      stringCheck: true,
      byteRangeLength:[2,16]
    },
    'broker[phone]': {
      required: true,
      isMobile: true
    },
    'broker[id_number]': {
      required: true,
      isIdCardNo: true
    },
    'broker[website]': {
      url:true
    },
    'broker[qq]': {
      qq:true
    },

    'broker[user_banks_attributes][0][name]': {
      required: true,
    },
    'broker[user_banks_attributes][0][card_number]': {
      required: true,
      isBankcard: true
    },
    'broker[user_banks_attributes][0][address]': {
      required: true,
    },
    'broker[user_banks_attributes][0][payee]': {
      required: true,
    }

  },
  errorPlacement:function(error,element) {
    var position = element.position();
    //alert(position.top);
    error.css({
      "position" : "absolute",
      "line-height" : "20px",
      "top" : position.top+30,
      "left": position.left
    })
    error.addClass("label label-danger");
    error.appendTo(element.parent());
  },


}

function validate_code_time(code_id, wait) {
  var code_button = $("#"+code_id);
		if (wait == 0) {
			code_button.removeAttr("disabled");
			code_button.val("获取验证码");
		} else {
			code_button.attr("disabled", true);
      code_button.val("重新发送(" + wait + ")");
			wait = wait-1;
			setTimeout(function() {
				validate_code_time(code_id, wait)
			},
			1000)
		}
}

function copyToClipboard(element) {
  var copy_text = $(element).text();
  var $temp = $("<input>");
  $("body").append($temp);
  $temp.val(copy_text).select();
  try{
    document.execCommand("copy");
    $temp.remove();
  }catch(err){
    $temp.remove();
    window.prompt("您的浏览器不支持一键复制,请使用Ctrl+C来复制链接", copy_text);
  }
}



$(function(){
  if( $("#chart-wrapper").is('*') ){
    BetterFinancialPanelPlus();
  }
  if( $(".forex-adv").is('*') ){
    var swiper = new Swiper('.swiper-container-currency', {
         nextButton: '.xiayi',
         prevButton: '.shangyi',
         slidesPerView: 10,
         centeredSlides: false,
         spaceBetween: 1,
     });
   }
})
