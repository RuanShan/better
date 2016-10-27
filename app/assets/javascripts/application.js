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
//= require tether.min
//= require bootstrap-sprockets
//= require moment
//= require bootstrap-datetimepicker
//= require select2
//= require cable

function page_submit_form(form_id,page)
{ if($('#'+form_id+'>#page').length>0){
    $('#'+form_id+'>#page').val(page);
  }else{
    $("<input type='hidden' id='page' name='page' value='"+page+"'/>").appendTo($('#'+form_id));
  }
  $('#'+form_id).submit();
}
