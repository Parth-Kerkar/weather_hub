// Replace with your actual API keys
const WEATHER_API_KEY = "68b81e3893431d58a898cc15c29e4933";
const AQI_API_KEY = "0eba232661f29c16657f1f3bc8d3244069397613";

async function getWeatherData() {
  const city = document.getElementById("city-input").value;
  if (!city) return;

  const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric`);
  const weatherData = await weatherResponse.json();

  if (weatherData.cod !== 200) {
    alert("City not found");
    return;
  }

  const aqiResponse = await fetch(`https://api.waqi.info/feed/${city}/?token=${AQI_API_KEY}`);
  const aqiData = await aqiResponse.json();

  updateWeatherDisplay(weatherData);
  updateAQI(aqiData);
  updateAlerts(weatherData);
  updateSuggestions(weatherData, aqiData);
  updateTrivia();
}

async function compareCities() {
  const city1 = document.getElementById("city-input-1").value;
  const city2 = document.getElementById("city-input-2").value;

  if (!city1 || !city2) return;

  const [res1, res2] = await Promise.all([
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city1}&appid=${WEATHER_API_KEY}&units=metric`).then(res => res.json()),
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city2}&appid=${WEATHER_API_KEY}&units=metric`).then(res => res.json())
  ]);

  const output = `
    <h4>Comparison</h4>
    <p><strong>${res1.name}</strong>: ${res1.main.temp}°C, ${res1.weather[0].main}</p>
    <p><strong>${res2.name}</strong>: ${res2.main.temp}°C, ${res2.weather[0].main}</p>
  `;

  document.getElementById("comparison-display").innerHTML = output;
}

function updateWeatherDisplay(data) {
  const display = document.getElementById("weather-display");
  display.innerHTML = `
    <p><strong>${data.name}</strong> - ${data.weather[0].description}</p>
    <p><strong>Temperature:</strong> ${data.main.temp}°C</p>
    <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
    <p><strong>Wind Speed:</strong> ${data.wind.speed} m/s</p>
  `;
}

function updateAQI(data) {
  const aqiBox = document.getElementById("aqi-box");
  if (data.status === "ok") {
    aqiBox.innerHTML = `
      <p><strong>AQI:</strong> ${data.data.aqi} (${getAQIStatus(data.data.aqi)})</p>
    `;
  } else {
    aqiBox.innerHTML = "<p>Data unavailable</p>";
  }
}

function getAQIStatus(aqi) {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Moderate";
  if (aqi <= 150) return "Unhealthy for Sensitive Groups";
  if (aqi <= 200) return "Unhealthy";
  if (aqi <= 300) return "Very Unhealthy";
  return "Hazardous";
}

function updateAlerts(data) {
  const box = document.getElementById("alert-box");
  if (data.alerts && data.alerts.length > 0) {
    const alert = data.alerts[0];
    box.innerHTML = `
      <p><strong>⚠️ Alert:</strong> ${alert.event}</p>
      <p>${alert.description}</p>
    `;
  } else {
    box.innerHTML = "<p>No weather alerts</p>";
  }
}

