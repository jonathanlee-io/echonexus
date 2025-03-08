import {show} from './views/message';
import Alpine from 'alpinejs';
import requests from 'alpinejs-requests';

const supportedAPI = ['init', 'message']; // enlist all methods supported by API (e.g. `mw('event', 'user-login');`)

/**
 The main entry of the application
 */
function app(window) {
  window.alpine = Alpine;
  Alpine.plugin(requests);
  Alpine.start();

  Alpine.store('api', {
    baseUrl: 'http://jdevel.api.echonexus-local.io:8000/v1',
    reportBug(url, body) {
      fetch(url, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }).then((r) => console.log(r));
    },
  });

  console.log('echonexus Widget Starting...');

  // set default configurations
  let configurations = {
    project: null,
  };

  // all methods that were called till now and stored in queue
  // needs to be called now
  let globalObject = window[window['JS-Widget']];
  const queue = globalObject.q;
  if (queue) {
    for (let i = 0; i < queue.length; i++) {
      if (queue[i][0].toLowerCase() === 'init') {
        configurations = extendObject(configurations, queue[i][1]);
        console.log('echonexus Widget successfully started', configurations);
      } else apiHandler(queue[i][0], queue[i][1]);
    }
  }

  // override temporary (until the app loaded) handler
  // for widget's API calls
  globalObject = apiHandler;
  globalObject.configurations = configurations;
}

/**
 Method that handles all API calls
 */
function apiHandler(api, params) {
  if (!api) throw Error('API method required');
  api = api.toLowerCase();

  if (supportedAPI.indexOf(api) === -1)
    throw Error(`Method ${api} is not supported`);

  console.log(`Handling API call ${api}`, params);

  switch (api) {
    case 'message':
      show(params);
      break;
    default:
      console.warn(`No handler defined for ${api}`);
  }
}

function extendObject(a, b) {
  for (const key in b) if (b.hasOwnProperty(key)) a[key] = b[key];
  return a;
}

app(window);
