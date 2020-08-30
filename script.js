// write your code here

const tabsWrapper$ = document.querySelector('.tabs-wrapper');
const errorText$ = document.querySelector('.error-text');
const loader$ = document.querySelector('.loader');
const degrees$ = document.querySelector('.weather-info__temperature');
const location$ = document.querySelector('.weather-info__location');
const container$ = document.querySelector('.weather-info');

let controller;
tabsWrapper$.addEventListener('click', async (e) => {
  if (!e.target.classList.contains('tab')) {
    return;
  }
  const { lat, long } = await getLocationFromSelection(e.target);
  const locationName = e.target.textContent;
  if (controller) {
    controller.abort();
  }
  controller = new AbortController();
  renderSelection(e.target);
  try {
    renderLoader();
    const degrees = await getWeatherInCelcius({ lat, long, signal: controller.signal });
    renderWeather({ degrees, locationName });
  } catch (err) {
    renderError(err);
  } finally {
    hideLoader();
  }
});

const API_BASE = 'https://api.darksky.net/forecast/557ecd4b8c8bbba02f4a50afe884934b';
/* eslint-disable-next-line no-restricted-globals */
const API_URL = location.href.includes('localhost') ? './' : API_BASE;

const getWeather = ({ lat, long, signal }) => fetch(`${API_URL}/${lat},${long}`, { signal });

async function getLocationFromSelection(target) {
  const { long, lat, iscurrent } = target.dataset;
  if (!iscurrent) {
    return { long, lat };
  }
  if (!navigator.geolocation) {
    throw new Error('Current location disabled due to browser limitation');
  }
  const response = await new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
  const { latitude, longitude } = response.coords;
  return { long: longitude, lat: latitude };
}
async function getWeatherInCelcius({ lat, long, signal }) {
  const weather = await getWeather({ lat, long, signal }).then((x) => x.json());
  const farenheit = weather?.currently?.temperature;
  return ((farenheit - 32) * 5) / 9;
}
function renderWeather({ degrees, locationName }) {
  errorText$.style.display = 'none';
  degrees$.textContent = degrees?.toFixed(0);
  location$.textContent = locationName;
}
function renderSelection(target) {
  tabsWrapper$.querySelectorAll('.tab').forEach((e) => e.classList.remove('selected'));
  target.classList.add('selected');
}
function renderError(e) {
  errorText$.textContent = e?.message ?? e;
  errorText$.style.display = 'block';
}
function renderLoader() {
  loader$.style.display = 'block';
  container$.setAttribute('hidden', 'true');
}

function hideLoader() {
  loader$.style.display = 'none';
  container$.removeAttribute('hidden');
}
