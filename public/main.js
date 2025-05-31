// For login with Google
document.addEventListener("DOMContentLoaded", event => {
    const app = firebase.app();
    console.log(app)
});

// Function to login
function googleLogin() {
  const provider = new firebase.auth.GoogleAuthProvider();

  firebase.auth().signInWithPopup(provider)
    .then(result => {
      const user = result.user;
      const fullName = user.displayName;
      const firstName = fullName.split(' ')[0];

      // Replace the subscribe button with a greeting
      const subsButton = document.getElementById("subsbtn");
      subsButton.innerText = `Hi, ${firstName}!`;
      subsButton.disabled = true;
      subsButton.style.cursor = 'default';
    })
    .catch(console.log);
}

// Toggle the 'selected' class on the clicked button
function toggleSelected(button) {
    const allButtons = document.querySelectorAll('.option');
    allButtons.forEach(btn => btn.classList.remove('selected'));
    button.classList.toggle('selected');
}

// GNews Free plan offers 100 requests per day

// Function to display API JSON news data

// WeatherAPI Free plan offers 1M requests per month

// Function to fetch news API data
async function getWeatherData() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            async function(position) {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                
                const FCapiKey = 'e2d4b02e8a7b4c21b3f124037252802';
                const FCweatherUrl = `https://api.weatherapi.com/v1/forecast.json?key=${FCapiKey}&q=${latitude},${longitude}`;

                try {
                    const response = await fetch(FCweatherUrl);
                    const data = await response.json();
                    console.log('Weather data from geolocation:', data);
                    if (data && data.location) {
                        displayWeather(data);
                    } else {
                        console.error('Invalid data received from geolocation weather API');
                    }
                } catch (error) {
                    console.error('Error fetching weather data:', error);
                    // Fallback to London
                    const FCweatherUrlFallback = 'https://api.weatherapi.com/v1/current.json?key=e2d4b02e8a7b4c21b3f124037252802&q=London&aqi=no';
                    try {
                        const fallbackResponse = await fetch(FCweatherUrlFallback);
                        const fallbackData = await fallbackResponse.json();
                        displayWeather(fallbackData);
                    } catch (error) {
                        console.error('Error fetching fallback weather data:', error);
                    }
                }
            },
            async function(error) {
                console.error('Error getting location:', error.message);
                // Fallback to London if geolocation fails
                const FCweatherUrlFallback = 'https://api.weatherapi.com/v1/current.json?key=e2d4b02e8a7b4c21b3f124037252802&q=London&aqi=no';
                try {
                    const fallbackResponse = await fetch(FCweatherUrlFallback);
                    const fallbackData = await fallbackResponse.json();
                    displayWeather(fallbackData);
                } catch (error) {
                    console.error('Error fetching fallback weather data:', error);
                }
            }
        );
    } else {
        console.log("Geolocation is not supported by this browser.");
        const FCweatherUrlFallback = 'https://api.weatherapi.com/v1/current.json?key=e2d4b02e8a7b4c21b3f124037252802&q=London&aqi=no';
        try {
            const fallbackResponse = await fetch(FCweatherUrlFallback);
            const fallbackData = await fallbackResponse.json();
            displayWeather(fallbackData);
        } catch (error) {
            console.error('Error fetching fallback weather data:', error);
        }
    }
}

// Function to display API JSON weather data
function displayWeather(data) {
    const city = data.location.name;
    const lTime = data.location.localtime;
    const tempC = data.current.temp_c;
    const cond = data.current.condition.text;
    const uv = data.current.uv;
    const wind = data.current.wind_mph;
    const humid = data.current.humidity;

    document.getElementById("city").innerText = `${city}`;
    document.getElementById("localTime").innerText = `Time: ${lTime}`;
    document.getElementById("temp").innerText = `Temperature: ${tempC}°C`;
    document.getElementById("cond").innerText = `Condition: ${cond}`;
    document.getElementById("uv").innerText = `UV Index: ${uv}`;
    document.getElementById("humid").innerText = `Humidity: ${humid}%`;
    document.getElementById("wind").innerText = `Wind Speed: ${wind} mph`;
}

// List of stock symbols for the slideshow
const stockSymbols = ['AAPL', 'GOOGL', 'AMZN', 'MSFT', 'TSLA'];

// Track the current stock index in the slideshow
let currentStockIndex = 0;

// API Key and URL
const Sapikey = '7e5a2c3b2b0e45fbb93cd76f6a3a8b0e'; 

// Function to fetch stocks API data
async function fetchStockData(symbol) {
    const Surl = `https://api.twelvedata.com/quote?symbol=${symbol}&apikey=${Sapikey}&source=docs`;

    try {
        // Fetching the stock data from the API
        const response = await fetch(Surl);
        
        // Check if the response is okay (status 200)
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        // Parse the JSON response
        const data = await response.json();

        // Check if we received valid data
        if (data && data.symbol) {
            console.log('Stock Data:', data);
            // Call function to display the stock data
            displayStockData(data);
        } else {
            console.error('Invalid or empty data received:', data);
        
            try {
                // Fetch fallback data for AAPL stock
                const response = await fetch('https://api.twelvedata.com/quote?symbol=AAPL&apikey=demo&source=docs');
                
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
        
                const fallbackData = await response.json();
                displayStockData(fallbackData);
        
            } catch (error) {
                console.error('Error fetching fallback stock data:', error);
            }
        }        
    } catch (error) {
        console.error('Error fetching stock data:', error);
    }
}

