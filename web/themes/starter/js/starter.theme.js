
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
    
    if($menu.length) {
      $menu.append($menu_mobile_button);
      $menu.watchMenu({ mobileMenu: $menu_mobile });
      $menu_mobile_button.click(function() {
        $menu_mobile_button.toggleMenu();
        $menu_mobile.toggleMenu();
      });
      /// Child Menu Items
      $menu.find('.menu-item--expanded > a').click(function(e) {
        e.preventDefault();
        $(this).parent().toggleClass('open');
      });
      $menu.find('li').click(function(e) {
        e.stopPropagation();
      });

      /// Close Menus
      $('body').click(function() {
        $menu.closeMenu();
      });
    }
    
  });
  
})(jQuery);