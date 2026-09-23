<?php
if (!defined('ABSPATH')) {
    exit;
}

class WPAI_Revisions {
    const OPTION_KEY = 'wpai_style_revisions';
    const MAX_REVISIONS = 25;

    public function __construct() {
        // Revision management initialization
    }

    public static function save_revision($target, $css, $prompt = '', $provider = '') {
        $revisions = self::get_all();

        $entry = [
            'id'        => 'rev_' . wp_generate_password(8, false),
            'timestamp' => current_time('mysql'),
            'target'    => sanitize_text_field($target),
            'css'       => $css,
            'prompt'    => sanitize_text_field($prompt),
            'provider'  => sanitize_text_field($provider)
        ];

        array_unshift($revisions, $entry);

        // Keep maximum allowed revisions
        if (count($revisions) > self::MAX_REVISIONS) {
            $revisions = array_slice($revisions, 0, self::MAX_REVISIONS);
        }

        update_option(self::OPTION_KEY, $revisions);
        return $entry;
    }

    public static function get_all() {
        $revisions = get_option(self::OPTION_KEY, []);
        return is_array($revisions) ? $revisions : [];
    }

    public static function clear_all() {
        return update_option(self::OPTION_KEY, []);
    }
}
