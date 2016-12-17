// JavaScript Document
//头部按钮
$(function(){
	$(".header_r02 span").mouseenter(function(){
		//$(".top_btn").stop(true,true).show("slow");
		$('.top_btn').css('display','inline-block');
	});
	$(".header_r02 span").mouseleave(function(){
		//$(".top_btn").stop(true,true).hide("fast");
		$('.top_btn').css('display','none');
	});
});
//主导航
$(function(){
	$("#nav ul li").mouseenter(function(){
		$(this).children("div").show();
	});
	$("#nav ul li").mouseleave(function(){
		$(this).children("div").hide();
	});
});
//隐藏主导航
$(function(){
	$(".inline").mouseenter(function(){
		$(".caidan01").show();
	});
	$(".inline").mouseleave(function(){
		$(".caidan01").hide();
	});
});
//底部微信二维码
$(function(){
	$(".wei_er_m").mouseenter(function(){
		$(".wei_er").show();
	});
	$(".wei_er_m").mouseleave(function(){
		$(".wei_er").hide();
	});
});
//底部手机二维码
$(function(){
	$(".wei_wang_m").mouseenter(function(){
		$(".wei_wang").show();
	});
	$(".wei_wang_m").mouseleave(function(){
		$(".wei_wang").hide();
	});
});
//头部按钮伸缩
$(function(){
	$(".btn_kuan").mouseenter(function(){
		$(this).stop(true,true).animate({padding:"0 20px"},"slow");
	});
	$(".btn_kuan").mouseleave(function(){
		$(this).stop(true,true).animate({padding:"0 15px"},"slow");
	});
});
//幻灯片开户按钮
$(function(){
	$(".banner_btn a").mouseenter(function(){
		$(this).stop(true,true).animate({padding:"0 60px"},"slow");
	});
	$(".banner_btn a").mouseleave(function(){
		$(this).stop(true,true).animate({padding:"0 50px"},"slow");
	});
});
//隐藏菜单滚动监听
$(function(){   
    var winHeight = $(document).scrollTop();
 
    $(window).scroll(function() {
        var scrollY = $(document).scrollTop();// 获取垂直滚动的距离，即滚动了多少
 
        if (scrollY > 50){ //如果滚动距离大于50px则隐藏，否则删除隐藏类
            $('.hide_nav').addClass('showed');
        } 
        else {
            $('.hide_nav').removeClass('showed');
        }
		if (scrollY > winHeight){ //如果没滚动到顶部，删除显示类，否则添加显示类
            $('.hide_nav').removeClass('hiddened');
        } 
        else {
            $('.hide_nav').addClass('hiddened');
        } 
     });
});

	$(function(){
	    var $div_li =$("div.tab_menu ul li");
	    $div_li.click(function(){
			$(this).addClass("selected")            //当前<li>元素高亮
				   .siblings().removeClass("selected");  //去掉其它同辈<li>元素的高亮
            var index =  $div_li.index(this);  // 获取当前点击的<li>元素 在 全部li元素中的索引。
			$("div.tab_box > div")   	//选取子节点。不选取子节点的话，会引起错误。如果里面还有div 
					.eq(index).show()   //显示 <li>元素对应的<div>元素
					.siblings().hide(); //隐藏其它几个同辈的<div>元素
			if($('.tab_menu').eq(0).attr('spe') == 'demo_success'){
				$("div.tab_box > div").eq(index).show().siblings().hide();
			}
		}).hover(function(){
			$(this).addClass("hover");
		},function(){
			$(this).removeClass("hover");
		});
	});
//]]>
//返回顶部
$(function(){
        //首先将#back-to-top隐藏
        $("#totop").hide();
        //当滚动条的位置处于距顶部100像素以下时，跳转链接出现，否则消失
        $(function () {
            $(window).scroll(function(){
                if ($(window).scrollTop()>100){
                    $("#totop").fadeIn();
                }
                else
                {
                    $("#totop").fadeOut();
                }
            });
            //当点击跳转链接后，回到页面顶部位置
            $("#totop").click(function(){
                $('body,html').animate({scrollTop:0},500);
                return false;
            });
        });
    });
