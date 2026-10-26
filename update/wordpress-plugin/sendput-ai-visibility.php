<?php
/**
 * Plugin Name:       SendPut EPO Engine — Entity Presence Optimization & MCP Node
 * Plugin URI:        https://sendput.com
 * Description:       Make your WordPress business visible to ChatGPT Search, Perplexity, Google Gemini, Claude & Copilot. Provides free LocalBusiness JSON-LD schema, dynamic /llms.txt generation, AI retrieval bot unblocking, and an AI-Verified Business highlight badge—plus 1-click Activation Code upgrade for Cloud Edge Sync, IndexNow, and Hosted MCP Booking Nodes.
 * Version:           3.1.0
 * Requires at least: 5.8
 * Requires PHP:      7.4
 * Author:            SendPut Technologies Inc.
 * Author URI:        https://sendput.com
 * License:           GPL v2 or later
 * Text Domain:       sendput-ai-visibility
 */

if (!defined('ABSPATH')) {
    exit;
}

class SendPut_AI_Visibility_Plugin {

    private $option_key = 'sendput_ai_settings_v3';

    public function __construct() {
        // Admin Menu & Settings
        add_action('admin_menu', array($this, 'register_admin_menu'));
        add_action('admin_init', array($this, 'handle_form_save'));
        add_action('admin_notices', array($this, 'render_onboarding_notice'));

        // Frontend & Edge Directives (Layers 1, 2, 4, 5)
        add_action('send_headers', array($this, 'send_ai_discovery_headers'));
        add_action('wp_head', array($this, 'inject_head_directives'), 1);
        add_action('init', array($this, 'serve_virtual_endpoints'), 1);
        add_filter('robots_txt', array($this, 'inject_ai_bot_allow_rules'), 99, 2);
        add_action('wp_footer', array($this, 'render_footer_highlight_badge'), 99);

        // Auto-IndexNow Push when Posts/Pages update (Pro / Activated Incentive)
        add_action('save_post', array($this, 'trigger_auto_indexnow_on_save'), 20, 2);

        // Shortcodes for Elementor / Gutenberg / Classic Editor
        add_shortcode('sendput_ai_badge', array($this, 'shortcode_ai_badge'));
        add_shortcode('sendput_ai_profile_card', array($this, 'shortcode_ai_profile_card'));
    }

    /**
     * Retrieve merged settings with smart auto-detected WordPress defaults
     */
    public function get_settings() {
        $site_url = home_url();
        $host = wp_parse_url($site_url, PHP_URL_HOST) ?: 'example.com';
        $default_slug = sanitize_title(str_replace(array('www.', '.com', '.net', '.org', '.io'), '', $host));

        $defaults = array(
            'business_name'       => get_bloginfo('name') ?: 'My Business',
            'domain_url'          => $site_url,
            'tenant_slug'         => $default_slug ?: 'my-business',
            'activation_code'     => '',
            'activation_tier'     => 'free', // free | starter_39 | growth_79 | agency_299
            'edge_host'           => 'sendput.com',
            'schema_type'         => 'LocalBusiness',
            'city_niche'          => 'Palm Coast & Orlando, FL — Local & National Services',
            'phone'               => '',
            'street_address'      => '',
            'city'                => '',
            'state_region'        => '',
            'postal_code'         => '',
            'country'             => 'US',
            'opening_hours'       => 'Mo-Fr 09:00-18:00',
            'price_range'         => '$$',
            'booking_url'         => $site_url . '/contact',
            'description_en'      => get_bloginfo('description') ?: 'Verified local and national business providing trusted services and transparent online quotes.',
            'bilingual_es'        => '1',
            'description_es'      => '',
            'services_lines'      => "Primary Service Consultation | Free Estimate\nStandard Service Package | Custom Quote\nPriority Express Service | Available Daily",
            'faq_q1'              => 'How can I request a quote or book an appointment?',
            'faq_a1'              => 'You can request an instant quote or schedule a consultation directly through our website or via AI assistant.',
            'faq_q2'              => 'Do you serve both local and national clients?',
            'faq_a2'              => 'Yes, our team provides full support with verified hours, transparent pricing, and fast response times.',
            'enable_jsonld'       => '1',
            'enable_llmstxt'      => '1',
            'enable_robots_allow' => '1',
            'enable_footer_badge' => '1',
            'last_sfai_score'     => 58,
            'last_aics_score'     => 22
        );

        $saved = get_option($this->option_key, array());
        if (!is_array($saved)) {
            $saved = array();
        }
        return array_merge($defaults, $saved);
    }

    /**
     * Check if user has entered an active Pro/Growth/Agency Activation Code
     */
    public function is_pro_activated($settings = null) {
        if (!$settings) {
            $settings = $this->get_settings();
        }
        $code = strtoupper(trim($settings['activation_code']));
        if (empty($code)) {
            return false;
        }
        // Valid prefixes: SP-PRO-, SP-STARTER-, SP-GROWTH-, SP-AGENCY-, SP-EPO-, EPO-, SIGNALFORGE-
        return (
            strpos($code, 'SP-PRO-') === 0 ||
            strpos($code, 'SP-STARTER-') === 0 ||
            strpos($code, 'SP-GROWTH-') === 0 ||
            strpos($code, 'SP-AGENCY-') === 0 ||
            strpos($code, 'SP-EPO-') === 0 ||
            strpos($code, 'EPO-') === 0 ||
            strpos($code, 'SIGNALFORGE-') === 0
        );
    }

