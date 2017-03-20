(function ($) {  
  
  //////////////
  /// COLORS ///
  
  /// colors config file
  var colors = null;
  var colors_map= {};

  /// load colors config file
  $.get('/' + drupalSettings.paragraphs.oxbow_paragraphs_colors, function(data) {
    colors = data;
  })
  .done(function() {
    setColors();
  })
  .fail(function() {
    alert('WARNING: Missing colors config file');
  });
  
  
  /// reduce size of ckeditor for caption fields
  CKEDITOR.on('instanceReady', function(){
    $('.field--name-field-p-caption .cke_contents').css('height','80px');
  });
  
  /// toggle the visibility of JSON field with [`]
  $('body').on('keypress', function(e) {
    alert();
    log(e.keyCode);
  });
  
  
  
  ////////////
  /// AJAX ///
  
  Drupal.behaviors.myBehavior = {
    attach: function (context, settings) {
      
      /// check for paragraphs field
      if ($('.field--widget-entity-reference-paragraphs').length) {
        
        /////////////
        /// MENUS ///
        
        /// identify and mark top level menus
        $('.paragraphs-subform').each(function() {
          $(this).find('> div[class*="field--name-field-p-settings-"]:not(.p-setting-menu)').each(function() {
            $(this).addClass('p-setting-pane p-setting-menu');
          });
        });
        
        /// create top level paragraph menus
        $('.paragraphs-subform').each(function() {
          
          var $p = $(this);
          
          if ($p.find('> .p-menu').length) {
            return true;
          }
          
          var $panes = $p.find('> .p-setting-menu');
          var $menu = $('<div class="p-menu"></div>').prependTo($p);
          
          $panes.each(function() {
            var $this = $(this);
            var title = $this.find('legend').first().text();
            var $item = $('<div class="p-menu-item" data-pane="' + $this.attr('data-drupal-selector') + '"><span>' + title + '</span></div>').appendTo($menu);
            var $pane = $p.find('div[data-drupal-selector="' + $item.attr('data-pane') + '"]');
            
            $item.click(function() {
              if ($(this).hasClass('active')) {
                closePanes();
              }
              else {
                closePanes();
                $(this).openPane();
              }
            });
          });
        });
          
        /// create top level paragraph menus
        $('.paragraphs-subform').each(function() {
          
          var $p = $(this);
          var $panes = $p.find('> .p-setting-menu');
          
          /// set relative pane position
          $panes.each(function() {
            var $this = $(this);
            var $item = $p.find('.p-menu-item[data-pane="' + $this.attr('data-drupal-selector') + '"]');
            
            $this.css('right', ($p.width() - ($item.position().left + $item.outerWidth() + parseInt($item.css('margin-left')))));
          });
        });
        
        /// close setting panes
        $('body').click(function(e) {
          var $e = $(e.target);
          if (!$e.closest('.p-setting-menu').length && !$e.hasClass('p-menu-item') && !$e.parent().hasClass('p-menu-item')) {
            closePanes();
          }
        });
        
        
        ///////////
        /// ALL ///
        
        /// hide all tag fields
        $('.field--name-field-p-tag').addClass('p-hide');
        
        /// build all color palettes
        $('.field--type-string[class*="config"][class*="color"]').createColorPalettes(colors_map);
        
        
        /////////////
        /// TITLE ///
        
        /// build icons
        $('.field--name-field-p-config-title-display').radiosToIcons();
        $('.field--name-field-p-config-title-display').find('.form-radios').addClass('p-icons-text');
        
        $('.field--name-field-p-config-title-align').radiosToIcons();
        $('.field--name-field-p-config-title-align').find('.form-radios').addClass('p-icons-text');
        
        
        /////////////
        /// COLOR ///        
        
        /// hide title color when no title
        $('.field--name-field-p-settings-color').each(function() {
          if (!$(this).closest('.paragraphs-subform').find('> .field--name-field-p-title').length) {
            $(this).find('.field--name-field-p-config-title-color').addClass('p-hide');
          }
        });
        
        
        //////////////////
        /// BACKGROUND ///
        
        /// build icons
        $('.field--name-field-p-config-bg-type').radiosToIcons();
        $('.field--name-field-p-config-bg-type').addClass('p-setting-pane-toggle');
        
        $('.field--name-field-p-config-bg-img-size').radiosToIcons();
        $('.field--name-field-p-config-bg-img-size').find('.form-radios').addClass('p-icons-text');
        
        $('.field--name-field-p-config-bg-video-loop').radiosToIcons();
        $('.field--name-field-p-config-bg-video-loop').find('.form-radios').addClass('p-icons-text');
        
        $('.field--name-field-p-config-bg-video-size').radiosToIcons();
        $('.field--name-field-p-config-bg-video-size').find('.form-radios').addClass('p-icons-text');
        
        /// build sliders
        $('div[class*="field--name-field-p-config-"][class*="opacity"]').selectToSlider();
        
        /// background type toggle
        $('.field--name-field-p-config-bg-type').each(function() {
          var $this = $(this);
          var $panes = $this.parent().find('> [class*="field--name-field-p-setting-"]');
          $panes.addClass('p-setting-pane');
          $this.iconsToPanes($panes);
          
          $this.find('input').change(function() {
            $this.iconsToPanes($panes);
          });
        });
        
        
        ////////////
        /// SIZE ///
        var $panes_size = $('.field--name-field-p-settings-r-size, .field--name-field-p-settings-size');
        
        /// build sliders
        $('.field--name-field-p-config-size-height').selectToSlider();
        $('div[class*="field--name-field-p-config-size-padding-"]').selectToSlider();
        $('div[class*="field--name-field-p-config-size-margin-"]').selectToSlider();
        
        /// build text icons
        $('.field--name-field-p-config-size-constrain').radiosToIcons();
        $('.field--name-field-p-config-size-constrain').find('.form-radios').addClass('p-icons-text');
        
        /// add locks
        $panes_size.each(function() {
          $(this).find('.field--name-field-p-config-size-padding-t, .field--name-field-p-config-size-padding-b').createLock();
          $(this).find('.field--name-field-p-config-size-padding-l, .field--name-field-p-config-size-padding-r').createLock();
          $(this).find('.field--name-field-p-config-size-margin-t, .field--name-field-p-config-size-margin-b').createLock();
          $(this).find('.field--name-field-p-config-size-margin-l, .field--name-field-p-config-size-margin-r').createLock();
        });
        
        
        //////////////
        /// LAYOUT ///
        
        /// layout type icons
        $('.field--name-field-p-config-layout-type').radiosToIcons();
        $('.field--name-field-p-config-layout-type').addClass('p-setting-pane-toggle');
        
        /// layout type toggle
        $('.field--name-field-p-config-layout-type').each(function() {
          var $this = $(this);
          var $panes = $this.closest('.paragraphs-subform').find('> [class*="field--name-field-p-setting-"]');
          $panes.addClass('p-setting-pane');
          $this.iconsToPanes($panes);
          
          /// layout type change
          $this.find('input').change(function() {
            $this.iconsToPanes($panes);
            
            var layout_type = $(this).val();
            
            /// disable content spacing when irrelevant
            if (layout_type == 'slides' || layout_type == 'tabs') {
              $this.parent().find('.field--name-field-p-config-layout-spacing').addClass('p-hide');
            }
            else {
              $this.parent().find('.field--name-field-p-config-layout-spacing').removeClass('p-hide');
            }
            
            /// enable tag field for children when relevant
            if (layout_type == 'tabs') {
              $this.closest('.paragraphs-subform').showTags('Tab Title');
            }
            else {
              $this.closest('.paragraphs-subform').hideTags();
            }
          });
          
          /// disable content spacing when irrelevant on load
          var layout_type = $this.find('input:checked').val();
          if (layout_type == 'slides' || layout_type == 'tabs') {
            $this.closest('.paragraphs-subform').find('.field--name-field-p-config-layout-spacing').addClass('p-hide');
          }
          
          /// enable tag field for children when relevant on load
          if (layout_type == 'tabs') {
            $this.closest('.paragraphs-subform').showTags('Tab Titlee');
          }
        });
        
        /// build sliders
        $('.field--name-field-p-config-layout-columns').selectToSlider();
        $('.field--name-field-p-config-layout-spacing').selectToSlider();
        
        /// build text icons
        $('.field--name-field-p-config-layout-equalize').radiosToIcons();
        $('.field--name-field-p-config-layout-equalize').find('.form-radios').addClass('p-icons-text');
        
        $('.field--name-field-p-config-layout-direction').radiosToIcons();
        $('.field--name-field-p-config-layout-direction').find('.form-radios').addClass('p-icons-text');
        
        /// slideshows
        $('.field--name-field-p-config-slides-slides').selectToSlider();
        $('.field--name-field-p-config-slides-speed').selectToSlider();
        
        var slide_text_icons = '.field--name-field-p-config-slides-arrows';
        slide_text_icons += ', .field--name-field-p-config-slides-pause';
        slide_text_icons += ', .field--name-field-p-config-slides-type';
        slide_text_icons += ', .field--name-field-p-config-slides-cycle';
        $(slide_text_icons).radiosToIcons();
        $(slide_text_icons).find('.form-radios').addClass('p-icons-text');
        
        /// grid layout selection
        $('div[class*="field--name-field-p-config-layout-cols-"]').addClass('p-hide');
        var grid_cols = 12;
        
        /// show selected column layouts
        $('.field--name-field-p-config-layout-cols').each(function() {
          var $this = $(this);
          $this.radiosToIcons();
          var cols = $this.find('input:checked').val();
          var $cols_active = $this.siblings('.field--name-field-p-config-layout-cols-' + cols);
          $cols_active.removeClass('p-hide');
          
          $this.find('input').change(function() {
            $this.siblings('div[class*="field--name-field-p-config-layout-cols-"]').addClass('p-hide');
            cols = $this.find('input:checked').val();
            $cols_active = $this.siblings('.field--name-field-p-config-layout-cols-' + cols);
            $cols_active.removeClass('p-hide');
          });
        });
        
        /// create layout icons
        $('div[class*="field--name-field-p-config-layout-cols-"]').each(function() {
          var $this = $(this);
          $this.radiosToIcons();
          $this.find('label.option').each(function() {
            var $label = $(this);
            var layout = $label.siblings('input').val();
            $label.drawLayout({layout: layout});
          });
        });
        
        
        
        //////////////
        /// REMOVE ///
        
        $('input[data-drupal-selector*="links-remove-button"][value="Remove"]').each(function() {
          var $input = $(this);
          $('<a class="p-remove"></a>').insertAfter($input);
          $input.addClass('p-hide');
          $input.siblings('.p-remove').click(function() {
            $input.mousedown();
          });
        });
        
        
        
        ////////////
        /// SWAP ///
        
        /// make position swap buttons
        $('.paragraphs-subform').each(function() {
          if(!$(this).closest('tr').find('> .p-swap').length) {
            var $row = $(this).closest('tr');
            $row.append('<td class="p-swap"><a class="icon--swap"></a></td>');
          }
        });
        
        /// swap paragraphs
        $('.p-swap a').click(function() {
          var $row = $(this).closest('tr');
          var $row_next = $row.next();
          
          if ($row_next.length) {
            /// detach wysiwyg editor instances
            $row.find('.field--widget-text-textarea .text-format-wrapper').each(function() {
              var $wrapper = $(this);
              var $textarea = $wrapper.find('textarea').get(-1);
              var $format = drupalSettings.editor.formats[$wrapper.find('.filter-wrapper select').val()];
              Drupal.editorDetach($textarea, $format);
            });
            
            /// swap delta orders
            var row_weight = $row.find('> .delta-order select').val();
            var row_next_weight = $row_next.find('> .delta-order select').val();
            $row.find('> .delta-order select').val(row_next_weight);
            $row_next.find('> .delta-order select').val(row_weight);
            
            /// swap location in html
            $row_moved = $row.detach();
            $row_moved.insertAfter($row_next);
            
            /// reattach wysiwyg editor instances
            $row_moved.find('.field--widget-text-textarea .text-format-wrapper').each(function() {
              var $wrapper = $(this);
              var $textarea = $wrapper.find('textarea').get(-1);
              var $format = drupalSettings.editor.formats[$wrapper.find('.filter-wrapper select').val()];
              Drupal.editorAttach($textarea, $format);
            });
          }
        });
      }
    }
  };
  
  
  
  
  /*
   * Return all first level children of given paragraph
   */
  $.fn.getChildren = function() {
    return $(this).find('.field--widget-entity-reference-paragraphs table').first().find('> tbody > tr');
  }
  
  
  /*
   * Close all menu panes
   */
  function closePanes() {
    $('.paragraphs-subform').removeClass('active');
    $('.p-menu').removeClass('active');
    $('.p-setting-menu').removeClass('active');
    $('.p-menu-item').removeClass('active');
  }
  
  
  /*
   * Open given menu pane
   */
  $.fn.openPane = function() {
    $(this).parentsUntil('body', '.paragraphs-subform').addClass('active');
    $(this).closest('.paragraphs-subform').find('div[data-drupal-selector="' + $(this).attr('data-pane') + '"]').addClass('active');
    $(this).closest('.p-menu').addClass('active');
    $(this).addClass('active');
  }
  
  
  /*
   * Show tags on all first level children of given paragraph
   * Set tag label text
   */
  $.fn.showTags = function(title) {
    var $this_children = $(this).getChildren();
    $this_children.each(function() {
      var $tag = $(this).find('.field--name-field-p-tag').first();
      $tag.find('label').text(title);
      $tag.removeClass('p-hide');
    });
  }
  
  
  /*
   * Hide tags on all first level children of given paragraph
   */
  $.fn.hideTags = function() {
    var $this_children = $(this).getChildren();
    $this_children.each(function() {
      $(this).find('.field--name-field-p-tag').first().addClass('p-hide');
    });
  }
  
  
  /*
   * Turns button list labels into icons
   */
  $.fn.radiosToIcons = function () {
    
    $items = $(this);
    
    $items.each(function() {
      
      var $field = $(this);
      
      if ($field.find('.form-radios .p-icon').length) {
       return true;
      }
      
      $field.find('.form-radios input').each(function() {
       
       var $this = $(this);
       $this.closest('.form-item').addClass('p-icon');
       $this.siblings('label').addClass('icon--' + $this.val()).attr('data-value', $this.val());
       
       if ($this.is(':checked')) {
         $this.closest('.p-icon').addClass('active');
       }
       
       $this.click(function() {
         $field.find('.p-icon').removeClass('active');
         $this.closest('.p-icon').addClass('active');
       });
      });
    });
  }
  
  
  /*
   * Links icons to setting panes
   */
  $.fn.iconsToPanes = function (_$panes) {
    var $this = $(this);
    var value = $this.find('.p-icon input:checked').val();
    
    _$panes.removeClass('active');
    if (value != 'none') {
      _$panes.has('[class*="' + value + '"]').addClass('active');
    }
  }
  
  
  /*
   * Turn select options into a slider
   */
  $.fn.selectToSlider = function () {
    
    var $items = $(this);
    
    $items.each(function() {
      
      if ($(this).hasClass('p-slider')) {
        return true;
      }
      
      $(this).addClass('p-slider');
      $(this).find('select').each(function() {
        var $this = $(this);
        $this.addClass('p-hide');
        var $slider = $('<div></div>').insertBefore($this).slider({
          min: 1,
          max: $this.find('option').length,
          range: "min",
          value: $this[0].selectedIndex + 1,
          slide: function(event, ui) {
            $this[0].selectedIndex = ui.value - 1;
            var value = $this.find('option').eq(ui.value - 1).text();
            $slider.find('.ui-slider-handle').text(value);
          },
          stop: function( event, ui ) {
            $this.trigger('change');
          }
        });
        $slider.find('.ui-slider-handle').text($this.find('option').eq($this[0].selectedIndex).text());
        
        $this.change(function() {
          $slider.find('.ui-slider-handle').text($this.find('option').eq($this[0].selectedIndex).text());
          $slider.slider("value", this.selectedIndex + 1);
        });
      });
    });
  }
  
    
  /*
   * Init for colors config file
   */
  function setColors() {
    var colors_json = JSON.parse(colors);
    
    /// create color palette map -- map[field] = palette
    $.each(colors_json, function(key, obj) {
      colors_map[key] = obj;
    });
    
    /// create color palettes
    $(document).ready(function() {
      $('.field--type-string[class*="config"][class*="color"]').each(function() {
        $(this).createColorPalettes(colors_map);
      });
    });
  }
  
  
  /*
   * Creates color palette icons
   */
  $.fn.createColorPalettes = function (_colors_map) {
    
    /// if colors exist
    if (!$.isEmptyObject(_colors_map)) {
      
      var $items = $(this);
      
      $items.each(function() {
        
        /// only create if does not already exist
        if (!$(this).find('.color-palette').length) {
        
          var html = '<div class="color-palette">';
          var $field = $(this);
          var color_val = $field.find('input').val();
          
          /// set to default color palette
          var color_map = _colors_map._default;
          
          /// check for field specific color palette override
          $.each(_colors_map, function(key, items) {
            if ($field.hasClass(key)) {
              color_map = items;
            }
          });
          
          /// loop through colors in palette
          $.each(color_map, function(name, hex){
            
            /// check if active color
            var is_active = '';
            if (name == color_val)
              is_active = ' active';
            
            /// create color swatch html
            html += '<div class="p-icon icon--color">'
            html += '<div class="icon' + is_active +'" data-hex="' + hex + '" data-color="' + name + '" style="background: ' + hex + ';"></div>'
            html += '</div>';
          });
          
          /// add color palette html
          html += '</div>';
          $field.find('.form-item').addClass('has-color-palette').append(html);
          
          /// click event for color swatches
          $field.find('.icon--color .icon').click(function() {
            /// set field color value to click color name
            $field.find('input').val($(this).data('color'));
            /// set active color swatch
            $field.find('.icon--color .icon').removeClass('active');
            $(this).addClass('active');
          });
          
          /// default to "none" swatch if color value is missing from palette
          if (!$field.find('.icon--color .icon.active').length) {
            var $color_none = $field.find('.icon[data-hex="none"]');
            if ($color_none.length) {
              $color_none.addClass('active');
              $color_none.trigger('click');
            }
          }
        }
      });
    }
  }
  
  
  /*
   * Locks together values of given inputs
   * Creates lock icon with disable/enable state
   */
  $.fn.createLock = function() {
    var $targets = $(this);
    $targets.addClass('p-lock');
    var $targets_input = $targets.find('input, select');
    var $target_first = $targets.eq(0);
    var $target_first_input = $target_first.find('input, select');
    
    /// add lock icon
    $target_first.append('<div class="icon--lock lock-on"></div>');
    var $lock = $target_first.find('.icon--lock');
    
    /// update locked values
    $targets_input.change(function() {
      var new_val = $(this).val();
      if ($lock.hasClass('lock-on')) {
        $targets_input.each(function() {
          if ($(this).val() != new_val) {
            $(this).val(new_val).trigger('change');
          }
        });
      }
    });
    
    /// toggle lock state
    $lock.click(function() {
      var $this = $(this);
      if ($this.hasClass('lock-on')) {
        $this.removeClass('lock-on').addClass('lock-off');
      }
      else {
        $this.removeClass('lock-off').addClass('lock-on');
        $targets_input.val($target_first_input.val()).trigger('change');
      }
    });
    
    /// set lock state on load
    $targets_input.each(function() {
      if ($(this).val() != $target_first_input.val()) {
        $lock.trigger('click');
        return false;
      }
    });
  }
  
  
  /*
   * Attaches svg icon from layout string to given element
   */
  $.fn.drawLayout = function(vars) {
    var args = $.extend({}, $.fn.drawLayout.defaults, vars);
    var $this = $(this);
    var svg = $this.svg().svg('get');
    var cols = args.cols;
    var layout = args.layout.split('-');
    var svg_w = args.svg_w;
    var svg_h = args.svg_h;
    var col_w = svg_w / cols;
    var stroke_w = 4;
    var stroke_color = args.color;
    
    /// create svg with rectangle outline
    svg.configure({viewBox: '0 0 ' + svg_w + ' ' + svg_h}, true);
    svg.rect(0, 0, svg_w, svg_h, {fill:'none', strokeWidth: stroke_w, stroke: stroke_color});
    
    /// calculate number of rows
    var layout_w = 0;
    $.each(layout, function(i, value) {
      layout_w += parseInt(value);
    });
    var layout_rows = layout_w / cols;
    
    /// group for column lines
    var stroke = svg.group({fill:'none', strokeWidth: stroke_w/2, stroke: stroke_color});
    var col_x = 0;
    var col_y = 0;
    var col_h = svg_h / layout_rows;
    
    /// draw each columns right vertical line
    $.each(layout, function(i, value) {
      col_x += value * col_w;
      
      /// move to new row and draw horizontal line
      if (col_x > svg_w) {
        col_x = value * col_w;
        col_y += col_h;
        svg.line(stroke, 0, col_y, svg_w, col_y);
      }
      
      svg.line(stroke, col_x, col_y, col_x, col_y + col_h);
    });
  }
  $.fn.drawLayout.defaults = {
    layout: '12',
    svg_w: 60,
    svg_h: 40,
    cols: 12,
    color: 'white',
  };
  
})(jQuery);