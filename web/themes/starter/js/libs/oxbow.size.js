(function ($) {
  
  
  /// apply cover algorithm to element
  $.fn.cover = function (vars) {
    
    var args = $.extend({}, $.fn.cover.defaults, vars);
    
    var $this = $(this);
    var $container = $this.parent();
    
    if (args.container != null) {
      if (args.container.length) {
        $container = args.container;
      }
    }
    
    if ($container.css('postion') == 'static') {
      $container.css('postion', 'relative');
    }
    $container.css('overflow', 'hidden');
    
    $this.css('max-width', 'none');
    $this.css('max-height', 'none');
    $this.css('position', 'absolute');
    $this.css('left', '-100%');
    $this.css('right', '-100%');
    $this.css('top', '-100%');
    $this.css('bottom', '-100%');
    $this.css('margin', 'auto');
    
    fit($container, $this, 'cover');
    
    $(window).load(function(){
      fit($container, $this, 'cover');
    });
    $(window).resize(function(){
      fit($container, $this, 'cover');
    });
  };
  $.fn.cover.defaults = {
    container: null,
  };
  
  
  /// apply contain algorithm to element
  $.fn.contain = function (vars) {
    
    var args = $.extend({}, $.fn.contain.defaults, vars);
    
    var $this = $(this);
    var $container = $this.parent();
    
    if (args.container != null) {
      if (args.container.length) {
        $container = args.container;
      }
    }
    
    if ($container.css('postion') == 'static') {
      $container.css('postion', 'relative');
    }
    $container.css('overflow', 'hidden');
    
    $this.css('max-width', 'none');
    $this.css('max-height', 'none');
    $this.css('position', 'absolute');
    $this.css('left', '-100%');
    $this.css('right', '-100%');
    $this.css('top', '-100%');
    $this.css('bottom', '-100%');
    $this.css('margin', 'auto');
    
    fit($container, $this, 'contain');
    
    $(window).load(function(){
      fit($container, $this, 'contain');
    });
    $(window).resize(function(){
      fit($container, $this, 'contain');
    });
  };
  $.fn.contain.defaults = {
    container: null,
  };
  
  
  /// run resize method
  function fit($container, $item, method) {
    var containerRatio = $container.width() / $container.height();
    var itemRatio = $item.width() / $item.height();
    
    if (containerRatio > itemRatio) {
      if (method == 'cover') {
        $item.css('width', '100%');
        $item.css('height', 'auto');
      }
      if (method == 'contain') {
        $item.css('width', 'auto');
        $item.css('height', '100%');
      }
    } else {
      if (method == 'cover') {
        $item.css('width', 'auto');
        $item.css('height', '100%');
      }
      if (method == 'contain') {
        $item.css('width', '100%');
        $item.css('height', 'auto');
      }
    }
  }
    
    
    
})(jQuery);