// Function to display the stock data in a slideshow fashion
function displayStockData(data) {
    document.getElementById("symbol").innerText = `${data.symbol}`;
    document.getElementById("change").innerText = `Change: ${Math.round(data.percent_change * 100) / 100}%`;
    document.getElementById("price").innerText = `Price: $${Math.round(data.close * 100) / 100}`;
    document.getElementById("open").innerText = `Open: $${Math.round(data.open * 100) / 100}`;
    document.getElementById("high").innerText = `High: $${Math.round(data.high * 100) / 100}`; 
    document.getElementById("low").innerText = `Low: $${Math.round(data.low * 100) / 100}`; 
    document.getElementById("volume").innerText = `Volume: ${data.volume}`;
}

// Function to automatically cycle through the stocks every 5 seconds
function startStockSlideshow() {
    // Fetch data for the first stock symbol on page load
    fetchStockData(stockSymbols[currentStockIndex]);

    // Set an interval to change the stock every 5 seconds (5000 ms)
    setInterval(() => {
        // Move to the next stock in the array (loop back to start if at the end)
        currentStockIndex = (currentStockIndex + 1) % stockSymbols.length;
        fetchStockData(stockSymbols[currentStockIndex]);
    }, 5000); // Change stock every 5 seconds
}

// Function to open nav bar
function openNav() {
    document.getElementById("myNav").style.height = "100%";
}

// Function to close nav bar
function closeNav() {
    document.getElementById("myNav").style.height = "0%";
}

// for loop with all news info
function forLoop(articles, x, nurl, nimg, title, descpt, date, sname){
    for (i = x; i < articles.length; i++) {

        const urlContainer = document.getElementById(nurl);
        urlContainer.addEventListener("click", function() {
            window.location.href = articles[i]['url']; // Redirect to the URL
        });

        const imageContainer = document.getElementById(nimg);
        const imageUrl = articles[i]['image']; 
        const existingImage = imageContainer.querySelector('img');
        if (existingImage) {
            existingImage.src = imageUrl;  // Change the source of the existing image
        } else {
            const img = document.createElement("img");
            img.src = imageUrl;
            img.style.width = "100%";  // Set the width of the image
            img.style.height = "auto"; // Maintain the aspect ratio
            imageContainer.appendChild(img);  // Append the new image
        }

        const titleContainer = document.getElementById(title)
        titleContainer.innerText = articles[i]['title']; //title
        titleContainer.style.fontFamily = '"Lexend", sans-serif';
        titleContainer.style.fontStyle = 'normal';
        titleContainer.style.fontSize = 'clamp(0.5rem, 0.05rem + 5vw, 1rem)';

        const descptContainer = document.getElementById(descpt);
        descptContainer.innerText = articles[i]['description']; //description
        descptContainer.style.fontFamily = '"Funnel Sans", sans-serif';
        descptContainer.style.fontStyle = 'normal';
        descptContainer.style.fontSize = 'clamp(0.5rem, 0.05rem + 5vw, 0.9rem)';
  
        const dateContainer = document.getElementById(date)
        dateContainer.innerText = articles[i]['publishedAt']; //description
        dateContainer.style.fontFamily = '"Funnel Sans", sans-serif';
        dateContainer.style.fontStyle = 'normal';
        dateContainer.style.fontSize = 'clamp(0.1rem, 0.05rem + 50vw, 0.7rem)';

        const snameContainer = document.getElementById(sname)
        snameContainer.innerText = articles[i]['source']['name']; //description
        snameContainer.style.fontFamily = '"Funnel Sans", sans-serif';
        snameContainer.style.fontStyle = 'normal';
        snameContainer.style.fontSize = 'clamp(0.1rem, 0.05rem + 50vw, 0.7rem)';
        break;
    }
}

// for loop with only headlines
function forLoop1(articles, x, nurl, title, date, sname){
    for (i = x; i < articles.length; i++) {

        const urlContainer = document.getElementById(nurl);
        urlContainer.addEventListener("click", function() {
            window.location.href = articles[i]['url']; // Redirect to the URL
        });

        const titleContainer = document.getElementById(title)
        titleContainer.innerText = articles[i]['title']; //title
        titleContainer.style.fontFamily = '"Lexend", sans-serif';
        titleContainer.style.fontStyle = 'normal';
        titleContainer.style.fontSize = 'clamp(0.5rem, 0.05rem + 5vw, 1rem)';
  
        const dateContainer = document.getElementById(date)
        dateContainer.innerText = articles[i]['publishedAt']; //description
        dateContainer.style.fontFamily = '"Funnel Sans", sans-serif';
        dateContainer.style.fontStyle = 'normal';
        dateContainer.style.fontSize = 'clamp(0.1rem, 0.05rem + 50vw, 0.7rem)';

        const snameContainer = document.getElementById(sname)
        snameContainer.innerText = articles[i]['source']['name']; //description
        snameContainer.style.fontFamily = '"Funnel Sans", sans-serif';
        snameContainer.style.fontStyle = 'normal';
        snameContainer.style.fontSize = 'clamp(0.1rem, 0.05rem + 50vw, 0.7rem)';
        break;
    }
}

