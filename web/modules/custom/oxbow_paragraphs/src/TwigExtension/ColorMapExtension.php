<?php
/**
 * @file
 * Contains Drupal\oxbow_paragraphs\TwigExtension.
 */

namespace Drupal\oxbow_paragraphs\TwigExtension;

class ColorMapExtension extends \Twig_Extension {

  public function getName() {
    return 'color_map_extension';
  }
  
  public function getFilters() {
    return array(
      new \Twig_SimpleFilter('colorMap', array($this, 'colorMap')),
    );
  }
  
  public static function colorMap($val, $file) {
    
    $color = 'none';
    $key = '_default';
      
    $obj = json_decode(file_get_contents($file), true);
    
    if(isset($obj[$val[0]]))
      $key = $val[0];
      
    if(isset($obj[$key][$val[1]]))
      $color = $obj[$key][$val[1]];
    
    return $color;
  }
}