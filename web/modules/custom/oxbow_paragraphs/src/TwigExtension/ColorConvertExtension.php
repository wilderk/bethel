<?php
/**
 * @file
 * Contains Drupal\oxbow_paragraphs\TwigExtension.
 */

namespace Drupal\oxbow_paragraphs\TwigExtension;

class ColorConvertExtension extends \Twig_Extension {

  public function getName() {
    return 'color_convert_extension';
  }
  
  public function getFilters() {
    return array(
      //'hexToRgb' => new Twig_Filter_Method($this, 'hexToRgb'),
      new \Twig_SimpleFilter('hexToRgb', array($this, 'hexToRgb')),
    );
  }
  
  public static function hexToRgb($hex, $returnAsArray = false) {

    $hex = str_replace("#", "", $hex);
    
    if(strlen($hex) == 3) {
      $r = hexdec(substr($hex,0,1).substr($hex,0,1));
      $g = hexdec(substr($hex,1,1).substr($hex,1,1));
      $b = hexdec(substr($hex,2,1).substr($hex,2,1));
    } else {
      $r = hexdec(substr($hex,0,2));
      $g = hexdec(substr($hex,2,2));
      $b = hexdec(substr($hex,4,2));
    }
    
    $rgb = array('r' => $r, 'g' => $g, 'b' => $b);

    return $returnAsArray ? $rgb : implode(",", $rgb);
  }
}