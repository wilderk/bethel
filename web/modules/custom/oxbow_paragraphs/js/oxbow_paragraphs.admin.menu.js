/**
 * @file
 * JS/jQuery
 */
 
(function ($) {  
  


  $(document).ready(function() {

    $('body').click(function(e) {
      if ($('.p-menu > ul > li.active .p-popup.active').length)
        closePopups();
      else
        closeMenus();
    });
  });
  
  
  
  $.fn.makeMenu = function() {
  
    if (configJSON) {

      if (!menuJSON) {
        menuJSON = new Array();
        $.each(configJSON, function(key, val) {
          var obj = {};
          obj[key] = val;
          menuJSON.push(obj);
        });
        menuJSON.sort(function(a, b) {
          var key_a = Object.keys(a)[0];
          var key_b = Object.keys(b)[0];
          return +a[key_a].weight > +b[key_b].weight ? 1 : -1;
        });
      }

      if (!configDefaultJSON) {
        configDefaultJSON = getConfigDefault(configJSON);
      }
      
      var pDefaultJSON = $.extend(true, {}, configDefaultJSON);
      
      var $this = $(this);
      var $p_json = $this.getConfigField();
      
      if ($p_json && !$this.find('> .p-menu').length) {

        var menu_html = '<div class="p-menu"><ul>';

        /// create setting groups
        $.each(menuJSON, function(key, tmp_val) {
          var group_key = Object.keys(tmp_val)[0];
          var val = tmp_val[group_key];

          var p_type = $this.getType();
          
          var restrict = false;
          
          /// check if group is allowed for paragraph type
          if ('restrict' in configJSON[group_key]) {
            restrict = true;
            $.each(configJSON[group_key]['restrict'], function(index, val) {
              if (val.startsWith('!')) {
                val = val.substring(1);
                if (p_type.indexOf(val) >= 0) {
                  restrict = true;
                  return false;
                }
                else {
                  restrict = false;
                }
              }
              else if (p_type.indexOf(val) >= 0) {
                restrict = false;
              }
            });
          }
          
          if (restrict) {
            delete pDefaultJSON[group_key]
          }
          
          if (group_key != 'global' && !restrict) {
            menu_html += '<li data-setting="' + group_key + '">';
            menu_html += '<span class="p-menu-item">' + configJSON[group_key]['label'] + '</span>';
            menu_html += '<div class="p-settings p-group">';
          
            /// create each field in setting group
            $.each(configJSON[group_key]['fields'], function(field_key, val) {
              menu_html += renderField(field_key, [group_key]);
            });
          
            menu_html += '</div>';
            menu_html += '</li>';
            
          }
          
        });

        /// add delete button to menu
        menu_html += '<li data-setting="delete"><div class="p-delete"><span>\u0054</span></div></li>';
        
        menu_html += '</ul></div>';
        $this.prepend(menu_html);
        
        var $menu = $this.find('> .p-menu');
        var $menu_links = $menu.find('li > .p-menu-item');
        var $menu_fields = $menu.find('.p-setting');

        if($this.closest('.field--widget-entity-reference-paragraphs').hasClass('field--name-field-p-regions')) {
          $menu.addClass('region-menu');
        }
        
        /// update JSON on field change
        $menu_fields.watch();
        
        /// mark paragraphs with open menus
        $menu_links.click(function() {
          var active = $(this).parent().hasClass('active');
          closeMenus();
          if (!active) {
            $(this).parent().addClass('active');
            $menu.addClass('open');
            $(this).parentsUntil( $('.field--name-field-p-regions'), 'tr' ).addClass('p-active');
          }
        });
        
        /// set to default if not set
        if (!$p_json.find('textarea').val().length) {
          $p_json.find('textarea').val(JSON.stringify(pDefaultJSON));
        }
        
        /// top level paragraphs
        if (!$this.parents('.paragraphs-subform').length) {
          /// hide tag field
          $this.find('.field--name-field-p-tag').addClass('p-hide');
          /// add status toggle
          $this.addStatusToggle();
        }
        /// child paragraphs
        else {
          var $layout = $this.parent().closest('.paragraphs-subform').find('> .p-menu [data-setting="layout"] > .p-group > [data-field="type"]');
          if ($layout.length) {
            /// show tabs tag
            if ($layout.valJSON() == 'tabs') {
              $this.parent().closest('.paragraphs-subform').showTags('Tab Title');
            }
            /// show accordion tag
            else if ($layout.valJSON() == 'accordion') {
              $this.parent().closest('.paragraphs-subform').showTags('Accordion Title');
            }
            /// hide tag
            else {
              $this.find('.field--name-field-p-tag').addClass('p-hide');
            }
          }
        }
        
        /// set menu items based on values
        $menu_fields.update();
        
        /// delete button ( drupal 8 )
        $menu.find('li[data-setting="delete"] .p-delete').click(function() {
          $(this).addClass('ajax-loading');
          console.log($(this).closest('tr[data-id]').data('id'));
          $menu.closest('td').find('.paragraph-type-top input[value="Remove"]').first().mousedown();
        });
        
        
        /// general click events
        
        $menu.find('.p-popup > .popup').click(function(e) {
          e.stopPropagation();
        });
        $menu.find('.p-popup > .button').click(function(e) {
          e.stopPropagation();
        });
        
        $menu.click(function(e) {
          e.stopPropagation();
          closePopups();
        });
        
      }
      
    }
    
  }
  
  
  /*
   * Close all setting menus
   */
  window.closeMenus = function() {
    $('.p-menu').removeClass('open');
    $('.p-menu li').removeClass('active');
    $('tr').removeClass('p-active');
    $('.p__add .btn.toggle').removeClass('open');
    closePopups();
  };
  
  
  /*
   * Close all popups
   */
  window.closePopups = function() {
    $('.p-menu .p-popup').removeClass('active');
  };
  
  
  /*
   * Get paragraph type
   */
  $.fn.getType = function() {
    var $type = $(this).closest('td').find('.paragraph-type-top').first();
    
    if ($type.length) {
      var type = $type.text();
      return type.replace('Type:', '').trim().toLowerCase();
    }
    
    return 'none';
  };
  
  
  /*
   * Add status toggle to paragraph if setting exists in menu
   */
  $.fn.addStatusToggle = function() {
    var $this = $(this);
    var $status_field = $this.find('> .p-menu li[data-setting="status"] [data-field="status"]');
    if ($status_field.length) {
      var active = $status_field.valJSON();
      $this.closest('tr').addClass('p-status-' + active);
      $this.parent().addClass('p-has-status p-status-' + active);
      var values = [];
      var labels = [];
      $status_field.find('.button a').each(function(index){
        values.push($(this).data('value'));
        labels.push($(this).text());
        if ($(this).data('value') == active) {
          active = index;
        }
      });
      var $toggle = $(toggle(values, labels, active, 45));
      $toggle.addClass('p-status-toggle');
      $toggle.find('.toggle-value').change(function() {
        $status_field.find('.button a[data-value="' + $(this).val() + '"]').click();
        $this.closest('tr').removeClass('p-status-show p-status-hide p-status-draft');
        $this.closest('tr').addClass('p-has-status p-status-' + $(this).val());
        $this.parent().removeClass('p-status-show p-status-hide p-status-draft');
        $this.parent().addClass('p-has-status p-status-' + $(this).val());
      });
      $this.append($toggle);
    }
  };
  
  
  
  /////////////////////////////
  /// JSON Helper Functions ///
  /////////////////////////////
  
  
  
  /*
   * Returns field HTML and wrapper for given JSON field
   */
  function renderField(_field_key, _group_keys) {
    
    var label = getFieldLabel(_field_key, _group_keys);
    var type = getFieldType(_field_key, _group_keys);
    
    var field_html = '';
    
    /// start setting wrapper
    field_html += '<div class="p-setting p-' + type + '" data-field="' + _field_key + '">';
    field_html += '<div class="p-label"><label>' + label + '</label></div>';
    
    /// render field
    field_html += render(_field_key, _group_keys);
    
    /// end setting wrapper
    field_html += '</div>';
    
    return field_html;
  }
  
  
  
  /*
   * Returns HTML for given JSON field
   */
  function render(_field_key, _group_keys) {
    
    var field = getField(_field_key, _group_keys);
    var label = getFieldLabel(_field_key, _group_keys);
    var type = getFieldType(_field_key, _group_keys);
    var values = getFieldValues(_field_key, _group_keys);
    
    var field_html = '';
    
    /// global fields
    if (type == 'global' && 'map' in field) {
      field_html = render(field['map'], ['global']);
    }
    
    /// settings with nested fields
    if ('fields' in field) {
      var tmp_group_keys = _group_keys.slice(0);
      tmp_group_keys.push(_field_key);
      $.each(field['fields'], function(sub_field_key, val) {
        field_html += renderField(sub_field_key, tmp_group_keys);
      });
    }
    
    /// popup fields
    if (type == 'popup') {
      field_html = '<div class="popup-preview button"></div><div class="popup">' + field_html + '</div>';
    }
    
    /// pane menu field
    if (type == 'pane-menu') {
      
      field_html = '<div class="pane-menu">';
      
      $.each(values, function(value_key, val) {
        var value = values[value_key];
        field_html += '<div class="button"><a';
        field_html += ' data-value="' + value_key + '">';
        field_html += value['label'];
        field_html += '</a></div>';
      });
      
      field_html += '</div>';
    }
    
    /// action field
    if (type == 'action') {
      
      field_html = '<div class="actions">';
      
      $.each(values, function(value_key, val) {
        var value = values[value_key];
        field_html += '<div class="button"><a';
        field_html += ' data-value="' + value_key + '" data-map="' + value['map'] + '">';
        field_html += value['label'];
        field_html += '</a></div>';
      });
      
      field_html += '</div>';
    }
    
    /// select field
    if (type == 'select') {
      
      field_html = '<select>';
      
      $.each(values, function(value_key, val) {
        var value = values[value_key];
        field_html += '<option value="' + value_key + '">' + value['label'] + '</option>';
      });
      
      field_html += '</select>';
    }
    
    /// color field
    if (type == 'colors') {
      
      field_html = '<div class="color-palette">';
      
      $.each(values, function(value_key, val) {
        var value = values[value_key];
        field_html += '<div class="color"><div class="icon--color"';
        field_html += ' data-value="' + value_key + '"';
        field_html += ' data-color="' + value['value'] + '"';
        field_html += ' style="background-color:' + value['value'] + ';"';
        field_html += '></div></div>';
      });
      
      field_html += '</div>';
    }
    
    /// button field
    if (type == 'buttons') {
      
      field_html = '<div class="buttons">';
      
      $.each(values, function(value_key, val) {
        var value = values[value_key];
        field_html += '<div class="button"><a';
        field_html += ' data-value="' + value_key + '">';
        field_html += value['label'];
        field_html += '</a></div>';
      });
      
      field_html += '</div>';
    }
    
    /// text field
    if (type == 'text') {
      
      field_html = '<div class="text">';
      
      $.each(values, function(value_key, val) {
        var value = values[value_key];
        
        field_html += '<input type="text"';
        if ('placeholder' in val) field_html += ' placeholder="' + val['placeholder'] + '"';
        field_html += ' data-value="' + value_key + '">';
      });
      
      field_html += '</div>';
    }
    
    /// drupal field
    if (type == 'drupal') {
      
      field_html = '<div class="drupal">';
      
      $.each(values, function(value_key, val) {
        var value = values[value_key];
        field_html += '<div class="field" data-value="' + value_key + '" data-map="' + value['map'] + '">';
        field_html += '</div>';
      });
      
      field_html += '</div>';
    }
    
    return field_html;
  }
  
  
  
  /*
   * Returns JSON field value as string
   */
  window.getFieldValue = function(_value_key, _field_key, _group_keys) {
    
    var value_key = _value_key || null;
    var field_key = _field_key || null;
    var group_keys = _group_keys || null;
    
    if (value_key) {
      
      var tmp_json = getFieldValues(field_key, group_keys);
      
      if (tmp_json) {
        if (value_key in tmp_json) {
          if ('value' in tmp_json[value_key]) {
            return tmp_json[value_key]['value'];
          }
        }
      }
    }
    
    return null;
  };
  
  
  
  /*
   * Returns JSON object of field values
   */
  window.getFieldValues = function(_field_key, _group_keys) {
    
    var field_key = _field_key || null;
    var group_keys = _group_keys || null;
    
    var tmp_json = configJSON;
    
    if (field_key) {
      
      var tmp_json = getField(field_key, group_keys);
      
      if (tmp_json) {
        
        /// global type -- return mapped values
        if (tmp_json['type'] == 'global' && 'map' in tmp_json) {
          var map = tmp_json['map'];
          if (map in configJSON['global']['fields']) {
            if ('values' in configJSON['global']['fields'][map]) {
              return configJSON['global']['fields'][map]['values'];
            }
          }
        }
        
        /// normal type -- return values
        if ('values' in tmp_json) {
          return tmp_json['values'];
        }
      }
    }
    
    return null;
  };
  
  
  
  /*
   * Returns JSON field default as string
   */
  window.getFieldDefault = function(_field_key, _group_keys) {
    
    var field_key = _field_key || null;
    var group_keys = _group_keys || null;
    
    if (field_key) {
      
      var tmp_json = getField(field_key, group_keys);
      
      if (tmp_json) {
        
        /// normal type or overriden default -- return default
        if ('default' in tmp_json) {
          return tmp_json['default'];
        }
        
        /// global type -- return mapped default
        if (tmp_json['type'] == 'global' && 'map' in tmp_json) {
          var map = tmp_json['map'];
          if (map in configJSON['global']['fields']) {
            if ('default' in configJSON['global']['fields'][map]) {
              return configJSON['global']['fields'][map]['default'];
            }
          }
        }
      }
    }
    
    return null;
  };
  
  
  
  /*
   * Returns JSON field label as string
   */
  window.getFieldLabel = function(_field_key, _group_keys) {
    
    var field_key = _field_key || null;
    var group_keys = _group_keys || null;
    
    if (field_key) {
      
      var tmp_json = getField(field_key, group_keys);
      
      if (tmp_json) {
        
        /// normal type or overriden default -- return default
        if ('label' in tmp_json) {
          return tmp_json['label'];
        }
        
        /// global type -- return mapped default
        if (tmp_json['type'] == 'global' && 'map' in tmp_json) {
          var map = tmp_json['map'];
          if (map in configJSON['global']['fields']) {
            if ('label' in configJSON['global']['fields'][map]) {
              return configJSON['global']['fields'][map]['label'];
            }
          }
        }
      }
    }
    
    return null;
  };
  
  
  
  /*
   * Returns JSON field type as string
   */
  window.getFieldType = function (_field_key, _group_keys) {
    
    var field_key = _field_key || null;
    var group_keys = _group_keys || null;
    
    if (field_key) {
      
      var tmp_json = getField(field_key, group_keys);
      
      if (tmp_json) {
        
        /// global type -- return mapped default
        if (tmp_json['type'] == 'global' && 'map' in tmp_json) {
          var map = tmp_json['map'];
          if (map in configJSON['global']['fields']) {
            if ('type' in configJSON['global']['fields'][map]) {
              return configJSON['global']['fields'][map]['type'];
            }
          }
        }
        
        /// normal type -- return default
        if ('type' in tmp_json) {
          return tmp_json['type'];
        }
      }
    }
    
    return null;
  };
  
  
  
  /*
   * Returns JSON object for field
   * uses configJSON unless different JSON is provided
   */
  window.getField = function(_field_key, _group_keys, _json) {
    
    var field_key = _field_key || null;
    var group_keys = _group_keys || null;
    var tmp_json = _json || configJSON;
    
    if (field_key) {
      
      if (group_keys) {
        /// naviagate through groups in JSON
        for (i = 0; i < group_keys.length; i++) {
          if (group_keys[i] in tmp_json) {
            tmp_json = tmp_json[group_keys[i]]['fields'];
          }
        }
      }
      
      /// return field
      if (field_key in tmp_json) {
        return tmp_json[field_key];
      }
    }
    
    return null;
  }
  
  
  
  /*
   * Modify a JSON object for a field
   * to have only value, set to default
   */
  function getConfigFieldDefault(_field_key, _group_keys, _json) {
    
    var field_key = _field_key || null;
    var group_keys = _group_keys || null;
    
    /// default value for field
    var field = getField(field_key, group_keys, _json);
    var default_value = getFieldDefault(field_key, group_keys);
    
    /// remove unnecessary properties from field
    $.each(field, function(prop_key, val) {
      if (prop_key != 'fields') {
        delete field[prop_key];
      }
    });
    
    /// set sub fields
    if ('fields' in field) {
      var new_group_keys = group_keys.slice(0);
      new_group_keys.push(field_key);
      $.each(field['fields'], function(sub_field_key, val){
        getConfigFieldDefault(sub_field_key, new_group_keys, _json);
      });
    }
    
    /// add value to field
    if (default_value) {
      field['value'] = default_value;
    }
  }
  
  
  
  /*
   * Returns a JSON object
   * with field values set to default value
   * for intializing a JSON config field
   */
  function getConfigDefault(_json) {
    var tmp_json = $.extend(true, {}, _json);
        
    delete tmp_json['global'];
      
    /// each setting group
    $.each(tmp_json, function(group_key, val) {
      
      // remove unnecessary properties from field
      $.each(tmp_json[group_key], function(prop_key, val) {
        if (prop_key != 'fields') {
          delete tmp_json[group_key][prop_key];
        }
      });
    
      /// each field in setting group
      $.each(tmp_json[group_key]['fields'], function(field_key, val) {
        getConfigFieldDefault(field_key, [group_key], tmp_json);
      });
    });

    return tmp_json;
  }
  
  
  
  /*
   * Helper function to convert hex to rgb
   */
  window.hexToRgb = function(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
  }
  
  
  
})(jQuery);