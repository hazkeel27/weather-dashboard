var userForm = $('#userForm');
var inputTag = $('#inputTag');
var searchButton = $('#searchButton');
var savedCityList = $('#savedCityList');
var searchedCity = $('#searchedCity');
var todayDate = $('#todayDate');
var todayTemp = $('#todayTemp');
var todayWind = $('#todayWind');
var todayHumidity = $('#todayHumidity');
var fiveDayContainer = $('#fiveDayContainer');
var cityHeader = $('#cityHeader');

//render current day on the top of the webpage
function renderCurrentDay() {
    var today = dayjs();
    todayDate.text(today.format('M/D/YYYY'));

}

function formSubmitHandler(event) {
    event.preventDefault();
    fiveDayContainer.empty();
    cityHeader.find('img').remove();
    geocodingApi();
}

function getCityName() {
    var cityName;

    cityName = inputTag.val()

    return cityName;
}

function geocodingApi() {
    var inputTagValue = getCityName();
    var cityNameApi;
    var longitudeApi;
    var latitudeApi;

    var apiKey = `471cc655335aaaad32557e7ce7d71113`;
    var geocodingUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${inputTagValue}&limit=1&appid=${apiKey}`;

    $.ajax({
        url: geocodingUrl,
        method: 'GET',
        dataType: 'json',
        success: function(response) {
            cityNameApi = response[0].name;
            longitudeApi = response[0].lon;
            latitudeApi = response[0].lat;

            searchedCity.text(cityNameApi);

            weatherForecastApi(cityNameApi, longitudeApi, latitudeApi);
        },
        error: function(jqXHR, textStatus, errorThrown) {
          console.log('Error:', textStatus, errorThrown);
        }
      });
}

function weatherForecastApi(cityNameApi, longitudeApi, latitudeApi) {

    var apiKey = `471cc655335aaaad32557e7ce7d71113`;
    var weatherForecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitudeApi}&lon=${longitudeApi}&units=imperial&appid=${apiKey}`;

    $.ajax({
        url: weatherForecastUrl,
        method: 'GET',
        dataType: 'json',
        success: function(response) {

            todayTemp.text(`${response.list[0].main.temp} °F`);
            todayWind.text(`${response.list[0].wind.speed} MPH`);
            todayHumidity.text(`${response.list[0].main.humidity} %`);

            var cityHeaderImgTag = $('<img>');
            var todayIconUrl = `http://openweathermap.org/img/wn/${response.list[0].weather[0].icon}.png`;
            cityHeaderImgTag.attr('src', todayIconUrl);
            cityHeaderImgTag.attr('alt', 'Weather Forecast Icon Display');
            cityHeaderImgTag.attr('id', 'todayWeatherIcon');
            cityHeader.append(cityHeaderImgTag);

            for (var i=7; i<response.list.length; i+=8) {

                var date = dayjs();
                var dateText = response.list[i].dt_txt;
                dateText = dateText.split(' ');
                dateText = dateText[0];

                var iconUrl = `http://openweathermap.org/img/wn/${response.list[i].weather[0].icon}.png`;

                var temp = response.list[i].main.temp;
                var wind = response.list[i].wind.speed;
                var humidity = response.list[i].main.humidity;

                var div = $('<div></div>');
                div.addClass('col-2 col-md-2 text-center');

                var boldTag = $('<b></b>');
                var dateSpanTag = $('<span></span>');
                dateSpanTag.text(`(${dateText})`);
                boldTag.append(dateSpanTag);

                var iconImgTag = $('<img>');
                iconImgTag.attr('src', iconUrl);
                iconImgTag.attr('alt', 'Weather Forecast Icon Display');

                var hrTag1 = $('<hr>');
                var hrTag2 = $('<hr>');
                var hrTag3 = $('<hr>');
                var hrTag4 = $('<hr>');
                var hrTag5 = $('<hr>');

                var tempSpanTag = $('<span></span>');
                tempSpanTag.text(`Temp: ${temp}  °F`);

                var windSpanTag = $('<span></span>');
                windSpanTag.text(`Wind: ${wind} MPH`);

                var humiditySpanTag = $('<span></span>');
                humiditySpanTag.text(`Humidity: ${humidity} %`);

                div.append(boldTag);
                div.append(hrTag1);
                div.append(iconImgTag);
                div.append(hrTag2);
                div.append(tempSpanTag);
                div.append(hrTag3);
                div.append(windSpanTag);
                div.append(hrTag4);
                div.append(humiditySpanTag);
                div.append(hrTag5);

                fiveDayContainer.append(div);

                console.log(`Date: ${dateText}, Temp: ${temp}, Humidity: ${humidity}, Wind: ${wind}`);
            }
            console.log(response);
        },
        error: function(jqXHR, textStatus, errorThrown) {
          console.log('Error:', textStatus, errorThrown);
        }
      });
}




//function runs on page load
$(function () {
    renderCurrentDay();
    userForm.on('submit', formSubmitHandler);

});