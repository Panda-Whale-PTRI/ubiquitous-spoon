import { clearPersistence, persistState, getPersistence } from '../localStorage';
import { clearUser } from '../actions/actions';

const auth = {};

auth.createAuthHeader = () => {
  const appJWTToken = getPersistence('token');
  //localStorage.getItem('token');

  return `Bearer ${appJWTToken}`;
};

auth.logout = (props) => {
  const url = '/api/logout';

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: auth.createAuthHeader(),
    },
  }).catch((err) => console.log('Error from the request to Logout'));

  // localStorage.setItem('token', '');
  const intervalId = getPersistence('intervalId');
  clearInterval(intervalId);
  clearPersistence();
  props.clearUser();
};

auth.silentRefreshTimer = (token_expiry, username) => {
  const url = '/api/refresh_token';

  // Take the expiration time from the JWT - current time - 10 secs
  // refreshToken will be triggered every ~10 mins
  const intervalTime = token_expiry * 1000 - Date.now() - 10000;

  // Call /refresh_token 2min & 50sec after initial call
  const id = setInterval(function () {
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: auth.createAuthHeader(),
      },
      body: JSON.stringify({ username }),
    });
  }, intervalTime);

  persistState('intervalId', id);
};

export default auth;
