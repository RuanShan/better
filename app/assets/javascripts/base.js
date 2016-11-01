// http://stackoverflow.com/questions/23101966/bootstrap-alert-auto-close
$(function(){
  $("[data-dismiss='alert']").fadeTo(2000, 500).slideUp(500, function(){
      $("[data-dismiss='alert']").alert('close');
  });
})
