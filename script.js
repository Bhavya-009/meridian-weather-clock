// Global Time
let globalTimezone = 'Europe/London';
let globalCityName = 'London';

// Live Time
function updateClocks() {
  const now = new Date();

  // LEFT clock — always Mumbai (local)
  const mumbai = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  document.getElementById('local-time').textContent = fmt(mumbai);

  // RIGHT clock — searched city
  try {
    const global = new Date(now.toLocaleString('en-US', { timeZone: globalTimezone }));
    document.getElementById('global-time').textContent = fmt(global);
    document.getElementById('global-city').textContent = globalCityName;
  } catch (_) { }
}

// TIME Format
function fmt(d) {
  return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

updateClocks();
setInterval(updateClocks, 1000);

//  WMO Weather Code : label + emoji 
const WMO = {
  0: ['Clear Sky', '☀️'],
  1: ['Mainly Clear', '🌤'],
  2: ['Partly Cloudy', '⛅'],
  3: ['Overcast', '☁️'],
  45: ['Foggy', '🌫'],
  48: ['Icy Fog', '🌫'],
  51: ['Light Drizzle', '🌦'],
  53: ['Drizzle', '🌦'],
  55: ['Heavy Drizzle', '🌧'],
  61: ['Light Rain', '🌧'],
  63: ['Rain', '🌧'],
  65: ['Heavy Rain', '🌧'],
  71: ['Light Snow', '🌨'],
  73: ['Snow', '❄️'],
  75: ['Heavy Snow', '❄️'],
  80: ['Rain Showers', '🌦'],
  81: ['Heavy Showers', '🌧'],
  95: ['Thunderstorm', '⛈'],
  96: ['Thunderstorm + Hail', '⛈'],
  99: ['Severe Thunderstorm', '⛈'],
};
function wmoInfo(code) {
  return WMO[code] || ['Unknown', '🌡'];
}

// Loading Circle (Spinner)
function setLoading(on) {
  const btn = document.getElementById('search-btn');
  btn.innerHTML = on
    ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83">
          <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.8s" repeatCount="indefinite"/>
        </path>
       </svg>`
    : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
       </svg>`;
  btn.disabled = on;
}

// ERROR
function showError(msg) {
  const el = document.getElementById('city-name');
  el.textContent = msg;
  el.style.color = '#f07060';
  setTimeout(() => { el.style.color = ''; }, 3000);
}

// Geocode city name : { name, lat, lon, timezone, country }
async function geocodeCity(city) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
  const res = await fetch(url);
  const data = await res.json();
  if (!data.results || data.results.length === 0) throw new Error('City not found');
  const r = data.results[0];
  return { name: r.name, lat: r.latitude, lon: r.longitude, timezone: r.timezone, country: r.country_code };
}

// Fetch weather from Open-Meteo
async function fetchWeather(lat, lon, timezone) {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    timezone,
    current: [
      'temperature_2m', 'apparent_temperature', 'weather_code',
      'relative_humidity_2m', 'wind_speed_10m',
      'precipitation_probability', 'visibility'
    ].join(','),
    daily: [
      'weather_code', 'temperature_2m_max', 'temperature_2m_min',
      'sunrise', 'sunset'
    ].join(','),
    forecast_days: 8,
    wind_speed_unit: 'kmh',
  });
  const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
  return res.json();
}

// "06:32" from ISO string 
function fmtTime(iso) {
  return iso ? iso.slice(11, 16) : '--:--';
}

// Populate all weather fields 
function populateWeather(geo, w) {
  const c = w.current;
  const d = w.daily;
  const [condLabel, condIcon] = wmoInfo(c.weather_code);

  document.getElementById('city-name').textContent = `${geo.name}, ${geo.country}`;
  document.getElementById('temperature').textContent = `${Math.round(c.temperature_2m)}°`;
  document.getElementById('condition').textContent = condLabel;
  document.getElementById('feels-like').textContent = `Feels like ${Math.round(c.apparent_temperature)}°`;
  document.getElementById('hi-lo').textContent = `H: ${Math.round(d.temperature_2m_max[0])}°  L: ${Math.round(d.temperature_2m_min[0])}°`;
  document.getElementById('weather-icon').textContent = condIcon;
  document.getElementById('rain').textContent = `${c.precipitation_probability ?? 0}%`;
  document.getElementById('humidity').textContent = `${c.relative_humidity_2m}%`;
  document.getElementById('air').textContent = `${Math.round(c.wind_speed_10m)} km/h`;
  document.getElementById('visibility').textContent = `${(c.visibility / 1000).toFixed(1)} km`;
  document.getElementById('sunrise').textContent = fmtTime(d.sunrise[0]);
  document.getElementById('sunset').textContent = fmtTime(d.sunset[0]);
  document.getElementById('city-date').textContent = new Date().toLocaleDateString('en-US', {
    weekday: 'long', day: 'numeric', month: 'long'
  });

  // 7-day forecast
  const list = document.getElementById('forecast-list');
  list.innerHTML = '';
  for (let i = 1; i <= 7; i++) {
    const date = new Date(d.time[i] + 'T12:00:00');
    const label = i === 1 ? 'Tomorrow' : date.toLocaleDateString('en-US', { weekday: 'long' });
    const [, fIcon] = wmoInfo(d.weather_code[i]);
    const item = document.createElement('div');
    item.className = 'forecast-item';
    item.innerHTML = `
      <span class="f-day">${label}</span>
      <span class="f-icon">${fIcon}</span>
      <span class="f-range">${Math.round(d.temperature_2m_max[i])}° / ${Math.round(d.temperature_2m_min[i])}°</span>
    `;
    list.appendChild(item);
  }

  // Update global clock to the searched city
  globalTimezone = geo.timezone;
  globalCityName = geo.name;
  updateClocks();
}

// Main: geocode + fetch + render
async function loadCity(cityName) {
  setLoading(true);
  try {
    const geo = await geocodeCity(cityName);
    const weather = await fetchWeather(geo.lat, geo.lon, geo.timezone);
    populateWeather(geo, weather);
  } catch (e) {
    showError(e.message === 'City not found' ? '🔍 City not found' : '⚠ Network error');
    console.error(e);
  } finally {
    setLoading(false);
  }
}

// Default on load
loadCity('London');

// ── Search handlers ──
function handleSearch() {
  const val = document.getElementById('search-input').value.trim();
  if (!val) return;
  loadCity(val);
  document.getElementById('search-input').value = '';
}

document.getElementById('search-btn').addEventListener('click', handleSearch);
document.getElementById('search-input').addEventListener('keydown', e => {
  if (e.key === 'Enter') handleSearch();
});