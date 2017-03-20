(function ($) {
  
  
  $.fn.stickyTop = function (vars) {
    
    var args = $.extend({}, $.fn.stickyTop.defaults, vars);
    
    var $this = $(this);
    var this_top = $this.offset().top;
    var this_top_init = $this.css('top');
    
    $(window).scroll(function() {
      
      var scroll_top = $(window).scrollTop();
      var $bumper = null;
      
      if(args.offset_element) {
        if($(args.offset_element).length) {
          $bumper = $(args.offset_element);
        }
      }

      /// add in offseting element
      $bumper != null ? scroll_top += $bumper.height() : scroll_top = scroll_top;
      
      /// if scroll position is below element
      if (this_top <= scroll_top) {
        $this.addClass('fixed');
        $bumper ? $this.css('top', $bumper.height()) : $this.css('top', 0);
      }
      /// if scroll position is above element
      else {
        $this.removeClass('fixed');
        $this.css('top', this_top_init);
      }
    });
  };
  
  $.fn.stickyTop.defaults = {
    /// element to offset top
    offset_element: null,
  };  
    
    
    
})(jQuery);