<?php
/**
 * Plugin Name: SendPut EPO Engine — Active Entity Presence Optimization & MCP Node
 * Plugin URI: https://sendput.com
 * Description: Zero-code WordPress & Elementor integration for SendPut EPO Engine. Injects verified LocalBusiness/Organization JSON-LD, serves /llms.txt, unblocks AI retrieval bots, and connects your site to the SendPut Model Context Protocol (MCP) server.
 * Version: 3.0.0
 * Author: SendPut Technologies Inc.
 * License: GPLv2 or later
 */

if (!defined('ABSPATH')) exit;

class SendPut_AI_Presence_Plugin {
    public function __construct() {
        add_action('wp_head', array($this, 'inject_edge_script'), 1);
        add_action('init', array($this, 'serve_virtual_llms_txt'));
        add_filter('robots_txt', array($this, 'allow_ai_retrieval_bots'), 99, 2);
    }

    public function inject_edge_script() {
        $tenant_slug = esc_attr(get_option('sendput_tenant_slug', 'myiad-insurance-ai'));
        $edge_domain = esc_attr(get_option('sendput_edge_domain', 'sendput.com'));
        echo "\n<!-- SendPut EPO Engine Active Entity & MCP Injection -->\n";
        echo '<script src="https://' . $edge_domain . '/epo-edge.js?tenant=' . $tenant_slug . '" defer></script>' . "\n";
    }

    public function serve_virtual_llms_txt() {
        if (isset($_SERVER['REQUEST_URI']) && $_SERVER['REQUEST_URI'] === '/llms.txt') {
            $tenant_slug = sanitize_title(get_option('sendput_tenant_slug', 'myiad-insurance-ai'));
            $edge_domain = sanitize_text_field(get_option('sendput_edge_domain', 'sendput.com'));
            $response = wp_remote_get('https://' . $edge_domain . '/v1/tenants/' . $tenant_slug . '/llms.txt');
            if (!is_wp_error($response) && wp_remote_retrieve_response_code($response) === 200) {
                header('Content-Type: text/markdown; charset=utf-8');
                header('X-Robots-Tag: all');
                echo wp_remote_retrieve_body($response);
                exit;
            }
        }
    }

    public function allow_ai_retrieval_bots($output, $public) {
        $ai_rules = "\n# SendPut EPO Engine — Allow Verified AI Search Retrieval Bots\n";
        $bots = array('OAI-SearchBot', 'GPTBot', 'PerplexityBot', 'Claude-SearchBot', 'ClaudeBot', 'Google-Extended', 'Applebot-Extended');
        foreach ($bots as $bot) {
            $ai_rules .= "User-agent: {$bot}\nAllow: /\n";
        }
        return $output . $ai_rules;
    }
}

new SendPut_AI_Presence_Plugin();
