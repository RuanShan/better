// http://stackoverflow.com/questions/23101966/bootstrap-alert-auto-close
$(function(){
  $("[data-dismiss='alert']").fadeTo(2000, 500).slideUp(500, function(){
      $("[data-dismiss='alert']").alert('close');
  });

  $('select').select2();

})


//图片上传预览    IE是用了滤镜。
function previewImage(file, div_id)
{
  var MAXWIDTH  = 388;
  var MAXHEIGHT = 233;
  var div = document.getElementById(div_id);
  if (file.files && file.files[0])
  {
    div.innerHTML ="<img id='imghead_"+div_id+"'>";
    var img = document.getElementById('imghead_'+div_id);
    img.onload = function(){
      var rect = clacImgZoomParam(MAXWIDTH, MAXHEIGHT, img.offsetWidth, img.offsetHeight);
      img.width  =  rect.width;
      img.height =  rect.height;
      //                 img.style.marginLeft = rect.left+'px';
      img.style.marginTop = rect.top+'px';
    }
    var reader = new FileReader();
    reader.onload = function(evt){img.src = evt.target.result;}
    reader.readAsDataURL(file.files[0]);
  }
  else //兼容IE
  {
    var sFilter='filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale,src="';
    file.select();
    var src = document.selection.createRange().text;
    div.innerHTML = "<img id='imghead_"+div_id+"'>";
    var img = document.getElementById('imghead_'+div_id);
    img.filters.item('DXImageTransform.Microsoft.AlphaImageLoader').src = src;
    var rect = clacImgZoomParam(MAXWIDTH, MAXHEIGHT, img.offsetWidth, img.offsetHeight);
    status =('rect:'+rect.top+','+rect.left+','+rect.width+','+rect.height);
    div.innerHTML = "<div id=divhead style='width:"+rect.width+"px;height:"+rect.height+"px;margin-top:"+rect.top+"px;"+sFilter+src+"\"'></div>";
  }
}

function clacImgZoomParam( maxWidth, maxHeight, width, height ){
  var param = {top:0, left:0, width:width, height:height};
  if( width>maxWidth || height>maxHeight )
  {
    rateWidth = width / maxWidth;
    rateHeight = height / maxHeight;

    if( rateWidth > rateHeight )
    {
      param.width =  maxWidth;
      param.height = Math.round(height / rateWidth);
    }else
    {
      param.width = Math.round(width / rateHeight);
      param.height = maxHeight;
    }
  }

  param.left = Math.round((maxWidth - param.width) / 2);
  param.top = Math.round((maxHeight - param.height) / 2);
  return param;
}
