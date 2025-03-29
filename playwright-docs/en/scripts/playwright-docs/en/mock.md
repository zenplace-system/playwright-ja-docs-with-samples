# Mock APIs | Playwright

Source: https://playwright.dev/docs/mock

Downloaded: 2025-03-29T01:18:06.734Z

---

*   [](/)
*   Guides
*   Mock APIs

On this page

Mock APIs
=========

Introduction[​](#introduction "Direct link to Introduction")
------------------------------------------------------------

Web APIs are usually implemented as HTTP endpoints. Playwright provides APIs to **mock** and **modify** network traffic, both HTTP and HTTPS. Any requests that a page does, including [XHRs](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest) and [fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) requests, can be tracked, modified and mocked. With Playwright you can also mock using HAR files that contain multiple network requests made by the page.

Mock API requests[​](#mock-api-requests "Direct link to Mock API requests")
---------------------------------------------------------------------------

The following code will intercept all the calls to `*/**/api/v1/fruits` and will return a custom response instead. No requests to the API will be made. The test goes to the URL that uses the mocked route and asserts that mock data is present on the page.

    test("mocks a fruit and doesn't call api", async ({ page }) => {  // Mock the api call before navigating  await page.route('*/**/api/v1/fruits', async route => {    const json = [{ name: 'Strawberry', id: 21 }];    await route.fulfill({ json });  });  // Go to the page  await page.goto('https://demo.playwright.dev/api-mocking');  // Assert that the Strawberry fruit is visible  await expect(page.getByText('Strawberry')).toBeVisible();});

You can see from the trace of the example test that the API was never called, it was however fulfilled with the mock data. ![api mocking trace](https://github.com/microsoft/playwright/assets/13063165/3dc14cbf-c100-4efc-ac21-d7b52d698b53)

Read more about [advanced networking](/docs/network).

Modify API responses[​](#modify-api-responses "Direct link to Modify API responses")
------------------------------------------------------------------------------------

Sometimes, it is essential to make an API request, but the response needs to be patched to allow for reproducible testing. In that case, instead of mocking the request, one can perform the request and fulfill it with the modified response.

In the example below we intercept the call to the fruit API and add a new fruit called 'Loquat', to the data. We then go to the url and assert that this data is there:

    test('gets the json from api and adds a new fruit', async ({ page }) => {  // Get the response and add to it  await page.route('*/**/api/v1/fruits', async route => {    const response = await route.fetch();    const json = await response.json();    json.push({ name: 'Loquat', id: 100 });    // Fulfill using the original response, while patching the response body    // with the given JSON object.    await route.fulfill({ response, json });  });  // Go to the page  await page.goto('https://demo.playwright.dev/api-mocking');  // Assert that the new fruit is visible  await expect(page.getByText('Loquat', { exact: true })).toBeVisible();});

In the trace of our test we can see that the API was called and the response was modified. ![trace of test showing api being called and fulfilled](https://github.com/microsoft/playwright/assets/13063165/8b8dd82d-1b3e-428e-871b-840581fed439)

By inspecting the response we can see that our new fruit was added to the list. ![trace of test showing the mock response](https://github.com/microsoft/playwright/assets/13063165/03e6c87c-4ecc-47e8-9ca0-30fface25e9d)

Read more about [advanced networking](/docs/network).

Mocking with HAR files[​](#mocking-with-har-files "Direct link to Mocking with HAR files")
------------------------------------------------------------------------------------------

A HAR file is an [HTTP Archive](http://www.softwareishard.com/blog/har-12-spec/) file that contains a record of all the network requests that are made when a page is loaded. It contains information about the request and response headers, cookies, content, timings, and more. You can use HAR files to mock network requests in your tests. You'll need to:

1.  Record a HAR file.
2.  Commit the HAR file alongside the tests.
3.  Route requests using the saved HAR files in the tests.

### Recording a HAR file[​](#recording-a-har-file "Direct link to Recording a HAR file")

To record a HAR file we use [page.routeFromHAR()](/docs/api/class-page#page-route-from-har) or [browserContext.routeFromHAR()](/docs/api/class-browsercontext#browser-context-route-from-har) method. This method takes in the path to the HAR file and an optional object of options. The options object can contain the URL so that only requests with the URL matching the specified glob pattern will be served from the HAR File. If not specified, all requests will be served from the HAR file.

Setting `update` option to true will create or update the HAR file with the actual network information instead of serving the requests from the HAR file. Use it when creating a test to populate the HAR with real data.

    test('records or updates the HAR file', async ({ page }) => {  // Get the response from the HAR file  await page.routeFromHAR('./hars/fruit.har', {    url: '*/**/api/v1/fruits',    update: true,  });  // Go to the page  await page.goto('https://demo.playwright.dev/api-mocking');  // Assert that the fruit is visible  await expect(page.getByText('Strawberry')).toBeVisible();});

### Modifying a HAR file[​](#modifying-a-har-file "Direct link to Modifying a HAR file")

Once you have recorded a HAR file you can modify it by opening the hashed .txt file inside your 'hars' folder and editing the JSON. This file should be committed to your source control. Anytime you run this test with `update: true` it will update your HAR file with the request from the API.

    [  {    "name": "Playwright",    "id": 100  },  // ... other fruits]

### Replaying from HAR[​](#replaying-from-har "Direct link to Replaying from HAR")

Now that you have the HAR file recorded and modified the mock data, it can be used to serve matching responses in the test. For this, just turn off or simply remove the `update` option. This will run the test against the HAR file instead of hitting the API.

    test('gets the json from HAR and checks the new fruit has been added', async ({ page }) => {  // Replay API requests from HAR.  // Either use a matching response from the HAR,  // or abort the request if nothing matches.  await page.routeFromHAR('./hars/fruit.har', {    url: '*/**/api/v1/fruits',    update: false,  });  // Go to the page  await page.goto('https://demo.playwright.dev/api-mocking');  // Assert that the Playwright fruit is visible  await expect(page.getByText('Playwright', { exact: true })).toBeVisible();});

In the trace of our test we can see that the route was fulfilled from the HAR file and the API was not called. ![trace showing the HAR file being used](https://github.com/microsoft/playwright/assets/13063165/1bd7ab66-ea4f-43c2-a4e5-ca17d4837ff1)

If we inspect the response we can see our new fruit was added to the JSON, which was done by manually updating the hashed `.txt` file inside the `hars` folder. ![trace showing response from HAR file](https://github.com/microsoft/playwright/assets/13063165/db3117fc-7b02-4973-9a51-29e213261a6a)

HAR replay matches URL and HTTP method strictly. For POST requests, it also matches POST payloads strictly. If multiple recordings match a request, the one with the most matching headers is picked. An entry resulting in a redirect will be followed automatically.

Similar to when recording, if given HAR file name ends with `.zip`, it is considered an archive containing the HAR file along with network payloads stored as separate entries. You can also extract this archive, edit payloads or HAR log manually and point to the extracted har file. All the payloads will be resolved relative to the extracted har file on the file system.

#### Recording HAR with CLI[​](#recording-har-with-cli "Direct link to Recording HAR with CLI")

We recommend the `update` option to record HAR file for your test. However, you can also record the HAR with Playwright CLI.

Open the browser with Playwright CLI and pass `--save-har` option to produce a HAR file. Optionally, use `--save-har-glob` to only save requests you are interested in, for example API endpoints. If the har file name ends with `.zip`, artifacts are written as separate files and are all compressed into a single `zip`.

    # Save API requests from example.com as "example.har" archive.npx playwright open --save-har=example.har --save-har-glob="**/api/**" https://example.com

Read more about [advanced networking](/docs/network).

Mock WebSockets[​](#mock-websockets "Direct link to Mock WebSockets")
---------------------------------------------------------------------

The following code will intercept WebSocket connections and mock entire communcation over the WebSocket, instead of connecting to the server. This example responds to a `"request"` with a `"response"`.

    await page.routeWebSocket('wss://example.com/ws', ws => {  ws.onMessage(message => {    if (message === 'request')      ws.send('response');  });});

Alternatively, you may want to connect to the actual server, but intercept messages in-between and modify or block them. Here is an example that modifies some of the messages sent by the page to the server, and leaves the rest unmodified.

    await page.routeWebSocket('wss://example.com/ws', ws => {  const server = ws.connectToServer();  ws.onMessage(message => {    if (message === 'request')      server.send('request2');    else      server.send(message);  });});

For more details, see [WebSocketRoute](/docs/api/class-websocketroute "WebSocketRoute").