function updateSuggestions(data, aqiData) {
  const container = document.getElementById("suggestions");
  container.innerHTML = "";

  const temp = data.main.temp;
  const weather = data.weather[0].main.toLowerCase();
  const wind = data.wind.speed;
  const aqi = aqiData.status === "ok" ? aqiData.data.aqi : null;

  if (temp >= 30) {
    container.innerHTML += "<div class='suggestion-card'>💧 Stay hydrated and avoid sun during peak hours.</div>";
    container.innerHTML += "<div class='suggestion-card'>🧴 Wear sunscreen and light clothing.</div>";
  } else if (temp <= 10) {
    container.innerHTML += "<div class='suggestion-card'>🧥 Dress warmly and layer your clothes.</div>";
    container.innerHTML += "<div class='suggestion-card'>🔥 Keep indoors heated and protect exposed skin.</div>";
  } else {
    container.innerHTML += "<div class='suggestion-card'>🌤️ Comfortable weather, enjoy a walk outside!</div>";
  }

  if (weather.includes("rain")) container.innerHTML += "<div class='suggestion-card'>☔ Carry an umbrella or raincoat.</div>";
  if (weather.includes("storm")) container.innerHTML += "<div class='suggestion-card'>⚡ Stay indoors and avoid metal objects during storms.</div>";
  if (weather.includes("fog")) container.innerHTML += "<div class='suggestion-card'>🌫️ Drive carefully and use low-beam headlights.</div>";
  if (wind > 10) container.innerHTML += "<div class='suggestion-card'>💨 Secure outdoor items due to strong winds.</div>";
  if (aqi !== null && aqi > 100) container.innerHTML += "<div class='suggestion-card'>😷 Air quality is poor, limit outdoor activity.</div>";
}

function updateTrivia() {
  const facts = [
    "Lightning strikes about 8 million times a day worldwide!",
    "The coldest temperature ever recorded was -89.2°C in Antarctica.",
    "Rain contains vitamin B12, especially in urban areas.",
    "The fastest wind speed ever recorded was 407 km/h during a tornado in Oklahoma.",
    "Clouds look white because they scatter all colors of light equally.",
    "Snowflakes can fall at speeds of up to 1.7 m/s!",
    "The Sahara Desert can sometimes experience snow.",
    "A cubic mile of ordinary fog contains less than a gallon of water.",
    "Raindrops can fall at speeds up to 22 miles per hour.",
    "The smell of rain is called petrichor.",
    "Thunder is caused by the rapid expansion of air surrounding a lightning bolt.",
    "A bolt of lightning is five times hotter than the surface of the sun.",
    "Tornadoes can have winds exceeding 300 miles per hour.",
    "Hurricanes can release energy equivalent to 10 atomic bombs per second.",
    "Some frogs can predict rain and become more active beforehand.",
    "The eye of a hurricane is calm and often clear.",
    "Rainbow colors always appear in the same order: red, orange, yellow, green, blue, indigo, violet.",
    "The hottest place on Earth is Death Valley, California.",
    "Dew forms when objects cool to the dew point and cause moisture in the air to condense.",
    "The Beaufort scale measures wind speed based on observed conditions.",
    "The heaviest hailstone recorded in the U.S. weighed over 1 kilogram.",
    "The term ‘monsoon’ means seasonal wind.",
    "Ice crystals in clouds are responsible for many optical phenomena like halos and sundogs.",
    "It can snow even when the surface temperature is above freezing.",
    "There are more than 1,800 thunderstorms occurring at any given moment worldwide.",
    "A heatwave can cause the rails of train tracks to bend.",
    "The term 'El Niño' refers to a warm ocean current that affects global weather.",
    "Wind chill measures how cold it feels based on wind speed and temperature.",
    "A mirage occurs when light bends due to layers of hot and cold air.",
    "The term 'derecho' describes a widespread, long-lived windstorm.",
    "Volcanic eruptions can influence global weather patterns.",
    "In Antarctica, it’s so dry it's considered a polar desert.",
    "Blizzards can reduce visibility to near zero for hours.",
    "There is a place in Colombia where it rains almost every day: Lloro.",
    "The UK is known for having over 100 words to describe different types of rain.",
    "Dust storms on Mars can engulf the entire planet.",
    "The Coriolis effect makes cyclones spin clockwise in the southern hemisphere.",
    "It can rain fish in some parts of the world due to waterspouts.",
    "The word 'hurricane' comes from the Taino Native American word 'hurucane'.",
    "Polar stratospheric clouds glow in the dark and help form ozone holes.",
    "Dry lightning is lightning without rain and is a major wildfire threat.",
    "A rainbow is actually a full circle, but the ground blocks the bottom half.",
    "There are entire weather systems on other planets—Jupiter’s Great Red Spot is a huge storm!",
    "The sound of thunder travels at about 343 m/s in dry air.",
    "Snowflakes have six sides due to how water molecules bond.",
    "You can estimate lightning distance by counting seconds between the flash and the thunder.",
    "Fog is essentially a low-lying cloud that touches the ground.",
    "Ball lightning is a rare form of lightning that appears as glowing spheres.",
    "Tsunamis aren't weather, but underwater earthquakes—they often coincide with severe storms.",
    "Waterspouts are tornadoes that form over water.",
    "Typhoons and hurricanes are the same phenomenon in different parts of the world.",
    "Meteorology is the science of weather forecasting.",
    "A weather balloon can reach altitudes of 35 km or more.",
    "Atmospheric pressure drops as you go higher in altitude, affecting weather conditions."
  ];
  const box = document.querySelector(".trivia-box");
  const randomFact = facts[Math.floor(Math.random() * facts.length)];
  box.innerHTML = `<p>${randomFact}</p>`;
}

