// http://stackoverflow.com/questions/23101966/bootstrap-alert-auto-close
$(function(){
  //$("[data-dismiss='alert']").fadeTo(2000, 500).slideUp(500, function(){
  //    $("[data-dismiss='alert']").alert('close');
  //});

  $('select.select2').select2();

})

//visiter index page js
$(document).ready(function(){
  // 切换视频
  $(".video-list li").click(function(){
    var obj = $(this);
    var video_id = obj.attr("video");
    var path = obj.attr("id");
    var vid = obj.attr("vid");
    $(".js_videoCon").hide();
    $("#js_videoCon_"+vid).show();
    obj.addClass("now").siblings().removeClass("now");
  });
});


$(function() {
    var index = 0;
    var adtimer;
    var _wrap = $("#container ol"); //
    var len = $("#container ol li").length;
    //len=1;
    if (len > 1) {
        $("#container").hover(function() {
            clearInterval(adtimer);
        },
        function() {
            adtimer = setInterval(function() {

                var _field = _wrap.find('li:first'); //此变量不可放置于函数起始处,li:first取值是变化的
                var _h = _field.height(); //取得每次滚动高度(多行滚动情况下,此变量不可置于开始处,否则会有间隔时长延时)
                _field.animate({
                    marginTop: -_h + 'px'
                },
                500,
                function() { //通过取负margin值,隐藏第一行
                    _field.css('marginTop', 0).appendTo(_wrap); //隐藏后,将该行的margin值置零,并插入到最后,实现无缝滚动
                })

            },
            5000);
        }).trigger("mouseleave");
        function showImg(index) {
            var Height = $("#container").height();
            $("#container ol").stop().animate({
                marginTop: -_h + 'px'
            },
            1000);
        }

        $("#container").mouseover(function() {
            $("#container .mouse_direction").css("display", "block");
        });
        $("#container").mouseout(function() {
            $("#container .mouse_direction").css("display", "none");
        });
    }

    $("#container").find(".mouse_top").click(function() {
        var _field = _wrap.find('li:first'); //此变量不可放置于函数起始处,li:first取值是变化的
        var last = _wrap.find('li:last'); //此变量不可放置于函数起始处,li:last取值是变化的
        //last.prependTo(_wrap);
        var _h = last.height();
        $("#container ol").css('marginTop', -_h + "px");
        last.prependTo(_wrap);
        $("#container ol").animate({
            marginTop: 0
        },
        500,
        function() { //通过取负margin值,隐藏第一行
            //$("#container ol").css('marginTop',0).prependTo(_wrap);//隐藏后,将该行的margin值置零,并插入到最后,实现无缝滚动
        })
    });
    $("#container").find(".mouse_bottom").click(function() {
        var _field = _wrap.find('li:first'); //此变量不可放置于函数起始处,li:first取值是变化的
        var _h = _field.height();
        _field.animate({
            marginTop: -_h + 'px'
        },
        500,
        function() { //通过取负margin值,隐藏第一行
            _field.css('marginTop', 0).appendTo(_wrap); //隐藏后,将该行的margin值置零,并插入到最后,实现无缝滚动
        })
    });
});

function H$(i) {return document.getElementById(i)}
function H$$(c, p) {return p.getElementsByTagName(c)}
var slider = function () {
  function init (o) {
    this.id = o.id;
    this.at = o.auto ? o.auto : 3;
    this.o = 0;
    this.pos();
  }
  init.prototype = {
    pos : function () {
      clearInterval(this.__b);
      this.o = 0;
      var el = H$(this.id), li = H$$('li', el), l = li.length;
      var _t = li[l-1].offsetHeight;
      var cl = li[l-1].cloneNode(true);
      cl.style.opacity = 0; cl.style.filter = 'alpha(opacity=0)';
      el.insertBefore(cl, el.firstChild);
      el.style.top = -_t + 'px';
      this.anim();
    },
    anim : function () {
      var _this = this;
      this.__a = setInterval(function(){_this.animH()}, 20);
    },
    animH : function () {
      var _t = parseInt(H$(this.id).style.top), _this = this;
      if (_t >= -1) {
        clearInterval(this.__a);
        H$(this.id).style.top = 0;
        var list = H$$('li',H$(this.id));
        H$(this.id).removeChild(list[list.length-1]);
        this.__c = setInterval(function(){_this.animO()}, 20);
        //this.auto();
      }else {
        var __t = Math.abs(_t) - Math.ceil(Math.abs(_t)*.07);
        H$(this.id).style.top = -__t + 'px';
      }
    },
    animO : function () {
      this.o += 2;
      if (this.o == 100) {
        clearInterval(this.__c);
        H$$('li',H$(this.id))[0].style.opacity = 1;
        H$$('li',H$(this.id))[0].style.filter = 'alpha(opacity=100)';
        this.auto();
      }else {
        H$$('li',H$(this.id))[0].style.opacity = this.o/100;
        H$$('li',H$(this.id))[0].style.filter = 'alpha(opacity='+this.o+')';
      }
    },
    auto : function () {
      var _this = this;
      this.__b = setInterval(function(){_this.pos()}, this.at*1000);
    }
  }
  return init;
}();



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
