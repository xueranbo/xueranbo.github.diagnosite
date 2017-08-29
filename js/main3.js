var miaov = {};

miaov.timescroll = null;//挂载整平切换的实例
miaov.currentstep = 'step1';

miaov.init = function(){
	miaov.resize();//设置第一屏的高度和top值
	miaov.events();//配置事件
	miaov.configIntAnimate();//配置导航动画
	miaov.button3d('.start','.state1','.state2',0.3);
	miaov.button3d('.button1','.state1','.state2',0.3);
	miaov.button3d('.button2','.state1','.state2',0.3);
	
	miaov.imgwidth($('.scene img'))  //设置每一屏的百分比
	
	miaov.configTimescroll();//配置整屏切换的动画
	twoanimate.init(); //执行具体第二屏的动画细节
	threeanimate.init(); //执行第三屏动画
	fiveanimate.init(); //执行第五屏的动画
	
}
$(document).ready(miaov.init);

miaov.events =function(){//配置事件
	
	miaov.nav();//导航条动画
	$(window).bind('scroll',scrollfn);
	function scrollfn(){
		$(window).scrollTop(0);
	}
	//滚动条事件滚动对应的页面
	$(window).bind('scroll',miaov.scrollstatus);
	
	//当mousedown时候，解除scroll事件
	$(window).bind('mousedown',function(){
		$(window).unbind('scroll',scrollfn);
	});
	
	//当mouseup的时候，让这一瓶到达某个状态
	$(window).bind('mouseup',miaov.mouseupfn);
	
	//干掉浏览器默认的滚动行为
	$('.wrapper').bind('mousewheel',function(ev){
		if($(window).width()>780){
			ev.preventDefault();
		}
	})
	$('.wrapper').one('mousewheel',mousewheelfn);
	var timer = null;
	function mousewheelfn(ev,direction){
		$(window).unbind('scroll',scrollfn);
		if(direction<1){//向下滚动
			miaov.changestep('next');
		}else{//向上滚动
		    miaov.changestep('prev');
	    }
		clearTimeout(timer);
		timer = setTimeout(function(){
			if($(window).width()>780){
				$('.wrapper').one('mousewheel',mousewheelfn);
			}
		},1200)
	}
	$(window).resize(miaov.resize);
};

miaov.mouseupfn = function(){//当mouseup的时候，让这一瓶到达某个状态
	var scale = miaov.scale();//计算滚动比列
	//得到当前页面到达的某个时间点
	var times = scale*miaov.timescroll.totalDuration();
	//获取到上一个状态和下一个状态
	var prevstep = miaov.timescroll.getLabelBefore(times);
	var nextstep = miaov.timescroll.getLabelAfter(times);
	//获取到上一个状态的时间和下一个状态的时间
	var prevtime = miaov.timescroll.getLabelTime(prevstep);
	var nexttime = miaov.timescroll.getLabelTime(nextstep);
	
	//计算差值
	var prevdvalue = Math.abs(prevtime-times);
	var nextdvalue = Math.abs(nexttime-times);
	
	/*
	  如果scale为0
	    step1
	    scale为1
	    step5
	 如果prevdvalue < nextdvalue
	   prevstep
	   如果prevdvalue > nextdvalue
	   nextstep
	*/
	var step = '';
	if(scale === 0){
		step = 'step1';
	}else if(scale === 1){
		step = 'footer';
	}else if(prevdvalue < nextdvalue){
		step = prevstep;
	}else{
		step = nextstep;
	}
	miaov.timescroll.tweenTo(step);
	
	/////////////当松开鼠标市控制滚动条到达某个状态的距离///////////////////////
	//获取动画总时长
    var totaltime = miaov.timescroll.totalDuration();
    //获取要到达状态的时间
    var aftertime = miaov.timescroll.getLabelTime(step);
    //获取滚动条的滚动距离
    var maxh = $('body').height() - $(window).height();
    //计算滚动条滚动距离
    var positiony = aftertime/totaltime * maxh;
    //滚动条滚动距离的持续时间
    var d = Math.abs(miaov.timescroll.time() - aftertime);
    var scrollanimatea = new TimelineMax();
    scrollanimatea.to('html,body',d,{scrollTop:positiony});
    miaov.currentstep = step;
}

