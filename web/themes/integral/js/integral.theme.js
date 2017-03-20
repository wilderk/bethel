
(function ($) {  

  $('.btn.toggle').click(function() {
    var $this = $(this);
    if($this.hasClass('open')) {
      $('.btn.toggle').removeClass('open');
    }
    else {
      $('.btn.toggle').removeClass('open');
      $this.addClass('open');
    }
  });

  $('.node__edit').stick_in_parent();

  $('.node__save .btn').click(function() {
    $(this).parent().find('input').first().click();
  });

  $('.node__unpublish .btn, .node__publish .btn').click(function() {
    $(this).parent().find('input').click();
  });

  $('.node__delete .btn').click(function() {
    window.location = $(this).parent().find('a').attr('href');
  });

  $('.group__header').stick_in_parent();
  //$('.nav__fields').stick_in_parent();
  setNavigableHeight();

  $(window).load(function() {
    setNavigableHeight();
    $('.nav__fields').stick_in_parent();
  });

  $(window).resize(function() {
    setNavigableHeight();
  });

  function setNavigableHeight() {
    var $group_navigable = $('.group__navigable');
    if($group_navigable.length) {
      $('body').css('max-height', '100vh').css('overflow', 'hidden');
      var h = Math.floor($(window).height()) - Math.floor($group_navigable.offset().top);
      $group_navigable.height(h);
    }
  }

})(jQuery);