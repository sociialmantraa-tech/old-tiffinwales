<?php
if (!defined('ABSPATH')) {
    exit;
}

class WPAI_API_Handler {
    public function __construct() {
        add_action('rest_api_init', [$this, 'register_endpoints']);
    }

    public function register_endpoints() {
        // Save Settings
        register_rest_route('wpai/v1', '/settings', [
            'methods'             => 'POST',
            'callback'            => [$this, 'handle_save_settings'],
            'permission_callback' => [$this, 'check_permissions'],
        ]);

        // Generate AI Frontend Code
        register_rest_route('wpai/v1', '/generate', [
            'methods'             => 'POST',
            'callback'            => [$this, 'handle_generate'],
            'permission_callback' => [$this, 'check_permissions'],
        ]);

        // Apply Code to Live Site
        register_rest_route('wpai/v1', '/apply', [
            'methods'             => 'POST',
            'callback'            => [$this, 'handle_apply'],
            'permission_callback' => [$this, 'check_permissions'],
        ]);

        // Get Revisions
        register_rest_route('wpai/v1', '/revisions', [
            'methods'             => 'GET',
            'callback'            => [$this, 'handle_get_revisions'],
            'permission_callback' => [$this, 'check_permissions'],
        ]);

        // Fetch Current Live Styles
        register_rest_route('wpai/v1', '/current-styles', [
            'methods'             => 'GET',
            'callback'            => [$this, 'handle_get_current_styles'],
            'permission_callback' => [$this, 'check_permissions'],
        ]);
    }

    public function check_permissions() {
        return current_user_can('manage_options');
    }

    public function handle_save_settings($request) {
        $api_key = sanitize_text_field($request->get_param('api_key'));
        $provider = sanitize_text_field($request->get_param('provider') ?: 'gemini');

        update_option('wpai_api_key', $api_key);
        update_option('wpai_ai_provider', $provider);

        return rest_ensure_response([
            'success' => true,
            'message' => __('Settings saved successfully.', 'wp-ai-copilot')
        ]);
    }

    public function handle_get_current_styles($request) {
        $target = sanitize_text_field($request->get_param('target') ?: 'global');

        if ($target === 'global') {
            $css = get_option('wpai_custom_css_global', '');
        } else {
            $css = get_post_meta(intval($target), '_wpai_custom_css', true) ?: '';
        }

        return rest_ensure_response([
            'success' => true,
            'css'     => $css
        ]);
    }

    public function handle_get_revisions() {
        return rest_ensure_response([
            'success'   => true,
            'revisions' => WPAI_Revisions::get_all()
        ]);
    }

    public function handle_generate($request) {
        $prompt = sanitize_textarea_field($request->get_param('prompt'));
        $target = sanitize_text_field($request->get_param('target') ?: 'global');
        $current_css = (string) $request->get_param('current_css');

        if (empty($prompt)) {
            return new WP_Error('empty_prompt', __('Prompt cannot be empty.', 'wp-ai-copilot'), ['status' => 400]);
        }

        $api_key = get_option('wpai_api_key', '');
        $provider = get_option('wpai_ai_provider', 'gemini');

        if (empty($api_key)) {
            return new WP_Error('missing_key', __('Please configure your AI API Key in the settings panel above.', 'wp-ai-copilot'), ['status' => 400]);
        }

        if ($provider === 'openai') {
            $result = $this->call_openai($api_key, $prompt, $target, $current_css);
        } else {
            $result = $this->call_gemini($api_key, $prompt, $target, $current_css);
        }

        if (is_wp_error($result)) {
            return $result;
        }

        return rest_ensure_response([
            'success'     => true,
            'css'         => $result['css'],
            'explanation' => $result['explanation']
        ]);
    }

    public function handle_apply($request) {
        $target = sanitize_text_field($request->get_param('target') ?: 'global');
        $css    = wp_strip_all_tags((string)$request->get_param('css'));
        $prompt = sanitize_text_field($request->get_param('prompt') ?: 'Manual / AI Edit');
        $provider = get_option('wpai_ai_provider', 'gemini');

        // Save rollback snapshot
        WPAI_Revisions::save_revision($target, $css, $prompt, $provider);

        if ($target === 'global') {
            update_option('wpai_custom_css_global', $css);
        } else {
            update_post_meta(intval($target), '_wpai_custom_css', $css);
        }

        return rest_ensure_response([
            'success'   => true,
            'message'   => __('Changes safely applied to your live website!', 'wp-ai-copilot'),
            'revisions' => WPAI_Revisions::get_all()
        ]);
    }