//计算滚动在滚动过程中的一个比列
miaov.scale = function(){
	var scrollt = $(window).scrollTop();
	var maxh = $('body').height() - $(window).height();
	var s = scrollt/maxh;
	return s;
}

miaov.scrollstatus = function(){//滚动条事件滚动对应的页面
		var times = miaov.scale()*miaov.timescroll.totalDuration();
		//当滚动条滚动中，让也秒的动画运动到某个时间点
		miaov.timescroll.seek(times,false);	
		
}

miaov.changestep = function(value){//切换整平并且计算滚动条的距离
    if(value === 'next'){//向下切换
    	//获取当前的时间
    	var currenttime = miaov.timescroll.getLabelTime(miaov.currentstep);
    	//获取到下一个状态的字符串
    	var afterstep = miaov.timescroll.getLabelAfter(currenttime);
    	if(!afterstep) return;
    	//获取动画总时长
    	var totaltime = miaov.timescroll.totalDuration();
    	//获取到下一个状态的时间
    	var aftertime = miaov.timescroll.getLabelTime(afterstep);
    	//获取滚动条的滚动距离
    	var maxh = $('body').height() - $(window).height();
    	//计算滚动条滚动距离
    	var positiony = aftertime/totaltime * maxh;
    	//滚动条滚动距离的持续时间
    	var d = Math.abs(miaov.timescroll.time() - aftertime);
    	var scrollanimateb = new TimelineMax();
    	scrollanimateb.to('html,body',d,{scrollTop:positiony});
    	
    	//运动到下一个状态
    	//miaov.timescroll.tweenTo(afterstep);
    	//记录当前的状态味下一个状态，方便切换
    	miaov.currentstep = afterstep;
    }else{//向上切换
    	//获取当前的时间
    	var currenttime = miaov.timescroll.getLabelTime(miaov.currentstep);
    	//获取到上一个状态的字符串
    	var beforestep = miaov.timescroll.getLabelBefore(currenttime);
    	if(!beforestep) return;
    	
    	//获取动画总时长
    	var totaltime = miaov.timescroll.totalDuration();
    	//获取到上一个状态的时间
    	var beforetime = miaov.timescroll.getLabelTime(beforestep);
    	//获取滚动条的滚动距离
    	var maxh = $('body').height() - $(window).height();
    	//计算滚动条滚动距离
    	var positiony = beforetime/totaltime * maxh;
    	//滚动条滚动距离的持续时间
    	var d = Math.abs(miaov.timescroll.time() - beforetime);
    	var scrollanimatet = new TimelineMax();
    	scrollanimatet.to('html,body',d,{scrollTop:positiony});
    	
    	//运动到上一个状态
    	//miaov.timescroll.tweenTo(beforestep);
    	//记录当前的状态味上一个状态，方便切换
    	miaov.currentstep = beforestep;
    }
}
miaov.configTimescroll = function(){//配置整屏切换的动画
	var time = miaov.timescroll?miaov.timescroll.time():0;
	if(miaov.tiemscroll) miaov.timescroll.clear();
	miaov.timescroll = new TimelineMax();
	
	    //当从第二屏切换到第一屏的时候，让第二屏的动画时间重归零
	    miaov.timescroll.to('scene1',0,{onReverseComplete:function(){
	    	twoanimate.timeline.seek(0,false);
	    }},0);
	    
	    miaov.timescroll.to('.footer',0,{top:'100%'},0);
	
	    miaov.timescroll.add('step1');
	    
	miaov.timescroll.to('.scene2',0.8,{top:0,ease:Cubic.easeInout});
	miaov.timescroll.to({},0.1,{onComplete:function(){
		menu.changemenu('menu_state2');//切换到第二屏的函数，同时传入导航条背景颜色变化的class
	},onReverseComplete:function(){
		menu.changemenu('menu_state1');
	}},'-=0.2');
	
	//当切换到第二屏的时候，然后翻转第二瓶的第一个动画
	miaov.timescroll.to({},0,{onComplete:function(){
		twoanimate.timeline.tweenTo('state1');
	}},'-=0.2');
	
	    miaov.timescroll.add('step2');
	
	//主动画中配置第二屏小动画start
	miaov.timescroll.to({},0,{onComplete:function(){
		twoanimate.timeline.tweenTo('state2');
	},onReverseComplete:function(){
		twoanimate.timeline.tweenTo('state1');
	}})
	miaov.timescroll.to({},0.4,{});
	
	    miaov.timescroll.add('point1');
	
	miaov.timescroll.to({},0,{onComplete:function(){
		twoanimate.timeline.tweenTo('state3');
	},onReverseComplete:function(){
		twoanimate.timeline.tweenTo('state2');
	}})
	miaov.timescroll.to({},0.4,{});
	
	    miaov.timescroll.add('point2');
	
	miaov.timescroll.to({},0,{onComplete:function(){
		twoanimate.timeline.tweenTo('state4');
	},onReverseComplete:function(){
		twoanimate.timeline.tweenTo('state3');
	}})
	miaov.timescroll.to({},0.4,{});
	    miaov.timescroll.add('point3');
	//主动画中配置第二屏小动画end
	
	miaov.timescroll.to('.scene3',0.8,{top:0,ease:Cubic.easeInout,onReverseComplete:function(){
		threeanimate.timeline.seek(0,false);
	}});
	miaov.timescroll.to({},0.1,{onComplete:function(){
		menu.changemenu('menu_state3');//切换到第三屏的函数，同时传入导航条背景颜色变化的class
	},onReverseComplete:function(){
		menu.changemenu('menu_state2');
	}},'-=0.2');
	
	miaov.timescroll.to({},0,{onComplete:function(){
		threeanimate.timeline.tweenTo('threestate1');
	}},'-=0.2');
	
	    miaov.timescroll.add('step3');
	    
	//主动画中配置第三屏小动画enstart
	miaov.timescroll.to({},0,{onComplete:function(){
		threeanimate.timeline.tweenTo('threestate2');
	},onReverseComplete:function(){
		threeanimate.timeline.tweenTo('threestate1');
	}})
	miaov.timescroll.to({},0.4,{});
	    miaov.timescroll.add('threestate');
	//主动画中配置第三屏小动画end
	    
	miaov.timescroll.to('.scene4',0.8,{top:0,ease:Cubic.easeInout});
	
	    miaov.timescroll.add('step4');
	
	//配置滚动到第五屏的时候，第四屏滚出屏幕外
	miaov.timescroll.to('.scene4',0.8,{top:-$(window).height(),ease:Cubic.easeInout});
    
    //当可视区域大于950 隐藏导航条
    if($(window).width()>950){
        miaov.timescroll.to('.menu_warpper',0.8,{top:-110,ease:Cubic.easeInout},'-=0.8');
    }else{
    	$('.menu_warpper').css('top',0);
    }

	miaov.timescroll.to('.scene5',0.8,{top:0,ease:Cubic.easeInout,onReverseComplete:function(){
		fiveanimate.timeline.seek(0,false);
	}},'-=0.8');
	
	miaov.timescroll.to({},0,{onComplete:function(){
		fiveanimate.timeline.tweenTo('fivestate')
	}},'-=0.2');
	    miaov.timescroll.add('step5');
	
	//底部
	miaov.timescroll.to('.scene5',0.5,{top:-$('.footer').height(),ease:Cubic.easeInOut});
	miaov.timescroll.to('.footer',0.5,{top:$(window).height() - $('.footer').height(),ease:Cubic.easeInOut},'-=0.5');
	
	    miaov.timescroll.add('footer');
	
	miaov.timescroll.stop();
	
	//当改变浏览器的大小时，让动画走到之前已经到达的时间点
	miaov.timescroll.seek(time);
}

