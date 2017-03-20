/**
 * @file
 * JS/jQuery
 */
 
(function ($) {
  
  /// where _target is the elements to compare
  function isSingleRow(_target) {
    
    var single = true;
    
    if (_target.length) {
      var top = _target.first().offset().top;
        
      _target.each(function() {

        if ($(this).offset().top != top) {
          single = false;
          return;
        }
      });
    
    }
    return single;
 }  
  window.isSingleRow = isSingleRow;
  
  
  /// where _target is the elements to compare
  function watchRowHeight(_target) {
    
    if (_target && _target.length) {
      setEqualHeight(_target);
      
      $(window).resize(function() {
        setEqualHeight(_target);
      });
      
      $(window).load(function() {
        setEqualHeight(_target);
      });
    }
  }  
  window.watchRowHeight = watchRowHeight;
  
  
  // set elements to have same height
  function setEqualHeight(_target) {
    
    if (_target && _target.length) {
      var row = [];
      var row_offset = -1000000;
      var row_height = 0;
      
      _target.each(function() {
        $(this).css('height', 'auto');
      });
      
      _target.each(function() {
        
        // if we have a new row
        if ($(this).offset().top != row_offset) {
          
          // set height of previous row
          if (row.length) {
            for(i = 0; i < row.length; i++) {
              row[i].height(row_height);
            }
            
            // empty row
            row = []
          }
          
          // add new element to row
          row.push($(this));
          
          // set new row offset
          row_offset = $(this).offset().top;
          
          // set new height
          row_height = $(this).outerHeight();
        }
        
        // item is in current row
        else {
          
          // add item
          row.push($(this));
          
          // update max row height
          if ($(this).outerHeight() > row_height) {
            row_height = $(this).outerHeight();
          }
        }
      });
      
      if (row.length) {
        for(i = 0; i < row.length; i++) {
          row[i].height(row_height);
        }
      }
    }
  }
  
})(jQuery);