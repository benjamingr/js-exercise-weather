const { launch } = require('@testim/root-cause');
const assert = require('assert');

// Too lazy to add a test runner like Jest/Mocha but probably should  ¯\_(ツ)_/¯
launch({ testName: 'Sanity' }, async (page) => {
  // eslint-disable-next-line global-require
  require('./dev-server/dev-server');
  // wait for server to start
  await retry(() => page.goto('http://localhost:1337'));
  await page.setRequestInterception(true);
  page.on('request', (request) => {
    request.respond({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockApiResponse()),
    });
  });

  await page.click('body > div.tabs-wrapper > a:nth-child(3)');
  await page.waitForSelector('.weather-info__location', {
    visible: true,
  });
  const location = await page.evaluate((() => document.querySelector('.weather-info__location').textContent));
  assert.equal(location, 'Paris');
  const temp = await page.evaluate((() => document.querySelector('.weather-info__temperature').textContent));
  assert.equal(temp, '0');
  const desc = await page.evaluate((() => document.querySelector('.weather-info__description').textContent));
  assert.equal(desc, 'Heavy Rain');
});

async function retry(fn) {
  // very very naive
  for (let i = 0; i < 10; i += 1) {
    try {
      // eslint-disable-next-line no-await-in-loop
      return await fn();
    } catch (e) {
      // eslint-disable-next-line no-await-in-loop
      await new Promise((r) => setTimeout(r, 100));
    }
  }
}
function mockApiResponse() {
  return {
    currently: {
      temperature: 32,
      icon: 'rain',
      summary: 'Heavy Rain',
    },
  };
}
