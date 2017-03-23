<?php
/**
 * @file
 * Contains \Drupal\gck_header\Plugin\Block\Copyright.
 */

namespace Drupal\oxbow_misc\Plugin\Block;
use Drupal\Core\Block\BlockBase;

/**
 * Provides a 'Copyright' block with automatic site name and date.
 *
 * @Block(
 *   id = "copyright",
 *   admin_label = @Translation("Oxbow Labs -- Copyright"),
 *   category = @Translation("Displays site copyright with name, current date, and Oxbow Labs link.")
 * )
 */

class Copyright extends BlockBase {
  /**
   * {@inheritdoc}
   */
  
  public function build() {
    
    /// Copyright output:
    /// Copyright © {year} {site_name}. {link}Crafted in Colorado{/link} by {link}Oxbow Labs{/link}
    
    $oxbow_link = '<a href="//oxbowlabs.com" target="_blank">';
    $date_year = date('Y');
    $site_name = \Drupal::config('system.site')->get('name');
    
    $output = 'Copyright © ' . $date_year . ' ' . $site_name . '. ';
    $output .= $oxbow_link . 'Crafted in Colorado</a> by ' . $oxbow_link . 'Oxbow Labs</a>';
    
    return array(
      '#type' => 'markup',
      '#markup' => $output,
      '#cache' => [
        'max-age' => 86400,
      ],
    );
  }
}