// Function for display second block of news in index html
async function Home() {
    const GNapikey = 'db04ab388fc901e5726b51fa58f28fce';
    const url = 'https://gnews.io/api/v4/top-headlines?category=general&lang=en&country=us&max=10&apikey=' + GNapikey;

    try {
        // Fetch data from the API
        let response = await fetch(url);

        // Check if the response was successful before trying to access the JSON
        if (!response.ok) {
            throw new Error('API fetch failed, switching to fallback');
        }

        // Parse the response JSON only if the fetch is successful
        let data = await response.json();
        let articles = data.articles;

        // Display the articles 
        forLoop1(articles, 1, 'news-url2', 'title2', 'date2', 'sname2');
        forLoop1(articles, 2, 'news-url3', 'title3', 'date3', 'sname3');
        forLoop1(articles, 3, 'news-url4', 'title4', 'date4', 'sname4');

    } catch (error) {
        console.error('There was an issue with the API fetch:', error);

        try { 
            let externalUrl = 'https://the-pioneer-f06fb.web.app/general.json'; // Use the actual URL of the JSON file
            let externalResponse = await fetch(externalUrl);
            if (!externalResponse.ok) {
                throw new Error('External JSON fetch failed');
            }

            // Parse the local JSON data
            let externalData = await externalResponse.json();
            let articles = externalData.articles;

            // Display the fallback articles 
            forLoop1(articles, 1, 'news-url2', 'title2', 'date2', 'sname2');
            forLoop1(articles, 2, 'news-url3', 'title3', 'date3', 'sname3');
            forLoop1(articles, 3, 'news-url4', 'title4', 'date4', 'sname4');

        }  catch (externalError) {
            console.error('Both API and external JSON fetch failed:', externalError);
        }
    }
}

// Function for display second block of news in tech page
async function Tech() {
    const GNapikey = 'db04ab388fc901e5726b51fa58f28fce';
    const url = 'https://gnews.io/api/v4/top-headlines?category=technology&lang=en&country=us&max=10&apikey=' + GNapikey;

    try { 
        // Fetch data from the API
        let response = await fetch(url);

        // Check if the response was successful before trying to access the JSON
        if (!response.ok) {
            throw new Error('API fetch failed, switching to fallback');
        }

        // Parse the response JSON only if the fetch is successful
        let data = await response.json();
        let articles = data.articles;

        // Display the articles (you can replace this with your actual display logic)
        forLoop(articles, 1, 'tech-news-url1', 'tech-news-img1', 'tech-title1', 'tech-descpt1', 'tech-date1', 'tech-sname1');
        forLoop(articles, 2, 'tech-news-url2', 'tech-news-img2', 'tech-title2', 'tech-descpt2', 'tech-date2', 'tech-sname2');
        forLoop(articles, 3, 'tech-news-url3', 'tech-news-img3', 'tech-title3', 'tech-descpt3', 'tech-date3', 'tech-sname3');
        forLoop1(articles, 4, 'tech-news-url4', 'tech-title4', 'tech-date4', 'tech-sname4');
        forLoop1(articles, 5, 'tech-news-url5', 'tech-title5', 'tech-date5', 'tech-sname5');
        forLoop1(articles, 6, 'tech-news-url6', 'tech-title6', 'tech-date6', 'tech-sname6');

    } catch (error) {
        console.error('There was an issue with the API fetch:', error);

        try { 
            let externalUrl = 'https://the-pioneer-f06fb.web.app/technology.json'; // Use the actual URL of your JSON file
            let externalResponse = await fetch(externalUrl);
            if (!externalResponse.ok) {
                throw new Error('External JSON fetch failed');
            }

            // Parse the local JSON data
            let externalData = await externalResponse.json();
            let articles = externalData.articles;

            // Display the fallback articles (you can replace this with your actual display logic)
            forLoop(articles, 1, 'tech-news-url1', 'tech-news-img1', 'tech-title1', 'tech-descpt1', 'tech-date1', 'tech-sname1');
            forLoop(articles, 2, 'tech-news-url2', 'tech-news-img2', 'tech-title2', 'tech-descpt2', 'tech-date2', 'tech-sname2');
            forLoop(articles, 3, 'tech-news-url3', 'tech-news-img3', 'tech-title3', 'tech-descpt3', 'tech-date3', 'tech-sname3');
            forLoop1(articles, 4, 'tech-news-url4', 'tech-title4', 'tech-date4', 'tech-sname4');
            forLoop1(articles, 5, 'tech-news-url5', 'tech-title5', 'tech-date5', 'tech-sname5');
            forLoop1(articles, 6, 'tech-news-url6', 'tech-title6', 'tech-date6', 'tech-sname6');


        }  catch (externalError) {
            console.error('Both API and external JSON fetch failed:', externalError);
        }
    }
}

async function Bus() {
    const GNapikey = 'db04ab388fc901e5726b51fa58f28fce';
    const url = 'https://gnews.io/api/v4/top-headlines?category=business&lang=en&country=us&max=10&apikey=' + GNapikey;

    try {
        // Fetch data from the API
        let response = await fetch(url);

        // Check if the response was successful before trying to access the JSON
        if (!response.ok) {
            throw new Error('API fetch failed, switching to fallback');
        }

        // Parse the response JSON only if the fetch is successful
        let data = await response.json();
        let articles = data.articles;

        // Display the articles (you can replace this with your actual display logic)
        forLoop(articles, 1, 'bus-news-url1', 'bus-news-img1', 'bus-title1', 'bus-descpt1', 'bus-date1', 'bus-sname1');
        forLoop(articles, 2, 'bus-news-url2', 'bus-news-img2', 'bus-title2', 'bus-descpt2', 'bus-date2', 'bus-sname2');
        forLoop(articles, 3, 'bus-news-url3', 'bus-news-img3', 'bus-title3', 'bus-descpt3', 'bus-date3', 'bus-sname3');
        forLoop1(articles, 4, 'bus-news-url4', 'bus-title4', 'bus-date4', 'bus-sname4');
        forLoop1(articles, 5, 'bus-news-url5', 'bus-title5', 'bus-date5', 'bus-sname5');
        forLoop1(articles, 6, 'bus-news-url6', 'bus-title6', 'bus-date6', 'bus-sname6');

    } catch (error) {
        console.error('There was an issue with the API fetch:', error);

        try { 
            let externalUrl = 'https://the-pioneer-f06fb.web.app/business.json'; // Use the actual URL of your JSON file
            let externalResponse = await fetch(externalUrl);
            if (!externalResponse.ok) {
                throw new Error('External JSON fetch failed');
            }

            // Parse the local JSON data
            let externalData = await externalResponse.json();
            let articles = externalData.articles;

            // Display the fallback articles (you can replace this with your actual display logic)
            forLoop(articles, 1, 'bus-news-url1', 'bus-news-img1', 'bus-title1', 'bus-descpt1', 'bus-date1', 'bus-sname1');
            forLoop(articles, 2, 'bus-news-url2', 'bus-news-img2', 'bus-title2', 'bus-descpt2', 'bus-date2', 'bus-sname2');
            forLoop(articles, 3, 'bus-news-url3', 'bus-news-img3', 'bus-title3', 'bus-descpt3', 'bus-date3', 'bus-sname3');
            forLoop1(articles, 4, 'bus-news-url4', 'bus-title4', 'bus-date4', 'bus-sname4');
            forLoop1(articles, 5, 'bus-news-url5', 'bus-title5', 'bus-date5', 'bus-sname5');
            forLoop1(articles, 6, 'bus-news-url6', 'bus-title6', 'bus-date6', 'bus-sname6');


        }  catch (externalError) {
            console.error('Both API and external JSON fetch failed:', externalError);
        }
    }
}

