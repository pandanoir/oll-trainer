// eslint-disable-next-line @typescript-eslint/no-var-requires
const fetchPolyfill = require('whatwg-fetch');

global.fetch = fetchPolyfill.fetch;
global.Request = fetchPolyfill.Request;
global.Response = fetchPolyfill.Response;
global.Headers = fetchPolyfill.Headers;

jest.useFakeTimers().setSystemTime(new Date('2020-09-30').getTime());
