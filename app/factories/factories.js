App.factory('weatherService', function($http) {
    return {
        getWeather: function() {
            var weather = { temp: {}, clouds: null };
           // http://api.openweathermap.org/data/2.5/forecast?q=Edmonton,ca&unites=metic&mode=JSON&appid=a5200136b760b0ddc583acd73600bb79  ** 5 day 3 hr forecast for future **
            $http.jsonp('http://api.openweathermap.org/data/2.5/weather?id=5946768&units=metric&callback=JSON_CALLBACK&APPID=a5200136b760b0ddc583acd73600bb79').success(function(data) {
                if (data) {
                    if (data.main) {
                        weather.temp.current = data.main.temp;
                        weather.temp.min = data.main.temp_min;
                        weather.temp.max = data.main.temp_max;
                    }
                    weather.clouds = data.clouds ? data.clouds.all : undefined;
                }
            });

            return weather;
        }
    };
});