async function World() {
    const GNapikey = 'db04ab388fc901e5726b51fa58f28fce';
    const url = 'https://gnews.io/api/v4/top-headlines?category=world&lang=en&country=us&max=10&apikey=' + GNapikey;

    try {
        // Fetch data from the API
        let response = await fetch(url);

        // Check if the response was successful before trying to access the JSON
        if (!response.ok) {
            throw new Error('API fetch failed, switching to fallback');
        }

        // Parse the response JSON only if the fetch is successful
        let data = await response.json();
        let articles = data.articles;

        // Display the articles (you can replace this with your actual display logic)
        forLoop(articles, 1, 'world-news-url1', 'world-news-img1', 'world-title1', 'world-descpt1', 'world-date1', 'world-sname1');
        forLoop(articles, 2, 'world-news-url2', 'world-news-img2', 'world-title2', 'world-descpt2', 'world-date2', 'world-sname2');
        forLoop(articles, 3, 'world-news-url3', 'world-news-img3', 'world-title3', 'world-descpt3', 'world-date3', 'world-sname3');
        forLoop1(articles, 4, 'world-news-url4', 'world-title4', 'world-date4', 'world-sname4');
        forLoop1(articles, 5, 'world-news-url5', 'world-title5', 'world-date5', 'world-sname5');
        forLoop1(articles, 6, 'world-news-url6', 'world-title6', 'world-date6', 'world-sname6');

    } catch (error) {
        console.error('There was an issue with the API fetch:', error);

        try { 
            let externalUrl = 'https://the-pioneer-f06fb.web.app/world.json'; // Use the actual URL of your JSON file
            let externalResponse = await fetch(externalUrl);
            if (!externalResponse.ok) {
                throw new Error('External JSON fetch failed');
            }

            // Parse the local JSON data
            let externalData = await externalResponse.json();
            let articles = externalData.articles;

            // Display the fallback articles (you can replace this with your actual display logic)
            forLoop(articles, 1, 'world-news-url1', 'world-news-img1', 'world-title1', 'world-descpt1', 'world-date1', 'world-sname1');
            forLoop(articles, 2, 'world-news-url2', 'world-news-img2', 'world-title2', 'world-descpt2', 'world-date2', 'world-sname2');
            forLoop(articles, 3, 'world-news-url3', 'world-news-img3', 'world-title3', 'world-descpt3', 'world-date3', 'world-sname3');
            forLoop1(articles, 4, 'world-news-url4', 'world-title4', 'world-date4', 'world-sname4');
            forLoop1(articles, 5, 'world-news-url5', 'world-title5', 'world-date5', 'world-sname5');
            forLoop1(articles, 6, 'world-news-url6', 'world-title6', 'world-date6', 'world-sname6');


        }  catch (externalError) {
            console.error('Both API and external JSON fetch failed:', externalError);
        }
    }
}

