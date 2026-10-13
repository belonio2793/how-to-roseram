import { Tutorial } from '../types/tutorial';

export const PRESET_TUTORIALS: Tutorial[] = [
  {
    id: 'roseram-101-getting-started',
    title: 'Getting Started with Roseram Browser Workspace',
    description: 'Learn the fundamentals of navigating Roseram.com: the unified browser IDE, frontier model selector, and instant preview.',
    category: 'Getting Started',
    estimatedDuration: 42,
    targetAudience: 'Developer',
    aspectRatio: '16:9',
    themeColor: 'violet',
    voice: 'Kore',
    tags: ['Workspace', 'Quickstart', 'Browser IDE', 'Multi-Model'],
    scenes: [
      {
        id: 'scene-1',
        title: 'Welcome to Roseram.com',
        subtitle: 'The Unified Browser-First AI Workspace',
        narration: 'Welcome to Roseram.com. In this walkthrough, you will learn how to launch projects, toggle AI models, and run full-stack apps completely in your browser.',
        duration: 8,
        focusArea: 'ide',
        simulatedUI: {
          activeFile: 'src/App.tsx',
          modelSelected: 'Multi-Model Auto',
          gitBranch: 'main',
          activeViewTab: 'code',
          codeSnippet: `// Welcome to Roseram.com AI Workspace
import React from 'react';

export default function WorkspaceApp() {
  return (
    <div className="p-8 bg-zinc-950 text-white min-h-screen">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-400 to-violet-500 bg-clip-text text-transparent">
        Building with Roseram Super Intelligence
      </h1>
      <p className="text-zinc-400 mt-2">Browser-native IDE with multi-model routing</p>
    </div>
  );
}`,
          terminalCommand: 'roseram dev --host 0.0.0.0',
          terminalOutput: '[ROSERAM] Workspace initialized. Dev server running at https://app.roseram.dev:3000\n[ROSERAM] Multi-model router connected: Claude 3.7, GPT-4o, Gemini 2.5',
        },
        cursorAction: {
          target: 'model-selector-badge',
          actionType: 'hover',
          xPercent: 78,
          yPercent: 12,
          label: 'AI Model Selector',
        },
        calloutBadge: {
          text: 'No local installation required! Runs directly in any modern browser.',
          type: 'pro',
          position: 'top-right',
        },
      },
      {
        id: 'scene-2',
        title: 'Multi-Model Routing Architecture',
        subtitle: 'Switching Between Frontier Models Seamlessly',
        narration: 'Roseram eliminates vendor lock-in. Switch seamlessly between Claude 3.7 Sonnet, GPT-4o, and Gemini 2.5 without ever having to re-craft your prompts.',
        duration: 9,
        focusArea: 'router',
        simulatedUI: {
          activeFile: 'roseram.config.ts',
          modelSelected: 'Claude 3.7 Sonnet',
          tokenCount: 1420,
          costEstimate: '$0.0042',
          activeViewTab: 'code',
          codeSnippet: `export default defineConfig({
  workspace: "roseram-saas-starter",
  aiRouting: {
    coding: "claude-3.7-sonnet",     // Precision code generation
    planning: "gemini-2.5-pro",       // Deep architectural reasoning
    fastTasks: "gpt-4o-mini",        // High throughput transformations
  },
  boundedAutomation: true,          // Human-in-the-loop diff validation
});`,
          terminalOutput: '[ROSERAM-ROUTER] Active engine: Claude 3.7 Sonnet (Thinking mode enabled)\n[ROSERAM-ROUTER] Latency: 180ms | Prompt adapter: active',
        },
        cursorAction: {
          target: 'model-claude-button',
          actionType: 'click',
          xPercent: 65,
          yPercent: 18,
          label: 'Switch to Claude 3.7 Sonnet',
        },
        calloutBadge: {
          text: 'Roseram auto-adapts prompts across different model architectures',
          type: 'tip',
          position: 'bottom-right',
        },
      },
      {
        id: 'scene-3',
        title: 'Plan → Build → Review Execution',
        subtitle: 'Safe Bounded Automation with Review Gates',
        narration: 'Every agentic action follows Roseram’s bounded automation pipeline. The agent first proposes a structured plan, executes the changes in a sandbox, and presents diffs for your review.',
        duration: 9,
        focusArea: 'proposals',
        simulatedUI: {
          activeFile: 'src/components/AnalyticsDashboard.tsx',
          modelSelected: 'Claude 3.7 Sonnet',
          activeViewTab: 'diff',
          proposalDiff: {
            fileName: 'src/components/AnalyticsDashboard.tsx',
            added: [
              '+ export function AnalyticsDashboard() {',
              '+   const { data, loading } = useTelemetryMetrics();',
              '+   return <MetricGrid cards={data.kpis} refreshInterval={5000} />;',
              '+ }',
            ],
            removed: [
              '- export function AnalyticsDashboard() {',
              '-   return <div>Placeholder Analytics</div>;',
              '- }',
            ],
            status: 'pending',
          },
          terminalOutput: '[ROSERAM AGENT] Proposed 1 modification to AnalyticsDashboard.tsx\n[HUMAN-IN-THE-LOOP] Awaiting approval to apply diff to workspace...',
        },
        cursorAction: {
          target: 'accept-diff-button',
          actionType: 'click',
          xPercent: 88,
          yPercent: 32,
          label: 'Approve & Apply Diff',
        },
        calloutBadge: {
          text: 'Inspect every line before merging with 1-click accept or rollback',
          type: 'tip',
          position: 'top-left',
        },
      },
      {
        id: 'scene-4',
        title: 'Live Interactive Terminal & Build',
        subtitle: 'Real-time WebAssembly & Cloud Dev Server',
        narration: 'The built-in terminal gives you direct command execution with live streaming logs, package manager installs, and instant lint verification.',
        duration: 8,
        focusArea: 'terminal',
        simulatedUI: {
          activeFile: 'package.json',
          activeViewTab: 'code',
          terminalCommand: 'pnpm test && pnpm build',
          terminalOutput: `✓ test/analytics.test.ts (4 tests passed, 0 failures)
✓ test/auth.test.ts (6 tests passed, 0 failures)
✨ Built in 412ms
  dist/assets/index-b4f8a1.js  48.2 kB
  dist/assets/index-c93d22.css  9.4 kB
✓ [ROSERAM] Live preview updated automatically`,
        },
        cursorAction: {
          target: 'terminal-input-bar',
          actionType: 'type',
          xPercent: 45,
          yPercent: 82,
          label: 'Execute build command',
        },
        calloutBadge: {
          text: 'Shortcut: Press Ctrl+` to toggle the Roseram terminal anytime',
          type: 'shortcut',
          position: 'bottom-left',
        },
      },
      {
        id: 'scene-5',
        title: 'Instant Live Preview & GitHub Sync',
        subtitle: 'Shareable URLs and Continuous Deployment',
        narration: 'Preview your live application side-by-side with zero reload delays, and sync your changes directly to your GitHub repository with one click.',
        duration: 8,
        focusArea: 'preview',
        simulatedUI: {
          activeFile: 'src/App.tsx',
          activeViewTab: 'preview',
          livePreviewUrl: 'https://saas-roseram-preview.dev',
          gitBranch: 'feature/analytics-v2',
          terminalOutput: '[ROSERAM-SYNC] Changes pushed to github.com/user/roseram-saas (PR #14 created)\n[ROSERAM-PREVIEW] SSL edge certificate active. Ready for sharing!',
        },
        cursorAction: {
          target: 'share-preview-button',
          actionType: 'click',
          xPercent: 92,
          yPercent: 12,
          label: 'Share Live Link',
        },
        calloutBadge: {
          text: 'Congratulations! You are now ready to build full-stack apps on Roseram.com',
          type: 'pro',
          position: 'center',
        },
      },
    ],
  },
  {
    id: 'roseram-201-agentic-coding',
    title: 'Agentic Coding: The Plan → Build → Review Workflow',
    description: 'Master Roseram’s bounded automation engine: reviewing code proposals, executing terminal commands, and human-in-the-loop verification.',
    category: 'Agentic Coding',
    estimatedDuration: 45,
    targetAudience: 'Developer',
    aspectRatio: '16:9',
    themeColor: 'emerald',
    voice: 'Fenrir',
    tags: ['Agentic Coding', 'Bounded Automation', 'Diff Review', 'Terminal'],
    scenes: [
      {
        id: 'agentic-1',
        title: 'Formulating the Agentic Prompt',
        subtitle: 'Stating Requirements Clearly to Roseram Agent',
        narration: 'In Roseram, agentic coding starts with high-level intent. Simply prompt the agent to build or refactor a module, and watch it structure the task.',
        duration: 9,
        focusArea: 'ide',
        simulatedUI: {
          activeFile: 'src/lib/stripePayment.ts',
          modelSelected: 'Claude 3.7 Sonnet',
          activeViewTab: 'code',
          codeSnippet: `// User prompt to Roseram Agent:
// "Implement a secure Stripe webhook handler with signature validation
// and subscription tier provisioning for Team and Enterprise users."

// Roseram Agent thinking process:
// 1. Identify webhook secret env var
// 2. Add signature verification logic
// 3. Update database subscription schema`,
          terminalOutput: '[ROSERAM AGENT] Analyzing dependency tree and security perimeter...\n[ROSERAM AGENT] Generated Plan with 3 sub-tasks: 1. Auth 2. Webhook 3. Database',
        },
        cursorAction: {
          target: 'agent-prompt-submit',
          actionType: 'click',
          xPercent: 70,
          yPercent: 78,
          label: 'Send Prompt to Agent',
        },
        calloutBadge: {
          text: 'Roseram breaks down complex tasks into transparent atomic stages',
          type: 'tip',
          position: 'top-right',
        },
      },
      {
        id: 'agentic-2',
        title: 'Reviewing the Diff Proposal',
        subtitle: 'Color-Coded Additions & Deletions Review',
        narration: 'Unlike wild autocompletions that overwrite your files unchecked, Roseram renders a clear side-by-side diff proposal before any file is touched.',
        duration: 10,
        focusArea: 'proposals',
        simulatedUI: {
          activeFile: 'src/api/stripe/webhook.ts',
          activeViewTab: 'diff',
          proposalDiff: {
            fileName: 'src/api/stripe/webhook.ts',
            added: [
              '+ const sig = req.headers["stripe-signature"];',
              '+ const event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);',
              '+ switch (event.type) {',
              '+   case "customer.subscription.created":',
              '+     await handleNewSubscription(event.data.object);',
              '+     break;',
              '+ }',
            ],
            removed: [
              '- // TODO: implement signature verification',
              '- console.log("Received webhook", req.body);',
            ],
            status: 'pending',
          },
          terminalOutput: '[ROSERAM PROPOSAL #108] Verification: Stripe API v2024-06-20 compliant\nDiff status: 7 lines added, 2 lines removed.',
        },
        cursorAction: {
          target: 'diff-inspector-line',
          actionType: 'highlight',
          xPercent: 50,
          yPercent: 42,
          label: 'Inspect Security Logic',
        },
        calloutBadge: {
          text: 'Accept with Enter or reject with Esc without breaking your git tree',
          type: 'shortcut',
          position: 'bottom-right',
        },
      },
      {
        id: 'agentic-3',
        title: 'Interactive Terminal Execution',
        subtitle: 'Real-time Test Run & Dependency Resolution',
        narration: 'Next, the agent executes test suites inside the sandboxed terminal to guarantee no regressions were introduced by the newly added code.',
        duration: 9,
        focusArea: 'terminal',
        simulatedUI: {
          activeFile: 'src/api/stripe/webhook.ts',
          terminalCommand: 'pnpm vitest run src/api/stripe',
          terminalOutput: `✓ src/api/stripe/webhook.test.ts (3 tests)
  ✓ rejects invalid signature with 400
  ✓ provisions Team plan on customer.subscription.created
  ✓ handles idempotent event replay
Test Files  1 passed (1)
     Tests  3 passed (3)
  Duration  184ms`,
        },
        cursorAction: {
          target: 'terminal-status-pass',
          actionType: 'hover',
          xPercent: 32,
          yPercent: 75,
          label: '3 of 3 Tests Passed',
        },
        calloutBadge: {
          text: 'Terminal output runs directly in your browser without requiring Docker',
          type: 'pro',
          position: 'top-left',
        },
      },
      {
        id: 'agentic-4',
        title: 'Acceptance & Git Commit',
        subtitle: 'Automatic Commit Messages & Branch Cleanliness',
        narration: 'Accept the proposal with one click. Roseram automatically packages the change into a clean Git commit with comprehensive message context.',
        duration: 8,
        focusArea: 'ide',
        simulatedUI: {
          activeFile: 'src/api/stripe/webhook.ts',
          gitBranch: 'feat/stripe-webhooks',
          proposalDiff: {
            fileName: 'src/api/stripe/webhook.ts',
            added: ['+ Webhook verified successfully'],
            removed: [],
            status: 'accepted',
          },
          terminalOutput: '[GIT] Committed 4b92ec1: "feat(stripe): add signature verification and webhook handlers"\n[ROSERAM] All changes accepted and synced.',
        },
        cursorAction: {
          target: 'git-commit-badge',
          actionType: 'click',
          xPercent: 84,
          yPercent: 12,
          label: 'Push to Remote Branch',
        },
        calloutBadge: {
          text: 'You maintain 100% human-in-the-loop control over every line of code',
          type: 'pro',
          position: 'center',
        },
      },
    ],
  },
  {
    id: 'roseram-301-campaign-studio',
    title: 'Generative Campaign Studio: Marketing from Any URL',
    description: 'Transform any public website URL into multi-channel marketing campaigns, high-converting email sequences, and social creatives.',
    category: 'Campaign Studio',
    estimatedDuration: 40,
    targetAudience: 'Growth Marketer',
    aspectRatio: '16:9',
    themeColor: 'cyan',
    voice: 'Puck',
    tags: ['Marketing', 'Campaign Studio', 'Email Automation', 'Copywriting'],
    scenes: [
      {
        id: 'camp-1',
        title: 'Entering the Target URL',
        subtitle: 'Autonomous Value Proposition Extraction',
        narration: 'Roseram isn’t just for coding. Open the Generative Campaign Studio and paste any public URL. Roseram crawls the landing page and identifies your core audience.',
        duration: 8,
        focusArea: 'campaign',
        simulatedUI: {
          activeViewTab: 'campaign',
          campaignAsset: {
            title: 'SaaS Onboarding Sequence',
            channel: 'Email Sequence',
            hook: 'Stop wrestling with 6 disconnected AI subscriptions.',
            content: 'URL Ingested: https://roseram.com\nValue Prop Extracted: Unified browser-first AI workspace with multi-model routing and bounded automation.',
          },
          terminalOutput: '[CAMPAIGN-STUDIO] Crawled target URL: https://roseram.com\n[CAMPAIGN-STUDIO] Extracted 4 primary user personas and 7 conversion triggers.',
        },
        cursorAction: {
          target: 'campaign-url-input',
          actionType: 'type',
          xPercent: 42,
          yPercent: 24,
          label: 'Paste Public URL',
        },
        calloutBadge: {
          text: 'Campaign Studio works on any competitor or company website',
          type: 'tip',
          position: 'top-right',
        },
      },
      {
        id: 'camp-2',
        title: 'Generating Conversion Email Sequences',
        subtitle: 'Multi-Step Drip Sequence with Dynamic Hooks',
        narration: 'Within seconds, Roseram generates a high-converting 3-part email welcome sequence tailored to developer and founder pain points.',
        duration: 9,
        focusArea: 'campaign',
        simulatedUI: {
          activeViewTab: 'campaign',
          campaignAsset: {
            title: 'Welcome Email #1: The Fragmented AI Problem',
            channel: 'Email Sequence',
            hook: 'Subject: Why switching between 5 AI tabs is costing you 4 hours a week',
            content: `Hey {{first_name}},

If your browser tab bar looks like ChatGPT, Cursor, Midjourney, and Claude all competing for memory, you're not alone.

That's exactly why we built Roseram: a single browser workspace that routes between the world's best models automatically.

Click here to try your first prompt in under 30 seconds ->`,
          },
          terminalOutput: '[CAMPAIGN-STUDIO] Generated 3 sequence variations with 98% deliverability score.',
        },
        cursorAction: {
          target: 'email-preview-tab',
          actionType: 'click',
          xPercent: 62,
          yPercent: 35,
          label: 'Inspect Email Sequence',
        },
        calloutBadge: {
          text: 'Emails are pre-formatted for HubSpot, Mailchimp, and Customer.io',
          type: 'pro',
          position: 'bottom-left',
        },
      },
      {
        id: 'camp-3',
        title: 'Generating Social Creatives & Ad Angles',
        subtitle: 'LinkedIn Thought Leadership & X Launch Threads',
        narration: 'Toggle to Social Creatives to get viral LinkedIn carousel copy, Twitter launch threads, and Meta ad hooks ready for distribution.',
        duration: 8,
        focusArea: 'campaign',
        simulatedUI: {
          activeViewTab: 'campaign',
          campaignAsset: {
            title: 'LinkedIn Launch Post',
            channel: 'LinkedIn Post',
            hook: 'Most engineers don’t need more AI models. They need better routing.',
            content: `Here is the unspoken truth about frontier AI:

Model A is 3x better at code diffs.
Model B is 5x faster at customer inquiries.
Model C wins on deep STEM reasoning.

Instead of paying $100/mo for each, Roseram connects them into a unified browser IDE.

Here is the 60-second video demo showing how: 🧵👇`,
          },
          terminalOutput: '[CAMPAIGN-STUDIO] Generated 5 organic post angles with hashtag analysis.',
        },
        cursorAction: {
          target: 'social-channel-toggle',
          actionType: 'click',
          xPercent: 78,
          yPercent: 28,
          label: 'Toggle to LinkedIn Creatives',
        },
        calloutBadge: {
          text: 'Includes targeted hashtags and engagement hook prompts',
          type: 'tip',
          position: 'top-left',
        },
      },
      {
        id: 'camp-4',
        title: 'Exporting Campaigns & Webhooks',
        subtitle: 'Export to Markdown, CSV, or Webhook Automation',
        narration: 'Export your copy directly into your marketing stack or copy it with a single click. Marketing campaign creation in Roseram takes minutes, not days.',
        duration: 7,
        focusArea: 'campaign',
        simulatedUI: {
          activeViewTab: 'campaign',
          campaignAsset: {
            title: 'Export Package Ready',
            channel: 'Email Sequence',
            hook: '4 Emails + 3 Social Posts + 2 Ad Variants',
            content: 'All campaign assets bundled into campaign-package.zip with markdown copy and metadata tags.',
          },
          terminalOutput: '[EXPORT] Campaign exported successfully. Copied to clipboard!',
        },
        cursorAction: {
          target: 'campaign-export-btn',
          actionType: 'click',
          xPercent: 88,
          yPercent: 18,
          label: 'Export Campaign Package',
        },
        calloutBadge: {
          text: 'Ready to launch your product campaign with zero copywriting fatigue',
          type: 'pro',
          position: 'center',
        },
      },
    ],
  },
  {
    id: 'roseram-401-token-ledger-costs',
    title: 'Multi-Model Cost Optimization & Token Ledger',
    description: 'Track real-time token consumption, compare pricing between Claude, GPT, and Gemini, and optimize your monthly AI spend.',
    category: 'Multi-Model',
    estimatedDuration: 36,
    targetAudience: 'Founder',
    aspectRatio: '16:9',
    themeColor: 'amber',
    voice: 'Zephyr',
    tags: ['Cost Optimization', 'Token Ledger', 'Analytics', 'Enterprise'],
    scenes: [
      {
        id: 'ledger-1',
        title: 'Opening the Roseram Token Ledger',
        subtitle: 'Granular Per-Session Cost Transparency',
        narration: 'Roseram gives you complete transparency over token usage. Open the Token Ledger to monitor real-time consumption across every AI engine.',
        duration: 8,
        focusArea: 'ledger',
        simulatedUI: {
          activeViewTab: 'ledger',
          tokenCount: 48250,
          costEstimate: '$0.142',
          terminalOutput: `[ROSERAM-LEDGER] Session Tokens: 48,250
- Claude 3.7 Sonnet: 32,100 tokens ($0.096)
- Gemini 2.5 Pro: 12,400 tokens ($0.031)
- GPT-4o Mini: 3,750 tokens ($0.015)
Effective Cost Reduction via Multi-Routing: 68.4% vs monolithic API.`,
        },
        cursorAction: {
          target: 'ledger-tab-btn',
          actionType: 'click',
          xPercent: 82,
          yPercent: 12,
          label: 'View Token Ledger',
        },
        calloutBadge: {
          text: 'No surprise bills! Hard budget limits can be configured per project',
          type: 'warning',
          position: 'top-right',
        },
      },
      {
        id: 'ledger-2',
        title: 'Comparing Model Price vs Speed',
        subtitle: 'Auto-Routing Queries to the Most Cost-Effective Model',
        narration: 'Why pay flagship prices for simple unit tests? Configure Roseram to route lightweight edits to fast models, reserving frontier models for hard architectural challenges.',
        duration: 9,
        focusArea: 'router',
        simulatedUI: {
          activeFile: 'roseram-routing-rules.json',
          activeViewTab: 'code',
          codeSnippet: `{
  "rules": [
    { "type": "regex_or_boilerplate", "target": "gpt-4o-mini", "savings": "85%" },
    { "type": "ast_refactor_and_diff", "target": "claude-3.7-sonnet", "savings": "Quality-first" },
    { "type": "large_repo_indexing", "target": "gemini-2.5-pro", "savings": "70%" }
  ]
}`,
          terminalOutput: '[ROUTER OPTIMIZER] 14 requests routed to cost-saving tiers. Saved $1.42 this hour.',
        },
        cursorAction: {
          target: 'auto-route-toggle',
          actionType: 'click',
          xPercent: 55,
          yPercent: 48,
          label: 'Enable Cost-Optimized Routing',
        },
        calloutBadge: {
          text: 'Teams save an average of 40% to 70% on monthly AI token budgets',
          type: 'tip',
          position: 'bottom-right',
        },
      },
      {
        id: 'ledger-3',
        title: 'Setting Team Spend Caps & Quotas',
        subtitle: 'Enterprise Guardrails and Usage Alerts',
        narration: 'Set team-level spending caps, notify Slack when thresholds are crossed, and export monthly CSV audit reports for finance teams.',
        duration: 9,
        focusArea: 'ledger',
        simulatedUI: {
          activeViewTab: 'ledger',
          tokenCount: 124500,
          costEstimate: '$0.380',
          terminalOutput: '[GUARDRAILS] Monthly project cap: $25.00 | Current: $3.42 (13.6%)\n[ALERT] Webhook configured: Notify #dev-billing at 80% quota.',
        },
        cursorAction: {
          target: 'budget-cap-input',
          actionType: 'type',
          xPercent: 72,
          yPercent: 62,
          label: 'Set Spend Threshold',
        },
        calloutBadge: {
          text: 'Enterprise-grade governance built right into your browser IDE',
          type: 'pro',
          position: 'top-left',
        },
      },
    ],
  },
  {
    id: 'roseram-501-deploy-templates',
    title: 'Deploying 20+ Business Templates to Production',
    description: 'Jumpstart projects with pre-built production templates: modern SaaS dashboards, storefronts, and internal operations portals.',
    category: 'Deployment',
    estimatedDuration: 38,
    targetAudience: 'Founder',
    aspectRatio: '16:9',
    themeColor: 'violet',
    voice: 'Kore',
    tags: ['Templates', 'Deployment', 'Full-Stack', 'Production'],
    scenes: [
      {
        id: 'tmpl-1',
        title: 'Selecting a Business Template',
        subtitle: '20+ Curated Full-Stack Templates',
        narration: 'Start any product in seconds. Roseram offers over 20 pre-built business templates, from modern e-commerce storefronts to multi-tenant SaaS dashboards.',
        duration: 8,
        focusArea: 'ide',
        simulatedUI: {
          activeFile: 'templates/saas-dashboard/manifest.json',
          modelSelected: 'Multi-Model Auto',
          activeViewTab: 'code',
          codeSnippet: `{
  "template": "ai-saas-dashboard-pro",
  "stack": ["React 19", "Tailwind CSS v4", "TypeScript", "Lucide", "Motion"],
  "features": ["Auth", "Stripe Checkout", "Team RBAC", "Dark/Light Theme"],
  "readyForProduction": true
}`,
          terminalOutput: '[TEMPLATE ENGINE] Cloned "ai-saas-dashboard-pro". Running zero-config setup...',
        },
        cursorAction: {
          target: 'template-gallery-card',
          actionType: 'click',
          xPercent: 35,
          yPercent: 40,
          label: 'Select SaaS Dashboard Template',
        },
        calloutBadge: {
          text: 'Includes responsive design, auth scaffolding, and dark mode out of the box',
          type: 'tip',
          position: 'top-right',
        },
      },
      {
        id: 'tmpl-2',
        title: 'Customizing with Natural Language',
        subtitle: 'Tailoring Branding, Colors, and Features',
        narration: 'Ask Roseram to customize the brand palette, replace hero copy, and wire up your specific business logic. The agent updates all components instantly.',
        duration: 9,
        focusArea: 'proposals',
        simulatedUI: {
          activeFile: 'src/theme/branding.config.ts',
          activeViewTab: 'diff',
          proposalDiff: {
            fileName: 'src/theme/branding.config.ts',
            added: [
              '+ export const brandConfig = {',
              '+   companyName: "HyperFlow AI",',
              '+   primaryColor: "#7c3aed", // Electric Violet',
              '+   accentColor: "#06b6d4",  // Cyber Cyan',
              '+ };',
            ],
            removed: [
              '- export const brandConfig = { companyName: "Acme Corp" };',
            ],
            status: 'accepted',
          },
          terminalOutput: '[ROSERAM] Theme tokens recompiled. HMR updated in 12ms.',
        },
        cursorAction: {
          target: 'apply-branding-btn',
          actionType: 'click',
          xPercent: 80,
          yPercent: 30,
          label: 'Apply Brand Customizations',
        },
        calloutBadge: {
          text: 'Tailwind CSS v4 variables update live without browser reload',
          type: 'pro',
          position: 'bottom-left',
        },
      },
      {
        id: 'tmpl-3',
        title: '1-Click Edge Deployment & Custom Domain',
        subtitle: 'Global CDN Hosting & SSL Provisioning',
        narration: 'When you are ready, hit Deploy. Roseram compiles your project to global edge servers with automated SSL certification and a custom domain ready to share.',
        duration: 8,
        focusArea: 'preview',
        simulatedUI: {
          activeViewTab: 'preview',
          livePreviewUrl: 'https://hyperflow-app.roseram.live',
          gitBranch: 'production',
          terminalOutput: `🚀 Deploying to Global Edge Network...
✓ Build passed in 1.2s
✓ SSL Certificate issued for hyperflow-app.roseram.live
✓ Health checks passed in 4 regions (US-East, EU-Central, AP-East)
Status: LIVE AT https://hyperflow-app.roseram.live`,
        },
        cursorAction: {
          target: 'deploy-production-btn',
          actionType: 'click',
          xPercent: 90,
          yPercent: 14,
          label: 'Deploy to Production',
        },
        calloutBadge: {
          text: 'Your app is live with zero devops overhead!',
          type: 'pro',
          position: 'center',
        },
      },
    ],
  },
];