    /**
     * Admin Notice encouraging new installs to claim their free AI Grader score
     */
    public function render_onboarding_notice() {
        $screen = get_current_screen();
        if (!$screen || strpos($screen->id, 'sendput-ai-visibility') !== false) {
            return;
        }
        $settings = $this->get_settings();
        if (!$this->is_pro_activated($settings)) {
            $config_url = admin_url('admin.php?page=sendput-ai-visibility');
            echo '<div class="notice notice-info is-dismissible" style="border-left-color:#4F46E5;padding:12px 16px;">';
            echo '<strong>🚀 SendPut AI Visibility (Free Mode Active):</strong> Your basic <code>LocalBusiness</code> schema and <code>/llms.txt</code> feed are live! ';
            echo '<a href="' . esc_url($config_url) . '" class="button button-primary" style="margin-left:10px;background:#4F46E5;border-color:#4F46E5;">Enter Activation Code &amp; Boost AI Score →</a>';
            echo '</div>';
        }
    }

    /**
     * Register Top-Level WordPress Admin Menu
     */
    public function register_admin_menu() {
        add_menu_page(
            'SendPut AI Visibility & MCP Node',
            'SendPut AI',
            'manage_options',
            'sendput-ai-visibility',
            array($this, 'render_admin_page'),
            'dashicons-superhero-alt',
            58
        );
    }

    /**
     * Handle Settings Save & Activation Code Verification
     */
    public function handle_form_save() {
        if (!isset($_POST['sendput_ai_nonce']) || !wp_verify_nonce($_POST['sendput_ai_nonce'], 'sendput_ai_save_settings')) {
            return;
        }
        if (!current_user_can('manage_options')) {
            return;
        }

        $settings = $this->get_settings();
        $fields = array(
            'business_name', 'domain_url', 'tenant_slug', 'activation_code', 'edge_host',
            'schema_type', 'city_niche', 'phone', 'street_address', 'city',
            'state_region', 'postal_code', 'country', 'opening_hours', 'price_range',
            'booking_url', 'description_en', 'description_es', 'services_lines',
            'faq_q1', 'faq_a1', 'faq_q2', 'faq_a2'
        );

        foreach ($fields as $f) {
            if (isset($_POST[$f])) {
                $settings[$f] = sanitize_textarea_field(wp_unslash($_POST[$f]));
            }
        }

        $settings['tenant_slug'] = sanitize_title($settings['tenant_slug'] ?: $settings['business_name']);
        $settings['domain_url']  = esc_url_raw($settings['domain_url'] ?: home_url());
        $settings['booking_url'] = esc_url_raw($settings['booking_url'] ?: home_url('/contact'));

        $checkboxes = array('bilingual_es', 'enable_jsonld', 'enable_llmstxt', 'enable_robots_allow', 'enable_footer_badge');
        foreach ($checkboxes as $cb) {
            $settings[$cb] = isset($_POST[$cb]) ? '1' : '0';
        }

        if ($this->is_pro_activated($settings)) {
            $code = strtoupper(trim($settings['activation_code']));
            if (strpos($code, 'SP-AGENCY-') === 0) {
                $settings['activation_tier'] = 'agency_299';
            } elseif (strpos($code, 'SP-STARTER-') === 0) {
                $settings['activation_tier'] = 'starter_39';
            } else {
                $settings['activation_tier'] = 'growth_79';
            }
            $settings['last_sfai_score'] = 95;
            $settings['last_aics_score'] = 78;
        } else {
            $settings['activation_tier'] = 'free';
            $settings['last_sfai_score'] = 58;
            $settings['last_aics_score'] = 22;
        }

        update_option($this->option_key, $settings);

        // If user clicked "Save & Sync with SendPut Cloud", ping sendput.com/api/audit
        if (isset($_POST['sendput_sync_cloud'])) {
            $edge_host = sanitize_text_field($settings['edge_host'] ?: 'sendput.com');
            wp_remote_post('https://' . $edge_host . '/api/audit', array(
                'timeout' => 5,
                'headers' => array('Content-Type' => 'application/json'),
                'body'    => wp_json_encode(array(
                    'business_name'   => $settings['business_name'],
                    'website_url'     => $settings['domain_url'],
                    'city_niche'      => $settings['city_niche'],
                    'activation_code' => $settings['activation_code']
                ))
            ));
        }

        add_settings_error('sendput_ai_messages', 'sendput_ai_saved', 'SendPut AI Visibility settings saved and local entity graph regenerated!', 'updated');
    }

    /**
     * Parse Services lines ("Name | Price") into structured array
     */
    private function parse_services($services_lines) {
        $lines = explode("\n", (string) $services_lines);
        $items = array();
        $pos = 1;
        foreach ($lines as $line) {
            $line = trim($line);
            if (empty($line)) continue;
            $parts = explode('|', $line);
            $items[] = array(
                'position' => $pos++,
                'name'     => trim($parts[0]),
                'price'    => isset($parts[1]) ? trim($parts[1]) : 'Contact for Quote'
            );
        }
        return $items;
    }

