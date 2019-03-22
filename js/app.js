
// klucz weather API id
// ******************************************************************
const APP_ID = '6d024a6f97a28ed3937f7434543b8817';
const API_URL = 'http://api.openweathermap.org/data/2.5/weather';

// zadeklaruj i przypisz zmienne
// ******************************************************************
let cityButton = document.getElementById('search')
let locateButton = document.getElementById('locate')
let coorButton = document.getElementById('coordinates')
let weatherInfo = document.getElementById('weatherInfo')

// dane wprowadzane przez uzytkownika (pola input)
let cityInput = document.getElementById('city')
let lonInput = document.getElementById('lon')
let latInput = document.getElementById('lat')

// komunikat bledu (.toast)
let toastMsg = document.querySelector('.toast-body')

// znajdz przez wprowadzone miasto
// ******************************************************************
cityButton.addEventListener('click', function(e){

  e.preventDefault()
  let city = cityInput.value

  let URL = `${API_URL}?q=${city}&units=metric&appid=${APP_ID}`;

  if (city) {
    getWeather(URL)
    if(!(getWeather(URL))){
      toastMsg.innerHTML =  'City not found'
      $('.toast').toast('show')
    }

  } else {
    toastMsg.innerHTML =  'Please enter city name'
    $('.toast').toast('show')
  }

  return false;

});

// znajdz przez wprowadzone współrzędne
// ******************************************************************
coorButton.addEventListener('click', function(e){

  e.preventDefault()
  let lon = lonInput.value
  let lat = latInput.value

  let URL = `${API_URL}?lat=${lat}&lon=${lon}&units=metric&appid=${APP_ID}`;

  if (lat && lon) {
    getWeather(URL)
    if(!(getWeather(URL))){
      toastMsg.innerHTML =  'Wrong coordinates'
      $('.toast').toast('show')
    }
  } else {
    toastMsg.innerHTML =  'Please enter coordinates'
    $('.toast').toast('show')
  }

  return false;

});

// sprawdz lokalizacje uzytkownika
// ******************************************************************
locateButton.addEventListener('click', function(e){
  e.preventDefault()
  if (navigator.geolocation) {

    navigator.geolocation.getCurrentPosition(function(location) {

      lonInput.value = location.coords.latitude
      latInput.value = location.coords.longitude

      coorButton.classList.add('bg-success');

      return false
    });
  } else {
    toastMsg.innerHTML =  "Can't acces localisation"
    $('.toast').toast('show')
    console.log('error')
  }
});

// zresetuj kolor przycisku po namierzeniu wspolrzednych
// ******************************************************************
document.body.addEventListener('click', function(e){
  if(!(e == locateButton))
    coorButton.classList.remove('bg-success');
  lonInput.classList.remove('bg-highlight');
  latInput.classList.remove('bg-highlight');
});

// pobierz dane pogodowe
// ******************************************************************
function getWeather(url){
  let xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function(){
    if ( this.status == 200 && this.readyState == 4 ) {

      let data = formatData( JSON.parse(xhr.responseText) );
      document.getElementById("weatherInfo").innerHTML = data;

      scrollToResult();
    }else{
      return false;
    }

  };

  xhr.open("GET", url);
  xhr.send();
}

// stworz tabelke z danymi pogody
// ******************************************************************
function formatData(data){

  let dataArr = {
    "clouds": {
      data: data.clouds.all,
      icon: '<i class="fas fa-cloud"></i>'
    },
    "humidity": {
      data: data.main.humidity,
      icon: '<i class="fas fa-tint"></i>'
    },
    "pressure": {
      data: data.main.pressure,
      icon: '<i class="fas fa-tachometer-alt"></i>'
    },
    "temperature": {
      data: data.main.temp,
      icon: '<i class="fas fa-thermometer-half"></i>'
    },
    "max temperature": {
      data: data.main.temp_max,
      icon: '<i class="fas fa-thermometer-full"></i>'
    },
    "min temperature": {
      data: data.main.temp_min,
      icon: '<i class="fas fa-thermometer-empty"></i>'
    },
    "wind speed": {
      data: data.wind.speed,
      icon: '<i class="fas fa-plane-departure"></i>'
    },
    "wind direction": {
      data: data.wind.deg,
      icon: '<i class="fas fa-location-arrow"></i>'
    }

  }

  let description = data.weather[0].description
  let city = data.name
  let country = data.sys.country

  let sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString()
  let sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString()
  let date = new Date(data.dt * 1000).toDateString()

  let result = `
    <div class="col-md-12 col-sm-12 ">

      <table class="weathertable table table-striped table-dark">
      <thead>
        <tr class="weatherHead">
          <th colspan="6">`

  if(city){
    result += `
      ${city}, ${country}
    `
  }

  result += `
          <span class="desc">${description}</span></th>
        </tr>
        </thead>
        <tbody>
        <tr class="weatherRow">
          <th class="iconRow" scope="row"><i class="far fa-calendar-alt"></i></th>
          <td>${date}</td>
          <td><span class="desc">sunrise: </span>${sunrise}</td>
          <td><span class="desc">sunset: </span>${sunset}</td>
        </tr>
        `

  for(let i in dataArr){
  result += `
        <tr class="weatherRow">
          <th class="iconRow" scope="row">${dataArr[i].icon}</th>
          <td colspan="2">${i}</td>
          <td colspan="4">${dataArr[i].data}</td>
        </tr>`
      }

  result += `
      </tbody>
      </table>
    </div>`

  lonInput.value = data.coord.lon
  latInput.value = data.coord.lat

  lonInput.classList.add('bg-highlight');
  latInput.classList.add('bg-highlight');

  return result;
}

// nie pozwol wprowadzac liter do pol przeznaczonych na wspolrzedne
// ******************************************************************
let regex = /[a-z]/i;
latInput.addEventListener('keypress', function(e){

  if ( regex.test(e.key) ){
    e.preventDefault();
  }
  // console.log(e.key)
});
lonInput.addEventListener('keypress', function(e){

  if ( regex.test(e.key) ){
    e.preventDefault();
  }
});

// animuj scrollowanie do segmentu z danymi pogodywymi
// ******************************************************************
function scrollToResult(){
  $('html, body').animate({
    scrollTop: $( $('#weatherInfo') ).offset().top
  }, 500);
  return false;
}
