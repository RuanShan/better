//= require application
$(function () {
  $('.calendar').datetimepicker({format: "YYYY-MM-DD"});
});

function get_my_search_url(search_object){
  var start_date = $("#start_date").val();
  var end_date = $("#end_date").val();
  var search_url = search_object+"/search?start_date="+start_date+"&end_date="+end_date;
  switch(search_object)
  {
    case "bonuses":
      search_url = "wallets/search_bonuses?start_date="+start_date+"&end_date="+end_date;
      break;
    case "bids":
      var game_id = $("#game_id").val();
      search_url = search_url+"&game_id="+game_id;
      break;
    default:
      var state = $("#state").val();
      search_url = search_url+"&state="+state;
  }
  return search_url;
}

function set_my_search_url(search_object){
  var origin_url = window.location.href;
  var host_array = origin_url.split("/");
  var my_index = $.inArray( "my", host_array );
  var search_url = "";
  for(i=0;i<=my_index;i++){
    search_url+=host_array[i];
    search_url+="/";
  }
  var action_params = get_my_search_url(search_object);
  search_url += action_params;
  window.location.href=search_url;
}

function select_bank(bank_id, user_bank_json){
  var user_bank = $.parseJSON(user_bank_json);
  var disable = true;
  if(bank_id==""){
    disable = false;
    $("#password_div").show();
    $("#submit_div").show();
  }else{
    $("#password_div").hide();
    $("#submit_div").hide();
  }
  $("#user_bank_name").val(user_bank.name).attr("disabled",disable);
  $("#user_bank_card_number").val(user_bank.card_number).attr("disabled",disable);
  $("#user_bank_branch_name").val(user_bank.branch_name).attr("disabled",disable);
  $("#user_bank_address").val(user_bank.address).attr("disabled",disable);
}

function select_bank_for_drawing(bank_id, user_bank_json){
  var user_bank = $.parseJSON(user_bank_json);
  var disable = true;
  if(bank_id==""){
    disable = false;
    if($("#drawing_user_bank_attributes_id").length>0){$("#drawing_user_bank_attributes_id").remove();}
  }else{
    if($("#drawing_user_bank_attributes_id").length>0){
      $("#drawing_user_bank_attributes_id").val(bank_id);
    }else{
      $("#current_money_password").after("<input id='drawing_user_bank_attributes_id' type='hidden' name='drawing[user_bank_attributes][id]'' value='"+bank_id+"'>" );
    }
  }
  $("#drawing_user_bank_attributes_name").val(user_bank.name).attr("disabled",disable);
  $("#drawing_user_bank_attributes_card_number").val(user_bank.card_number).attr("disabled",disable);
  $("#drawing_user_bank_attributes_branch_name").val(user_bank.branch_name).attr("disabled",disable);
  $("#drawing_user_bank_attributes_address").val(user_bank.address).attr("disabled",disable);
}
