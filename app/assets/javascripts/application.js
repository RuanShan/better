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
//= require promise-min
//= require tether.min
//= require bootstrap-sprockets
//= require moment
//= require moment/zh-cn
//= require bootstrap-datetimepicker
//= require select2
//= require base
//= require cable
//= require ext-min
//= require better
//= require jquery.countdown
//= require highstock
//= require forex.base
//= require forex.chart
//= require forex.chart.plus
//= require new/all

$(function(){
  setInterval(time_update, 1000);
  $("#obtainVerifyCode").click(function(){
    if($("#user_phone").length>0){
      var phone = $("#user_phone").val();
    }else {
      var phone = $("#phone").val();
    }
    $.ajax({url:'/sms/create_verify_code',
      type:'POST',
      data:{
        phone: phone
      }
    })
  })

})

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

function time_update() {
  $('#clock').html(moment().format('GMT+0800：YYYY年MM月D日 H:mm:ss'));

  if($(".b-current-expiry-in").is("*"))
  {
    $current_expiry_in = $(".b-current-expiry-in");
    var expiry_in = parseInt( $current_expiry_in.data("expiry-in") );
    var seconds = moment().seconds();

  }
}

$(function(){
  if( $("#chart-wrapper").is('*') ){
    BetterFinancialPanelPlus();
  }
})
