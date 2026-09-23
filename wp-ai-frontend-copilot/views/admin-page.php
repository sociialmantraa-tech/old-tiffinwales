<?php
if (!defined('ABSPATH')) {
    exit;
}
?>
<div class="wrap wpai-wrap">
    <!-- Top Bar -->
    <header class="wpai-header">
        <div class="wpai-logo-title">
            <span class="wpai-icon">✨</span>
            <div>
                <h1>WP AI Frontend Copilot</h1>
                <p class="wpai-tagline">Safe, zero-crash AI frontend styling & live updates</p>
            </div>
        </div>

        <div class="wpai-settings-bar">
            <select id="wpai-provider-select" class="wpai-input-select">
                <option value="gemini" <?php selected(get_option('wpai_ai_provider', 'gemini'), 'gemini'); ?>>Google Gemini (Fast & Free Tier)</option>
                <option value="openai" <?php selected(get_option('wpai_ai_provider', 'gemini'), 'openai'); ?>>OpenAI (GPT-4o-mini)</option>
            </select>
            <input type="password" id="wpai-api-key-input" class="wpai-input-text" placeholder="Paste your API Key..." value="<?php echo esc_attr(get_option('wpai_api_key', '')); ?>" />
            <button type="button" class="button button-primary" id="wpai-save-settings-btn">Save Key</button>
        </div>
    </header>

    <!-- Main Workspace Grid -->
    <div class="wpai-grid">
        <!-- Control Panel -->
        <div class="wpai-sidebar">
            <div class="wpai-card">
                <label for="wpai-page-target"><strong>1. Select Target Scope</strong></label>
                <select id="wpai-page-target" class="wpai-select-full">
                    <option value="global">🌐 Entire Website (Global Styles)</option>
                    <optgroup label="Pages">
                        <?php
                        $pages = get_pages(['number' => 100]);
                        foreach ($pages as $p) {
                            echo '<option value="' . esc_attr($p->ID) . '">📄 ' . esc_html($p->post_title) . '</option>';
                        }
                        ?>
                    </optgroup>
                </select>
            </div>

            <div class="wpai-card">
                <label for="wpai-prompt-input"><strong>2. What would you like to design or change?</strong></label>
                <textarea id="wpai-prompt-input" rows="4" class="wpai-textarea" placeholder="E.g., Make hero title bold with an orange gradient, add soft shadows to product cards, make navigation bar sticky with glassmorphism blur..."></textarea>
                
                <div class="wpai-quick-prompts">
                    <span class="wpai-chip" data-prompt="Add modern glassmorphism effect to header and navbar">✨ Glassmorphism Nav</span>
                    <span class="wpai-chip" data-prompt="Add hover zoom and smooth shadow animation to all cards/boxes">✨ Card Hover FX</span>
                    <span class="wpai-chip" data-prompt="Make typography cleaner with Inter font and improved line-height">✨ Crisp Typography</span>
                    <span class="wpai-chip" data-prompt="Add glowing gradient styling to primary CTA buttons">✨ Glowing Buttons</span>
                </div>

                <button type="button" class="button button-primary button-hero wpai-btn-generate" id="wpai-generate-btn">
                    <span class="wpai-btn-text">🪄 Generate with AI</span>
                    <span class="wpai-spinner" style="display:none;"></span>
                </button>
            </div>

            <div class="wpai-card wpai-code-card">
                <div class="wpai-code-header">
                    <strong>Generated CSS Code</strong>
                    <button type="button" class="button button-small" id="wpai-clear-editor-btn">Clear</button>
                </div>
                <textarea id="wpai-css-editor" rows="10" spellcheck="false" class="wpai-code-editor" placeholder="/* AI generated CSS will appear here. You can also edit it manually! */"></textarea>
            </div>

            <div class="wpai-card">
                <div class="wpai-revisions-header">
                    <strong>🕒 Rollback & Version History</strong>
                </div>
                <div class="wpai-revisions-scroll" id="wpai-revisions-container">
                    <p class="wpai-muted">No revisions recorded yet.</p>
                </div>
            </div>
        </div>

        <!-- Live Preview Stage -->
        <div class="wpai-preview-stage">
            <div class="wpai-stage-bar">
                <div class="wpai-devices">
                    <button type="button" class="wpai-device-btn active" data-width="100%">🖥️ Desktop</button>
                    <button type="button" class="wpai-device-btn" data-width="768px">📱 Tablet</button>
                    <button type="button" class="wpai-device-btn" data-width="390px">📱 Mobile</button>
                </div>

                <div class="wpai-stage-status">
                    <span id="wpai-live-indicator" class="wpai-badge wpai-badge-ready">Ready</span>
                </div>

                <div class="wpai-stage-actions">
                    <button type="button" class="button" id="wpai-refresh-preview-btn">🔄 Reload Preview</button>
                    <button type="button" class="button button-primary button-hero" id="wpai-apply-live-btn" disabled>
                        🚀 Apply to Live Website
                    </button>
                </div>
            </div>

            <div class="wpai-iframe-wrapper">
                <iframe id="wpai-preview-iframe" src="<?php echo esc_url(get_site_url()); ?>" title="Website Live Preview"></iframe>
            </div>
        </div>
    </div>
</div>
