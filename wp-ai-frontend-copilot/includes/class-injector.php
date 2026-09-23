<?php
if (!defined('ABSPATH')) {
    exit;
}

class WPAI_Injector {
    public function __construct() {
        // Inject styles safely in wp_head with high priority
        add_action('wp_head', [$this, 'inject_styles'], 9999);
        // Inject JS safely in wp_footer wrapped in try/catch sandbox
        add_action('wp_footer', [$this, 'inject_scripts'], 9999);
    }

    public function inject_styles() {
        $global_css = get_option('wpai_custom_css_global', '');
        $page_css = '';

        if (is_singular()) {
            $page_id = get_queried_object_id();
            if ($page_id) {
                $page_css = get_post_meta($page_id, '_wpai_custom_css', true);
            }
        }

        $combined_css = trim($global_css . "\n" . $page_css);

        if (!empty($combined_css)) {
            // Strip any malicious script/html tags for safety
            $sanitized_css = wp_strip_all_tags($combined_css);
            echo "\n<!-- ========================================== -->\n";
            echo "<!-- [WP AI Frontend Copilot] Injected Styles   -->\n";
            echo "<!-- ========================================== -->\n";
            echo "<style id=\"wpai-copilot-custom-css\" type=\"text/css\">\n";
            echo $sanitized_css . "\n";
            echo "</style>\n";
        }
    }

    public function inject_scripts() {
        $global_js = get_option('wpai_custom_js_global', '');
        if (!empty($global_js)) {
            echo "\n<!-- ========================================== -->\n";
            echo "<!-- [WP AI Frontend Copilot] Injected Scripts  -->\n";
            echo "<!-- ========================================== -->\n";
            echo "<script id=\"wpai-copilot-custom-js\" type=\"text/javascript\">\n";
            echo "(function(){\n";
            echo "  try {\n";
            echo "    " . $global_js . "\n";
            echo "  } catch(e) {\n";
            echo "    console.warn('[WP AI Copilot] Safe error catch:', e);\n";
            echo "  }\n";
            echo "})();\n";
            echo "</script>\n";
        }
    }
}