//右边客服
$(function(){
	$(".tencent").mouseenter(function(){
		$(".you007").show();
	});
	$(".tencent").mouseleave(function(){
		$(".you007").hide();
	});
	
	$(".shou").mouseenter(function(){
		$(".you008").show();
	});
	$(".shou").mouseleave(function(){
		$(".you008").hide();
	});
});
//提示框
$(function(){
	/*$(".tsk_gb").click(function(){
		$(".tishikuang_box").fadeOut();
		$(".tishikuang_nei").animate({top:'-260'},"");
		return false;
	});
	$(".tishik_chu").click(function(){
		var top;
		var campaignId = 175;
		if($(this).attr('showtype') == 2){
			top = $(this).parent().prev();
		}else if($(this).attr('showtype') == 3){
			top = $('.tab_box');
		}else{
			top = $(this).parent();
		}
		var username = top.find('input[name=username]').val();
		var phone = top.find('input[name=phone]').val();
		var xin = top.find('input[name=xin]').val();
		var email = top.find('input[name=email]').val();

		if( $(this).attr("showtype") == 13140 ){
			campaignId = 279;
		}else if( $(this).attr("showtype") == 3 ){
			campaignId = 280;
		}else{
			campaignId = '';
		}
		if(xin == ''){
			$('.tishikuang_nei02').html('<i class="icon iconfont red">&#xe622;</i> 姓氏不能为空！');
			exit();
			return false;
		}
		if(username == ''){
			$('.tishikuang_nei02').html('<i class="icon iconfont red">&#xe622;</i> 名字不能为空！');
			exit();
			return false;
		}
		var reg =/^([a-zA-Z0-9_-]|\.)+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
		if(!reg.test(email)){
			$('.tishikuang_nei02').html('<i class="icon iconfont red">&#xe622;</i> 邮箱格式不正确！');
			exit();
			return false;
		}
		reg=/^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(14[0-9]{1})|(17[0-9]{1})|(19[0-9]{1}))+\d{8})$/;
		if(!reg.test(phone)){
			$('.tishikuang_nei02').html('<i class="icon iconfont red">&#xe622;</i> 手机号码格式不正确！');
			exit();
			return false;
		}

		if( $(this).attr("showtype") == '' ){
			$.post('/appProxy/openAccount?'+Math.random(),{post_str:'firstName='+username+'&phone='+phone+'&lastName='+xin+'&email='+email+'&password=123456&action=register&isDemo=1&test=1'},function(data){
				var objData = $.parseJSON(data);
				if(objData.status=='success'){
					$('.tishikuang_nei02').html('<i class="icon iconfont green">&#xe621;</i> 恭喜您提交成功！<br><span style="font-size:16px;">账号: ' + objData.info.email + '</span><br><span style="font-size:16px;">密码: '+objData.info.password+'</span>');
					exit();
				}else{
					$('.tishikuang_nei02').html('<i class="icon iconfont red">&#xe622;</i> 提交失败！');
					exit();
				}
				return false;
			});
		}else{
			$.post('/Huodong/active?'+Math.random(),{username:username,phone:phone,xin:xin,email:email,campaignId:campaignId},function(data){
				if(data.flag){
					$('.tishikuang_nei02').html('<i class="icon iconfont green">&#xe621;</i> 恭喜您提交成功！');
					exit();
				}else{
					$('.tishikuang_nei02').html('<i class="icon iconfont red">&#xe622;</i> 提交失败！');
					exit();
				}
				return false;
			});
		}
	});*/

	function exit(){
		$(".tishikuang_box").fadeIn("slow");
		$(".tishikuang_nei").animate({top:'30%'},"");
	}

	$('.anniu').click(function(){
		//search submit
		if($('input[name=wenben]').val() == ''){
			$('.tishikuang_nei02').html('<i class="icon iconfont red">&#xe622;</i> 查询内容不能为空！');
			exit();
			return false;
		}
		return true;
	});
});