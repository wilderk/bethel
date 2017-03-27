(function ($) {

  var scrolling = false;

  $(document).foundation();

  $(document).ready(function() {
    
    /// scroll buttons
    $('.p__scroll').click(function() {
      var $paragraph = $(this).closest('.paragraph');
      var $menu = $('.sticky-menu');
      var menu_offset = 0;
      if ($menu.length) {
        menu_offset = $menu.outerHeight() + $menu.position().top;
      }
      $('html, body').animate({
        scrollTop: $paragraph.offset().top - menu_offset
      }, 1000);
    });
    
    /// video backgrounds
    $('.p__bg video.size-cover').cover();
    $('.p__bg video.size-contain').contain();
    
    /// videos
    $('.field--name-field-p-video').fitVids();
    
    /// slideshow regions
    $('.paragraph--type--region.layout-type-slides').each(function() {
      var $this = $(this);
      $this.find('.field--name-field-p-paragraphs').first().data('slick', $(this).data('slick')).slick();
      if(!$this.hasClass('height-auto')) {
        var $tmp_p = $this.find('.slick-slide > .paragraph--type--image');
        $tmp_p.each(function() {
          var $tmp_p_img = $(this);
          /// make room for caption
          if($tmp_p_img.find('figcaption').length) {
            $(window).load(function() {
              $tmp_p_img.find('figure .field--type-image').css('bottom', $tmp_p_img.find('figcaption').outerHeight());
            });
            $(window).resize(function() {
              $tmp_p_img.find('figure .field--type-image').css('bottom', $tmp_p_img.find('figcaption').outerHeight());
            });
          }
          /// fit image
          $tmp_p_img.find('img').contain();
          $(window).resize(function() {
            $tmp_p_img.find('img').contain();
          });
        });
      }
    });
    /// slideshow views
    $('.paragraph--type--view.layout-type-slides').each(function() {
      $(this).find('.field--name-field-p-view .view-content').first().data('slick', $(this).data('slick')).slick();
    });
    /// reveal slideshow
    $(window).load(function() {
      $('.layout-type-slides').addClass('loaded');
    });
    
    /// tabbed regions
    $('.layout-type-tabs').each(function() {
      var $p = $(this);
      var $p_tabs = $p.find('.field--name-field-p-paragraphs').first().find('> .field__item > .paragraph');
      $p_tabs.slice(1).addClass('tab-hidden');
      var sticky_anchor = $p.find('.p__content').first().attr('id');
      
      var tabs_html = '<div class="p__tabs"><div class="links">';
      var tabs_h_max = 0;
      
      $p_tabs.each(function(index) {
        var $tab = $(this);
        var tab_title = 'Tab ' + (index + 1);
        if ($tab.data('tag')) {
          tab_title = $tab.data('tag');
        }
        if (index == 0) {
          tabs_html += '<a data-tab="' + $tab.attr('id') + '" class="tab-active">' + tab_title + '</a>';
        }
        else {
          tabs_html += '<a data-tab="' + $tab.attr('id') + '">' + tab_title + '</a>';
        }
        
        if ($tab.outerHeight() > tabs_h_max) {
          tabs_h_max = $tab.outerHeight();
        }
      });
      
      tabs_html += '</div></div>';
      $(tabs_html).insertBefore($p.find('> .p__inner > .p__content'));
      
      if ($p.hasClass('layout-equalize')) {
        
        $p_tabs.css('min-height', tabs_h_max);
        
        $(window).resize(function() {
          var tabs_h_max = 0;
          $p_tabs.each(function() {
            $(this).css('min-height', '0');
            if ($(this).outerHeight() > tabs_h_max) {
              tabs_h_max = $(this).outerHeight();
            }
          });
          $p_tabs.css('min-height', tabs_h_max);
        });
      }

      var $sticky = null;
      if($p.hasClass('layout-tabs-align-left') || $p.hasClass('layout-tabs-align-right')) {
        var menu_h = 0;
        if ($('#header').length) {
          menu_h = $('#header').outerHeight();
          if(menu_h == 0 && $('#header-top').length) menu_h = $('#header-top').outerHeight();
        }
        if ($('#toolbar-bar').length) menu_h += $('#toolbar-bar').outerHeight();
        if ($('#toolbar-item-administration-tray.is-active[class*="horizontal"]').length) menu_h += $('#toolbar-item-administration-tray').outerHeight();
        $sticky = $p.find('> .p__inner > .p__tabs .links');
        $sticky.stick_in_parent({offset_top: menu_h});
      }

      var $tab_menu = $p.find('> .p__inner > .p__tabs a[data-tab]');
      
      $tab_menu.click(function() {
        if (!$(this).hasClass('tab-active')) {
          var $tab = $('#' + $(this).data('tab'));
          $p_tabs.addClass('tab-hidden');
          $tab.removeClass('tab-hidden');
          $tab_menu.removeClass('tab-active');
          $(this).addClass('tab-active');

          if($sticky) {
            $sticky.trigger("sticky_kit:recalc");
          }
        }
      });
    });

    /// accordion regions
    $('.layout-type-accordion').each(function() {
      var $p = $(this);
      var $accordions = $p.find('.layout-accordion').first().find('> .layout-item-accordion');
      var collapse = $p.hasClass('layout-accordion-collapse');

      $accordions.find('> .paragraph > .p__inner > .p__accordion').click(function(e) {
        var $accordion = $(this).closest('.layout-item-accordion');
        var open = $accordion.hasClass('open');
        if(collapse) {
          $accordions.removeClass('open');
          if(!open) $accordion.addClass('open');
        }
        else {
          $accordion.toggleClass('open');
        }
      });
    });
    
  });

})(jQuery);