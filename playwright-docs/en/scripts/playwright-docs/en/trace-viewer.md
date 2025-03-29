# Trace viewer | Playwright

Source: https://playwright.dev/docs/trace-viewer

Downloaded: 2025-03-29T01:18:20.835Z

---

*   [](/)
*   Guides
*   Trace viewer

On this page

Trace viewer
============

Introduction[​](#introduction "Direct link to Introduction")
------------------------------------------------------------

Playwright Trace Viewer is a GUI tool that helps you explore recorded Playwright traces after the script has run. Traces are a great way for debugging your tests when they fail on CI. You can open traces [locally](#opening-the-trace) or in your browser on [trace.playwright.dev](https://trace.playwright.dev).

Opening Trace Viewer[​](#opening-trace-viewer "Direct link to Opening Trace Viewer")
------------------------------------------------------------------------------------

You can open a saved trace using either the Playwright CLI or in the browser at [trace.playwright.dev](https://trace.playwright.dev). Make sure to add the full path to where your `trace.zip` file is located.

    npx playwright show-trace path/to/trace.zip

### Using [trace.playwright.dev](https://trace.playwright.dev)[​](#using-traceplaywrightdev "Direct link to using-traceplaywrightdev")

[trace.playwright.dev](https://trace.playwright.dev) is a statically hosted variant of the Trace Viewer. You can upload trace files using drag and drop or via the `Select file(s)` button.

Trace Viewer loads the trace entirely in your browser and does not transmit any data externally.

![Drop Playwright Trace to load](https://user-images.githubusercontent.com/13063165/194577918-b4d45726-2692-4093-8a28-9e73552617ef.png)

### Viewing remote traces[​](#viewing-remote-traces "Direct link to Viewing remote traces")

You can open remote traces directly using its URL. This makes it easy to view the remote trace without having to manually download the file from CI runs, for example.

    npx playwright show-trace https://example.com/trace.zip

When using [trace.playwright.dev](https://trace.playwright.dev), you can also pass the URL of your uploaded trace at some accessible storage (e.g. inside your CI) as a query parameter. CORS (Cross-Origin Resource Sharing) rules might apply.

    https://trace.playwright.dev/?trace=https://demo.playwright.dev/reports/todomvc/data/fa874b0d59cdedec675521c21124e93161d66533.zip

Recording a trace[​](#recording-a-trace "Direct link to Recording a trace")
---------------------------------------------------------------------------

### Tracing locally[​](#tracing-locally "Direct link to Tracing locally")

To record a trace during development mode set the `--trace` flag to `on` when running your tests. You can also use [UI Mode](/docs/test-ui-mode) for a better developer experience, as it traces each test automatically.

    npx playwright test --trace on

You can then open the HTML report and click on the trace icon to open the trace.

    npx playwright show-report

### Tracing on CI[​](#tracing-on-ci "Direct link to Tracing on CI")

Traces should be run on continuous integration on the first retry of a failed test by setting the `trace: 'on-first-retry'` option in the test configuration file. This will produce a `trace.zip` file for each test that was retried.

*   Test
*   Library

playwright.config.ts

    import { defineConfig } from '@playwright/test';export default defineConfig({  retries: 1,  use: {    trace: 'on-first-retry',  },});

    const browser = await chromium.launch();const context = await browser.newContext();// Start tracing before creating / navigating a page.await context.tracing.start({ screenshots: true, snapshots: true });const page = await context.newPage();await page.goto('https://playwright.dev');// Stop tracing and export it into a zip archive.await context.tracing.stop({ path: 'trace.zip' });

Available options to record a trace:

*   `'on-first-retry'` - Record a trace only when retrying a test for the first time.
*   `'on-all-retries'` - Record traces for all test retries.
*   `'off'` - Do not record a trace.
*   `'on'` - Record a trace for each test. (not recommended as it's performance heavy)
*   `'retain-on-failure'` - Record a trace for each test, but remove it from successful test runs.

You can also use `trace: 'retain-on-failure'` if you do not enable retries but still want traces for failed tests.

There are more granular options available, see [testOptions.trace](/docs/api/class-testoptions#test-options-trace).

If you are not using Playwright as a Test Runner, use the [browserContext.tracing](/docs/api/class-browsercontext#browser-context-tracing) API instead.

Trace Viewer features[​](#trace-viewer-features "Direct link to Trace Viewer features")
---------------------------------------------------------------------------------------

### Actions[​](#actions "Direct link to Actions")

In the Actions tab you can see what locator was used for every action and how long each one took to run. Hover over each action of your test and visually see the change in the DOM snapshot. Go back and forward in time and click an action to inspect and debug. Use the Before and After tabs to visually see what happened before and after the action.

![actions tab in trace viewer](https://github.com/microsoft/playwright/assets/13063165/948b65cd-f0fd-4c7f-8e53-2c632b5a07f1)

**Selecting each action reveals:**

*   Action snapshots
*   Action log
*   Source code location

### Screenshots[​](#screenshots "Direct link to Screenshots")

When tracing with the [screenshots](/docs/api/class-tracing#tracing-start-option-screenshots) option turned on (default), each trace records a screencast and renders it as a film strip. You can hover over the film strip to see a magnified image of for each action and state which helps you easily find the action you want to inspect.

Double click on an action to see the time range for that action. You can use the slider in the timeline to increase the actions selected and these will be shown in the Actions tab and all console logs and network logs will be filtered to only show the logs for the actions selected.

![timeline view in trace viewer](https://github.com/microsoft/playwright/assets/13063165/b04a7d75-54bb-4ab2-9e30-e76f6f74a2c8)

### Snapshots[​](#snapshots "Direct link to Snapshots")

When tracing with the [snapshots](/docs/api/class-tracing#tracing-start-option-snapshots) option turned on (default), Playwright captures a set of complete DOM snapshots for each action. Depending on the type of the action, it will capture:

Type

Description

Before

A snapshot at the time action is called.

Action

A snapshot at the moment of the performed input. This type of snapshot is especially useful when exploring where exactly Playwright clicked.

After

A snapshot after the action.

Here is what the typical Action snapshot looks like:

![action tab in trace viewer](https://github.com/microsoft/playwright/assets/13063165/7168d549-eb0a-4964-9c93-483f03711fa9)

Notice how it highlights both, the DOM Node as well as the exact click position.

### Source[​](#source "Direct link to Source")

When you click on an action in the sidebar, the line of code for that action is highlighted in the source panel.

![showing source code tab in trace viewer](https://github.com/microsoft/playwright/assets/13063165/daa8845d-c250-4923-aa7a-5d040da9adc5)

### Call[​](#call "Direct link to Call")

The call tab shows you information about the action such as the time it took, what locator was used, if in strict mode and what key was used.

![showing call tab in trace viewer](https://github.com/microsoft/playwright/assets/13063165/95498580-f9dd-4932-a123-c37fe7cfc3c2)

### Log[​](#log "Direct link to Log")

See a full log of your test to better understand what Playwright is doing behind the scenes such as scrolling into view, waiting for element to be visible, enabled and stable and performing actions such as click, fill, press etc.

![showing log of tests in trace viewer](https://github.com/microsoft/playwright/assets/13063165/de621461-3bab-4140-b39d-9f02d6672dbf)

### Errors[​](#errors "Direct link to Errors")

If your test fails you will see the error messages for each test in the Errors tab. The timeline will also show a red line highlighting where the error occurred. You can also click on the source tab to see on which line of the source code the error is.

![showing errors in trace viewer](https://github.com/microsoft/playwright/assets/13063165/e9ef77b3-05d1-4df2-852c-981023723d34)

### Console[​](#console "Direct link to Console")

See console logs from the browser as well as from your test. Different icons are displayed to show you if the console log came from the browser or from the test file.

![showing log of tests in trace viewer](https://github.com/microsoft/playwright/assets/13063165/4107c08d-1eaf-421c-bdd4-9dd2aa641d4a)

Double click on an action from your test in the actions sidebar. This will filter the console to only show the logs that were made during that action. Click the _Show all_ button to see all console logs again.

Use the timeline to filter actions, by clicking a start point and dragging to an ending point. The console tab will also be filtered to only show the logs that were made during the actions selected.

### Network[​](#network "Direct link to Network")

The Network tab shows you all the network requests that were made during your test. You can sort by different types of requests, status code, method, request, content type, duration and size. Click on a request to see more information about it such as the request headers, response headers, request body and response body.

![network requests tab in trace viewer](https://github.com/microsoft/playwright/assets/13063165/0a3d1671-8ccd-4f7a-a844-35f5eb37f236)

Double click on an action from your test in the actions sidebar. This will filter the network requests to only show the requests that were made during that action. Click the _Show all_ button to see all network requests again.

Use the timeline to filter actions, by clicking a start point and dragging to an ending point. The network tab will also be filtered to only show the network requests that were made during the actions selected.

### Metadata[​](#metadata "Direct link to Metadata")

Next to the Actions tab you will find the Metadata tab which will show you more information on your test such as the Browser, viewport size, test duration and more.

![meta data in trace viewer](https://github.com/microsoft/playwright/assets/13063165/82ab3d33-1ec9-4b8a-9cf2-30a6e2d59091)

### Attachments[​](#attachments "Direct link to Attachments")

The "Attachments" tab allows you to explore attachments. If you're doing [visual regression testing](/docs/test-snapshots), you'll be able to compare screenshots by examining the image diff, the actual image and the expected image. When you click on the expected image you can use the slider to slide one image over the other so you can easily see the differences in your screenshots.

![attachments tab in trace viewer](https://github.com/microsoft/playwright/assets/13063165/4386178a-5808-4fa8-9436-315350a23b04)