
(function ($) {  
  
  $(document).ready(function() {

    /// fix labels valid display, for not required fields
    $('.form-type-textfield, .form-type-password, .form-type-email, .form-type-number').find('input').each(function(){
      if ($.trim($(this).val()) == '') {
        $(this).addClass('is-empty');
      }
      $(this).change(function() {
        if ($.trim($(this).val()) == '') {
          $(this).addClass('is-empty');
        }
        else {
          $(this).removeClass('is-empty');
        }
      })
    });
    
    /// menus
    var $menu = $('#block-starter-main-menu');
    var $menu_mobile = $('#block-mainnavigation');
    var $menu_mobile_button = $('<div class="mobile-menu-button">☰</div>');
    
    if($menu.length && $menu_mobile.length) {
      /// Desktop Menu
      $menu.append($menu_mobile_button);
      /// Desktop - Open child menu items
      $menu.find('.menu-item--expanded > a').click(function(e) {
        var $parent = $(this).parent();
        e.preventDefault();
        if($parent.hasClass('open')) {
          $menu.closeMenu();
        }
        else {
          $menu.closeMenu();
          $(this).parent().addClass('open');
        }
      });
      $menu.find('li').click(function(e) {
        e.stopPropagation();
      });

      /// Mobile Menu
      $menu.watchMenu({ mobileMenu: $menu_mobile });
      /// Open mobile menu
      $menu_mobile_button.click(function(e) {
        e.stopPropagation();
        $menu_mobile_button.toggleMenu();
        $menu_mobile.toggleMenu();
      });
      /// Mobile - Open child menu items
      $menu_mobile.find('.menu-item--expanded > a').click(function(e) {
        var $parent = $(this).parent();
        e.preventDefault();
        $parent.addClass('open');
        $menu_mobile.scrollTop(0);
        $menu_mobile.find('ul').scrollTop(0);
        $menu_mobile.find('.closing').removeClass('closing');
        $menu_mobile.addClass('open-1');
      });
      $menu_mobile.find('li').click(function(e) {
        e.stopPropagation();
      });
      /// Mobile - Add back buttons
      $menu_mobile.find('.menu-item--expanded > ul').each(function() {
        $(this).prepend($('<li class="menu-item back"><a>Back</a></li>'));
      });
      /// Mobile - Back button click
      $menu_mobile.find('.menu-item.back').click(function() {
        $menu_mobile.scrollTop(0);
        $menu_mobile.find('ul').scrollTop(0);
        $menu_mobile.find('.open').removeClass('open').addClass('closing');
        $menu_mobile.removeClass('open-1');
      });

      /// Close Menus
      $('body').click(function() {
        $menu.closeMenu();
      });
    }
    
  });
  
})(jQuery);