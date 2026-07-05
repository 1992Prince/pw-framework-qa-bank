/**
 * ============================================================================
 * TOPIC 13 — MOUSE ACTIONS
 * Website: BillPay Practice App | URL: .../index.html#/practice
 * ============================================================================
 * COVERS: drag and drop (dragTo() vs manual mouse.down/up), page.mouse.wheel(),
 *         scrollIntoViewIfNeeded(), infinite scroll pattern, page-level scroll
 * SOURCE: 02-actions.spec.ts, topics_03_click_operations_methods_spec.ts
 * ============================================================================
 *
 * CONCEPT
 * ────────
 * dragTo(target)  → high-level API. Internally does mouse move → down → move
 *                    → up, and AUTO-SCROLLS the page if needed. Use this first.
 *
 * Manual drag      → hover() → mouse.down() → hover(target) → mouse.up().
 * (page.mouse)       Use when dragTo() doesn't work — canvas elements, custom
 *                    drag libraries, or when you need precise intermediate
 *                    mouse positions (e.g. dragging in small increments).
 *
 * page.mouse.wheel(dx, dy) → simulates a real scroll-wheel event on whatever
 *                    is under the pointer. Needed when scrollIntoViewIfNeeded()
 *                    alone doesn't trigger a container's scroll (e.g. custom
 *                    scroll containers, infinite-scroll/lazy-load lists).
 *
 * scrollIntoViewIfNeeded() → scrolls just enough to bring an element into the
 *                    viewport. Most Playwright actions do this automatically
 *                    before interacting — call it explicitly only when you
 *                    need the scroll to happen BEFORE some other check.
 */

import { test, expect } from '@playwright/test';

const PRACTICE_URL = 'https://gauravkhurana.in/practise-api/ui/index.html#/practice';


// =============================================================================
// 13.1 — dragTo() — preferred, high-level drag and drop
// =============================================================================
test('13.1 — drag and drop using dragTo()', async ({ page }) => {
  await page.goto(PRACTICE_URL);

  const dropTarget = page.locator('#dropTarget');
  const item1 = page.getByText('Item 1');

  // dragTo() handles mouse move/down/move/up internally, and auto-scrolls
  await item1.dragTo(dropTarget);

  await page.pause();
});


// =============================================================================
// 13.2 — Manual drag and drop — page.mouse low-level control
// =============================================================================
test('13.2 — manual drag and drop using page.mouse', async ({ page }) => {
  await page.goto(PRACTICE_URL);

  const dragSource = page.getByText('Item 1');
  const dropTarget = page.locator('#dropTarget');

  await dragSource.hover();   // move pointer onto source
  await page.mouse.down();    // press and hold
  await dropTarget.hover();   // move pointer to target
  await page.mouse.up();      // release — drop complete

  // Optional: drag to exact coordinates instead of a locator
  // await page.mouse.move(400, 300);
});


// =============================================================================
// 13.3 — page.mouse.wheel() — scroll a container, then jump to a target
// =============================================================================
test('13.3 — scroll with mouse wheel then scrollIntoViewIfNeeded', async ({ page }) => {
  await page.goto(PRACTICE_URL);

  // Sometimes you must first bring the SCROLL CONTAINER into view before
  // wheel events will affect it
  const scrollSectionHeader = page.getByText('Infinite Scroll');
  await scrollSectionHeader.scrollIntoViewIfNeeded();

  await page.pause();

  // Focus/click an element inside the container so wheel events target it
  const firstItem = page.getByText('Item #1', { exact: true });
  await firstItem.focus();
  await firstItem.click();

  // Each wheel() call scrolls the container down by the given pixel amount
  await page.mouse.wheel(0, 500);
  await page.mouse.wheel(0, 500);
  await page.mouse.wheel(0, 200);

  // Once close enough, scrollIntoViewIfNeeded() finishes the job precisely
  const targetItem = page.getByText('Item #31');
  await targetItem.scrollIntoViewIfNeeded();

  await page.pause();
});


// =============================================================================
// 13.4 — INFINITE SCROLL PATTERN — loop until target appears
// =============================================================================
/**
 * Classic pattern for lazy-loaded lists: keep scrolling in a loop, checking
 * visibility each time, until the target element finally renders.
 */
test('13.4 — infinite scroll — loop until item is visible', async ({ page }) => {
  await page.goto(PRACTICE_URL);

  const scrollSection = page.getByText('Infinite Scroll');
  await scrollSection.scrollIntoViewIfNeeded();
  await page.getByTestId('scroll-item-1').click();

  const targetItem = page.getByText('Item #44');

  while (!(await targetItem.isVisible())) {
    await page.mouse.wheel(0, 500);
  }

  await targetItem.scrollIntoViewIfNeeded();
  await targetItem.click();

  await page.pause();
});


// =============================================================================
// 13.5 — PAGE-LEVEL SCROLL — top / bottom via page.evaluate()
// =============================================================================
/**
 * For scrolling the whole page (not a sub-container), page.evaluate() with
 * native window.scrollTo() is the simplest, most reliable approach.
 */
test('13.5 — scroll page to bottom and back to top', async ({ page }) => {
  await page.goto(PRACTICE_URL);

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.pause();
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.pause();
});


// =============================================================================
// 📌 QUICK REFERENCE — TOPIC 13
// =============================================================================
/**
 * ┌───────────────────────────────┬────────────────────────────────────┬──────────────────────────────────┐
 * │ Method                          │ Behavior                             │ When to use                          │
 * ├───────────────────────────────┼────────────────────────────────────┼──────────────────────────────────┤
 * │ locator.dragTo(target)          │ Full drag+drop, auto-scrolls        │ Default choice — try this first     │
 * │ hover()+mouse.down/up()         │ Manual, step-by-step drag           │ Canvas, custom drag libs, dragTo()   │
 * │                                  │                                      │ not working                          │
 * │ page.mouse.wheel(dx, dy)        │ Real scroll-wheel simulation        │ Custom scroll containers, infinite   │
 * │                                  │                                      │ scroll / lazy-loaded lists           │
 * │ scrollIntoViewIfNeeded()        │ Scrolls element into viewport       │ Precise final positioning; most      │
 * │                                  │                                      │ actions already do this automatically│
 * │ page.evaluate(window.scrollTo)  │ Native page-level scroll            │ Scroll whole page top/bottom         │
 * └───────────────────────────────┴────────────────────────────────────┴──────────────────────────────────┘
 *
 * 🎯 INTERVIEW POINT: dragTo() vs manual mouse.down/up
 *   dragTo() is preferred for standard HTML5/library drag-drop — it's one
 *   line and auto-scrolls. Fall back to manual page.mouse control only when
 *   dragTo() fails to trigger the app's drag logic (common with canvas-based
 *   or custom JS drag implementations that need real, granular mouse events).
 */