miaov.configIntAnimate = function(){//配置导航动画
	var t = new TimelineMax();
	
	t.to('.menu',0.5,{opacity:1});
	t.to('.menu',0.5,{left:22},'-=0.3');
	t.to('.nav',0.5,{opacity:1});
	
	//设置首屏动画
	t.to('.scene1_logo',0.5,{opacity:1});
	t.staggerTo('.scene1_1 img',2,{opacity:1,rotationX:0,ease:Elastic.easeOut},0.2);
	t.to('.light_left',0.7,{rotationZ:0,ease:Cubic.easeOut},'-=2');
	t.to('.light_right',0.7,{rotationZ:0,ease:Cubic.easeOut},'-=2');
	t.to('.controls',0.5,{bottom:20,opacity:1},'-=0.7');
	
	t.to('body',0,{'overflow-y':'scroll'})
	
}

miaov.nav = function(){//导航条动画
	var navt = new TimelineMax();
	$('.nav a').bind('mouseenter',function(){
		var w = $(this).width();
		var l = $(this).offset().left;
		navt.clear();
		navt.to('.line',0.4,{opacity:1,left:l,width:w});
	})
	$('.nav a').bind('mouseleave',function(){
		navt.clear();
		navt.to('.line',0.4,{opacity:0});
	})
	//语言显示
	var languaget = new TimelineMax();
	$('.language').bind('mouseenter',function(){
		languaget.clear();
		languaget.to('.dropdown',0.5,{opacity:1,'display':'block'})
	});
	$('.language').bind('mouseleave',function(){
		languaget.clear();
		languaget.to('.dropdown',0.5,{opacity:0,'display':'none'})
	});
	//调出左侧导航条
	$('.btn_mobile').click(function(){
		var mt = new TimelineMax();
		mt.to('.left_nav',0.5,{left:0});
	});
	$('.l_close').click(function(){
		var lt = new TimelineMax();
		lt.to('.left_nav',0.5,{left:-300})
	})
}

