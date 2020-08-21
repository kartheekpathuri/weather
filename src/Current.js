import React, { useState, useEffect } from "react";

const Current = () => {
    const [today, setToday] = useState({
        main: { temp: "" },
        weather: [{ icon: "" }]
    });
    const [hasError, setErrors] = useState(false);
    const apiKey = "95b1829285d860f0b0de10ccdcefd849";

    const fetchCurrentWeather = async url => {
        const res = await fetch(url);
        res
            .json()
            .then(res => {
                setToday(res);
            })
            .catch(err => {
                console.log("Error Fetching Current Weather::", err);
                setErrors(true);
            });
    };

    const getCurrentWeather = () => {
        const coord = JSON.parse(localStorage.getItem("coord"));
        const url = `http://api.openweathermap.org/data/2.5/weather?lat=${coord.lat}&lon=${coord.lon}&appid=${apiKey}&units=imperial`;
        fetchCurrentWeather(url);
    }

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                position => {
                    const url = `http://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=imperial`;
                    fetchCurrentWeather(url);
                },
                error => {
                    console.log("Error Fetching Geolocation::", error);
                    if (error.code == error.PERMISSION_DENIED) {
                        getCurrentWeather();
                    }
                },
                {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0
                }
            );
        }
        else getCurrentWeather();
    }, []);
    if (today.coord) localStorage.setItem("coord", JSON.stringify(today.coord));
    return (
        <div>
            {!hasError && (
                <div>
                    <h1>{today.name} Current Weather</h1>
                    <table className="current">
                        <tbody>
                            <tr>
                                <td>
                                    <h2>{Math.ceil(+today.main.temp)} &#8457;</h2>
                                </td>
                                {today.weather[0].icon && (
                                    <td><img alt="weather-icon" src={`http://openweathermap.org/img/wn/${today.weather[0].icon}@2x.png`}></img></td>
                                )}
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}
            {hasError && (
                <h1>Error has Occurred while fetching/displaying current weather</h1>
            )}
        </div>
    );
};

export default Current;
