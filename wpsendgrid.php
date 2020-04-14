<?php
/*
Plugin Name: WooCart SendGrid Integration
Description: Transactional email integration for WooCart.
Version: 1.0.0
Author: SendGrid && WooCart
Author URI: http://woocart.com
Text Domain: sendgrid-email-delivery-simplified
License: GPLv2
*/

// SendGrid configurations
define( 'SENDGRID_CATEGORY', 'wp_sendgrid_plugin' );
define( 'SENDGRID_PLUGIN_SETTINGS', 'settings_page_sendgrid-settings' );
define( 'SENDGRID_PLUGIN_STATISTICS', 'dashboard_page_sendgrid-statistics' );

if ( version_compare( phpversion(), '5.4.0', '<' ) ) {
  add_action( 'admin_notices', 'php_version_error' );

  /**
  * Display the notice if PHP version is lower than plugin need
  *
  * return void
  */
  function php_version_error()
  {
    echo '<div class="error"><p>' . __('SendGrid: Plugin requires PHP >= 5.4.0.') . '</p></div>';
  }

  return;
}

if ( function_exists('wp_mail') )
{
  /**
   * wp_mail has been declared by another process or plugin, so you won't be able to use SENDGRID until the problem is solved.
   */
  add_action( 'admin_notices', 'wp_mail_already_declared_notice' );

  /**
  * Display the notice that wp_mail function was declared by another plugin
  *
  * return void
  */
  function wp_mail_already_declared_notice()
  {
    echo '<div class="error"><p>' . __( 'SendGrid: wp_mail has been declared by another process or plugin, so you won\'t be able to use SendGrid until the conflict is solved.' ) . '</p></div>';
  }

  return;
}

// Load plugin files
require_once plugin_dir_path( __FILE__ ) . 'lib/class-sendgrid-tools.php';
require_once plugin_dir_path( __FILE__ ) . 'lib/class-sendgrid-settings.php';
require_once plugin_dir_path( __FILE__ ) . 'lib/class-sendgrid-mc-optin.php';
require_once plugin_dir_path( __FILE__ ) . 'lib/class-sendgrid-statistics.php';
require_once plugin_dir_path( __FILE__ ) . 'lib/sendgrid/sendgrid-wp-mail.php';
require_once plugin_dir_path( __FILE__ ) . 'lib/class-sendgrid-virtual-pages.php';


// Initialize SendGrid Settings
new Sendgrid_Settings( plugin_basename( __FILE__ ) );

// Initialize SendGrid Statistics
new Sendgrid_Statistics();