miaov.button3d = function(obj,elem1,elem2,d){//3d翻转
	var btnt = new TimelineMax();
	btnt.to($(obj).find(elem1),0,{rotationX:0,transformPerspective:600,transformOrigin:'center bottom'});
	btnt.to($(obj).find(elem2),0,{rotationX:-90,transformPerspective:600,transformOrigin:'top center'});
	
	$(obj).bind('mouseenter',function(){
		var entert = new TimelineMax();
		var ele1 = $(this).find(elem1);
		var ele2 = $(this).find(elem2);
		entert.to(ele1,d,{rotationX:90,top:-ele1.height(),ease:Cubic.easeInOut},0);
		entert.to(ele2,d,{rotationX:0,top:0,ease:Cubic.easeInOut},0);
	});
	$(obj).bind('mouseleave',function(){
		var leavet = new TimelineMax();
		var ele1 = $(this).find(elem1);
		var ele2 = $(this).find(elem2);
		leavet.to(ele1,d,{rotationX:0,top:0,ease:Cubic.easeInOut},0);
		leavet.to(ele2,d,{rotationX:-90,top:ele2.height(),ease:Cubic.easeInOut},0);
	});
}

miaov.resize = function(){//设置第一屏的高度和top值
	$('.scene').height($(window).height())//设置每一屏的height
	$(".scene:not(':first')").css('top',$(window).height());
	miaov.configTimescroll();
	if($(window).width()<=780){
		$('.wrapper').unbind();
		$(window).unbind('mousewheel');
		$(window).unbind('scroll');
		$(window).unbind('mousedown');
		$(window).unbind('mouseup');
		
		$('body').css('height','auto');
		$('body').addClass('r780 r950').css('overflow-y','scroll');
		
		$('.menu').css('top',0);
		$('.menu').css('transform','none')
		$('.menu_warpper').css('top',0);
		
		$('.menu').removeClass('menu_state2');
		$('.menu').removeClass('menu_state3');
	}else if($(window).width()<=950){
		
		$('body').css('height',8500);
		$('body').removeClass('r780').addClass('r950');
		$('.menu').css('top',0);
		$('.menu').css('transform','none');
		//miaov.events();
	}else{
		
		$('body').removeClass('r780 r950');
		$('body').css('height',8500);
		$('body').removeClass('r950');
		$('.menu').css('top',22);
		$('.left_nav').css('left',-300);
		
		//miaov.events();
	}
}

