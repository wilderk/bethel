
(function ($) {

  var Navigation = new Nav($('.group__navigable > .node__nav'));
  var $nav = $('.group__navigable > .node__nav');
  var $nav_paragraphs = $nav.find('> .nav__paragraphs');
  var $nav_fields = $nav.find('> .nav__fields');
  var $nav_add = $nav.find('.nav__add');

  var $paragraphs = $('.group__navigable > .node__paragraphs');
  var $fields = $('.group__navigable > .node__fields');
  var $regions = getRegions();
  var $region_new = null;

  var class_active = 'p-open';
  var class_nav_active = 'nav-open';

  /// AJAX Event
  Drupal.behaviors.integralNav = {
    attach: function (context, settings) {
      /// Reset Navigation
      Navigation.empty();
      $nav_add.removeClass('icon-loading');

      /// Add Region Previews
      $regions = getRegions();
      $regions.each(function() {
        var $region = $(this);
        var $preview = new Preview($region);
        $preview.update();
        Navigation.add($preview);
      });

      /// Render and Enable Navigation
      Navigation.render();
      Navigation.enable();

      /// Scroll to Newly Added Paragraph
      setTimeout(function() {
        if ($region_new && $region_new.length) {
          Navigation.activate($region_new.closest('tr').data('id'));
          var $paragraph_new = $region_new.find('.field--widget-entity-reference-paragraphs').first().find('table').first().find('> tbody > tr').last();
          var scroll = $paragraphs.scrollTop() - $paragraphs.offset().top + $paragraph_new.offset().top - 12;
          $paragraphs.animate({scrollTop: scroll}, 500);
          $region_new = null;
        }
      }, 500);
    }
  };

  if($nav.length) {
    if($paragraphs.length) {

      /// Add Region Button
      $nav_add.click(function (e) {
        if (!$(this).hasClass('icon-loading')) {
          Navigation.activate('last');
          $nav_add.addClass('icon-loading');
          $paragraphs.find('.field--name-field-p-regions .form-item').first().find('> div > .paragraphs-dropbutton-wrapper input').mousedown();
        }
      });

      /// Add Paragraph Button
      // $paragraphs.on('click', '.p__add .btn.toggle', function() {
      //   var $this = $(this);
      //   if($this.hasClass('open')) {
      //     var scroll = $paragraphs.scrollTop() - 200;
      //     $paragraphs.animate({scrollTop: scroll}, 500);
      //   }
      // });

      /// Mark New Paragraphs
      $paragraphs.on('click', '.p__add .btn.add', function() {
        $region_new = $(this).closest('.paragraphs-subform');
      });

      /// Sticky Fields Preview
      $nav_fields.stick_in_parent();
    }

    /// Load Fields
    $nav_fields.find('.fields__preview').first().click();
  }

  $(window).load(function() {
    /// Load paragraphs if no normal fields
    if($fields.length && !$fields.find('.form-wrapper:not(.field--name-langcode)').length) {
      if(Navigation.getActive() == 'none') {
        $('.paragraph__preview').first().click();
      }
    }
  });

  /// Return All Top Level Regions
  function getRegions() {
    var $regions = $paragraphs.find('.field--name-field-p-regions table').first().find('> tbody > tr');
    $regions.addClass('p-region');
    return $regions;
  }

  ///////////////////////////////////
  /// Paragraph Navigation Object ///
  ///////////////////////////////////

  function Nav(_$nav) {
    var $nav = _$nav;
    var $nav_paragraphs = $nav.find('> .nav__paragraphs');
    var $previews = {};
    var active = 'none';

    /// Empty Navigation
    this.empty = function() {
      for (var key in $previews) {
        $previews[key].delete();
      }
      $previews = {};
    };

    /// Add Preview
    this.add = function(_$preview) {
      $previews[_$preview.id()] = _$preview;
    };

    /// Remove Preview
    this.remove = function(_id) {
      delete $previews[_id];
    };

    /// Set Active Preview
    this.activate = function(_id) {
      active = _id;
    };
    var activate = this.activate;

    /// Return Active Key
    this.getActive = function() {
      return active;
    };

    /// Enable Sorting
    this.enable = function() {
      $nav_paragraphs.sortable({
        axis: "y",
        handle: '.paragraph__drag',
        stop: function(evt, ui) {
          sort();
        }
      });
      $nav_paragraphs.disableSelection();
    };

    /// Apply Sort Order
    this.sort = function() {
      $nav_paragraphs.find('> .paragraph__region').each(function(index) {
        var $region = $paragraphs.find('tr[data-id="' + $(this).data('id') + '"]');
        var $weight = $region.find('> .delta-order').find('select');
        $weight.val(index);
      });
    };
    var sort = this.sort;

    /// Show Paragraphs
    this.enableParagraphs = function() {
      $fields.removeClass(class_nav_active);
      $nav_fields.removeClass(class_nav_active);
      $nav_fields.find('.' + class_active).removeClass(class_active);
      $paragraphs.addClass(class_nav_active);
      $nav_paragraphs.addClass(class_nav_active);
    };
    var enableParagraphs = this.enableParagraphs;

    /// Show Fields
    this.enableFields = function() {
      $paragraphs.removeClass(class_nav_active);
      $nav_paragraphs.removeClass(class_nav_active);

      for(var key in $previews) {
        $previews[key].disable();
      }

      $fields.addClass(class_nav_active);
      $nav_fields.addClass(class_nav_active);
    };
    var enableFields = this.enableFields;

    /// Render Navigation HTML
    this.render = function() {

      /// Add Previews
      for(var key in $previews) {
        if(active && !active.length) active = key;
        $nav_paragraphs.append($previews[key].html());
      }

      /// Enable Active Region
      if(active == 'first') {
        $nav_paragraphs.find('.paragraph__preview').first().click();
      }
      else if(active == 'last') {
        $nav_paragraphs.find('.paragraph__preview').last().click();
        $nav.animate({ scrollTop: $nav.prop("scrollHeight")}, 1000);
      }
      else if(active in $previews == false) {
        var tmp_active = active.replace('-subform', '');
        if(tmp_active in $previews) {
          $nav.find('[data-id="' + tmp_active + '"] .paragraph__preview').click();
        }
        else {
          tmp_active = active + '-subform';
          if(tmp_active in $previews) {
            $nav.find('[data-id="' + tmp_active + '"] .paragraph__preview').click();
          }
        }
      }
      else if(active in $previews) {
        $nav.find('[data-id="' + active + '"] .paragraph__preview').click();
      }
    };

    /// Watch for Region Activation
    $nav.on('click', '.paragraph__preview', function(e) {
      /// Switch to Paragraphs Content
      enableParagraphs();
      /// Enable Clicked Region
      var this_key = $(this).parent().data('id');
      for(var key in $previews) {
        $previews[key].disable();
      }
      $previews[this_key].enable();
      /// Scroll to Top of Region
      if(active != this_key) {
        $paragraphs.scrollTop(0);
      }
      /// Set Region as Active
      activate(this_key);
    });

    /// Watch for Fields Activation
    $nav.on('click', '.fields__preview', function(e) {
      enableFields();
      $(this).parent().addClass(class_active);
    });
  }


  ////////////////////////////////
  /// Paragraph Preview Object ///
  ////////////////////////////////

  function Preview(_$paragraph) {
    var $paragraph = _$paragraph;
    var $paragraph_menu = $paragraph.find('.p-menu').first();
    var $paragraph_title = $paragraph.find('.field--name-field-p-title input');
    var $paragraph_json = $paragraph.find('.paragraphs-subform').first().find('> .field--name-field-p-settings .field--name-field-p-setting-json textarea');
    var $paragraph_add = $paragraph.find('.dropbutton-wrapper').last().parent();

    var $preview = $('<div class="paragraph__region"><div class="paragraph__drag icon-drag"></div><div class="paragraph__preview"><div class="p__bg"><div class="p__overlay"></div></div><div class="p__inner"><div class="p__title"></div><div class="p__layout"></div></div></div></div>');
    var $preview_inner = $preview.find('.paragraph__preview');
    var $preview_bg = $preview_inner.find('.p__bg');
    var $preview_title = $preview_inner.find('> .p__inner > .p__title');
    var $preview_layout = $preview_inner.find('> .p__inner > .p__layout');

    var id = $paragraph.find('.paragraphs-subform').first().data('drupal-selector');
    var active = false;

    if(!id) {
      id = $paragraph.find('div[data-drupal-selector]').first().data('drupal-selector');
    }

    /// Display Settings
    var title = '';
    var title_display = '';
    var bg_type = 'none';
    var bg_color = 'transparent';
    var bg_opacity = 1;
    var bg_overlay_color = 'transparent';
    var bg_overlay_opacity = 1;
    var bg_img = 'none';
    var txt_color = 'auto';
    var layout_type = 'stack';

    $paragraph.attr('data-id', id);
    $preview.attr('data-id', id);
    $paragraph_add.addClass('region__add');

    /// Return Mapped ID
    this.id = function() {
      return id;
    };

    /// Disable Active State
    this.disable = function() {
      active = false;
      $preview.removeClass(class_active);
      $paragraph.removeClass(class_active);
    };

    /// Enable Active State
    this.enable = function() {
      active = true;
      $preview.addClass(class_active);
      $paragraph.addClass(class_active);
    };

    /// Return Active State
    this.active = function() {
      return active;
    };

    this.delete = function() {
      $preview.remove();
    };

    /// Return HTML for Preview
    this.html = function() {
      return $preview;
    };

    /// Update HTML for Preview
    this.update = function() {

      /// Retrieve Current Data
      fetch();

      /// Title
      $preview_title.text(title);

      /// Layout
      $preview_layout.text(layout_type);

      /// Background
      $preview_bg.css('background-color', bg_color);
      $preview_bg.css('opacity', bg_opacity);
      $preview_bg.find('.p__overlay').css('background-color', bg_overlay_color);
      $preview_bg.find('.p__overlay').css('opacity', bg_overlay_opacity);
      $preview_bg.css('background-image', 'url("' + bg_img + '")');

      /// Color
      $preview_inner.css('color', txt_color);
    };
    var update = this.update;

    this.fetch = function() {

      /// Title
      $preview_title.removeClass('no-title hidden-title');
      title = $paragraph_title.val();

      /// Paragraph Settings JSON
      if($paragraph_json.length && $paragraph_json.val().length) {
        var json = $.parseJSON($paragraph_json.val());

        title_display = json['text_with_title']['fields']['title_display']['value'];
        if (title_display == 'hide') {
          $preview_title.addClass('hidden-title');
        }
        if (!title.length) {
          title = 'No Title';
          $preview_title.addClass('no-title');
        }

        /// Background
        bg_color = 'transparent';
        bg_opacity = 1;
        bg_overlay_color = 'transparent';
        bg_overlay_opacity = 1;
        bg_img = 'none';

        bg_type = json['background']['fields']['type']['value'];

        if (bg_type == 'none') {
          bg_color = 'transparent';
        }
        else if (bg_type == 'solid' || bg_type == 'video') {
          bg_color = json['background']['fields'][bg_type]['fields']['color']['fields']['color']['hex'];
          bg_opacity = (parseInt(json['background']['fields'][bg_type]['fields']['opacity']['value'].replace('opacity_', '')) - 1) * .1;
        }
        else if (bg_type == 'image') {
          bg_color = json['background']['fields'][bg_type]['fields']['color']['fields']['color']['hex'];
          bg_overlay_color = json['background']['fields'][bg_type]['fields']['overlay']['fields']['color']['hex'];
          bg_overlay_opacity = (parseInt(json['background']['fields'][bg_type]['fields']['opacity']['value'].replace('opacity_', '')) - 1) * .1;
          bg_img = $paragraph.find('.paragraphs-subform').first().find('> .p-menu li[data-setting="background"] .p-pane[data-field="image"] .field--name-field-p-setting-bg-img img').attr('src');
        }

        /// Handle auto color
        if(bg_color == 'auto') bg_color = 'transparent';

        /// Color
        txt_color = json['text_with_title']['fields']['title_color']['fields']['color']['hex'];

        /// Layout
        layout_type = json['layout']['fields']['type']['value'];
      }
      /// Delete Paragraphs
      else if($paragraph.text().indexOf('Deleted') >= 0) {
        title = 'Deleted';
        layout_type = '';
        $preview.addClass('p-deleted');
      }
    };
    var fetch = this.fetch;

    /// Title Change
    $paragraph_title.change(function() {
      update();
    });

    /// Settings Change
    $paragraph_json.change(function() {
      update();
    });

    /// Settings Image Change
    $paragraph_menu.find('.field--type-image input').change(function() {
      update();
    });
  }

})(jQuery);