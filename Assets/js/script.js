
// global variables 
var APIKey = "e7111b1f6589775ae781984a6af9beb7";
var cityHistory  = [];

// Event listener handeling city name submission -----------------------------------------------------------------

$("form").submit(function (event) {
    event.preventDefault()
    var cityName = $("#searchCity").val().trim();
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
        var weatherUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${APIKey}`
        var cityName = $("#searchCity").val().trim();
        cityName = cityName.charAt(0).toUpperCase() + cityName.slice(1);
        fetch(weatherUrl).then(response => {
            // if the data is successfully pullled append to the page
            if (response.ok) {
                response.json().then(data => {
                    console.log(data)

                    // data -> current date -----------------------------------------------
                    // display name
                    $("#currentCityName").html(cityName);
                    //display date
                    var date = moment().format("MM/DD/YY");
                    $("#currentdate").html(date);
                    // display weather icon
                    var todayWeatherIncon = data.current.weather[0].icon;
                    $("#weatherIconToday").attr("src", `http://openweathermap.org/img/wn/${todayWeatherIncon}@2x.png`);
                    // display uv index, temp, humidity, and wund speeds
                    $("#UVIndexToday").html(data.current.uvi);
                    $("#tempToday").html(data.current.temp + " \u00B0F");
                    $("#humidityToday").html(data.current.humidity + " %");
                    $("#windToday").html(data.current.wind_speed + " MPH");

                    //  data -> future dates -----------------------------------------------
                    // loop through the ids and append necessary info
                    for (var i = 1; i < 6; i++) {
                        //display date
                        var date = moment().add(i, "days").format("DD/MM/YY");
                        $("#Date" + i).html(date);
                        // display weather icon
                        var weatherIncon = data.daily[i].weather[0].icon;
                        $("#weatherIconDay" + i).attr("src", `http://openweathermap.org/img/wn/${weatherIncon}@2x.png`);
                        // display temperature
                        var temp = data.daily[i].temp.day;
                        $("#tempDay" + i).html(temp);
                        // display wind
                        var wind = data.daily[i].temp.day;
                        $("#windDay" + i).html(temp);
                        // display humidity
                        var humidity = data.daily[i].humidity;
                        $("#humidityDay" + i).html(humidity + " %");
                      }
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
    console.log(cityHistory);

    if (!cityHistory) {
        cityHistory = []
    } else {
        savedCityButton()
    }
}

// save to local storage ---------------------------------------
var saveCityName = function(cityName) {
    if (!cityHistory) {
        cityHistory = [];
        cityHistory.unshift(searchCityName);
    } 
    //prevent duplicates to be pushed to array 
    //but push cityName if its an original
    if (cityHistory.indexOf(cityName) === -1) cityHistory.push(cityName);
    localStorage.setItem("City", JSON.stringify(cityHistory))
    savedCityButton()
}

// create search history ---------------------------------------
var savedCityButton = function () {
    var historyEl = $("#searchedCities")
    historyEl.empty()

    for (var i = 0; i < cityHistory.length; i++) {
        // genereate list item
        var listItemEl = $("<li>")
        listItemEl.addClass("mt-2")
        historyEl.append(listItemEl)
        // generate button with text value of cityHistory
        var buttonHistoryEl = $("<button>")
        buttonHistoryEl.addClass("btn btn-secondary pull-history-button")
        listItemEl.append(buttonHistoryEl)
        buttonHistoryEl.text(cityHistory[i])
        // add event listener to button to push for data
        buttonHistoryEl.click(function (event) {
            event.preventDefault()
            var cityName = $(this).text();
            returnForcast(cityName)
        })
    }
}

loadCityName();
