
$(function(){
	$('.j-editor').survey();
	
})
$(function(){
  $('body').on('click','.j-edit-sw',function(){
    if($(this).hasClass('z-act')){
      $(this).parentsUntil('.j-qus-items').parent().find('.j-detail:visible').hide();
      $(this).parentsUntil('.j-qus-items').parent().find('.j-edit-sw').removeClass('z-act')
    }else{
      $(this).parentsUntil('.j-qus-items').parent().find('.j-detail').show();
      $(this).parentsUntil('.j-qus-items').parent().find('.j-edit-sw').addClass('z-act')
    }
  });
})