# 🌤 Meridian — Weather & World Clock
 
A real-time weather dashboard with live world clocks. Search any city to instantly see current weather conditions, a 7-day forecast, and the local time for that city — all in one clean interface.
 
---
 
## 📸 Preview
 
> Dark glassmorphism UI with live weather data, metric cards, and a dynamic world clock.
 
---
 
## ✨ Features
 
- 🌡 **Current Weather** — temperature, feels like, condition, high/low
- 📅 **7-Day Forecast** — daily weather icons and temperature range
- 💧 **Weather Metrics** — rain probability, humidity, wind speed, visibility
- 🌅 **Sunrise & Sunset** times for the searched city
- 🕐 **Live World Clocks** — Mumbai (local) + any searched city (updates dynamically)
- 🔍 **City Search** — search any city by name, press Enter or click the button
- 📱 **Responsive** — works on desktop and mobile
 
---
 
## 🛠 Tech Stack
 
| Layer | Technology |
|-------|-----------|
| Structure | HTML5 |
| Styling | CSS3 (Glassmorphism, CSS Variables, Flexbox) |
| Logic | Vanilla JavaScript (ES6+) |
| Weather API | [Open-Meteo](https://open-meteo.com/) — free, no API key needed |
| Geocoding API | [Open-Meteo Geocoding](https://open-meteo.com/en/docs/geocoding-api) |
| Fonts | Google Fonts — DM Serif Display, DM Mono, DM Sans |
 
> No frameworks. No dependencies. No API key required.
 
---
 
## 🚀 Getting Started
 
### 1. Clone the repo
 
```bash
git clone https://github.com/your-username/meridian-weather-clock.git
cd meridian-weather-clock
```
 
### 2. Open in browser
 
Just open `index.html` directly in your browser — no build step, no server needed:
 
```bash
open index.html
```
 
Or drag and drop `index.html` into any browser window.
 
---
 
## 📁 Project Structure
 
```
meridian-weather-clock/
│
├── index.html       # App structure and layout
├── style.css        # Styling, glassmorphism, animations, responsive
├── script.js        # Weather API calls, clocks, DOM updates
└── README.md        # You are here
```
 
---
 
## 🌐 APIs Used
 
### Weather — Open-Meteo
```
https://api.open-meteo.com/v1/forecast
```
- Free, no API key required
- Provides current weather and daily forecast
- Parameters used: `temperature_2m`, `apparent_temperature`, `weather_code`, `wind_speed_10m`, `relative_humidity_2m`, `precipitation_probability`, `visibility`, `sunrise`, `sunset`
 
### Geocoding — Open-Meteo Geocoding
```
https://geocoding-api.open-meteo.com/v1/search
```
- Converts city name → latitude, longitude, timezone
- Free, no API key required
 
---
 
## 🔍 How Search Works
 
1. User types a city name and presses **Enter** or clicks the **search button**
2. App calls the **Geocoding API** to get coordinates and timezone
3. App calls the **Weather API** with those coordinates
4. All weather fields update with live data
5. The **global clock** switches to that city's timezone instantly
 
---
 
## 🎨 Design
 
- **Theme** — Dark glassmorphism with navy gradient background
- **Colors** — `#0b1120` background · `#f0c040` accent · `#7eb8f7` condition text
- **Fonts** — DM Serif Display (headings) · DM Mono (data) · DM Sans (body)
- **Effects** — backdrop blur, atmospheric glow blobs, hover lift on cards, fade-in animations
 
---
 
## 📱 Responsive Breakpoints
 
| Screen | Behaviour |
|--------|-----------|
| `> 900px` | Side-by-side layout — weather left, forecast right |
| `≤ 900px` | Stacked layout — forecast wraps below, clocks hidden |
| `≤ 600px` | Compact padding and smaller city name font |
 
---
 
## Sources
 
- Weather data by [Open-Meteo](https://open-meteo.com/)
- Fonts by [Google Fonts](https://fonts.google.com/)
- Icons — native emoji (no icon library needed)
 
---
 
## 📄 License
 
MIT — free to use, modify, and distribute.