//设置img的百分比
miaov.imgwidth = function(elemimg){
	elemimg.each(function(){
		$(this).load(function(){
			width = $(this).width();
			$(this).css({
				width:'100%',
				'max-width':width,
				height:'auto'
			})
		})
	})
}

//配置第二屏动画
var twoanimate = {};
twoanimate.timeline = new TimelineMax();
twoanimate.init = function(){//具体第二屏的动画细节
	twoanimate.timeline.staggerTo('.scene2_1 img',1.5,{opacity:1,rotationX:0,ease:Elastic.easeOut},0.1);
	twoanimate.timeline.to('.points',0.2,{bottom:20},'-=1');
	
	//初始第一个按钮
	twoanimate.timeline.to('.scene2 .point0 .text',0.1,{opacity:1});
	twoanimate.timeline.to('.scene2 .point0 .point_icon',0,{'background-position':'right top'});

	    twoanimate.timeline.add('state1');
	    
	twoanimate.timeline.staggerTo('.scene2_1 img',0.2,{opacity:0,rotationX:90},0);
	twoanimate.timeline.to('.scene2_2 .left',0.4,{opacity:1});
	twoanimate.timeline.staggerTo('.scene2_2 .right img',0.3,{opacity:1,rotationX:0,ease:Cubic.easeInOut},0,'-=0.4');
		
	//第二个按钮
	twoanimate.timeline.to('.scene2 .point .text',0,{opacity:0},'-=0.4');
	twoanimate.timeline.to('.scene2 .point1 .text',0.1,{opacity:1});
	twoanimate.timeline.to('.scene2 .point .point_icon',0,{'background-position':'left top'},'-=0.4');
	twoanimate.timeline.to('.scene2 .point1 .point_icon',0,{'background-position':'right top'},'-=0.4');
	
	    twoanimate.timeline.add('state2');
	    
	twoanimate.timeline.to('.scene2_2 .left',0.4,{opacity:0});
	twoanimate.timeline.staggerTo('.scene2_2 .right img',0.3,{opacity:0,rotationX:90,ease:Cubic.easeInOut},0,'-=0.4');
	twoanimate.timeline.to('.scene2_3 .left',0.4,{opacity:1});
	twoanimate.timeline.staggerTo('.scene2_3 .right img',0.3,{opacity:1,rotationX:0,ease:Cubic.easeInOut},0,'-=0.4');
	
	//第三个按钮
	twoanimate.timeline.to('.scene2 .point .text',0,{opacity:0},'-=0.4');
	twoanimate.timeline.to('.scene2 .point2 .text',0.1,{opacity:1});
	twoanimate.timeline.to('.scene2 .point .point_icon',0,{'background-position':'left top'},'-=0.4');
	twoanimate.timeline.to('.scene2 .point2 .point_icon',0,{'background-position':'right top'},'-=0.4');
	
	    twoanimate.timeline.add('state3');
	    
	twoanimate.timeline.to('.scene2_3 .left',0.4,{opacity:0});
	twoanimate.timeline.staggerTo('.scene2_3 .right img',0.3,{opacity:0,rotationX:90,ease:Cubic.easeInOut},0,'-=0.4');
	twoanimate.timeline.to('.scene2_4 .left',0.4,{opacity:1});
	twoanimate.timeline.staggerTo('.scene2_4 .right img',0.3,{opacity:1,rotationX:0,ease:Cubic.easeInOut},0,'-=0.4');
	
	//第四个按钮
	twoanimate.timeline.to('.scene2 .point .text',0,{opacity:0},'-=0.4');
	twoanimate.timeline.to('.scene2 .point3 .text',0.1,{opacity:1});
	twoanimate.timeline.to('.scene2 .point .point_icon',0,{'background-position':'left top'},'-=0.4');
	twoanimate.timeline.to('.scene2 .point3 .point_icon',0,{'background-position':'right top'},'-=0.4');
	
	    twoanimate.timeline.add('state4');
	twoanimate.timeline.stop();
}

