/**
 * @file
 * JS/jQuery
 */
 
(function ($) {
  
  var class_settings = 'field--name-field-p-settings';
  var class_json = 'field--name-field-p-setting-json';
  var class_image = 'field--name-field-p-setting-bg-img';
  var class_link = 'field--name-field-p-setting-title-link';

  
  
  /*
   * Change JSON config to match field value
   */
  $.fn.watch = function() {
    
    $(this).each(function() {
      
      var $this = $(this);
      
      /// skip panes
      if ($this.hasClass('p-pane')) {
        return true;
      }
      
      if($this.hasClass('p-select')) {
        $this.find('select').change(function() {
          var value = { value: $(this).val() };
          $this.valJSON(value);
        });
      }
      
      else if($this.hasClass('p-colors')) {
        $this.find('.color-palette .icon--color').click(function() {
          var value = { value: $(this).data('value'), hex: $(this).data('color') };
          $this.valJSON(value);
          $this.find('.active').removeClass('active');
          $(this).addClass('active');
        });
      }
      
      else if($this.hasClass('p-buttons')) {
        $this.find('.buttons a').click(function() {
          var value = { value: $(this).data('value') };
          $this.valJSON(value);
          $this.find('.active').removeClass('active');
          $(this).addClass('active');
        });
      }
      
      else if($this.hasClass('p-text')) {
        $this.find('.text input[type="text"]').change(function() {
          var tmp_value = $(this).val() ? $(this).val() : ' ';
          var value = { value: tmp_value };
          $this.valJSON(value);
        });
      }
      
      else if($this.hasClass('p-pane-menu')) {
        $this.find('.pane-menu a').click(function() {
          var value = { value: $(this).data('value') };
          $this.valJSON(value);
          $this.siblings('.p-pane').removeClass('active');
          $this.siblings('.p-pane[data-field="' + value['value'] + '"]').addClass('active');
          $this.find('.active').removeClass('active');
          $(this).addClass('active');
          
          /// layout pane menu
          if ($this.data('field') == 'type' && $this.parents('[data-setting="layout"]')) {
            /// show / hide tag fields
            if (value['value'] == 'tabs') {
              $this.getParagraph().showTags('Tab Title');
            }
            else if (value['value'] == 'accordion') {
              $this.getParagraph().showTags('Accordion Title');
            }
            else {
              $this.getParagraph().hideTags();
            }
          }
        });
      }
      
      else if ($this.hasClass('p-action')) {
        $this.find('.actions a').click(function() {
          var value = { value: $(this).data('value') };
          $(this).getParagraph().find('> ' + $(this).data('map')).mousedown().click();
          $this.valJSON(value);
        });
      }
      
      else if ($this.hasClass('p-popup')) {
        $this.find('> .button').click(function() {
          
          var is_active = $this.hasClass('active');
          closePopups();
          
          if (!is_active) {
            
            $this.addClass('active');
            
            var $popup = $this.find('> .popup');
            $popup.removeClass('p-left p-top p-bottom');
            
            var popup_r = $popup.offset().left + $popup.outerWidth();
            
            if ($(window).width() - popup_r < $(window).width() / 100) {
              $popup.addClass('pos-t');
            }
          }
        });
        $this.find('> .popup .p-setting:not(.p-pane-menu)').click(function() {
          setPopupPreview($this);
        });
      }
      
      /// update image preview
      if ($this.parents('.p-pane[data-field="image"]').length) {
        $this.click(function() {
          setImagePreview($this.parent().find('[data-field="image"]'), $this.getParagraph().find('> .' + class_settings + ' .' + class_image));
        });
      }
      
      /// update link preview
      if ($this.hasClass('p-action') && $this.getKey() == 'link') {
        $this.click(function() {
          setLinkPreview($this, $this.getParagraph().find('> .' + class_settings + ' .' + class_link));
        });
        $this.on('change', '.p-link input', function() {
          $this.getParagraph().find('> .' + class_settings + ' .' + class_link + ' input[type="text"]').val($(this).val());
        });
      }
      
    });
    
    return $(this);
  };
  
  
  
  /*
   * Update fields to match JSON config value
   */
  $.fn.update = function() {
    
    $(this).each(function() {
      
      var $this = $(this);
      var value = $this.valJSON();
      
      if ($this.hasClass('p-select')) {
        $this.find('select').val(value).change();
      }
      
      else if ($this.hasClass('p-colors')) {
        $this.find('.icon--color[data-value="' + value + '"]').addClass('active');
      }
      
      else if ($this.hasClass('p-buttons')) {
        $this.find('a[data-value="' + value + '"]').addClass('active');
      }
      
      else if ($this.hasClass('p-text')) {
        $this.find('input[type="text"]').val(value);
      }
      
      else if($this.hasClass('p-drupal')) {
        $this.find('.drupal > .field').each(function() {
          var map = $(this).data('map');
          var $field = $this.getParagraph().find('> ' + map).detach();
          $(this).append($field);
        });
      }
      
      else if ($this.hasClass('p-pane-menu')) {
        if($this.find('a[data-value="' + value + '"]').length) {
          $this.find('a[data-value="' + value + '"]').click();
        }
        else {
          $this.find('a').first().click();
        }
          
        /// layout pane menu
        if ($this.data('field') == 'type' && $this.parents('[data-setting="layout"]')) {
          /// show tag field
          if (value == 'tabs') {
            $this.getParagraph().showTags('Tab Title');
          }
          else if (value == 'accordion') {
            $this.getParagraph().showTags('Accordion Title');
          }
          else {
            $this.getParagraph().hideTags();
          }
        }
      }
      
      if ($this.hasClass('p-action') && $this.getKey() == 'image') {
        setImagePreview($this, $this.getParagraph().find('> .' + class_settings + ' .' + class_image));
      }
      
      if ($this.hasClass('p-action') && $this.getKey() == 'link') {
        setLinkPreview($this, $this.getParagraph().find('> .' + class_settings + ' .' + class_link));
      }
      
      if ($this.parents('.p-popup').length) {
        setPopupPreview($this.parents('.p-popup'));
      }
    });
    
    return $(this);
  };
  
  
  
  /*
   * Set or get JSON config value key for field
   * Sets field value key if provided
   * Returns field value key if not provided
   */
  $.fn.valJSON = function(vars) {
    var args = $.extend({}, $.fn.valJSON.defaults, vars);
    var set_value = args.value ? true : false;
    
    var $this = $(this);
    var field_key = $this.getKey();
    var group_keys = $this.getGroupKeys();
    var type = getFieldType(field_key, group_keys);
    
    var json = $this.getConfigJSON();
    var tmp_json = json;
    
    if (json && type != 'pane' && type != 'popup') {
      
      /// naviagate through groups in JSON config field
      for (i = 0; i < group_keys.length; i++) {
        
        /// verify setting group exists
        if (group_keys[i] in tmp_json) {
          /// verify fields group exists
          if ('fields' in tmp_json[group_keys[i]]) {
            tmp_json = tmp_json[group_keys[i]]['fields'];
          }
          /// create missing field group
          else {
            tmp_json[group_keys[i]]['fields'] = {};
            tmp_json = tmp_json[group_keys[i]]['fields'];
          }
        }
        
        /// create missing setting groups
        else {
          tmp_json[group_keys[i]] = {};
          tmp_json[group_keys[i]]['fields'] = {};
          tmp_json = tmp_json[group_keys[i]]['fields'];
        }
      }
      
      /// create missing setting field
      if (field_key in tmp_json == false) {
        tmp_json[field_key] = {};
        tmp_json[field_key]['value'] = getFieldDefault(field_key, group_keys);
      }

      /// value was provided, set the value
      if (set_value) {
        tmp_json[field_key]['value'] = args.value;
        if(args.hex) tmp_json[field_key]['hex'] = args.hex;
        $this.getConfigField().find('textarea').val(JSON.stringify(json));
        $this.getConfigField().find('textarea').change();
        return $this;
      }
      
      /// no value provided, return value
      $this.getConfigField().find('textarea').val(JSON.stringify(json));
      return tmp_json[field_key]['value'];
    }
    
    return null;
  };
  
  $.fn.valJSON.defaults = {
    value: null,
  };
  
  
  
  /*
   * Returns field key
   */
  $.fn.getKey = function() {
    return $(this).data('field');
  };
  
  
  
  /*
   * Returns array of all parent groups
   * of field in DOM
   */
  $.fn.getGroupKeys = function() {
    var $this = $(this);
    var $parents = $($this.parents('.p-pane, .p-popup').get().reverse());
    var group_keys = [$this.closest('li').data('setting')];

    $parents.each(function() {
      group_keys.push($(this).getKey());
    });
    
    return group_keys;
  };
  
  
  
  /*
   * Returns paragraph's JSON
   */
  $.fn.getConfigJSON = function() {
    var json_string = $(this).getConfigField().find('textarea').val();

    if (json_string.length) {
      return JSON.parse(json_string);
    }

    return null;
  };
  
  
  
  /*
   * Returns paragraph's JSON field
   */
  $.fn.getConfigField = function() {
    var $this = $(this);
    var $json = $this.find('> .' + class_settings + ' .' + class_json);
    
    if ($json.length) {
      return $json;
    }

    var $paragraph = $this.getParagraph();
    if ($paragraph && $paragraph.length) {
      $json = $paragraph.find('> .' + class_settings + ' .' + class_json);
      if ($json.length) {
        return $json;
      }
    }
    
    return null
  }
  
  
  
  /*
   * Return paragraph object
   * from element within paragraph
   */
  $.fn.getParagraph = function() {
    var $this = $(this);
    
    if ($this.find('> .p-menu').length) {
      return $this;
    }
    
    var $paragraph = $this.closest('.paragraphs-subform');
    if ($paragraph.length) {
      if ($paragraph.find('> .p-menu').length){
        return $paragraph;
      }
      else if($paragraph.find('.p-menu').length) {
        $paragraph = $paragraph.find('.p-menu').parent();
        return $paragraph;
      }
    }
    
    return null;
  };
  
  
  
  /*
   * Return all first level children of given paragraph
   */
  $.fn.getChildren = function() {
    return $(this).find('.field--widget-entity-reference-paragraphs table').first().find('> tbody > tr');
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
  
  
})(jQuery);