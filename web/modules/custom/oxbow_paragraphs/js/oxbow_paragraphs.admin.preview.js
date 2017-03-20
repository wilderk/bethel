/**
 * @file
 * JS/jQuery
 */
 
(function ($) {
  
  
  
  /*
   * Creates image preview
   * pulls in size, background and overlay fields
   */
  window.setImagePreview = function(_$field, _$image) {
    
    ///// image to add
    //var $image = _$image.find('img');
    //
    ///// reset action buttons
    //_$field.find('.button').removeClass('p-hide');
    //
    //if ($image.length) {
    //  
    //  var $parent = _$field.closest('.p-pane');
    //  var $size = $parent.find('> [data-field="size"]');
    //  var $bg_color = $parent.find('> [data-field="color"]');
    //  var $overlay_color = $parent.find('> [data-field="overlay_color"]');
    //  var $overlay_opacity = $parent.find('> [data-field="overlay_opacity"]');
    //  
    //  var source = $image.attr('src').replace('styles/media_thumbnail/public/', '');
    //  var json = _$field.getConfigJSON();
    //  
    //  var size = getFieldValue($size.valJSON(), $size.getKey(), $size.getGroupKeys());
    //  var bg_color = getFieldValue($bg_color.valJSON(), $bg_color.getKey(), $bg_color.getGroupKeys());
    //  var overlay_color = getFieldValue($overlay_color.valJSON(), $overlay_color.getKey(), $overlay_color.getGroupKeys());
    //  var overlay_opacity = getFieldValue($overlay_opacity.valJSON(), $overlay_opacity.getKey(), $overlay_opacity.getGroupKeys());
    //  
    //  if (bg_color && bg_color != 'auto') {
    //    bg_color = hexToRgb(bg_color);
    //    bg_color = 'rgba(' + bg_color.r + ',' + bg_color.g + ',' + bg_color.b + ',1)';
    //  }
    //  else {
    //    bg_color = 'transparent';
    //  }
    //  
    //  if (overlay_color && overlay_color != 'auto') {
    //    overlay_color = hexToRgb(overlay_color);
    //    var opacity = overlay_opacity ? (overlay_opacity/100) : 1;
    //    overlay_color = 'rgba(' + overlay_color.r + ',' + overlay_color.g + ',' + overlay_color.b + ',' + opacity + ')';
    //  }
    //  else {
    //    overlay_color = 'transparent';
    //  }
    //  
    //  if (!_$field.find('.p-image').length) {
    //    _$field.prepend('<div class="p-image"><div class="p-overlay"></div></div>');
    //  }
    //  
    //  var $preview = _$field.find('.p-image');
    //  $preview.css('background-color', bg_color);
    //  $preview.find('.p-overlay').css('background-color', overlay_color);
    //  $preview.css('background-image', 'url("' + source + '")');
    //  $preview.removeClass('fit-cover fit-contain fit-repeat');
    //  $preview.addClass('fit-' + size);
    //  
    //  /// hide image add button
    //  _$field.find('.button [data-value="add"]').parent().addClass('p-hide');
    //}
    //else {
    //  /// remove old image
    //  _$field.find('.p-image').remove();
    //  /// hide image edit and remove buttons
    //  _$field.find('.button [data-value="edit"]').parent().addClass('p-hide');
    //  _$field.find('.button [data-value="remove"]').parent().addClass('p-hide');
    //}
  };
  
  
  
  /*
   * Creates link preview
   */
  window.setLinkPreview = function(_$field, _$link) {
    
    //var $link = _$link.find('input[type="text"]');
    //
    // _$field.find('.button').removeClass('p-hide');
    // _$field.find('.p-link').remove();
    //
    //if ($link.length && $link.val().length) {
    //  _$field.find('[data-value="add"]').addClass('p-hide');
    //  _$field.find('.actions').prepend('<div class="p-link"><input type="text"></div>');
    //  _$field.find('.p-link input').val($link.val()).click(function(e) {
    //    e.stopPropagation();
    //  });
    //}
    //else {
    //  _$field.find('[data-value="edit"]').parent().addClass('p-hide');
    //}
  };
  
  
  
  /*
   * Sets popup preview
   */
  window.setPopupPreview = function(_$field) {
    var settings_count = _$field.find('> .popup > .p-setting');

    /// Color Popup
    if (settings_count.length == 1 && _$field.find('.p-colors')) {
      _$field.find('> .popup-preview').html(_$field.find('.p-colors .active').parent().html());
      closePopups();
    }
    
    /// Layout Popup
    if (_$field.data('field') == 'layout') {
      _$field.find('> .popup-preview').html(_$field.find('.p-pane.active .active').parent().html());
      closePopups();
    }
    
  };
  
  
  
})(jQuery);