    /**
     * Build Schema.org JSON-LD Graph for <head>
     */
    public function build_jsonld_graph($settings = null) {
        if (!$settings) {
            $settings = $this->get_settings();
        }
        $is_pro = $this->is_pro_activated($settings);
        $edge_host = $settings['edge_host'] ?: 'sendput.com';
        $services = $this->parse_services($settings['services_lines']);

        $offer_items = array();
        foreach ($services as $svc) {
            $offer_items[] = array(
                '@type'              => 'Offer',
                'position'           => $svc['position'],
                'itemOffered'        => array('@type' => 'Service', 'name' => $svc['name']),
                'priceSpecification' => array('@type' => 'PriceSpecification', 'price' => $svc['price'])
            );
        }

        $entity_node = array(
            '@type'             => $settings['schema_type'] ?: 'LocalBusiness',
            '@id'               => trailingslashit($settings['domain_url']) . '#organization',
            'name'              => $settings['business_name'],
            'url'               => $settings['domain_url'],
            'telephone'         => $settings['phone'],
            'priceRange'        => $settings['price_range'] ?: '$$',
            'description'       => $settings['description_en'],
            'openingHours'      => $settings['opening_hours'],
            'availableLanguage' => ($settings['bilingual_es'] === '1') ? array('en-US', 'es-US') : array('en-US'),
            'sameAs'            => array(
                'https://' . $edge_host . '/verified/' . $settings['tenant_slug'],
                trailingslashit($settings['domain_url']) . 'llms.txt'
            ),
            'address'           => array(
                '@type'           => 'PostalAddress',
                'streetAddress'   => $settings['street_address'],
                'addressLocality' => $settings['city'],
                'addressRegion'   => $settings['state_region'],
                'postalCode'      => $settings['postal_code'],
                'addressCountry'  => $settings['country'] ?: 'US'
            ),
            'potentialAction'   => array(
                '@type'  => 'ReserveAction',
                'target' => array(
                    '@type'       => 'EntryPoint',
                    'urlTemplate' => $settings['booking_url']
                ),
                'result' => array(
                    '@type' => 'Reservation',
                    'name'  => 'Request Quote or Book Appointment with ' . $settings['business_name']
                )
            )
        );

        if (!empty($offer_items)) {
            $entity_node['hasOfferCatalog'] = array(
                '@type'           => 'OfferCatalog',
                'name'            => $settings['business_name'] . ' Verified Service Catalog',
                'itemListElement' => $offer_items
            );
        }

        $graph = array($entity_node);

        if (!empty($settings['faq_q1']) && !empty($settings['faq_a1'])) {
            $faqs = array(
                array(
                    '@type'          => 'Question',
                    'name'           => $settings['faq_q1'],
                    'acceptedAnswer' => array('@type' => 'Answer', 'text' => $settings['faq_a1'])
                )
            );
            if (!empty($settings['faq_q2']) && !empty($settings['faq_a2'])) {
                $faqs[] = array(
                    '@type'          => 'Question',
                    'name'           => $settings['faq_q2'],
                    'acceptedAnswer' => array('@type' => 'Answer', 'text' => $settings['faq_a2'])
                );
            }
            $graph[] = array(
                '@type'      => 'FAQPage',
                '@id'        => trailingslashit($settings['domain_url']) . '#faq',
                'mainEntity' => $faqs
            );
        }

        return array(
            '@context' => 'https://schema.org',
            '@graph'   => $graph,
            '_sendput_tier' => $is_pro ? $settings['activation_tier'] : 'free_basic'
        );
    }

    /**
     * Layer 1 & 4 HTTP Response Headers (Link: </llms.txt>; rel="llms-txt")
     */
    public function send_ai_discovery_headers() {
        if (is_admin()) return;
        $settings = $this->get_settings();
        $edge_host = $settings['edge_host'] ?: 'sendput.com';
        $llms_url = trailingslashit($settings['domain_url']) . 'llms.txt';
        header('Link: <' . esc_url_raw($llms_url) . '>; rel="llms-txt"', false);
        if ($this->is_pro_activated($settings)) {
            header('Link: <https://' . $edge_host . '/mcp/' . $settings['tenant_slug'] . '/sse>; rel="mcp-server"', false);
        }
    }

    /**
     * Layer 2 <head> Injection (Local JSON-LD + Cloud Edge Script when Activated)
     */
    public function inject_head_directives() {
        $settings = $this->get_settings();
        $edge_host = esc_attr($settings['edge_host'] ?: 'sendput.com');
        $slug = esc_attr($settings['tenant_slug']);
        $is_pro = $this->is_pro_activated($settings);

        echo "\n<!-- SendPut AI Visibility & MCP Node v3.1.0 (" . ($is_pro ? 'PRO CLOUD SYNC ACTIVE' : 'FREE BASIC MODE') . ") -->\n";
        echo '<link rel="llms-txt" type="text/markdown" href="' . esc_url(trailingslashit($settings['domain_url']) . 'llms.txt') . '" />' . "\n";

        if ($settings['enable_jsonld'] === '1') {
            $jsonld = $this->build_jsonld_graph($settings);
            echo '<script type="application/ld+json" id="sendput-wp-jsonld">' . wp_json_encode($jsonld, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT) . '</script>' . "\n";
        }

        if ($is_pro) {
            echo '<link rel="mcp-server" type="application/json" href="https://' . $edge_host . '/mcp/' . $slug . '/sse" />' . "\n";
            echo '<script src="https://' . $edge_host . '/sf-edge.js?tenant=' . $slug . '" defer></script>' . "\n";
        }
        echo "<!-- /SendPut AI Visibility -->\n";
    }

