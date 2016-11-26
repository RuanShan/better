$( document ).ready(function() {
	$( '.sidebar' ).simpleSidebar({
		settings: {
			opener: '#open-sbl',
			wrapper: '.wrapper',
			animation: {
				duration: 500,
				easing: 'easeOutQuint'
			}
		},
		sidebar: {
			align: 'left',
			width: 200,
			closingLinks: 'a',
		}
	});
  $(".subNav").click(function(){
  			// 修改数字控制速度， slideUp(500)控制卷起速度
  			$(this).next(".navContent").slideToggle(500);
  });
});