async function Sports() {
    const GNapikey = 'db04ab388fc901e5726b51fa58f28fce';
    const url = 'https://gnews.io/api/v4/top-headlines?category=sports&lang=en&country=us&max=10&apikey=' + GNapikey;

    try {
        // Fetch data from the API
        let response = await fetch(url);

        // Check if the response was successful before trying to access the JSON
        if (!response.ok) {
            throw new Error('API fetch failed, switching to fallback');
        }

        // Parse the response JSON only if the fetch is successful
        let data = await response.json();
        let articles = data.articles;

        // Display the articles (you can replace this with your actual display logic)
        forLoop(articles, 1, 'sports-news-url1', 'sports-news-img1', 'sports-title1', 'sports-descpt1', 'sports-date1', 'sports-sname1');
        forLoop(articles, 2, 'sports-news-url2', 'sports-news-img2', 'sports-title2', 'sports-descpt2', 'sports-date2', 'sports-sname2');
        forLoop(articles, 3, 'sports-news-url3', 'sports-news-img3', 'sports-title3', 'sports-descpt3', 'sports-date3', 'sports-sname3');
        forLoop1(articles, 4, 'sports-news-url4', 'sports-title4', 'sports-date4', 'sports-sname4');
        forLoop1(articles, 5, 'sports-news-url5', 'sports-title5', 'sports-date5', 'sports-sname5');
        forLoop1(articles, 6, 'sports-news-url6', 'sports-title6', 'sports-date6', 'sports-sname6');

    } catch (error) {
        console.error('There was an issue with the API fetch:', error);

        try { 
            let externalUrl = 'https://the-pioneer-f06fb.web.app/sports.json'; // Use the actual URL of your JSON file
            let externalResponse = await fetch(externalUrl);
            if (!externalResponse.ok) {
                throw new Error('External JSON fetch failed');
            }

            // Parse the local JSON data
            let externalData = await externalResponse.json();
            let articles = externalData.articles;

            // Display the fallback articles (you can replace this with your actual display logic)
            forLoop(articles, 1, 'sports-news-url1', 'sports-news-img1', 'sports-title1', 'sports-descpt1', 'sports-date1', 'sports-sname1');
            forLoop(articles, 2, 'sports-news-url2', 'sports-news-img2', 'sports-title2', 'sports-descpt2', 'sports-date2', 'sports-sname2');
            forLoop(articles, 3, 'sports-news-url3', 'sports-news-img3', 'sports-title3', 'sports-descpt3', 'sports-date3', 'sports-sname3');
            forLoop1(articles, 4, 'sports-news-url4', 'sports-title4', 'sports-date4', 'sports-sname4');
            forLoop1(articles, 5, 'sports-news-url5', 'sports-title5', 'sports-date5', 'sports-sname5');
            forLoop1(articles, 6, 'sports-news-url6', 'sports-title6', 'sports-date6', 'sports-sname6');


        }  catch (externalError) {
            console.error('Both API and external JSON fetch failed:', externalError);
        }
    }
}

async function Entertain() {
    const GNapikey = 'db04ab388fc901e5726b51fa58f28fce';
    const url = 'https://gnews.io/api/v4/top-headlines?category=entertainment&lang=en&country=us&max=10&apikey=' + GNapikey;

    try {
        // Fetch data from the API
        let response = await fetch(url);

        // Check if the response was successful before trying to access the JSON
        if (!response.ok) {
            throw new Error('API fetch failed, switching to fallback');
        }

        // Parse the response JSON only if the fetch is successful
        let data = await response.json();
        let articles = data.articles;

        // Display the articles (you can replace this with your actual display logic)
        forLoop(articles, 1, 'entertain-news-url1', 'entertain-news-img1', 'entertain-title1', 'entertain-descpt1', 'entertain-date1', 'entertain-sname1');
        forLoop(articles, 2, 'entertain-news-url2', 'entertain-news-img2', 'entertain-title2', 'entertain-descpt2', 'entertain-date2', 'entertain-sname2');
        forLoop(articles, 3, 'entertain-news-url3', 'entertain-news-img3', 'entertain-title3', 'entertain-descpt3', 'entertain-date3', 'entertain-sname3');
        forLoop1(articles, 4, 'entertain-news-url4', 'entertain-title4', 'entertain-date4', 'entertain-sname4');
        forLoop1(articles, 5, 'entertain-news-url5', 'entertain-title5', 'entertain-date5', 'entertain-sname5');
        forLoop1(articles, 6, 'entertain-news-url6', 'entertain-title6', 'entertain-date6', 'entertain-sname6');

    } catch (error) {
        console.error('There was an issue with the API fetch:', error);

        try { 
            let externalUrl = 'https://the-pioneer-f06fb.web.app/entertainment.json'; // Use the actual URL of your JSON file
            let externalResponse = await fetch(externalUrl);
            if (!externalResponse.ok) {
                throw new Error('External JSON fetch failed');
            }

            // Parse the local JSON data
            let externalData = await externalResponse.json();
            let articles = externalData.articles;

            // Display the fallback articles (you can replace this with your actual display logic)
            forLoop(articles, 1, 'entertain-news-url1', 'entertain-news-img1', 'entertain-title1', 'entertain-descpt1', 'entertain-date1', 'entertain-sname1');
            forLoop(articles, 2, 'entertain-news-url2', 'entertain-news-img2', 'entertain-title2', 'entertain-descpt2', 'entertain-date2', 'entertain-sname2');
            forLoop(articles, 3, 'entertain-news-url3', 'entertain-news-img3', 'entertain-title3', 'entertain-descpt3', 'entertain-date3', 'entertain-sname3');
            forLoop1(articles, 4, 'entertain-news-url4', 'entertain-title4', 'entertain-date4', 'entertain-sname4');
            forLoop1(articles, 5, 'entertain-news-url5', 'entertain-title5', 'entertain-date5', 'entertain-sname5');
            forLoop1(articles, 6, 'entertain-news-url6', 'entertain-title6', 'entertain-date6', 'entertain-sname6');


        }  catch (externalError) {
            console.error('Both API and external JSON fetch failed:', externalError);
        }
    }
}

// All the function calls

// Initialize the slideshow when the page loads
// Simulate a click on the first button
window.onload = function() {
    startStockSlideshow(); //Stock data
    const firstButton = document.querySelector(".default-option");
    firstButton.click(); //News data
}; // REMOVE HERE

// Call the function for weather data
getWeatherData();
Home() 
Tech() // tech page has total 3 requests
Bus()
World()
Sports()
Entertain()