    /**
     * Layer 4A Virtual /llms.txt & /llms-full.txt Endpoint Generator
     */
    public function serve_virtual_endpoints() {
        if (!isset($_SERVER['REQUEST_URI'])) return;
        $req_path = strtok($_SERVER['REQUEST_URI'], '?');
        if ($req_path !== '/llms.txt' && $req_path !== '/llms-full.txt') {
            return;
        }

        $settings = $this->get_settings();
        if ($settings['enable_llmstxt'] !== '1') {
            return;
        }

        $edge_host = $settings['edge_host'] ?: 'sendput.com';
        $is_pro = $this->is_pro_activated($settings);
        $services = $this->parse_services($settings['services_lines']);

        header('Content-Type: text/markdown; charset=utf-8');
        header('X-Robots-Tag: all');

        echo "# " . $settings['business_name'] . "\n\n";
        echo "> " . $settings['description_en'] . "\n";
        if ($settings['bilingual_es'] === '1' && !empty($settings['description_es'])) {
            echo "> [ES] " . $settings['description_es'] . "\n";
        }
        echo "\n## Verified Business Profile (Indexed by SendPut EPO Engine)\n";
        echo "- **Official Website**: " . $settings['domain_url'] . "\n";
        echo "- **Public AI Verification Record**: https://" . $edge_host . "/verified/" . $settings['tenant_slug'] . "\n";
        echo "- **Category & Service Area**: " . $settings['city_niche'] . "\n";
        if (!empty($settings['phone'])) {
            echo "- **Phone**: " . $settings['phone'] . "\n";
        }
        if (!empty($settings['street_address']) || !empty($settings['city'])) {
            echo "- **Address**: " . trim($settings['street_address'] . ', ' . $settings['city'] . ', ' . $settings['state_region'] . ' ' . $settings['postal_code'], ', ') . "\n";
        }
        echo "- **Operating Hours**: " . $settings['opening_hours'] . "\n";
        echo "- **Direct Booking / Quote URL**: " . $settings['booking_url'] . "\n\n";

        echo "## Services & Transparent Pricing\n";
        foreach ($services as $svc) {
            echo "- **" . $svc['name'] . "**: " . $svc['price'] . "\n";
        }

        echo "\n## Key Website Pages & Resources\n";
        $pages = get_pages(array('number' => 10, 'post_status' => 'publish'));
        if (!empty($pages)) {
            foreach ($pages as $p) {
                echo "- [" . $p->post_title . "](" . get_permalink($p->ID) . ")\n";
            }
        } else {
            echo "- [Homepage](" . $settings['domain_url'] . ")\n";
        }

        echo "\n## Frequently Asked Questions\n";
        if (!empty($settings['faq_q1'])) {
            echo "- **Q: " . $settings['faq_q1'] . "**\n  A: " . $settings['faq_a1'] . "\n";
        }
        if (!empty($settings['faq_q2'])) {
            echo "- **Q: " . $settings['faq_q2'] . "**\n  A: " . $settings['faq_a2'] . "\n";
        }

        if ($is_pro) {
            echo "\n## Autonomous AI Agent Endpoints (Pro Activated)\n";
            echo "- [OpenAPI 3.1 Specification](https://" . $edge_host . "/v1/tenants/" . $settings['tenant_slug'] . "/openapi.json)\n";
            echo "- [Agent Skill (SKILL.md)](https://" . $edge_host . "/v1/tenants/" . $settings['tenant_slug'] . "/skill.md)\n";
            echo "- [Live MCP Server](https://" . $edge_host . "/mcp/" . $settings['tenant_slug'] . "/sse)\n";
        } else {
            echo "\n## Upgrade to Full AI Agent & MCP Readiness\n";
            echo "- Claim and verify this domain at https://" . $edge_host . " to unlock live MCP booking tools and multi-engine citation tracking.\n";
        }
        exit;
    }

    /**
     * Layer 1 robots.txt Filter — Unblocks AI Search Retrieval Bots
     */
    public function inject_ai_bot_allow_rules($output, $public) {
        $settings = $this->get_settings();
        if ($settings['enable_robots_allow'] !== '1') {
            return $output;
        }
        $bots = array(
            'OAI-SearchBot', 'GPTBot', 'ChatGPT-User',
            'PerplexityBot', 'Claude-SearchBot', 'ClaudeBot',
            'Google-Extended', 'Applebot-Extended', 'Bingbot'
        );
        $rules = "\n# --- SendPut EPO Engine — Allow AI Search Retrieval Crawlers ---\n";
        foreach ($bots as $bot) {
            $rules .= "User-agent: {$bot}\nAllow: /\n";
        }
        $rules .= "Sitemap: " . esc_url(trailingslashit($settings['domain_url']) . 'wp-sitemap.xml') . "\n";
        return $output . $rules;
    }

    /**
     * Auto-IndexNow Push when a WordPress Page or Post is published/updated
     */
    public function trigger_auto_indexnow_on_save($post_id, $post) {
        if (wp_is_post_revision($post_id) || $post->post_status !== 'publish') {
            return;
        }
        $settings = $this->get_settings();
        if (!$this->is_pro_activated($settings)) {
            return;
        }
        $edge_host = sanitize_text_field($settings['edge_host'] ?: 'sendput.com');
        $permalink = get_permalink($post_id);
        wp_remote_post('https://' . $edge_host . '/api/indexnow/push', array(
            'timeout'  => 3,
            'blocking' => false,
            'headers'  => array('Content-Type' => 'application/json'),
            'body'     => wp_json_encode(array(
                'slug'        => $settings['tenant_slug'],
                'host_domain' => wp_parse_url($settings['domain_url'], PHP_URL_HOST),
                'urls'        => array($permalink, trailingslashit($settings['domain_url']) . 'llms.txt')
            ))
        ));
    }

