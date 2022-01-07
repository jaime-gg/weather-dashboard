
// global variables 
var APIKey = "e7111b1f6589775ae781984a6af9beb7";
var cityHistory  = [];

// Event listener handeling city name submission -----------------------------------------------------------------

$("form").submit(function (event) {
    event.preventDefault()
    var cityName = $("#searchCity").val().trim();
    saveCityName();
    if (cityName) {
        returnForcast(cityName)
    } else {
        alert(`${cityName} is not a valid city`)
    }
})


// pulling data from api -----------------------------------------------------------------------------------------

// take submitted city name and push to api that converts it to coordinates 
function returnForcast(cityName) {
    // style by capilizing city name, important when dealing with coordinate api
    cityName = cityName.charAt(0).toUpperCase() + cityName.slice(1);
    //console.log(cityName);

    // function for converting city name to coordinates
    var returnCoordinates = function() {
        var coordinateUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${APIKey}`

        fetch(coordinateUrl).then(response => {
            if (response.ok) {
                response.json().then((data) => {
                    var coordinate = data.city;
                    // call save function here instead of on-click in case user searched invalid city name.
                    saveCityName(cityName)
                    returnWeather(coordinate.coord.lat, coordinate.coord.lon)
                    console.log (coordinate);
                })
            } else {
                alert("This is not a Valid City!")
            }
        })
    }

    // plug in coordinates to fetch the local weather
    var returnWeather = function(lat, lon) {
        var weatherUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${APIKey}`
        var cityName = $("#searchCity").val().trim();
        fetch(weatherUrl).then(response => {
            if (response.ok) {
                response.json().then(data => {
                    console.log(data)

                    $("#currentCityName").html(cityName);
                    var date = moment().format("MM/DD/YY");
                    $("#currentdate").html(date);
                    $("#weatherIconToday").data.current.weather.icon,

                    $("#UVIndexToday").html(data.current.uvi);
                    $("#tempToday").html(data.current.temp + " \u00B0F");
                    $("#humidityToday").html(data.current.humidity + " %");
                    $("#windToday").html(data.current.wind_speed + " MPH");
                })
            } else {
                alert("Weather for these cooordinates is not available at the moment.")
            }
        })
    }
    returnCoordinates();
}

// local storage and history -------------------------------------------------------------------------------------

var cityName = $("#searchCity").val().trim();

// load from local storage -------------------------------------
var loadCityName = function() {
    cityHistory = JSON.parse(localStorage.getItem("City"))
    if (cityHistory == null) {
        cityHistory = [];
    }

    if (!cityHistory) {
        cityHistory = []
    } else {
        savedCityButton()
    }
}

// save to local storage ---------------------------------------
var saveCityName = function(cityName) {
    if (cityHistory == null) {
        cityHistory = [];
        cityHistory.unshift(searchCityName);
    } 
    cityHistory.push(cityName)
    localStorage.setItem("City", JSON.stringify(cityHistory))
    savedCityButton()
}

// create search history ---------------------------------------
var savedCityButton = function () {
    var historyEl = $("#searchedCities")
    historyEl.empty()

    for (var i = 0; i < cityHistory.length; i++) {
        var listItemEl = $("<li>")
        listItemEl.text(cityHistory[i])
        listItemEl.addClass("list-group-item mt-1")
        historyEl.append(listItemEl)
    }
}

loadCityName();
