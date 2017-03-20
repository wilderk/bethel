(function ($) {
  
  var debug = true;
  
  var path_module = '';
  var path_theme = '';
  
  window.configJSON = null;
  window.configDefaultJSON = null;
  window.menuJSON = null;
  var configCustomJSON = null;
  
  var target_paragraph = '.paragraphs-subform';
  
  
  
  /*
   * Toggle Settings field visibility with [`]
   */
  $('body').on('keypress', function(e) {
    if (e.keyCode == 96) {
      $('.field--name-field-p-settings').toggleClass('p-show');
    }
  });
  
  
  
  /*
   * Show paragraphs on load
   */
  $(window).load(function() {
    /// Reveal Paragraphs
    $('.field--name-field-p-regions').addClass('p-loaded');
  });
  
  
  /*
   * Drupal AJAX function
   * Make Oxbow Paragraphs!
   */
  Drupal.behaviors.myBehavior = {
    attach: function (context, settings) {

      if(!$('.field--widget-entity-reference-paragraphs').length) return;

      path_module = settings.oxbow_paragraphs.path_module;
      path_theme = settings.oxbow_paragraphs.path_theme;
      
      /// Load JSON config
      if (!configJSON) {
        getConfigJSON();
      }
      else {
        makeParagraphs();
      }

      log('Run Oxbow Paragraphs Admin.');

      makeEditor();
      makeSwap();
      makeAdd();
    }
  };
  
  
  
  /*
   * Build all paragraphs
   */
  function makeParagraphs() {

    /// Get all paragraphs
    var $paragraphs = $(target_paragraph);
    
    /// Build each paragraph
    $paragraphs.each(function() {
      var $paragraph = $(this);
      $paragraph.makeMenu();
    });
    
    
    /// deleted paragraphs
    var $paragraphs_deleted = $('.paragraph-type-title');
    $paragraphs_deleted.each(function() {
      var $p_delete = $(this);
      if($p_delete.text().indexOf('Deleted') >= 0) {
        $p_delete.text($p_delete.text().replace('Paragraph', 'Content'));
        $p_delete.closest('tr').addClass('p-deleted');
        if(!$p_delete.parent().find('.p-restore').length) {
          var $restore = $('<div class="p-restore btn">Restore</div>');
          $p_delete.parent().append($restore);
          $restore.click(function () {
            var $this = $(this);
            $this.parent().find('input[value="Restore"]').mousedown();
            $this.addClass('icon-loading');
          });
        }
      }
    });
    
    var $paragraphs_add = $('input[class*="field-add-more"]');
    if ($paragraphs_add.length) {
      $paragraphs_add.closest('.dropbutton-wrapper').parent().addClass('p-add');
    }
  }
  
  
  
  /*
   * Modify ckeditor
   */
  function makeEditor() {
    if(typeof(CKEDITOR) !== 'undefined') {
      /// caption fields
      CKEDITOR.on('instanceReady', function(){
        $('.field--name-field-p-caption .cke_contents').css('height','80px');
      });
    }
  }
  


  /*
   * Build paragraph add button
   */
  function makeAdd() {
    /// Get all paragraphs
    var $paragraphs = $(target_paragraph);

    /// Build each button
    $paragraphs.each(function() {
      var $paragraph = $(this);
      var $paragraph_add = $paragraph.find('.field--widget-entity-reference-paragraphs input[class*="field-add-more"]').last().closest('.dropbutton-wrapper').parent();

      if($paragraph_add.length && !$paragraph_add.find('.p__add').length) {
        var $types = $paragraph_add.find('input[class*="field-add-more"]');

        var $add_menu = $('<div class="add__menu"></div>');
        var type_html_base = '<div class="btn add add__[type]" data-id="[id]">[text]</div>';

        $types.each(function () {
          var $type = $(this);
          var type_html = type_html_base;
          var type = $type.val().replace('Add ', '');
          type_html = type_html.replace('[type]', type.toLowerCase());
          type_html = type_html.replace('[id]', $type.data('drupal-selector'));
          type_html = type_html.replace('[text]', type);

          $add_menu.append($(type_html));
        });

        var $add = $('<div class="p__add"><div class="add__bg"></div><div class="btn toggle icon-add"></div></div>');
        $add.append($add_menu);

        $add.find('.btn.toggle').click(function(e) {
          e.stopPropagation();
          var $this = $(this);
          $this.parent().removeClass('open-bottom');
          if ($this.hasClass('open')) {
            $('.btn.toggle').removeClass('open');
          }
          else {
            $('.btn.toggle').removeClass('open');
            $this.addClass('open');
            $this.closest('tr').addClass('p-active');
            /// open below button when no room
            var add_h = $this.parent().find('.add__menu').height();
            var offset = $this.offset().top - $this.closest('.field--name-field-p-regions').offset().top;
            if(offset < add_h) $this.parent().addClass('open-bottom');
          }
        });

        $add_menu.find('.btn.add').click(function () {
          var $this = $(this);
          $types.each(function () {
            var $type = $(this);
            if ($type.data('drupal-selector') == $this.data('id')) {
              $type.mousedown();
              $add.find('.btn.toggle').addClass('icon-loading').removeClass('open');
              return false;
            }
          });
        });

        $paragraph_add.append($add);
      }
    });

  }


  /*
   * Build all swap buttons
   */
  function makeSwap() {
    
    /// Get all paragraphs
    var $paragraphs = $(target_paragraph);
    
    /// Build each button
    $paragraphs.each(function() {
      
      var $paragraph = $(this);
      
      if(!$paragraph.closest('tr').find('> .p-swap').length) {
        
        var $row = $paragraph.closest('tr');
        var $swap = $('<td class="p-swap"><a class="icon--swap"></a></td>');
        $row.append($swap);
        
        $swap.find('a').click(function(){
          
          /// row to swap with ( below )
          var $row_next = $row.next();
    
          if ($row_next.length) {
            
            /// detach wysiwyg editor instances
            $row.find('.field--widget-text-textarea .text-format-wrapper').each(function() {
              var $wrapper = $(this);
              var $textarea = $wrapper.find('textarea').get(-1);
              var format = $wrapper.find('.filter-wrapper select').length ? $wrapper.find('.filter-wrapper select').val() : $wrapper.find('.filter-wrapper input').val();
              var $format = drupalSettings.editor.formats[format];
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
              var format = $wrapper.find('.filter-wrapper select').length ? $wrapper.find('.filter-wrapper select').val() : $wrapper.find('.filter-wrapper input').val();
              var $format = drupalSettings.editor.formats[format];
              Drupal.editorAttach($textarea, $format);
            });
          }
          
        });
        
      }
      
    });
    
  }
  
  
  
  /*
   * Obtain config JSON
   * Applies custom overrides
   * Builds setting menus
   */
  function getConfigJSON() {

    configJSON = new Object();

    var path_config = '/' + path_module + '/js/config/';

    var get_config = $.getJSON(path_config + 'oxbow_paragraphs.config.json')
      .done(function(data) { $.each(data[0], function(key, val) { configJSON[key] = val; }); });

    var get_config_text = $.getJSON(path_config + 'oxbow_paragraphs.config.text.json')
      .done(function(data) { $.each(data[0], function(key, val) { configJSON[key] = val; }); });

    var get_config_background = $.getJSON(path_config + 'oxbow_paragraphs.config.background.json')
      .done(function(data) { $.each(data[0], function(key, val) { configJSON[key] = val; }); });

    var get_config_size = $.getJSON(path_config + 'oxbow_paragraphs.config.size.json')
      .done(function(data) { $.each(data[0], function(key, val) { configJSON[key] = val; }); });

    var get_config_layout = $.getJSON(path_config + 'oxbow_paragraphs.config.layout.json')
      .done(function(data) { $.each(data[0], function(key, val) { configJSON[key] = val; }); });

    var get_config_menu = $.getJSON(path_config + 'oxbow_paragraphs.config.menu.json')
      .done(function(data) { $.each(data[0], function(key, val) { configJSON[key] = val; }); });

    var get_config_extras = $.getJSON(path_config + 'oxbow_paragraphs.config.extras.json')
      .done(function(data) { $.each(data[0], function(key, val) { configJSON[key] = val; }); });

    var get_config_custom = $.getJSON('/' + path_theme + '/js/oxbow_paragraphs.config.json')
      .done(function(data){
        configCustomJSON = data[0];
      });

    $.when(get_config,
      get_config_text,
      get_config_background,
      get_config_size,
      get_config_layout,
      get_config_menu,
      get_config_extras,
      get_config_custom)
      .always(function() {

        /// Check for config data
        if (configJSON) {

          /// Check for custom config data
          if (configCustomJSON) {
            addJSON(configJSON, configCustomJSON);
          }
          else {
            log('Unable to load custom config file.');
          }

          makeParagraphs();
        }
        else {
          log('Unable to load config file.', 'ERROR');
        }

      });
    
  }
  
  
  
  /*
   * Adds custom JSON
   * Overrides existing JSON
   */
  function addJSON(_json, _json_add) {
    
    $.each(_json_add, function(group_key, group) {
      
      /// New group, add to JSON
      if (!group_key in _json) {
        _json[group_key] = group;
        return;
      }
      
      $.each(_json_add[group_key], function(key, val) {
        
        /// Recursively add nested JSON
        if ($.type(val) == 'object') {
          addNestedJSON(_json[group_key][key], _json_add[group_key][key]);
        }
        /// Add JSON value
        else {
          _json[group_key][key] = val;
        }
        
      });

    });
    
  }
  
  
  
  /*
   * Replace nested JSON
   */
  function addNestedJSON(_json, _json_add) {
    
    /// Items in group
    $.each(_json_add, function(key, val) {
      if (key != 'values' && $.type(val) == 'object') {
        addNestedJSON(_json[key], _json_add[key]);
      }
      else {
        _json[key] = val;
      }
    });
    
  }
  
  
  
  /*
   * Prints a formatted message to console log
   * Disable by setting run_debug to false
   */
  window.log = function(_msg, _status) {
    _status = _status || '\t';
    if (debug) {
      var log_string = '[Oxbow Paragraphs]\t';
      log_string += _status + '\t';
      log_string += _msg;
      
      console.log(log_string);
      
      if ($.type(_msg) == 'object') {
        console.log(_msg);
      }
    }
  }
  
})(jQuery);