(function ($) {
	
/* Create a toggle object
 * Takes states as array, labels as array, active index number, and state width as number
 * Returns toggle as jQuery object
 */

function toggle(_states, _labels, _active, _width) {
  var toggle_states = '';
  var toggle_labels = '';
	
  for(i = 0; i < _states.length; i++) {
  	toggle_states += '<div class="toggle-state" data-state="' + _states[i] + '"></div>';
    toggle_labels += '<label class="toggle-label" data-state="' + _states[i] + '">' + _labels[i] + '</label>';
  }
  
  toggle_html = '<div class="toggle">';
  toggle_html += '<div class="toggle-states">' + toggle_states + '</div>';
  toggle_html += '<div class="toggle-labels">' + toggle_labels + '</div>';
  toggle_html += '<span class="toggle-active" data-active="' + _active + '"></span>';
  toggle_html += '<input class="toggle-value" type=hidden value="' + _states[_active] + '">';
  toggle_html += '</div>';
  
  $toggle = $(toggle_html);
  $toggle_states = $toggle.find('.toggle-state');
  $toggle_labels = $toggle.find('.toggle-label');
  $toggle_active = $toggle.find('.toggle-active');
  $toggle_val = $toggle.find('.toggle-value');
  
  $toggle_active.css('left', _width * _active);
  $toggle_active.data('active', _active);
  var state_val = $toggle_states.eq(_active).data('state');
  $toggle_labels.eq(_active).addClass('active');
  
  return $toggle;
}

$(document).ready(function() {
	$('body').delegate('.toggle', 'click', function(e) {
		var $this = $(this);
		$toggle_states = $this.find('.toggle-state');
		$toggle_labels = $this.find('.toggle-label');
		$toggle_active = $this.find('.toggle-active');
		$toggle_val = $this.find('.toggle-value');
		
		var state_num = $toggle_active.attr('data-active');
		state_num++;
		if(state_num > $toggle_states.length - 1) state_num = 0;
		$toggle_active.css('left', $toggle_states.first().width() * state_num);
		$toggle_active.attr('data-active', state_num);
		var state_val = $toggle_states.eq(state_num).data('state');
		$toggle_labels.removeClass('active');
		$toggle_labels.eq(state_num).addClass('active');
		$toggle_val.val(state_val).trigger('change');
	});
});

window.toggle = toggle;

})(jQuery);

//.toggle {
//  position: relative;
//  display: inline-block;
//  
//  .toggle-states {
//    display: inline-block;
//  }
//  
//  .toggle-state {
//    display: inline-block;
//    float: left;
//    width: 30px;
//    height: 30px;
//    background: thistle;
//    border: 1px solid dimgray;
//  }
//  
//  &:hover .toggle-labels {
//    display: inline-block;
//  }
//  .toggle-labels {
//    display: none;
//    position: absolute;
//    bottom: 100%;
//    left: 0;
//    right: 0;
//    background: black;
//    color: white;
//    
//    .toggle-label {
//      float: left;
//      display: inline-block;
//      vertical-align: center;
//      width: 30px;
//      height: 20px;
//      overflow: hidden;
//      white-space: nowrap;
//      color: rgba(255,255,255,.3);
//      
//      &.active {
//        color: white;
//      }
//    }
//  }
//  
//  .toggle-active {
//    box-sizing: border-box;
//    position: absolute;
//    width: 30px;
//    height: 30px;
//    border: 5px solid yellow;
//    left: 0;
//    top: 0;
//    border-radius: 50%;
//    transition: left .5s;
//  }
//}