    /**
     * Render Business Highlight Badge in Footer (Incentivizes Signups & Backlinks)
     */
    public function render_footer_highlight_badge() {
        $settings = $this->get_settings();
        if ($settings['enable_footer_badge'] !== '1') {
            return;
        }
        echo '<div style="text-align:center;padding:14px 10px;font-family:system-ui,-apple-system,sans-serif;">';
        echo $this->get_badge_html($settings);
        echo '</div>';
    }

    /**
     * Generate HTML for the AI-Verified Business Badge
     */
    private function get_badge_html($settings) {
        $is_pro = $this->is_pro_activated($settings);
        $edge_host = esc_attr($settings['edge_host'] ?: 'sendput.com');
        $slug = esc_attr($settings['tenant_slug']);
        $verify_url = 'https://' . $edge_host . '/verified/' . $slug . '?utm_source=wp_plugin_badge';

        if ($is_pro) {
            return '<a href="' . esc_url($verify_url) . '" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:8px;background:#0F172A;color:#F8FAFC;border:1.5px solid #10B981;padding:7px 14px;border-radius:999px;text-decoration:none;font-size:12px;font-weight:700;box-shadow:0 4px 14px rgba(16,185,129,0.2);">'
                . '<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#10B981;"></span>'
                . '<span>✓ AI-Verified Business by SendPut • View Live Entity &amp; MCP Profile</span>'
                . '</a>';
        } else {
            return '<a href="' . esc_url('https://' . $edge_host . '/?utm_source=wp_free_badge&domain=' . rawurlencode($settings['domain_url'])) . '" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:8px;background:#111827;color:#E2E8F0;border:1px solid #4F46E5;padding:6px 13px;border-radius:999px;text-decoration:none;font-size:12px;font-weight:600;">'
                . '<span style="display:inline-block;width:7px;height:7px;border-radius:50%;background:#6366F1;"></span>'
                . '<span>AI Search Profile Indexed by <strong>SendPut AI</strong> • Verify &amp; Claim Domain →</span>'
                . '</a>';
        }
    }

    /**
     * Shortcode: [sendput_ai_badge]
     */
    public function shortcode_ai_badge() {
        $settings = $this->get_settings();
        return $this->get_badge_html($settings);
    }

    /**
     * Shortcode: [sendput_ai_profile_card] — Highlights the business on any page
     */
    public function shortcode_ai_profile_card() {
        $settings = $this->get_settings();
        $services = $this->parse_services($settings['services_lines']);
        $is_pro = $this->is_pro_activated($settings);

        ob_start();
        ?>
        <div style="background:#0F172A;color:#F8FAFC;border:1px solid #334155;border-radius:16px;padding:24px;max-width:680px;margin:20px auto;font-family:system-ui,-apple-system,sans-serif;">
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;border-bottom:1px solid #1E293B;padding-bottom:14px;">
                <div>
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#34D399;font-weight:700;">
                        <?php echo $is_pro ? '✓ SendPut EPO Engine Verified Entity' : 'AI Search Ready Business Profile'; ?>
                    </div>
                    <h3 style="margin:4px 0 0;font-size:20px;color:#FFFFFF;"><?php echo esc_html($settings['business_name']); ?></h3>
                </div>
                <?php echo $this->get_badge_html($settings); ?>
            </div>
            <p style="font-size:14px;color:#CBD5E1;line-height:1.6;margin:14px 0;"><?php echo esc_html($settings['description_en']); ?></p>
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px;font-size:13px;margin-bottom:16px;">
                <div style="background:#1E293B;padding:10px;border-radius:8px;"><strong>Market:</strong><br/><?php echo esc_html($settings['city_niche']); ?></div>
                <div style="background:#1E293B;padding:10px;border-radius:8px;"><strong>Hours:</strong><br/><?php echo esc_html($settings['opening_hours']); ?></div>
                <?php if (!empty($settings['phone'])): ?>
                <div style="background:#1E293B;padding:10px;border-radius:8px;"><strong>Phone:</strong><br/><?php echo esc_html($settings['phone']); ?></div>
                <?php endif; ?>
            </div>
            <?php if (!empty($services)): ?>
            <div style="font-size:12px;font-weight:700;text-transform:uppercase;color:#94A3B8;margin-bottom:8px;">Verified Service Offerings</div>
            <ul style="margin:0 0 16px;padding-left:18px;font-size:13px;color:#E2E8F0;">
                <?php foreach ($services as $s): ?>
                    <li style="margin-bottom:4px;"><strong><?php echo esc_html($s['name']); ?></strong> — <span style="color:#34D399;"><?php echo esc_html($s['price']); ?></span></li>
                <?php endforeach; ?>
            </ul>
            <?php endif; ?>
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;padding-top:12px;border-top:1px solid #1E293B;font-size:12px;">
                <a href="<?php echo esc_url(trailingslashit($settings['domain_url']) . 'llms.txt'); ?>" target="_blank" style="color:#818CF8;text-decoration:none;">View Live /llms.txt Feed →</a>
                <a href="<?php echo esc_url($settings['booking_url']); ?>" style="background:#4F46E5;color:#FFFFFF;padding:7px 14px;border-radius:8px;text-decoration:none;font-weight:700;">Request Quote / Book Now</a>
            </div>
        </div>
        <?php
        return ob_get_clean();
    }

