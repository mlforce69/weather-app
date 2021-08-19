const cityForm = document.querySelector('form');
const card = document.querySelector('.card');
const details = document.querySelector('.details');
const time = document.querySelector('img.time');
const icon = document.querySelector('.icon img')
const favBtn = document.querySelector('.btn')

const liveLocation = document.querySelector('.current-position')

// retrieving the current date - weekday, day, month
function getDate(){
    const today = new Date();
   
    const options = {
      weekday: "long",
      day: "numeric",
      month: "short",
    };
   
    let day = today.toLocaleDateString("en-US", options);

    return day;
}

const updateUI = (data) => {
    const kelvin = 273.15;

    const city = data.name;
    const date = getDate();
    const weatherCondition = data.weather[0].description;
    const temp = Math.floor(data.main.temp - kelvin)
    const maxTemp = Math.floor(data.main.temp_max - kelvin)
    const minTemp = Math.floor(data.main.temp_min - kelvin)
    const humidity = data.main.humidity;
    const pressure = data.main.pressure;

    // getting the time in epoch format

    const utcCurrentTime = data.dt;
    const utcSunset = data.sys.sunset;
    const utcSunrise = data.sys.sunrise;

    // creating base time variables
    const currentTime = new Date(0);
    const sunset = new Date(0);
    const sunrise = new Date(0);

    // converting the time from epoch to date format
    currentTime.setUTCSeconds(utcCurrentTime);
    sunset.setUTCSeconds(utcSunset);
    sunrise.setUTCSeconds(utcSunrise);

    // getting only the time from the date 
    const resCurrTime = `${formatTime(currentTime.getHours(), currentTime.getMinutes())}`;
    const resSS = `${formatTime(sunset.getHours(), sunset.getMinutes())}`
    const resSR = `${formatTime(sunrise.getHours(), sunrise.getMinutes())}`


    // checking the current time to see if it is day time or night time, in order to set the picture
    if (sunrise <= currentTime && currentTime < sunset) {
        time.src = 'img/day.svg'
    } else {
        time.src = 'img/night.svg'
    }

    

    // updating the UI
    details.innerHTML = `
    <h5 class="my-3">${city}</h5>
    <div class="my-3">${date}</div>
    <div class="my-3">${resCurrTime}</div>
    <div class="my-3">${weatherCondition}</div>
    <div class="my-3">max ${maxTemp}&deg;C / min ${minTemp}&deg;C</div>
    <div class="my-3">Humidity ${humidity}%</div>
    <div class="my-3">Pressure ${pressure}</div>
    <div class="my-3"><img src="img/sunny.png" alt="sun image" class="sunset-sunrise-image"> ${resSR}</div>
    <div class="my-3"><img src="img/moon.png" alt="moon image" class="sunset-sunrise-image"> ${resSS}</div>
    <div class="display-4 my-4">
        <span>${temp}</span>
        <span>&deg;C</span>
    </div>
    <div class="fav-btn">
        <button class="btn btn-primary">Add to favourites</button>
    </div>
    `
    // update the icon image for the weather condition
    icon.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`

    // removing d-none - not displaying on all devices property
    if(card.classList.contains('d-none')) {
        card.classList.remove('d-none')
    }

    // favHtml = details.innerHTML;
    // // console.log(favHtml)

}



// formatting the time
const formatTime = function(hours, minutes) {
    const resHour = (hours.toString()).padStart(2, "0");
    const resMin = (minutes.toString()).padStart(2, "0");

    return `${resHour}:${resMin}`
}

const updateCity = async (city) => {
    const cityDetails = await getCity(city);

    return cityDetails
}

cityForm.addEventListener('submit', function (e) {
    //prevent default action (reloading)
    e.preventDefault();
    // trimming the start and the end in case there is some white space
    const city = cityForm.city.value.trim()
    cityForm.reset();

    updateCity(city)
    .then(data => updateUI(data))
    .catch(error => console.error(error.message))

    localStorage.setItem('city', city)
})

if(localStorage.getItem('city')) {
    updateCity(localStorage.getItem('city'))
    .then(data => updateUI(data))
    .catch(error => console.error(error))
}

function getLocation (position) {
    const positionCurr =  position.coords
    const latitude = positionCurr.latitude
    const longitude = positionCurr.longitude
    
    liveLocation.innerHTML = `Live position: lat:${latitude}, lon:${longitude}`

    console.log(latitude, longitude)
}

navigator.geolocation.getCurrentPosition(getLocation)

