/**
 * Runtime detection, provider-agnostic
 *
 * Single source of truth for determining whether the webview is running
 * inside an IDE extension (VS Code, Cursor, Windsurf, etc.) or standalone
 * in a browser.
 */

declare function acquireVsCodeApi(): unknown;

type Runtime = 'vscode' | 'browser';
// Future: 'cursor' | 'windsurf' | 'electron' | etc.

const runtime: Runtime = typeof acquireVsCodeApi !== 'undefined' ? 'vscode' : 'browser';

export const isBrowserRuntime = runtime === 'browser';

/**
 * True only under the Playwright e2e harness, which sets `__PIXEL_AGENTS_E2E`
 * via `addInitScript` before any app code runs (so it's set in every frame,
 * including the VS Code webview iframe). Gates test-only diagnostics
 * (window.__pixelAgentsTestHooks message/sound logs, the addAgent wrapper) so
 * they never run, and never grow unbounded, in a real user's session.
 */
export const isE2E: boolean =
  typeof window !== 'undefined' &&
  (window as unknown as { __PIXEL_AGENTS_E2E?: boolean }).__PIXEL_AGENTS_E2E === true;

/**
 * True when the embedder set `__PIXEL_AGENTS_FORCE_DESKTOP` before any app code
 * ran. Keeps the desktop layout at any viewport width, for hosts that drive the
 * full App headlessly at a size of their choosing -- Pixel Index's static
 * renderer sizes the viewport to the layout, so a narrow office would otherwise
 * get the mobile shell and its card bar would shift the canvas. Separate from
 * isE2E because the e2e suite itself exercises the mobile shell.
 */
export const forceDesktop: boolean =
  typeof window !== 'undefined' &&
  (window as unknown as { __PIXEL_AGENTS_FORCE_DESKTOP?: boolean }).__PIXEL_AGENTS_FORCE_DESKTOP ===
    true;
