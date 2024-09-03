import React from 'react';

interface WeatherProps {
  city: string;
  weather: any;
}

const Weather: React.FC<WeatherProps> = ({ city, weather }) => {
  if (!weather) {
    return <p>Veri yükleniyor...</p>;
  }

  return (
    <div className="weather-container">
      {weather.map((day: any, index: number) => (
        <div className="weather-card" key={index}>
          <h3>{day.day}</h3> {/* Gün ismi buraya eklendi */}
          <p>{day.date}</p> {/* Tarih bilgisi */}
          <img src={day.icon} alt={day.description} />
          <p>{day.description}</p>
          <p className="temp">Gündüz: {day.degree}°C</p>
          <p className="temp">Gece: {day.night}°C</p>
        </div>
      ))}
    </div>
  );
};

export default Weather;
