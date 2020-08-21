import React, { useState, useEffect } from "react";

const Forecast = () => {
    const [forecast, setForecast] = useState([]);
    const [coord, setCoord] = useState({});
    const [hasError, setErrors] = useState(false);
    const apiKey = "95b1829285d860f0b0de10ccdcefd849";

    const fetchForecastWeather = async url => {
        const res = await fetch(url);
        res
            .json()
            .then(res => {
                const data = res.daily;
                // Removing first and last two days of the forecast
                data.shift();
                data.pop();
                data.pop();

                setForecast(data);
                setCoord({lat: res.lat, lon: res.lon})
            })
            .catch(err => {
                console.log("Error Fetching Forecast::", err);
                setErrors(true);
            });
    };

    const getForecastWeather = () => {
        const coord = JSON.parse(localStorage.getItem("coord"));
        const url = `http://api.openweathermap.org/data/2.5/onecall?lat=${coord.lat}&lon=${coord.lon}&appid=${apiKey}&units=imperial&exclude=hourly,minutely`;
        fetchForecastWeather(url);
    }

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    const url = `http://api.openweathermap.org/data/2.5/onecall?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=imperial&exclude=hourly,minutely`;
                    fetchForecastWeather(url);
                },
                error => {
                    console.log("Error Fetching Geolocation::", error);
                    if (error.code == error.PERMISSION_DENIED) {
                        getForecastWeather();
                    }
                },
                {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0
                }
            );
        }
        else getForecastWeather();
    }, []);
    const options = {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric"
    };
    localStorage.setItem("coord", JSON.stringify(coord));
    return (
        <div>
            {!hasError && (
                <div>
                    <h1>Five Day Forecast</h1>
                    <table className="forecast">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>High</th>
                                <th>Low</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {forecast.map(item => {
                                return (
                                    <tr key={item.dt}>
                                        <td>{new Date(+item.dt * 1000).toLocaleDateString("en-US",options)}</td>
                                        <td>{Math.ceil(+item.temp.max)} &#8457;</td>
                                        <td>{Math.ceil(+item.temp.min)} &#8457;</td>
                                        <td><img alt="weather-icon" src={`http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}></img></td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
            {hasError && (
                <h1>Error has occurred fetching/displaying the weather forecast</h1>
            )}
        </div>
    );
};

export default Forecast;