// Function for dark theme
function Dark() {
    var element = document.body;
    element.classList.toggle("dark-mode");

    var imgElement = document.getElementById("lightIcon");
    // Check if the current image source is the light icon
    if (imgElement.src === "https://github.com/19SP2/The-Pioneer-resources/blob/main/light%20moon%20icon.png?raw=true") {
        // Change to dark icon
        imgElement.src = "https://github.com/19SP2/The-Pioneer-resources/blob/main/dark%20sun%20icon.png?raw=true";
    } else {
        // Change back to light icon
        imgElement.src = "https://github.com/19SP2/The-Pioneer-resources/blob/main/light%20moon%20icon.png?raw=true";
    }

    var logoimg = document.getElementById("logo");
    // Check if the current image source is the light icon
    if (logoimg.src === "https://github.com/19SP2/The-Pioneer-resources/blob/main/The%20Pioneer%20logo.png?raw=true") {
        // Change to dark icon
        logoimg.src = "https://github.com/19SP2/The-Pioneer-resources/blob/main/dark%20logo%20fit.png?raw=true";
    } else {
        // Change back to light icon
        logoimg.src = "https://github.com/19SP2/The-Pioneer-resources/blob/main/The%20Pioneer%20logo.png?raw=true";
    }

    var logoimg = document.getElementById("logo2");
    // Check if the current image source is the light icon
    if (logoimg.src === "https://github.com/19SP2/The-Pioneer-resources/blob/main/The%20Pioneer%20logo.png?raw=true") {
        // Change to dark icon
        logoimg.src = "https://github.com/19SP2/The-Pioneer-resources/blob/main/dark%20logo%20fit.png?raw=true";
    } else {
        // Change back to light icon
        logoimg.src = "https://github.com/19SP2/The-Pioneer-resources/blob/main/The%20Pioneer%20logo.png?raw=true";
    }

    var menuimg = document.getElementById("search");
    // Check if the current image source is the light icon
    if (menuimg.src === "https://github.com/19SP2/The-Pioneer-resources/blob/main/menu%20light.png?raw=true") {
        // Change to dark icon
        menuimg.src = "https://raw.githubusercontent.com/19SP2/The-Pioneer-resources/refs/heads/main/menu%20dark.png";
    } else {
        // Change back to light icon
        menuimg.src = "https://github.com/19SP2/The-Pioneer-resources/blob/main/menu%20light.png?raw=true";
    }
}


// Function to fetch news API data
async function newsCallCat(Ncategory, x, nurl, nimg, title, descpt, date, sname) {
    const GNapikey = 'db04ab388fc901e5726b51fa58f28fce';
    const url = 'https://gnews.io/api/v4/top-headlines?category=' + Ncategory + '&lang=en&country=us&max=10&apikey=' + GNapikey;

    try {
        // Fetch data from the API
        let response = await fetch(url);

        // Check if the response was successful before trying to access the JSON
        if (!response.ok) {
            throw new Error('API fetch failed, switching to fallback');
        }

        // Parse the response JSON only if the fetch is successful
        let data = await response.json();
        let articles = data.articles;

        // Display the articles 
        for (i = x; i < articles.length; i++) {

            const urlContainer = document.getElementById(nurl);
            urlContainer.addEventListener("click", function() {
                window.location.href = articles[i]['url']; // Redirect to the URL
            });

            const imageContainer = document.getElementById(nimg);
            const imageUrl = articles[i]['image']; 
            const existingImage = imageContainer.querySelector('img');
            if (existingImage) {
                existingImage.src = imageUrl;  // Change the source of the existing image
            } else {
                const img = document.createElement("img");
                img.src = imageUrl;
                img.style.width = "100%";  // Set the width of the image
                img.style.height = "auto"; // Maintain the aspect ratio
                imageContainer.appendChild(img);  // Append the new image
            }
    
            const titleContainer = document.getElementById(title)
            titleContainer.innerText = articles[i]['title']; //title
            titleContainer.style.fontFamily = '"Lexend", sans-serif';
            titleContainer.style.fontStyle = 'normal';
            titleContainer.style.fontSize = 'clamp(0.5rem, 0.05rem + 5vw, 1rem)';

            const descptContainer = document.getElementById(descpt);
            descptContainer.innerText = articles[i]['description']; //description
            descptContainer.style.fontFamily = '"Funnel Sans", sans-serif';
            descptContainer.style.fontStyle = 'normal';
            descptContainer.style.fontSize = 'clamp(0.5rem, 0.05rem + 5vw, 0.9rem)';
      
            const dateContainer = document.getElementById(date)
            dateContainer.innerText = articles[i]['publishedAt']; //description
            dateContainer.style.fontFamily = '"Funnel Sans", sans-serif';
            dateContainer.style.fontStyle = 'normal';
            dateContainer.style.fontSize = 'clamp(0.1rem, 0.05rem + 50vw, 0.7rem)';

            const snameContainer = document.getElementById(sname)
            snameContainer.innerText = articles[i]['source']['name']; //description
            snameContainer.style.fontFamily = '"Funnel Sans", sans-serif';
            snameContainer.style.fontStyle = 'normal';
            snameContainer.style.fontSize = 'clamp(0.1rem, 0.05rem + 50vw, 0.7rem)';
            break;
        }

    } catch (error) {
        console.error('There was an issue with the API fetch:', error);
    }
}

// Functions to call for Tech page
newsCallCat('technology', '1', 'tech-news-url1', 'tech-news-img1', 'tech-title1', 'tech-descpt1', 'tech-date1', 'tech-sname1')
newsCallCat('technology', '2', 'tech-news-url2', 'tech-news-img2', 'tech-title2', 'tech-descpt2', 'tech-date2', 'tech-sname2')
newsCallCat('technology', '3', 'tech-news-url3', 'tech-news-img3', 'tech-title3', 'tech-descpt3', 'tech-date3', 'tech-sname3')

function openModal(modalId) {
        document.getElementById(modalId).style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

function closeModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
        document.body.style.overflow = 'auto'; // Restore scrolling
}

    // Close modal when clicking outside of it
window.onclick = function(event) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (event.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
}

    // Close modal with Escape key
document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            const modals = document.querySelectorAll('.modal');
            modals.forEach(modal => {
                if (modal.style.display === 'block') {
                    modal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                }
            });
        }
});

