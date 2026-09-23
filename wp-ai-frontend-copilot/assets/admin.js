/**
 * WP AI Frontend Copilot Admin Controller
 */

jQuery(document).ready(function ($) {
    'use strict';

    const $iframe = $('#wpai-preview-iframe');
    const $cssEditor = $('#wpai-css-editor');
    const $promptInput = $('#wpai-prompt-input');
    const $targetSelect = $('#wpai-page-target');
    const $generateBtn = $('#wpai-generate-btn');
    const $applyBtn = $('#wpai-apply-live-btn');
    const $liveIndicator = $('#wpai-live-indicator');
    const $revisionsContainer = $('#wpai-revisions-container');

    // Fetch initial styles for selected scope
    function loadScopeStyles() {
        const target = $targetSelect.val();
        $.ajax({
            url: WPAI_SETTINGS.rest_url + 'current-styles',
            method: 'GET',
            headers: { 'X-WP-Nonce': WPAI_SETTINGS.nonce },
            data: { target: target },
            success: function (res) {
                if (res && res.success) {
                    $cssEditor.val(res.css || '');
                    injectIntoIframe(res.css || '');
                }
            }
        });
    }

    // Fetch Revisions
    function loadRevisions() {
        $.ajax({
            url: WPAI_SETTINGS.rest_url + 'revisions',
            method: 'GET',
            headers: { 'X-WP-Nonce': WPAI_SETTINGS.nonce },
            success: function (res) {
                if (res && res.success && res.revisions) {
                    renderRevisions(res.revisions);
                }
            }
        });
    }

    function renderRevisions(revisions) {
        if (!revisions || revisions.length === 0) {
            $revisionsContainer.html('<p class="wpai-muted">No revisions recorded yet.</p>');
            return;
        }

        let html = '';
        revisions.forEach(function (rev) {
            html += `
                <div class="wpai-revision-item">
                    <div class="wpai-rev-meta">
                        <span class="wpai-rev-time">${escapeHtml(rev.timestamp)}</span>
                        <span class="wpai-rev-prompt" title="${escapeHtml(rev.prompt)}">${escapeHtml(rev.prompt || 'Manual update')}</span>
                    </div>
                    <button type="button" class="button button-small wpai-restore-btn" data-css="${encodeURIComponent(rev.css)}">
                        ↺ Restore
                    </button>
                </div>
            `;
        });
        $revisionsContainer.html(html);
    }

    function escapeHtml(text) {
        if (!text) return '';
        return String(text).replace(/[&<>"']/g, function(m) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m];
        });
    }

    // Real-time CSS injection into live preview iframe without page reload
    function injectIntoIframe(css) {
        try {
            const iframe = $iframe[0];
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            if (!iframeDoc || !iframeDoc.head) return;

            let styleEl = iframeDoc.getElementById('wpai-live-preview-style');
            if (!styleEl) {
                styleEl = iframeDoc.createElement('style');
                styleEl.id = 'wpai-live-preview-style';
                iframeDoc.head.appendChild(styleEl);
            }
            styleEl.textContent = css;
        } catch (e) {
            console.warn('[WP AI Copilot] Live iframe sync warning:', e);
        }
    }

    // Save Settings
    $('#wpai-save-settings-btn').on('click', function () {
        const apiKey = $('#wpai-api-key-input').val().trim();
        const provider = $('#wpai-provider-select').val();

        if (!apiKey) {
            alert('Please enter a valid API key.');
            return;
        }

        const $btn = $(this).prop('disabled', true).text('Saving...');

        $.ajax({
            url: WPAI_SETTINGS.rest_url + 'settings',
            method: 'POST',
            headers: { 'X-WP-Nonce': WPAI_SETTINGS.nonce },
            data: { api_key: apiKey, provider: provider },
            success: function () {
                alert('AI API Key saved successfully!');
            },
            error: function (err) {
                alert('Error saving settings: ' + (err.responseJSON?.message || 'Server error'));
            },
            complete: function () {
                $btn.prop('disabled', false).text('Save Key');
            }
        });
    });

    // Quick prompt chips
    $('.wpai-chip').on('click', function () {
        const promptText = $(this).data('prompt');
        $promptInput.val(promptText).focus();
    });

    // Generate AI Design
    $generateBtn.on('click', function () {
        const prompt = $promptInput.val().trim();
        const target = $targetSelect.val();
        const currentCss = $cssEditor.val();

        if (!prompt) {
            alert('Please describe what you want the AI to design or change.');
            $promptInput.focus();
            return;
        }

        $generateBtn.prop('disabled', true);
        $generateBtn.find('.wpai-btn-text').text('AI is generating...');
        $generateBtn.find('.wpai-spinner').show();
        $liveIndicator.text('Generating...').attr('class', 'wpai-badge wpai-badge-working');

        $.ajax({
            url: WPAI_SETTINGS.rest_url + 'generate',
            method: 'POST',
            headers: { 'X-WP-Nonce': WPAI_SETTINGS.nonce },
            data: {
                prompt: prompt,
                target: target,
                current_css: currentCss
            },
            success: function (res) {
                if (res && res.success) {
                    const newCss = res.css;
                    $cssEditor.val(newCss);
                    injectIntoIframe(newCss);
                    $applyBtn.prop('disabled', false);
                    $liveIndicator.text('Preview Active (Not yet live)').attr('class', 'wpai-badge wpai-badge-working');
                }
            },
            error: function (err) {
                alert('AI Generation Error: ' + (err.responseJSON?.message || 'Unable to generate code'));
                $liveIndicator.text('Error').attr('class', 'wpai-badge');
            },
            complete: function () {
                $generateBtn.prop('disabled', false);
                $generateBtn.find('.wpai-btn-text').text('🪄 Generate with AI');
                $generateBtn.find('.wpai-spinner').hide();
            }
        });
    });

    // Manual edits in CSS editor update live preview immediately
    $cssEditor.on('input', function () {
        const updatedCss = $(this).val();
        injectIntoIframe(updatedCss);
        $applyBtn.prop('disabled', false);
    });

    // Apply Live to Website
    $applyBtn.on('click', function () {
        const target = $targetSelect.val();
        const css = $cssEditor.val();
        const prompt = $promptInput.val() || 'Applied custom style';

        $applyBtn.prop('disabled', true).text('Applying...');

        $.ajax({
            url: WPAI_SETTINGS.rest_url + 'apply',
            method: 'POST',
            headers: { 'X-WP-Nonce': WPAI_SETTINGS.nonce },
            data: {
                target: target,
                css: css,
                prompt: prompt
            },
            success: function (res) {
                if (res && res.success) {
                    $liveIndicator.text('Active Live on Site').attr('class', 'wpai-badge wpai-badge-active');
                    if (res.revisions) {
                        renderRevisions(res.revisions);
                    }
                    alert('🎉 Changes are now LIVE on your website!');
                }
            },
            error: function (err) {
                alert('Failed to apply changes: ' + (err.responseJSON?.message || 'Server error'));
            },
            complete: function () {
                $applyBtn.prop('disabled', false).text('🚀 Apply to Live Website');
            }
        });
    });

    // Rollback / Restore revision
    $(document).on('click', '.wpai-restore-btn', function () {
        const css = decodeURIComponent($(this).data('css'));
        if (!confirm('Would you like to load and preview this previous revision?')) return;

        $cssEditor.val(css);
        injectIntoIframe(css);
        $applyBtn.prop('disabled', false);
        $liveIndicator.text('Restored (Click Apply to Save)').attr('class', 'wpai-badge wpai-badge-working');
    });

    // Device Switcher
    $('.wpai-device-btn').on('click', function () {
        $('.wpai-device-btn').removeClass('active');
        $(this).addClass('active');
        const targetWidth = $(this).data('width');
        $iframe.css('width', targetWidth);
    });

    // Clear editor
    $('#wpai-clear-editor-btn').on('click', function () {
        if (confirm('Clear the current CSS editor?')) {
            $cssEditor.val('');
            injectIntoIframe('');
            $applyBtn.prop('disabled', false);
        }
    });

    // Reload preview iframe
    $('#wpai-refresh-preview-btn').on('click', function () {
        $iframe.attr('src', $iframe.attr('src'));
    });

    $targetSelect.on('change', function () {
        loadScopeStyles();
    });

    // Load initial data
    loadScopeStyles();
    loadRevisions();
});