//配置第三屏动画
var threeanimate = {};
threeanimate.timeline = new TimelineMax();
threeanimate.init = function(){//第三屏动画
	//动画初始化  翻转90 opacity 0
	threeanimate.timeline.to('.scene3 .step img',0,{rotationX:0,opacity:0,transformPerspective:600,transformOrigin:'center center'});
	
	threeanimate.timeline.staggerTo('.step3_1 img',0.2,{opacity:1,rotationX:0,ease:Cubic.easeOut},0.1);
	
	    threeanimate.timeline.add('threestate1');
	
	threeanimate.timeline.to('.step3_1 img',0.3,{opacity:0,rotationX:-90,ease:Cubic.easeInOut})
	threeanimate.timeline.to('.step3_2 img',0.3,{opacity:1,rotationX:0,ease:Cubic.easeInOut});
	
	    threeanimate.timeline.add('threestate2');
	
	threeanimate.timeline.stop();
}

//配置第五屏动画
var fiveanimate = {};
fiveanimate.timeline = new TimelineMax();
fiveanimate.init = function(){//第五屏的动画
	//初始化所有的图片和button  翻转-90度 opacity 0
	fiveanimate.timeline.to('.scene5 .area_content img, .scene5 .button1, .scene5 .button2',0,{opacity:0,rotationX:-90,transformPerspective:600,transformOrigin:'center center'});
	fiveanimate.timeline.to('.scene5 .scene5_img',0,{top:-220});
	
	fiveanimate.timeline.to('.scene5 .scene5_img',0.5,{top:0,ease:Cubic.easeInOut});
	fiveanimate.timeline.staggerTo('.scene5 .button1, .scene5 .button2, .scene5 .area_content img',1.2,{opacity:1,rotationX:0,ease:Elastic.easeOut},0.2);
	fiveanimate.timeline.to('.scene5 .lines',0.5,{opacity:1});
	
	    fiveanimate.timeline.add('fivestate');
	
	fiveanimate.timeline.stop();
};

//实现导航条3d翻转和top值
var menu = {};
menu.changemenu = function(stateclass){//当没滚动一次的时候，就调用这个函数，啊还能输里面是3d翻转的具体实习那细节,参数作用切换某一瓶的时候，要传入的class名字
	//实现3d翻转的效果
	var oldmenu = $('.menu');
	var newmenu = oldmenu.clone();
	newmenu.removeClass('menu_state1').removeClass('menu_state2').removeClass('menu_state3');
	
	newmenu.addClass(stateclass);
	$('.menu_warpper').append(newmenu);
	oldmenu.addClass('removeClass');
	miaov.nav();
	miaov.button3d('.start','.state1','.state2',0.3);
	var menut = new TimelineMax();
	
	if($(window).width()>950){//如果可视区域大于950导航条有效果
	    menut.to(newmenu,0,{top:100,rotationX:-90,transformPerspective:600,transformOrigin:'top center'});
	    menut.to(oldmenu,0,{top:22,rotationX:0,transformPerspective:600,transformOrigin:'center bottom'});
	    menut.to(oldmenu,0.3,{rotationX:90,top:-55,ease:Cubic.easeInOut,onComplete:function(){
		     $('.removeClass').remove();
	    }});
	    menut.to(newmenu,0.3,{rotationX:0,top:22,ease:Cubic.easeInOut},'-=0.3');
	};
}












