# Touch events (legacy) | Playwright

Source: https://playwright.dev/docs/touch-events

Downloaded: 2025-03-29T01:18:19.568Z

---

*   [](/)
*   Guides
*   Touch events (legacy)

On this page

Touch events (legacy)
=====================

Introduction[​](#introduction "Direct link to Introduction")
------------------------------------------------------------

Web applications that handle legacy [touch events](https://developer.mozilla.org/en-US/docs/Web/API/Touch_events) to respond to gestures like swipe, pinch, and tap can be tested by manually dispatching [TouchEvent](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent/TouchEvent)s to the page. The examples below demonstrate how to use [locator.dispatchEvent()](/docs/api/class-locator#locator-dispatch-event) and pass [Touch](https://developer.mozilla.org/en-US/docs/Web/API/Touch) points as arguments.

### Emulating pan gesture[​](#emulating-pan-gesture "Direct link to Emulating pan gesture")

In the example below, we emulate pan gesture that is expected to move the map. The app under test only uses `clientX/clientY` coordinates of the touch point, so we initialize just that. In a more complex scenario you may need to also set `pageX/pageY/screenX/screenY`, if your app needs them.

    import { test, expect, devices, type Locator } from '@playwright/test';test.use({ ...devices['Pixel 7'] });async function pan(locator: Locator, deltaX?: number, deltaY?: number, steps?: number) {  const { centerX, centerY } = await locator.evaluate((target: HTMLElement) => {    const bounds = target.getBoundingClientRect();    const centerX = bounds.left + bounds.width / 2;    const centerY = bounds.top + bounds.height / 2;    return { centerX, centerY };  });  // Providing only clientX and clientY as the app only cares about those.  const touches = [{    identifier: 0,    clientX: centerX,    clientY: centerY,  }];  await locator.dispatchEvent('touchstart',      { touches, changedTouches: touches, targetTouches: touches });  steps = steps ?? 5;  deltaX = deltaX ?? 0;  deltaY = deltaY ?? 0;  for (let i = 1; i <= steps; i++) {    const touches = [{      identifier: 0,      clientX: centerX + deltaX * i / steps,      clientY: centerY + deltaY * i / steps,    }];    await locator.dispatchEvent('touchmove',        { touches, changedTouches: touches, targetTouches: touches });  }  await locator.dispatchEvent('touchend');}test(`pan gesture to move the map`, async ({ page }) => {  await page.goto('https://www.google.com/maps/place/@37.4117722,-122.0713234,15z',      { waitUntil: 'commit' });  await page.getByRole('button', { name: 'Keep using web' }).click();  await expect(page.getByRole('button', { name: 'Keep using web' })).not.toBeVisible();  // Get the map element.  const met = page.locator('[data-test-id="met"]');  for (let i = 0; i < 5; i++)    await pan(met, 200, 100);  // Ensure the map has been moved.  await expect(met).toHaveScreenshot();});

### Emulating pinch gesture[​](#emulating-pinch-gesture "Direct link to Emulating pinch gesture")

In the example below, we emulate pinch gesture, i.e. two touch points moving closer to each other. It is expected to zoom out the map. The app under test only uses `clientX/clientY` coordinates of touch points, so we initialize just that. In a more complex scenario you may need to also set `pageX/pageY/screenX/screenY`, if your app needs them.

    import { test, expect, devices, type Locator } from '@playwright/test';test.use({ ...devices['Pixel 7'] });async function pinch(locator: Locator,  arg: { deltaX?: number, deltaY?: number, steps?: number, direction?: 'in' | 'out' }) {  const { centerX, centerY } = await locator.evaluate((target: HTMLElement) => {    const bounds = target.getBoundingClientRect();    const centerX = bounds.left + bounds.width / 2;    const centerY = bounds.top + bounds.height / 2;    return { centerX, centerY };  });  const deltaX = arg.deltaX ?? 50;  const steps = arg.steps ?? 5;  const stepDeltaX = deltaX / (steps + 1);  // Two touch points equally distant from the center of the element.  const touches = [    {      identifier: 0,      clientX: centerX - (arg.direction === 'in' ? deltaX : stepDeltaX),      clientY: centerY,    },    {      identifier: 1,      clientX: centerX + (arg.direction === 'in' ? deltaX : stepDeltaX),      clientY: centerY,    },  ];  await locator.dispatchEvent('touchstart',      { touches, changedTouches: touches, targetTouches: touches });  // Move the touch points towards or away from each other.  for (let i = 1; i <= steps; i++) {    const offset = (arg.direction === 'in' ? (deltaX - i * stepDeltaX) : (stepDeltaX * (i + 1)));    const touches = [      {        identifier: 0,        clientX: centerX - offset,        clientY: centerY,      },      {        identifier: 0,        clientX: centerX + offset,        clientY: centerY,      },    ];    await locator.dispatchEvent('touchmove',        { touches, changedTouches: touches, targetTouches: touches });  }  await locator.dispatchEvent('touchend', { touches: [], changedTouches: [], targetTouches: [] });}test(`pinch in gesture to zoom out the map`, async ({ page }) => {  await page.goto('https://www.google.com/maps/place/@37.4117722,-122.0713234,15z',      { waitUntil: 'commit' });  await page.getByRole('button', { name: 'Keep using web' }).click();  await expect(page.getByRole('button', { name: 'Keep using web' })).not.toBeVisible();  // Get the map element.  const met = page.locator('[data-test-id="met"]');  for (let i = 0; i < 5; i++)    await pinch(met, { deltaX: 40, direction: 'in' });  // Ensure the map has been zoomed out.  await expect(met).toHaveScreenshot();});