// Store all articles for saving
// Global variable to store the currently displayed article
let currentArticle = null;

function displayHeadNews(articles) {
  if (!articles || articles.length === 0) return;

  const article = articles[0]; // Display the first article
  currentArticle = article; // Store the current article for saving

  // News container
  const urlContainer = document.getElementById("news-url");
  if (urlContainer) {
    urlContainer.onclick = () => window.open(article.url, '_blank');
  } else {
    console.warn("Element with ID 'news-url' not found.");
  }

  // Image
  const imageContainer = document.getElementById("news-img");
  if (imageContainer) {
    const existingImage = imageContainer.querySelector('img');
    if (existingImage) {
      existingImage.src = article.image || '';
    } else {
      const img = document.createElement("img");
      img.src = article.image || '';
      img.style.width = "100%";
      img.style.height = "auto";
      imageContainer.appendChild(img);
    }
  }

  // Title
  const titleContainer = document.getElementById("title");
  if (titleContainer) {
    titleContainer.textContent = article.title || 'No title available';
    titleContainer.style.fontFamily = '"Lexend", sans-serif';
    titleContainer.style.fontStyle = 'normal';
    titleContainer.style.fontSize = 'clamp(0.8rem, 0.05rem + 5vw, 1.2rem)';
  }

  // Description
  const descptContainer = document.getElementById("descpt");
  if (descptContainer) {
    descptContainer.textContent = article.description || 'No description available';
    descptContainer.style.fontFamily = '"Funnel Sans", sans-serif';
    descptContainer.style.fontStyle = 'normal';
    descptContainer.style.fontSize = 'clamp(0.5rem, 0.05rem + 5vw, 0.9rem)';
  }

  // Date
  const dateContainer = document.getElementById("date");
  if (dateContainer) {
    dateContainer.textContent = article.publishedAt || 'No date available';
    dateContainer.style.fontFamily = '"Funnel Sans", sans-serif';
    dateContainer.style.fontStyle = 'normal';
    dateContainer.style.fontSize = 'clamp(0.1rem, 0.05rem + 50vw, 0.7rem)';
  }

  // Update save button state
  updateSaveButtonState();
}

async function headNews(Ncategory) {
    const GNapikey = 'db04ab388fc901e5726b51fa58f28fce';
    const url = `https://gnews.io/api/v4/top-headlines?category=${Ncategory}&lang=en&country=us&max=10&apikey=${GNapikey}`;

    console.log("Fetching news from GNews API:", url);

    try {
        let response = await fetch(url);
        console.log("API response status:", response.status);

        if (!response.ok) {
            throw new Error('API fetch failed');
        }

        let data = await response.json();
        console.log("Fetched data:", data);

        if (!data.articles || !Array.isArray(data.articles)) {
            throw new Error('Malformed API response');
        }

        displayHeadNews(data.articles);

    } catch (error) {
        console.warn('Primary fetch failed, falling back:', error.message);

        try {
            let fallbackUrl = `https://the-pioneer-f06fb.web.app/${Ncategory}.json`;
            console.log("Fetching fallback data from:", fallbackUrl);

            let fallbackResponse = await fetch(fallbackUrl);
            if (!fallbackResponse.ok) throw new Error('Fallback fetch failed');

            let fallbackData = await fallbackResponse.json();
            displayHeadNews(fallbackData.articles);

        } catch (fallbackError) {
            console.error('Both fetch attempts failed:', fallbackError.message);
        }
    }
}

// Save news article to Firebase
async function saveNews() {
    if (!currentArticle) {
        alert('No article to save!');
        return;
    }

    // Check if user is logged in
    const user = firebase.auth().currentUser;
    if (!user) {
        alert('Please log in to save articles!');
        return;
    }

    try {
        const saveButton = document.getElementById('save-news-btn');
        saveButton.disabled = true;
        saveButton.textContent = 'Saving...';

        const userId = user.uid;
        const db = firebase.firestore();

        // Create a unique ID for the article based on URL or title
        const articleId = btoa(currentArticle.url || currentArticle.title || Date.now().toString())
            .replace(/[^a-zA-Z0-9]/g, '').substring(0, 20);

        // Prepare article data for saving
        const articleData = {
            title: currentArticle.title || 'No title',
            description: currentArticle.description || 'No description available',
            image: currentArticle.image || '',
            url: currentArticle.url || '',
            publishedAt: currentArticle.publishedAt || '',
            savedAt: firebase.firestore.FieldValue.serverTimestamp(),
            date: new Date().toLocaleDateString() // For display purposes
        };

        // Save to Firestore
        await db.collection('users').doc(userId).collection('savedArticles').doc(articleId).set(articleData);

        // Success feedback
        saveButton.textContent = 'Saved!';
        saveButton.style.color = '#ffffff';
            saveButton.classList.add('body-font');
        saveButton.style.backgroundColor = '#4CAF50';
    

        console.log('Article saved successfully!');

    } catch (error) {
        console.error('Error saving article:', error);
        
        const saveButton = document.getElementById('save-news-btn');
        saveButton.disabled = false;
        saveButton.textContent = 'Save Failed';
        saveButton.style.color = '#ffffff';
            saveButton.classList.add('body-font');
        saveButton.style.backgroundColor = '#f44336';

        
        alert('Failed to save article. Please try again.');
    }
}

