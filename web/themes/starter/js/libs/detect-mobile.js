/**
 * @file
 * A jQuery file to detect mobile and append appropriate classes to body tag
 *
 */

(function ($) { // jQuery <3 Drupal
$(document).ready(function() {
    
//Detect Mobile

var isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i) ? true : false;
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i) ? true : false;
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i) ? true : false;
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i) ? true : false;
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Windows());
    }
};
//Append body classes
if(isMobile.any()){
  var mobileClasses = 'mobile';
  mobileClasses += isMobile.Android() ? ' android' : ''; 
  mobileClasses += isMobile.BlackBerry() ? ' blackberry' : ''; 
  mobileClasses += isMobile.iOS() ? ' ios' : ''; 
  mobileClasses += isMobile.Windows() ? ' windows' : '';
  $('body').addClass(mobileClasses);
}
    
$(document).ready(function() {
}); // End Doc Ready
    
})(jQuery); // End jQuery <3 Drupal
