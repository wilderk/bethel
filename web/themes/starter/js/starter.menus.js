
(function ($) {  
  
  $.fn.closeMenu = function() {
    var $this = $(this);
    $this.removeClass('open open-1');
    $this.find('.open').removeClass('open');
    $('body').removeClass('open-menu');
  };
  
  $.fn.openMenu = function() {
    $(this).addClass('open');
    $('body').addClass('open-menu');
  };
  
  $.fn.toggleMenu = function() {
    var $this = $(this);
    
    if ($this.hasClass('open')) {
      $this.closeMenu();
    }
    else {
      $this.openMenu();
    }
  };
  
  $.fn.watchMenu = function(options) {
    var opts = $.extend( {}, $.fn.watchMenu.defaults, options );
    var $mobile_mobile = opts.mobileMenu;

    var $body = $('body');
    var $this = $(this);
    var $li = $this.find('> ul > li');

    if(isSingleRow($li)) {
      if(!$body.hasClass('show-desktop')) {
        $body.addClass('show-desktop').removeClass('show-mobile');
        $this.closeMenu();
        $mobile_mobile.closeMenu();
      }
    }
    else {
      if(!$body.hasClass('show-mobile')) {
        $body.addClass('show-mobile').removeClass('show-desktop');
        $this.closeMenu();
      }
    }
    
    $(window).resize(function() {
      if(isSingleRow($li)) {
        if(!$body.hasClass('show-desktop')) {
          $body.addClass('show-desktop').removeClass('show-mobile');
          $this.closeMenu();
          $mobile_mobile.closeMenu();
        }
      }
      else {
        if(!$body.hasClass('show-mobile')) {
          $body.addClass('show-mobile').removeClass('show-desktop');
          $this.closeMenu();
        }
      }
    });
  };
  $.fn.watchMenu.defaults = {
    mobileMenu: null
  };
  
})(jQuery);