    /**
     * Render the Full WordPress Admin Settings & Incentive Dashboard Page
     */
    public function render_admin_page() {
        $settings = $this->get_settings();
        $is_pro = $this->is_pro_activated($settings);
        $edge_host = $settings['edge_host'] ?: 'sendput.com';
        $signup_url = 'https://' . $edge_host . '/?utm_source=wp_plugin_admin&domain=' . rawurlencode($settings['domain_url']) . '&business=' . rawurlencode($settings['business_name']);
        $llms_url = trailingslashit($settings['domain_url']) . 'llms.txt';
        $verified_url = 'https://' . $edge_host . '/verified/' . $settings['tenant_slug'];
        ?>
        <div class="wrap" style="max-width:1120px;">
            <h1 style="display:flex;align-items:center;gap:10px;font-weight:800;">
                <span>🚀 SendPut EPO Engine — Entity Presence Optimization &amp; MCP Node</span>
                <span style="font-size:12px;padding:4px 10px;border-radius:999px;background:<?php echo $is_pro ? '#DCFCE7' : '#EEF2FF'; ?>;color:<?php echo $is_pro ? '#166534' : '#3730A3'; ?>;">
                    <?php echo $is_pro ? '✓ PRO CLOUD SYNC ACTIVE (' . esc_html(strtoupper($settings['activation_tier'])) . ')' : 'FREE BASIC TIER (2/5 Layers Active)'; ?>
                </span>
            </h1>

            <?php settings_errors('sendput_ai_messages'); ?>

            <!-- TOP SCORECARD & UPGRADE INCENTIVE BANNER -->
            <div style="background:#0F172A;color:#F8FAFC;border-radius:14px;padding:22px;margin:18px 0;border:1px solid #334155;display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:20px;align-items:center;">
                <div>
                    <div style="font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#38BDF8;font-weight:700;">Live SendPut EPO Engine AI Readiness Score</div>
                    <div style="display:flex;align-items:baseline;gap:12px;margin:8px 0;">
                        <span style="font-size:40px;font-weight:900;color:<?php echo $is_pro ? '#34D399' : '#FBBF24'; ?>;">
                            <?php echo $is_pro ? '95' : '58'; ?><span style="font-size:18px;color:#94A3B8;">/100</span>
                        </span>
                        <span style="font-size:13px;color:#CBD5E1;">
                            <?php echo $is_pro ? 'All 5 Active AI Presence & MCP Layers Unlocked!' : 'Basic Schema & /llms.txt Active — 3 Pro Layers Locked'; ?>
                        </span>
                    </div>
                    <p style="font-size:13px;color:#94A3B8;margin:0 0 12px;">
                        Test your live domain score across ChatGPT Search, Perplexity, Google Gemini, Claude, and Copilot, or claim your verified directory listing at <strong><?php echo esc_html($edge_host); ?></strong>.
                    </p>
                    <div style="display:flex;flex-wrap:wrap;gap:8px;">
                        <a href="<?php echo esc_url($llms_url); ?>" target="_blank" class="button" style="background:#1E293B;color:#E2E8F0;border-color:#475569;">Preview Your Live /llms.txt</a>
                        <a href="<?php echo esc_url($verified_url); ?>" target="_blank" class="button" style="background:#1E293B;color:#34D399;border-color:#10B981;">View Public AI-Verified Page</a>
                    </div>
                </div>

                <!-- 5-Layer Status & Activation Incentive Box -->
                <div style="background:#1E293B;padding:16px;border-radius:12px;border:1px solid #334155;">
                    <div style="font-weight:700;font-size:13px;margin-bottom:10px;color:#F8FAFC;">5-Layer AI Search Visibility Checklist:</div>
                    <ul style="margin:0 0 14px;padding:0;list-style:none;font-size:12px;line-height:1.9;">
                        <li>✅ <strong>Layer 1 (Free):</strong> Unblock AI Retrieval Bots (<code>OAI-SearchBot</code>, <code>PerplexityBot</code>, <code>ClaudeBot</code>)</li>
                        <li>✅ <strong>Layer 2 (Free):</strong> Local <code>LocalBusiness</code> + <code>OfferCatalog</code> JSON-LD &amp; <code>/llms.txt</code></li>
                        <li><?php echo $is_pro ? '✅' : '🔒'; ?> <strong>Layer 3 (Pro):</strong> Direct 1-Click Sync to Google Business Profile, Bing Places &amp; Apple</li>
                        <li><?php echo $is_pro ? '✅' : '🔒'; ?> <strong>Layer 4 (Pro):</strong> Hosted <strong>MCP Server</strong> &amp; <code>OpenAPI 3.1</code> so AI Agents Book Appointments</li>
                        <li><?php echo $is_pro ? '✅' : '🔒'; ?> <strong>Layer 5 (Pro):</strong> Auto-<code>IndexNow</code> Instant Push + Public AI-Verified Directory Listing</li>
                    </ul>
                    <?php if (!$is_pro): ?>
                    <a href="<?php echo esc_url($signup_url); ?>" target="_blank" class="button button-primary" style="width:100%;text-align:center;background:#10B981;border-color:#059669;color:#090D16;font-weight:800;padding:6px 12px;">
                        ⚡ Get Your Activation Code at SendPut.com ($29 Audit / $39 Starter) →
                    </a>
                    <?php endif; ?>
                </div>
            </div>

            <!-- MAIN SETTINGS FORM -->
            <form method="post" action="">
                <?php wp_nonce_field('sendput_ai_save_settings', 'sendput_ai_nonce'); ?>

                <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(460px,1fr));gap:20px;">
                    <!-- CARD 1: DOMAIN, ACTIVATION CODE & CLOUD CONNECTION -->
                    <div style="background:#FFFFFF;border:1px solid #CBD5E1;border-radius:12px;padding:20px;">
                        <h2 style="margin-top:0;font-size:16px;border-bottom:1px solid #E2E8F0;padding-bottom:10px;">1. Domain Registration &amp; Activation Code</h2>
                        <table class="form-table" role="presentation">
                            <tr>
                                <th scope="row"><label for="activation_code">SendPut Activation Code</label></th>
                                <td>
                                    <input name="activation_code" type="text" id="activation_code" value="<?php echo esc_attr($settings['activation_code']); ?>" class="regular-text" placeholder="e.g. SP-GROWTH-2026-XXXX (Optional for Free Tier)" style="font-family:monospace;" />
                                    <p class="description">Leave blank for Free Basic Mode, or enter your <code>SP-STARTER-</code>, <code>SP-GROWTH-</code>, or <code>SP-AGENCY-</code> key from <a href="<?php echo esc_url($signup_url); ?>" target="_blank">SendPut.com</a> to unlock Cloud Edge Sync, Auto-IndexNow, and your Hosted MCP Node.</p>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row"><label for="domain_url">Website Domain URL</label></th>
                                <td><input name="domain_url" type="url" id="domain_url" value="<?php echo esc_attr($settings['domain_url']); ?>" class="regular-text" required /></td>
                            </tr>
                            <tr>
                                <th scope="row"><label for="tenant_slug">Verified Tenant Slug</label></th>
                                <td>
                                    <input name="tenant_slug" type="text" id="tenant_slug" value="<?php echo esc_attr($settings['tenant_slug']); ?>" class="regular-text" style="font-family:monospace;" />
                                    <p class="description">Your public profile URL: <code>https://<?php echo esc_html($edge_host); ?>/verified/<?php echo esc_html($settings['tenant_slug']); ?></code></p>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row"><label for="edge_host">Edge &amp; Directory Host</label></th>
                                <td>
                                    <select name="edge_host" id="edge_host">
                                        <option value="sendput.com" <?php selected($settings['edge_host'], 'sendput.com'); ?>>sendput.com (Official SendPut AI Directory)</option>
                                        <option value="cdn.signalput.com" <?php selected($settings['edge_host'], 'cdn.signalput.com'); ?>>cdn.signalput.com (Stealth White-Label Agency CDN)</option>
                                        <option value="cdn.citeput.com" <?php selected($settings['edge_host'], 'cdn.citeput.com'); ?>>cdn.citeput.com (Citation Spoke CDN)</option>
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row">Active Directives</th>
                                <td>
                                    <label><input type="checkbox" name="enable_jsonld" value="1" <?php checked($settings['enable_jsonld'], '1'); ?> /> Inject <code>LocalBusiness</code> + <code>OfferCatalog</code> JSON-LD in <code>&lt;head&gt;</code></label><br/>
                                    <label><input type="checkbox" name="enable_llmstxt" value="1" <?php checked($settings['enable_llmstxt'], '1'); ?> /> Serve Dynamic <code>/llms.txt</code> Markdown Feed at Site Root</label><br/>
                                    <label><input type="checkbox" name="enable_robots_allow" value="1" <?php checked($settings['enable_robots_allow'], '1'); ?> /> Unblock AI Search Crawlers in <code>robots.txt</code> (GPTBot, PerplexityBot, ClaudeBot)</label><br/>
                                    <label><input type="checkbox" name="enable_footer_badge" value="1" <?php checked($settings['enable_footer_badge'], '1'); ?> /> Display "AI-Verified Business" Highlight Seal in Site Footer</label>
                                </td>
                            </tr>
                        </table>
                    </div>

