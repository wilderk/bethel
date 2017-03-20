/**
 * @file
 * A jQuery file to turn any menu into a dropdown menu.
 *
 */

(function ($) { // jQuery <3 Drupal
$(document).ready(function() {
             
// 
// Dropdown menu to replace sidebar for mobile devices
//
  
// Element from which dropdown will be created  
createDropDownNav($("#changeme"));

function createDropDownNav(menu) {
 // Get the window's width, and check whether it is narrower than 480 pixels

    /* Clone our navigation */
    var mainNavigation = menu.clone();

    /* Replace unordered list with a "select" element to be populated with options, and create a variable to select our new empty option menu */
    $('#content').prepend('<select class="menu" id="navigation-dropdown"></select>');
    var selectMenu = $('select.menu');

    $(selectMenu).append('<option value="" selected="selected">Go To...</option>');
    $(selectMenu).append('<option value="/">Home</option>');

    /* Navigate our nav clone for information needed to populate options */
    $(mainNavigation).children('ul').children('li').each(function() {

       /* Get top-level link and text */
       var href = $(this).children('a').attr('href');
       var text = $(this).children('a').text();

       /* Append this option to our "select" */
       $(selectMenu).append('<option value="'+href+'">'+text+'</option>');

       /* Check for "children" and navigate for more options if they exist */
       if ($(this).children('ul').length > 0) {
          $(this).children('ul').children('li').each(function() {

             /* Get child-level link and text */
             var href2 = $(this).children('a').attr('href');
             var text2 = $(this).children('a').text();

             /* Append this option to our "select" */
             $(selectMenu).append('<option value="'+href2+'">--- '+text2+'</option>');
          });
       }
    });
 //}

 /* When our select menu is changed, change the window location to match the value of the selected option. */
 $(selectMenu).change(function() {
    location = this.options[this.selectedIndex].value;
 });
}

}); // End Doc Ready
})(jQuery); // End jQuery <3 Drupal