// Check if current article is already saved and update button state
async function updateSaveButtonState() {
    const saveButton = document.getElementById('save-news-btn');
    if (!saveButton || !currentArticle) return;

    const user = firebase.auth().currentUser;
    

    try {
        const userId = user.uid;
        const db = firebase.firestore();

        const articleId = btoa(currentArticle.url || currentArticle.title || Date.now().toString())
            .replace(/[^a-zA-Z0-9]/g, '')
            .substring(0, 20);

        const doc = await db.collection('users').doc(userId).collection('savedArticles').doc(articleId).get();

        if (doc.exists) {
            // Show as permanently saved
            saveButton.textContent = 'Saved!';
            saveButton.style.color = '#ffffff';
            saveButton.classList.add('body-font');
            saveButton.disabled = true;
            saveButton.style.backgroundColor = '#4CAF50';
        } else {
            saveButton.textContent = 'Save Article';
            saveButton.classList.add('body-font');
            saveButton.classList.add('white');
            saveButton.disabled = false;
            saveButton.style.backgroundColor = '';
        }
    } catch (error) {
        console.error('Error checking save status:', error);
        saveButton.textContent = 'Save Article';
        saveButton.classList.add('body-font');
        saveButton.classList.add('white');
        saveButton.disabled = false;
        saveButton.style.backgroundColor = '';
    }
}

// Function to toggle selected state for category buttons


async function saveOtherNews(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Element with ID '${containerId}' not found.`);
        return;
    }

    const saveButton = document.getElementById(`save-btn-${containerId}`);
    if (!saveButton) {
        console.warn(`Save button with ID 'save-btn-${containerId}' not found.`);
        return;
    }

    // Check user authentication
    const user = firebase.auth().currentUser;
    if (!user) {
        alert('Please log in to save articles!');
        return;
    }

    // Show saving state
    saveButton.disabled = true;
    saveButton.textContent = 'Saving...';

    // Extract suffix and prefix
    const suffixMatch = containerId.match(/\d+$/);
    const suffix = suffixMatch ? suffixMatch[0] : '';
    const prefixMatch = containerId.match(/^([a-z]+)-/i);
    const prefix = prefixMatch ? prefixMatch[1] : '';

    const titleId = `${prefix}-title${suffix}`;
    const descptId = `${prefix}-descpt${suffix}`;
    const snameId = `${prefix}-sname${suffix}`;
    const dateId = `${prefix}-date${suffix}`;
    const imgId = `${prefix}-news-img${suffix}`;

    const title = document.getElementById(titleId)?.textContent || 'No title';
    const description = document.getElementById(descptId)?.textContent || 'No description';
    const source = document.getElementById(snameId)?.textContent || 'Unknown source';
    const publishedAt = document.getElementById(dateId)?.textContent || '';
    const image = document.getElementById(imgId)?.querySelector('img')?.src || '';
    const url = container.getAttribute('data-url') || '';

    const articleId = btoa(url || title || Date.now().toString())
        .replace(/[^a-zA-Z0-9]/g, '')
        .substring(0, 20);

    const articleData = {
        title,
        description,
        source,
        image,
        url,
        publishedAt,
        savedAt: firebase.firestore.FieldValue.serverTimestamp(),
        date: new Date().toLocaleDateString()
    };

    try {
        const db = firebase.firestore();
        const userId = user.uid;

        const articleRef = db.collection('users').doc(userId).collection('savedArticles').doc(articleId);
        const doc = await articleRef.get();

        if (doc.exists) {
            // Update existing article
            await articleRef.update(articleData);
            saveButton.textContent = 'Updated!';
            saveButton.style.color = '#ffffff';
            saveButton.classList.add('body-font');
            saveButton.style.backgroundColor = '#2196F3'; // blue for update
        } else {
            // Save new article
            await articleRef.set(articleData);
            saveButton.textContent = 'Saved!';
            saveButton.style.color = '#ffffff';
            saveButton.classList.add('body-font');
            saveButton.style.backgroundColor = '#4CAF50'; // green for new save
        }

        saveButton.disabled = true;
        console.log(`Article '${containerId}' saved/updated.`);

    } catch (error) {
        console.error(`Error saving/updating article '${containerId}':`, error);
        saveButton.textContent = 'Save Failed';
        saveButton.classList.add('body-font');
        saveButton.style.backgroundColor = '#f44336';
        saveButton.disabled = false;
        alert('Failed to save or update article. Please try again.');
    }
}

async function checkSavedArticlesOnLogin() {
    const user = firebase.auth().currentUser;
    if (!user) return;

    const containers = document.querySelectorAll('[data-url]'); // or any class/id that identifies articles
    const db = firebase.firestore();
    const userId = user.uid;

    for (const container of containers) {
        const containerId = container.id;
        const saveButton = document.getElementById(`save-btn-${containerId}`);
        if (!saveButton) continue;

        const url = container.getAttribute('data-url');
        const titleElement = container.querySelector('[id*="title"]');
        const title = titleElement?.textContent || '';

        const articleId = btoa(url || title || Date.now().toString())
            .replace(/[^a-zA-Z0-9]/g, '')
            .substring(0, 20);

        try {
            const doc = await db.collection('users').doc(userId).collection('savedArticles').doc(articleId).get();
            if (doc.exists) {
                saveButton.textContent = 'Saved!';
                saveButton.classList.add('body-font');
                saveButton.disabled = true;
                saveButton.style.backgroundColor = '#4CAF50';
            } else {
                saveButton.textContent = 'Save Article';
                saveButton.classList.add('body-font');
                saveButton.classList.add('white');
                saveButton.disabled = false;
                saveButton.style.backgroundColor = '';
            }
        } catch (error) {
            console.error(`Error checking saved status for ${containerId}:`, error);
        }
    }
}

firebase.auth().onAuthStateChanged(user => {
    updateSaveButtonState();
    if (user) {
        checkSavedArticlesOnLogin(); // Check all visible articles
    }
});