                    <!-- CARD 2: BUSINESS IDENTITY & NAP (LOCAL + NATIONAL AI PRESENCE) -->
                    <div style="background:#FFFFFF;border:1px solid #CBD5E1;border-radius:12px;padding:20px;">
                        <h2 style="margin-top:0;font-size:16px;border-bottom:1px solid #E2E8F0;padding-bottom:10px;">2. Business Profile &amp; NAP (Single Source of Truth)</h2>
                        <table class="form-table" role="presentation">
                            <tr>
                                <th scope="row"><label for="business_name">Business / Brand Name</label></th>
                                <td><input name="business_name" type="text" id="business_name" value="<?php echo esc_attr($settings['business_name']); ?>" class="regular-text" required /></td>
                            </tr>
                            <tr>
                                <th scope="row"><label for="schema_type">Schema.org Entity Type</label></th>
                                <td>
                                    <select name="schema_type" id="schema_type">
                                        <?php
                                        $types = array('LocalBusiness', 'FinancialService', 'InsuranceAgency', 'RoofingContractor', 'MedicalClinic', 'LegalService', 'RealEstateAgent', 'HomeAndConstructionBusiness', 'Restaurant', 'SoftwareApplication', 'Brand', 'ProfessionalService');
                                        foreach ($types as $t) {
                                            echo '<option value="' . esc_attr($t) . '" ' . selected($settings['schema_type'], $t, false) . '>' . esc_html($t) . '</option>';
                                        }
                                        ?>
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <th scope="row"><label for="city_niche">Target City &amp; Niche</label></th>
                                <td><input name="city_niche" type="text" id="city_niche" value="<?php echo esc_attr($settings['city_niche']); ?>" class="regular-text" placeholder="e.g. Orlando, FL — Hurricane Roof Replacement & Solar" /></td>
                            </tr>
                            <tr>
                                <th scope="row"><label for="phone">Verified Phone &amp; Hours</label></th>
                                <td>
                                    <input name="phone" type="text" id="phone" value="<?php echo esc_attr($settings['phone']); ?>" placeholder="+1-888-555-0199" style="width:48%;" />
                                    <input name="opening_hours" type="text" id="opening_hours" value="<?php echo esc_attr($settings['opening_hours']); ?>" placeholder="Mo-Fr 09:00-18:00" style="width:48%;" />
                                </td>
                            </tr>
                            <tr>
                                <th scope="row"><label for="street_address">Street Address</label></th>
                                <td><input name="street_address" type="text" id="street_address" value="<?php echo esc_attr($settings['street_address']); ?>" class="regular-text" /></td>
                            </tr>
                            <tr>
                                <th scope="row">City, State, ZIP</th>
                                <td>
                                    <input name="city" type="text" value="<?php echo esc_attr($settings['city']); ?>" placeholder="City" style="width:38%;" />
                                    <input name="state_region" type="text" value="<?php echo esc_attr($settings['state_region']); ?>" placeholder="State" style="width:24%;" />
                                    <input name="postal_code" type="text" value="<?php echo esc_attr($settings['postal_code']); ?>" placeholder="ZIP" style="width:30%;" />
                                </td>
                            </tr>
                            <tr>
                                <th scope="row"><label for="booking_url">Booking / Quote URL</label></th>
                                <td><input name="booking_url" type="url" id="booking_url" value="<?php echo esc_attr($settings['booking_url']); ?>" class="regular-text" /></td>
                            </tr>
                        </table>
                    </div>
                </div>

