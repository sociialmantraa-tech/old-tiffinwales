<?php
/**
 * Plugin Name: WP AI Frontend Copilot
 * Plugin URI:  https://github.com/wp-ai-copilot
 * Description: Zero-crash AI Assistant inside WordPress Admin to safely edit frontend design, CSS, and interactive elements with live preview & 1-click rollback.
 * Version:     1.0.0
 * Author:      WP AI Studio
 * Author URI:  https://wordpress.org
 * License:     GPL-2.0+
 * Text Domain: wp-ai-copilot
 */

if (!defined('ABSPATH')) {
    exit;
}

define('WPAI_VERSION', '1.0.0');
define('WPAI_PATH', plugin_dir_path(__FILE__));
define('WPAI_URL', plugin_dir_url(__FILE__));

// Load includes
require_once WPAI_PATH . 'includes/class-revisions.php';
require_once WPAI_PATH . 'includes/class-injector.php';
require_once WPAI_PATH . 'includes/class-api-handler.php';

class WPAI_Copilot {
    private static $instance = null;

    public static function instance() {
        if (is_null(self::$instance)) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        add_action('admin_menu', [$this, 'register_admin_menu']);
        add_action('admin_enqueue_scripts', [$this, 'enqueue_admin_assets']);
        add_filter('plugin_action_links_' . plugin_basename(__FILE__), [$this, 'add_settings_link']);

        // Initialize sub-modules
        new WPAI_Revisions();
        new WPAI_Injector();
        new WPAI_API_Handler();
    }

    public function add_settings_link($links) {
        $settings_link = '<a href="' . admin_url('admin.php?page=wp-ai-copilot') . '">' . __('Open Copilot', 'wp-ai-copilot') . '</a>';
        array_unshift($links, $settings_link);
        return $links;
    }

    public function register_admin_menu() {
        add_menu_page(
            __('AI Frontend Copilot', 'wp-ai-copilot'),
            __('AI Copilot', 'wp-ai-copilot'),
            'manage_options',
            'wp-ai-copilot',
            [$this, 'render_admin_view'],
            'dashicons-superhero-alt',
            58
        );
    }

    public function enqueue_admin_assets($hook) {
        if ($hook !== 'toplevel_page_wp-ai-copilot') {
            return;
        }

        wp_enqueue_style('wpai-admin-styles', WPAI_URL . 'assets/admin.css', [], WPAI_VERSION);
        wp_enqueue_script('wpai-admin-script', WPAI_URL . 'assets/admin.js', ['jquery'], WPAI_VERSION, true);

        wp_localize_script('wpai-admin-script', 'WPAI_SETTINGS', [
            'rest_url'   => esc_url_raw(rest_url('wpai/v1/')),
            'nonce'      => wp_create_nonce('wp_rest'),
            'site_url'   => get_site_url(),
            'current_key'=> get_option('wpai_api_key', ''),
            'provider'   => get_option('wpai_ai_provider', 'gemini')
        ]);
    }

    public function render_admin_view() {
        include_once WPAI_PATH . 'views/admin-page.php';
    }
}

add_action('plugins_loaded', ['WPAI_Copilot', 'instance']);