    /**
     * Gemini API Integration (Default & High Speed)
     */
    private function call_gemini($api_key, $prompt, $target, $current_css) {
        $endpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" . urlencode($api_key);

        $system_instruction = "You are a master WordPress Frontend Designer & CSS Expert. "
            . "Generate clean, modern, responsive, and robust CSS according to the user's instructions. "
            . "Return a valid JSON object matching this schema strictly: "
            . "{\"css\": \"/* Valid pure CSS rules only */\", \"explanation\": \"Short description of changes made\"}. "
            . "Do not wrap in markdown or backticks.";

        $user_content = "Target scope: " . $target . "\n"
            . "Existing CSS:\n" . ($current_css ?: '/* none */') . "\n\n"
            . "Design instructions:\n" . $prompt;

        $body = [
            'contents' => [
                [
                    'role' => 'user',
                    'parts' => [
                        ['text' => $system_instruction . "\n\n" . $user_content]
                    ]
                ]
            ],
            'generationConfig' => [
                'responseMimeType' => 'application/json',
                'temperature' => 0.4
            ]
        ];

        $response = wp_remote_post($endpoint, [
            'headers' => ['Content-Type' => 'application/json'],
            'body'    => json_encode($body),
            'timeout' => 45
        ]);

        if (is_wp_error($response)) {
            return $response;
        }

        $code = wp_remote_retrieve_response_code($response);
        $body_raw = wp_remote_retrieve_body($response);
        $data = json_decode($body_raw, true);

        if ($code !== 200) {
            $err_msg = $data['error']['message'] ?? __('Gemini API Error', 'wp-ai-copilot');
            return new WP_Error('gemini_error', $err_msg, ['status' => $code]);
        }

        $raw_text = $data['candidates'][0]['content']['parts'][0]['text'] ?? '';
        $parsed = json_decode($raw_text, true);

        if (!$parsed || !isset($parsed['css'])) {
            // Fallback if not pure JSON
            return [
                'css'         => trim(str_replace(['```css', '```json', '```'], '', $raw_text)),
                'explanation' => 'Custom AI styling applied.'
            ];
        }

        return [
            'css'         => trim($parsed['css']),
            'explanation' => $parsed['explanation'] ?? 'Updated styles successfully.'
        ];
    }

    /**
     * OpenAI API Integration
     */
    private function call_openai($api_key, $prompt, $target, $current_css) {
        $endpoint = 'https://api.openai.com/v1/chat/completions';

        $system_instruction = "You are a master WordPress Frontend Designer & CSS Expert. "
            . "Generate clean, modern, responsive, and robust CSS according to the user's instructions. "
            . "Return a JSON object: {\"css\": \"...\", \"explanation\": \"...\"}";

        $body = [
            'model' => 'gpt-4o-mini',
            'messages' => [
                ['role' => 'system', 'content' => $system_instruction],
                ['role' => 'user', 'content' => "Target: {$target}\nExisting CSS: {$current_css}\nRequest: {$prompt}"]
            ],
            'response_format' => ['type' => 'json_object'],
            'temperature' => 0.4
        ];

        $response = wp_remote_post($endpoint, [
            'headers' => [
                'Authorization' => 'Bearer ' . $api_key,
                'Content-Type'  => 'application/json'
            ],
            'body'    => json_encode($body),
            'timeout' => 45
        ]);

        if (is_wp_error($response)) {
            return $response;
        }

        $code = wp_remote_retrieve_response_code($response);
        $body_raw = wp_remote_retrieve_body($response);
        $data = json_decode($body_raw, true);

        if ($code !== 200) {
            $err_msg = $data['error']['message'] ?? __('OpenAI API Error', 'wp-ai-copilot');
            return new WP_Error('openai_error', $err_msg, ['status' => $code]);
        }

        $content = json_decode($data['choices'][0]['message']['content'] ?? '{}', true);

        return [
            'css'         => trim($content['css'] ?? ''),
            'explanation' => $content['explanation'] ?? 'Updated styles successfully.'
        ];
    }
}
