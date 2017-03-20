(function ($) {
  
  
  $.fn.equalize = function (vars) {
    
    var args = $.extend({}, $.fn.equalize.defaults, vars);
    
    var $parent = $(this);
    var $targets = args.targets;
    
    if ($targets.length) {
      equalizeRow($targets);
      $( window ).resize(function() {
        equalizeRow($targets);
      });
    }
  };
  
  $.fn.equalize.defaults = {
    /// element to offset top
    targets: null,
  };  
    
  function equalizeRow($targets) {
    var row_top = 0;
    var row_height = 0;
    var $row = [];
    
    $targets.css('height', 'auto');
    
    $targets.each(function() {
      var $this = $(this);
      if ($this.offset().top != row_top) {
        if ($row.length) {
          $.each($row, function(index, value) {
            $(this).height(row_height);
          });
        }
        $row = [];
        row_top = $this.offset().top;
        row_height = $this.height();
        $row.push($this);
      }
      else {
        $row.push($this);
        if ($this.height() > row_height) {
          row_height = $this.height();
        }
      }
    });
    
    if ($row.length) {
      $.each($row, function(index, value) {
        $(this).height(row_height);
      });
    }
  }
    
    
})(jQuery);