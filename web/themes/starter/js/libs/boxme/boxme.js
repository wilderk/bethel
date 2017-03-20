(function(factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports !== 'undefined') {
        module.exports = factory(require('jquery'));
    } else {
        factory(jQuery);
    }

}(function($) {
    'use strict';
    
    
    var target = 'boxme';
    
    
    $(document).ready(function() {
      
      var $target = $('.'+target);

      /// open lightbox
      $target.click(function(e) {
        
        e.stopPropagation();
        e.preventDefault();
        
        var $this = $(this);
        var gallery_id = null;
        
        if ($this.data('boxme-gallery') !== undefined) {
          gallery_id = $this.data('boxme-gallery');
        }
        
        boxme($this, gallery_id);
      });
      
    });
    
    
    window.boxme = function(_target, _gallery) {
      
      var loop = true;
      var index = 0;
      var gallery = _gallery;
      var $gallery = $('.boxme[data-boxme-gallery="'+_gallery+'"]');
      
      if ($gallery.length < 2) {
        gallery = null;
      }
      
      if (gallery != null) {
        for (var i = 0; i < $gallery.length; i++) {
          if(_target.html() == $gallery.eq(i).html()) {
            index = i;
            break;
          }
        }
      }
      
      /// generate container and get reference
      var $container = makeContainer(gallery);
      var $canvas = $container.find('.boxme-canvas');
      
      $container.fadeIn(500);
      
      setContent($canvas, _target);
      
      
      /// arrows
      $container.find('.boxme-left').click(function(e) {
        e.stopPropagation();
        index--;
        if (loop && index < 0) {
          index = $gallery.length - 1;
        }
        setContent($canvas, $gallery.eq(index));
      });
      
      $container.find('.boxme-right').click(function(e) {
        e.stopPropagation();
        index++;
        if(loop && index >= $gallery.length) {
          index = 0;
        }
        setContent($canvas, $gallery.eq(index));
      });
      
      /// close
      $canvas.find(' > *').click(function(e) {
        e.stopPropagation();
      });
      
      $container.click(function(e) {
        removeContainer($container);
      });
      
      $(document).keyup(function(e) {
        /// escape key
        if (e.keyCode == 27) {
          removeContainer($container);
        }
        /// left key
        if (e.keyCode == 37) {
          index--;
          if (loop && index < 0) {
            index = $gallery.length - 1;
          }
          setContent($canvas, $gallery.eq(index));
        }
        /// right key
        if (e.keyCode == 39) {
          index++;
          if(loop && index >= $gallery.length) {
            index = 0;
          }
          setContent($canvas, $gallery.eq(index));
        }
      });
      
      /// resize
      $(window).resize(function() {
        resizeContent($canvas);
      });
    }
    
    
    var resizeContent = function(_canvas) {
      
      var container_w = _canvas.width();
      var container_h = _canvas.height();
      var container_ratio = container_w / container_h;
      
      var $content = _canvas.find(' > *');
      var content_w = $content.width();
      var content_h = $content.height();
      var content_ratio = content_w / content_h;

      if (container_ratio >= content_ratio) {
        $content.css('max-width', container_h * content_ratio+'px');
      }
      else {
        //$content.width('auto');
        $content.css('max-width', '100%');
      }
    }
    
    
    var setContent = function(_canvas, _target) {
      if (_canvas.find(' > *').length) {
        _canvas.find(' > *').fadeOut(function() {
          replaceContent(_canvas, _target); 
        });
      }
      else {
        replaceContent(_canvas, _target); 
      }
    }
    
    var replaceContent = function(_canvas, _target) {
      _canvas.empty();
      _canvas.append(_target.clone());
      
      _canvas.find(' > *').css('position', 'static');
      _canvas.find(' > *').fadeIn();
      
      resizeContent(_canvas);
      
      if (_canvas.find('img').length) {
        _canvas.find('img').load(function() {
          resizeContent(_canvas);
        });
      }
    }
    
    
    var makeContainer = function(_gallery) {
      
      var container = '';
      
      if ($('body').find('#boxme').length == 0) {
        container += '<div id="boxme">';
        container += '<div class="boxme-loading">1</div>';
        //container += '<div class="boxme-bg"></div>';
        container += '<div class="boxme-canvas"></div>';
        
        if (_gallery != null) {
          container += '<div class="boxme-left"><</div>';
          container += '<div class="boxme-right">></div>';
        }
        
        container += '<div class="boxme-close">x</div>';
        container += '</div>';
        
        $('body').append(container);
        $('body').addClass('boxme-open no-scroll');
      }
      
      return $('body').find('#boxme');
    }
    
    var removeContainer = function(_target) {
      _target.fadeOut(function() {
        _target.remove();
        $('body').removeClass('boxme-open no-scroll');
      });
    }
}));