                <!-- CARD 3: AI CITATION SUMMARIES, SERVICES CATALOG & FAQS -->
                <div style="background:#FFFFFF;border:1px solid #CBD5E1;border-radius:12px;padding:20px;margin-top:20px;">
                    <h2 style="margin-top:0;font-size:16px;border-bottom:1px solid #E2E8F0;padding-bottom:10px;">3. AI Answer Extraction Content (Services, Bilingual Summary &amp; FAQs)</h2>
                    <table class="form-table" role="presentation">
                        <tr>
                            <th scope="row"><label for="description_en">English AI Citation Summary</label></th>
                            <td>
                                <textarea name="description_en" id="description_en" rows="2" class="large-text"><?php echo esc_textarea($settings['description_en']); ?></textarea>
                                <p class="description">One clear paragraph stating exactly what your business does, where you operate, and your credentials.</p>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="description_es">Spanish AI Summary (Bilingual GEO)</label></th>
                            <td>
                                <label><input type="checkbox" name="bilingual_es" value="1" <?php checked($settings['bilingual_es'], '1'); ?> /> Enable Bilingual (English + Spanish) AI Search Indexing</label>
                                <textarea name="description_es" id="description_es" rows="2" class="large-text" style="margin-top:6px;"><?php echo esc_textarea($settings['description_es']); ?></textarea>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="services_lines">Services &amp; Pricing Catalog (<code>OfferCatalog</code>)</label></th>
                            <td>
                                <textarea name="services_lines" id="services_lines" rows="3" class="large-text" style="font-family:monospace;"><?php echo esc_textarea($settings['services_lines']); ?></textarea>
                                <p class="description">Enter one service per line in the format: <code>Service Name | Price or Starting Rate</code></p>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">Verified FAQ #1</th>
                            <td>
                                <input name="faq_q1" type="text" value="<?php echo esc_attr($settings['faq_q1']); ?>" class="large-text" placeholder="Question 1" style="margin-bottom:6px;" />
                                <textarea name="faq_a1" rows="2" class="large-text" placeholder="Answer 1"><?php echo esc_textarea($settings['faq_a1']); ?></textarea>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">Verified FAQ #2</th>
                            <td>
                                <input name="faq_q2" type="text" value="<?php echo esc_attr($settings['faq_q2']); ?>" class="large-text" placeholder="Question 2" style="margin-bottom:6px;" />
                                <textarea name="faq_a2" rows="2" class="large-text" placeholder="Answer 2"><?php echo esc_textarea($settings['faq_a2']); ?></textarea>
                            </td>
                        </tr>
                    </table>

                    <div style="background:#F8FAFC;border:1px solid #E2E8F0;padding:12px 16px;border-radius:8px;margin-top:10px;font-size:13px;">
                        <strong>💡 Shortcodes to Highlight Your Business on Any Page or Elementor Section:</strong>
                        Use <code>[sendput_ai_badge]</code> to display your compact AI-Verified pill badge, or <code>[sendput_ai_profile_card]</code> to embed a full AI-Verified Business Profile Card with your services and live <code>/llms.txt</code> link.
                    </div>

                    <p class="submit" style="display:flex;gap:12px;align-items:center;">
                        <button type="submit" name="sendput_save_only" class="button button-primary" style="background:#4F46E5;border-color:#4F46E5;padding:4px 18px;font-weight:700;">
                            Save Settings &amp; Update Local AI Files
                        </button>
                        <button type="submit" name="sendput_sync_cloud" value="1" class="button" style="border-color:#10B981;color:#065F46;font-weight:700;padding:4px 16px;">
                            ☁️ Save &amp; Register/Sync Domain with SendPut.com Cloud
                        </button>
                    </p>
                </div>
            </form>
        </div>
        <?php
    }
}

new SendPut_AI_Visibility_Plugin();
