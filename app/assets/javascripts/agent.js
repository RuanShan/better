//= require application
$(function () {
  $('.calendar').datetimepicker({format: "YYYY-MM-DD"});
  $('.mcalendar').datetimepicker({viewMode: "months", format: "YYYY-MM"});
});

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