const jokes = [
    "Why did the tornado break up with the hurricane? It had too many issues spinning around.",
    "What’s a tornado’s favorite game? Twister!",
    "What did one raindrop say to the other? Two’s company, three’s a cloud!",
    "Why don’t meteorologists trust stairs? They’re always up to something.",
    "How do hurricanes see? With one eye!",
    "Why don't people trust the rain? It's always dropping in unannounced.",
    "Why did the sun break up with the clouds? They were always throwing shade.",
    "Why don't meteorologists trust a calm breeze? It's often just shooting the breeze before a storm.",
    "Why are thermometers bad at keeping secrets? They're always revealing the temperature.",
    "Why don't people trust fog? It's always a bit misty-rious.",
    "Why did the snowdrift get a timeout? It was always up to snow good.",
    "Why don't sailors trust a waterspout? It's always trying to stir up trouble.",
    "Why was the lightning bolt always invited to parties? It knew how to electrify a crowd, but couldn't be trusted not to shock someone.",
    "Why don't campers trust a sudden gust of wind? It's always trying to tent-erfere.",
    "Why did the hail storm get a bad review? It really hammered the point home.",
    "Why don't artists trust rainbows? They're always a bit too over the top with their colors.",
    "Why did the barometer get anxious? It was always under pressure.",
    "Why don't picnickers trust a clear sky? It could turn on them in a flash.",
    "Why was the blizzard so unpopular? It always gave people the cold shoulder.",
    "Why don't gardeners trust a drought? It always has a dry sense of humor."
  ];
  
  
  function showJoke() {
    const box = document.getElementById("joke-box");
    const random = jokes[Math.floor(Math.random() * jokes.length)];
    box.innerHTML = `<p>${random}</p>`;
  }
  
  async function getLocationWeather() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async position => {
        const { latitude, longitude } = position.coords;
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${WEATHER_API_KEY}&units=metric`);
        const data = await res.json();
        updateWeatherDisplay(data);
        updateAQI({ status: "skip" }); // AQI skip for simplicity
        updateAlerts(data);
        updateSuggestions(data, { status: "skip" });
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }
  
  
  const fullQuestionBank = [
    { question: "What does a barometer measure?", options: ["Humidity", "Wind speed", "Air pressure", "Temperature"], answer: "Air pressure" },
    { question: "What is the term for frozen rain?", options: ["Sleet", "Hail", "Snow", "Frost"], answer: "Sleet" },
    { question: "Which layer of the atmosphere contains most weather?", options: ["Stratosphere", "Mesosphere", "Troposphere", "Thermosphere"], answer: "Troposphere" },
    { question: "What does 'El Niño' primarily affect?", options: ["Earthquakes", "Ocean currents", "Solar flares", "Snowfall"], answer: "Ocean currents" },
    { question: "What causes thunder?", options: ["Cloud collisions", "Sunlight and clouds", "Lightning heating the air", "Cold fronts meeting hot air"], answer: "Lightning heating the air" },
    { question: "Which cloud type is associated with thunderstorms?", options: ["Cirrus", "Cumulonimbus", "Stratus", "Altocumulus"], answer: "Cumulonimbus" },
    { question: "Which scale measures tornado intensity?", options: ["Richter", "Beaufort", "Fujita", "Saffir-Simpson"], answer: "Fujita" },
    { question: "Main gas in Earth's atmosphere?", options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"], answer: "Nitrogen" },
    { question: "Instrument for humidity?", options: ["Thermometer", "Hygrometer", "Anemometer", "Rain gauge"], answer: "Hygrometer" },
    { question: "Where do hurricanes form?", options: ["Over land", "Near poles", "Warm ocean water", "In deserts"], answer: "Warm ocean water" },
    { question: "What is the Coriolis effect?", options: ["Moonlight effect", "Rain refraction", "Wind curvature from Earth spin", "Cloud burst"], answer: "Wind curvature from Earth spin" },
    { question: "What color are rain clouds?", options: ["White", "Gray", "Black", "Yellow"], answer: "Gray" },
    { question: "The term 'petrichor' refers to?", options: ["Rainbow colors", "Smell of rain", "Snowfall", "Fog effect"], answer: "Smell of rain" },
    { question: "How many sides does a snowflake typically have?", options: ["3", "4", "6", "8"], answer: "6" },
    { question: "What is the eye of a hurricane?", options: ["Rainiest part", "Windiest part", "Calm center", "Storm boundary"], answer: "Calm center" },
    { question: "Lightning is hotter than?", options: ["Sun", "Volcano", "Molten lava", "Lava lamp"], answer: "Sun" },
    { question: "Which weather tool measures wind speed?", options: ["Anemometer", "Barometer", "Rain gauge", "Thermometer"], answer: "Anemometer" },
    { question: "What is a waterspout?", options: ["Underwater tornado", "Sea volcano", "Tornado over water", "Ocean whirlpool"], answer: "Tornado over water" },
    { question: "Where is the driest place on Earth?", options: ["Sahara", "Atacama Desert", "Gobi", "Death Valley"], answer: "Atacama Desert" },
    { question: "What does UV index indicate?", options: ["Humidity", "Wind speed", "Sunburn risk", "Rain chance"], answer: "Sunburn risk" }
  ];

  let quizQuestions = [];
  let currentQuestion = 0;
  let score = 0;

  function shuffleAndPickQuestions() {
    const shuffled = fullQuestionBank.sort(() => 0.5 - Math.random());
    quizQuestions = shuffled.slice(0, 5);
  }

  function loadQuestion() {
    const q = quizQuestions[currentQuestion];
    document.getElementById("question-text").textContent = q.question;
    const optionsDiv = document.getElementById("options");
    optionsDiv.innerHTML = "";

    q.options.forEach(option => {
      const btn = document.createElement("button");
      btn.className = "option-btn";
      btn.textContent = option;
      btn.onclick = () => checkAnswer(option);
      optionsDiv.appendChild(btn);
    });
  }

  function checkAnswer(selected) {
    if (selected === quizQuestions[currentQuestion].answer) {
      score++;
    }
    currentQuestion++;
    if (currentQuestion < quizQuestions.length) {
      loadQuestion();
    } else {
      showResults();
    }
  }

  function showResults() {
    document.getElementById("quiz-box").innerHTML = `<h3>You got ${score}/5 correct!</h3>`;
    const badge = document.getElementById("achievement-box");
    badge.innerHTML = score >= 4
      ? "<p>🏆 Pro Meteorologist!</p>"
      : score >= 2
      ? "<p>🌤️ Weather Enthusiast</p>"
      : "<p>🌧️ Keep Learning!</p>";
  }

  window.onload = () => {
    shuffleAndPickQuestions();
    loadQuestion();
  };

  
  

