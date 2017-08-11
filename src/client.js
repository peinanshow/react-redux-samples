import React from "react";
import ReactDOM from "react-dom";
import configureStore from "./store/configureStore";
import {Provider} from "react-redux";
import {Router, Route, IndexRoute, useRouterHistory} from "react-router";
import {createHistory} from "history";
import {settings} from "./config";
import {loginByToken} from "./actions/AuthActionCreators";
import {addLocaleData} from "react-intl";
import en from "react-intl/locale-data/en";
import ru from "react-intl/locale-data/ru";
import zh from "react-intl/locale-data/zh";
import App from "./views/App";
import Auth from "./views/Auth";
import Portal from "./views/Portal";

import "babel-polyfill";

// Import i18n assets

// Import Views

addLocaleData([...en, ...ru, ...zh]);

// Define user's language. Different browsers have the user locale defined
// on different fields on the `navigator` object, so we make sure to account
// for these different by checking all of them
const language = (navigator.languages && navigator.languages[0]) || navigator.language || navigator.userLanguage;

// Split locales with a region code
const locale = language.toLowerCase().split(/[_-]+/)[0];

// Extract i18n messages
fetch(`${settings.basename}/i18n/${locale}.json`)
  .then((response) => {
    if (response.status >= 400) throw new Error('Bad response from server');
    return response.json();
  })
  .then((localeData) => {
    // Configure the app store
    const store = configureStore({
      intl: {
        locale,
        messages: localeData,
      },
    });

    // Run our app under the /base URL.
    const browserHistory = useRouterHistory(createHistory)({
      basename: settings.basename,
    });

    function validateToken() {
      return new Promise((resolve, reject) => {
        const {auth} = store.getState();
        if (!auth.token) return reject();
        // ensure we have a valid token
        return store.dispatch(loginByToken(auth.token)).then(() =>
          store.getState().auth.isAuthenticated
            ? resolve() // token is valid
            : reject() // token is not valid
        );
      });
    }

    function getViewComponent(query) {
      switch (query) {
        case 'viewer':
        case 'designer':
        default:
          return Portal;
      }
    }

    ReactDOM.render(
      <Provider store={store}>
        <Router history={browserHistory}>
          <Route path="/" component={App}>
            <IndexRoute
              getComponent={(nextState, cb) => {
                const { auth } = store.getState();
                if (auth.isAuthenticated) {
                  cb(null, getViewComponent(nextState.location.query.handler));
                } else {
                    validateToken()
                      .then(
                        () => cb(null, getViewComponent(nextState.location.query.handler)), // resolve
                        () => cb(null, Auth), // reject
                      );
                }
              }
              }
            />
          </Route>
        </Router>
      </Provider>,
      document.getElementById('root')
    );
  });


