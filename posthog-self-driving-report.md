# PostHog Self-driving setup report

## Summary

PostHog Self-driving is configured for the 7Pacific Hydrogen storefront. Session Replay, Error Tracking, and Support are enabled; health, error, and support signal sources are enabled; and a focused scout troop plus two Replay Vision monitors are armed.

Findings will start appearing in the [Self-driving inbox](https://us.posthog.com/project/625541/inbox) within about 30 minutes after fresh data arrives.

## AI data processing

Approved by the wizard gate before this setup ran.

## GitHub

The PostHog GitHub App was already connected before this run. GitHub Issues was not selected as an external Self-driving responder.

## Products enabled

| Product                 | Result  | SDK check                                                                                                    |
| ----------------------- | ------- | ------------------------------------------------------------------------------------------------------------ |
| Session Replay          | enabled | Browser `posthog.init` does not disable recording.                                                           |
| Error Tracking          | enabled | Browser initialization has `capture_exceptions: true`; the server client also enables exception autocapture. |
| Support (Conversations) | enabled | Tickets will arrive only after an inbound email, inbox, or Slack channel is connected in PostHog.            |

## Signal sources

| Source product   | Source type                | Action                                                                                    |
| ---------------- | -------------------------- | ----------------------------------------------------------------------------------------- |
| `health_checks`  | `health_issue`             | Enabled — source config `01a0d1a7-cfd8-7539-9925-d5fdf5e4c0f9`.                           |
| `error_tracking` | `issue_created`            | Enabled — source config `01a0d1a7-d073-728a-aa9f-22be45a0b80c`.                           |
| `error_tracking` | `issue_reopened`           | Enabled — source config `01a0d1a7-d089-76e7-b793-0aa875f5dc71`.                           |
| `error_tracking` | `issue_spiking`            | Enabled — source config `01a0d1a7-cfe2-759d-817a-025ac4a9c3d1`.                           |
| `conversations`  | `ticket`                   | Enabled — source config `01a0d1a7-d0a6-7f27-81e5-890ac13e12e9`.                           |
| `signals_scout`  | `cross_source_issue`       | No row created; scout findings are enabled by default.                                    |
| `session_replay` | `session_analysis_cluster` | Deliberately skipped; this retired route is replaced by the Replay Vision scanners below. |
| `replay_vision`  | scanner-owned              | No source row created; each scanner is self-authorized with `emits_signals: true`.        |

## Connected tools

No external tool responder was selected. The GitHub App remains connected, but no GitHub Issues responder was enabled.

| Tool          | Result   |
| ------------- | -------- |
| GitHub Issues | not used |
| Linear        | not used |
| Jira          | not used |
| Sentry        | not used |
| Zendesk       | not used |

## Scout troop

**Run budget:** 100 runs per day; 0 used today and 100 remaining when configured. The early-access banner says: “Scouts are in early access. Each project gets up to 100 scout runs a day. Contact team-self-driving@posthog.com if you need more.”

### Enabled (5)

| Scout                     | Why it is active                                                                                   |
| ------------------------- | -------------------------------------------------------------------------------------------------- |
| General                   | Watches cross-product correlations and surfaces without a specialist.                              |
| Product analytics         | Watches the storefront’s product and journey metrics.                                              |
| Web analytics             | Watches acquisition, landing-page health, and traffic changes.                                     |
| Observability gaps        | Identifies material events without monitoring coverage.                                            |
| Commerce handoff (custom) | Watches the product-to-cart-to-checkout handoff for broad-impact liveness and conversion failures. |

### Disabled (23)

| Scout              | Reason it is disabled                                                                                   |
| ------------------ | ------------------------------------------------------------------------------------------------------- |
| AI observability   | No LLM telemetry evidence.                                                                              |
| Anomaly detection  | No established dashboards or insights to monitor yet.                                                   |
| APM                | No tracing/APM evidence.                                                                                |
| Conversations      | Support channel has not yet been connected.                                                             |
| CSP violations     | CSP headers exist, but no CSP reporting surface is configured.                                          |
| Customer analytics | This is a guest DTC storefront, not a B2B account product.                                              |
| Data pipelines     | No pipeline or batch-export evidence.                                                                   |
| Data warehouse     | No warehouse source was selected.                                                                       |
| Error tracking     | Covered by the enabled native Error Tracking source.                                                    |
| Experiments        | No active experiment evidence.                                                                          |
| Feature flags      | No active feature-flag evidence.                                                                        |
| Inbox validation   | Fresh setup has no resolved fixes to validate yet.                                                      |
| Insight alerts     | No existing insight-alert surface.                                                                      |
| Logs               | No PostHog logs-product evidence.                                                                       |
| MCP tool calls     | Not a product surface for this storefront.                                                              |
| PR follow-up       | No shipped Self-driving fixes to follow yet.                                                            |
| Replay Vision      | No accumulated Replay Vision observations yet; the two monitors below provide recording-level coverage. |
| Revenue analytics  | No revenue warehouse source or completed-order event surface.                                           |
| Session replay     | Covered by the Replay Vision monitors below.                                                            |
| Skills store       | Not an active product surface.                                                                          |
| Surveys            | No surveys exist.                                                                                       |
| Tasks              | No PostHog Tasks surface evidence.                                                                      |
| Web vitals         | No web-vitals product evidence.                                                                         |

## Custom scouts

### Created

| Scout                            | Surface and discriminator                                                                                                                                                                                        | Why it adds coverage                                                                                                                                                                                                                                                                               |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `signals-scout-commerce-handoff` | Cart-to-checkout health. It compares completed-window shopper progression and distinct-shopper reach, reporting only when storefront activity is healthy but add-to-cart or checkout handoff materially weakens. | It is tailored to the code-defined commerce sequence: product view, add-to-cart, cart updates, checkout handoff, and direct checkout links. The built-in Product analytics scout covers saved flow-rate regressions, but this scout also owns downstream silence and broad-reach handoff failures. |

### Considered and not created

| Surface                         | Decision                                                                                                                                    |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Newsletter and waitlist capture | Proposed as a focused audience-capture scout and declined. Web analytics partially covers traffic, but not the newsletter/waitlist outcome. |
| Error bursts                    | Ruled out because the native Error Tracking responder owns this route.                                                                      |
| Replay friction                 | Ruled out because Replay Vision monitors own this route.                                                                                    |
| Revenue completion              | Ruled out because checkout completes outside this storefront and no completed-order signal or revenue warehouse source is present.          |

If a custom scout becomes noisy, set its config’s `emit` field to `false` in PostHog to keep it running in dry-run mode without sending inbox reports.

## Replay Vision scanners

A scanner is an LLM that watches individual session recordings on a schedule and pushes what it finds to the Self-driving inbox. It is the only component in this setup that spends Replay Vision quota. Findings enter at half weight, so they need independent corroboration before being promoted into an inbox report.

No recordings existed at setup time. Both scanners are armed, enabled, and begin observing as soon as recordings arrive. The organization had 2,500 credits remaining (0 used) and both initial estimates were zero observations / zero credits because no recordings matched yet.

| Brief               | Scanner                            | Status  | Watches                                                                                                                            | Query scope                                                                                                                    | Sampling | Estimate                                        |
| ------------------- | ---------------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | -------- | ----------------------------------------------- |
| Breakage monitor    | Cart and checkout breakage         | created | Visible cart page failures, failed cart updates, blank/loading failures, and checkout handoff that does not progress.              | Recordings that visit `/cart`; this is the storefront-controlled completion step before the external Shopify checkout handoff. | 50%      | 0 observations/month; 0 credits/month at setup. |
| Frustration monitor | Storefront interaction frustration | created | Repeated clicks and visible struggles around adding to cart, choosing size/color, updating cart state, and proceeding to checkout. | `$rageclick` only; intentionally not URL-scoped to avoid overlapping the breakage monitor.                                     | 100%     | 0 observations/month; 0 credits/month at setup. |

Once observations arrive, rate them in Replay Vision with thumbs up or down to receive a configuration recommendation you can review.

## Follow-ups

- [ ] Connect an inbound Support channel (email, inbox, or Slack) in PostHog so enabled ticket signals can arrive.
- [ ] Generate real browser traffic after deployment so Session Replay and the two armed Replay Vision monitors can begin observing recordings.
- [ ] If completed-order monitoring is needed, add a server-side purchase event or a Shopify/revenue warehouse source; the current storefront instrumentation stops at checkout handoff.
- [ ] The setup MCP token lacks `property_definition:read`, so event-schema confirmation was not available during setup. The custom scout is written to validate its required event schema before judging; reauthorize the MCP connection with that scope if you want future setup runs to verify it directly.

## What happens next

Fresh scout configurations are picked up by the coordinator within about 30 minutes and draw from the daily run budget. Self-driving clusters corroborated findings into inbox reports, where immediately actionable reports can start coding tasks.

## Repository changes

Created `posthog-self-driving-report.md`. No application source files, dependencies, or environment files were changed.
