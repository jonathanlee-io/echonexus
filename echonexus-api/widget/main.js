import {show} from './views/message';
import Alpine from 'alpinejs';

const supportedAPI = ['init', 'message']; // enlist all methods supported by API (e.g. `mw('event', 'user-login');`)

/**
 The main entry of the application
 */
function app(window) {
  window.alpine = Alpine;
  Alpine.plugin(requests);
  Alpine.start();

  Alpine.store('api', {
    baseUrl: `https://${window.location.hostname.split('.')[0]}.api.echonexus.io/v1`,

    isMainMenuOpen: false,
    isBugReportOpen: false,
    isFeatureRequestOpen: false,
    isFeatureFeedbackOpen: false,
    isSubmissionSuccessfulOpen: false,

    openMainMenu() {
      this.isMainMenuOpen = true;
      this.isBugReportOpen = false;
      this.isFeatureRequestOpen = false;
      this.isFeatureFeedbackOpen = false;
      this.isSubmissionSuccessfulOpen = false;
      this.userFeedback = '';
    },

    closeMainMenu() {
      this.isMainMenuOpen = false;
    },

    openBugReportMenu() {
      this.isMainMenuOpen = true;
      this.isBugReportOpen = true;
      this.isFeatureRequestOpen = false;
      this.isFeatureFeedbackOpen = false;
      this.isSubmissionSuccessfulOpen = false;
    },

    openFeatureRequestMenu() {
      this.isMainMenuOpen = true;
      this.isBugReportOpen = false;
      this.isFeatureRequestOpen = true;
      this.isFeatureFeedbackOpen = false;
      this.isSubmissionSuccessfulOpen = false;
    },

    openFeatureFeedbackMenu() {
      this.isMainMenuOpen = true;
      this.isBugReportOpen = false;
      this.isFeatureRequestOpen = false;
      this.isFeatureFeedbackOpen = true;
      this.isSubmissionSuccessfulOpen = false;
    },

    submitFeedback(url, body) {
      fetch(`${url}?${new URLSearchParams(body)}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
        mode: 'no-cors',
      }).then(() => {
        this.isMainMenuOpen = true;
        this.isBugReportOpen = false;
        this.isFeatureRequestOpen = false;
        this.isFeatureFeedbackOpen = false;
        this.isSubmissionSuccessfulOpen = true;
      });
    },

    closeNonMainMenu() {
      this.isMainMenuOpen = true;
      this.isBugReportOpen = false;
      this.isFeatureRequestOpen = false;
      this.isFeatureFeedbackOpen = false;
    },

    closeSuccessModal() {
      this.isSubmissionSuccessfulOpen = false;
      this.isMainMenuOpen = false;
      this.isBugReportOpen = false;
      this.isFeatureRequestOpen = false;
      this.isFeatureFeedbackOpen = false;
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
