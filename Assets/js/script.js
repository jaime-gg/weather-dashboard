
// global variables 
var APIKey = "e7111b1f6589775ae781984a6af9beb7";


// form & history slection 
var listOfSearchedCities = []


// Event listener handeling city name submission 
$("form").submit(function (event) {
    event.preventDefault()
    var cityName = $("#searchCity").val().trim()
    if (cityName) {
        returnForcast(cityName)
    } else {
        alert(`${cityName} is not a valid city`)
    }
})

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
                    // in progress // saveSearches(cityName)
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
        fetch(weatherUrl).then(response => {
            if (response.ok) {
                response.json().then(data => {
                    console.log(data)
                })
            } else {
                alert("Weather for these cooordinates is not available at the moment.")
            }
        })
    }
    returnCoordinates();
}