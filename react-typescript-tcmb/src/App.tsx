import React, { useState, useEffect } from 'react';
import Weather from './components/Weather';
import { getWeather } from './services/weatherService';
import './App.css';

interface ExchangeRate {
  currency: string;
  buying: number;
  selling: number;
}

const App: React.FC = () => {
  const cities = ['İstanbul', 'Ankara', 'İzmir', 'Eskişehir', 'Adana', 'Sivas'];
  const [city, setCity] = useState<string>('İstanbul');
  const [weather, setWeather] = useState<any | null>(null);
  const [rates, setRates] = useState<ExchangeRate[]>([]);
  const [amount, setAmount] = useState<number>(0);
  const [selectedCurrency, setSelectedCurrency] = useState<string>('USD');
  const [priceType, setPriceType] = useState<string>('buying');
  const [result, setResult] = useState<number | null>(null);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/tcmb');
        const textData = await response.text();
        const parser = new DOMParser();
        const xml = parser.parseFromString(textData, 'application/xml');
        const currencyElements = Array.from(xml.getElementsByTagName('Currency'));

        const exchangeRates = currencyElements.map((currencyElement) => ({
          currency: currencyElement.getAttribute('CurrencyCode') || '',
          buying: parseFloat(
            currencyElement.getElementsByTagName('ForexBuying')[0]
              .textContent || '0'
          ),
          selling: parseFloat(
            currencyElement.getElementsByTagName('ForexSelling')[0]
              .textContent || '0'
          ),
        }));

        setRates(exchangeRates);
      } catch (error) {
        console.error('Error fetching exchange rates:', error);
      }
    };

    const fetchWeather = async () => {
      const data = await getWeather(city);
      setWeather(data.result);
    };

    fetchRates();
    fetchWeather();
  }, [city]);

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCity(e.target.value);
  };

  const handleCalculate = () => {
    const selectedRate = rates.find(rate => rate.currency === selectedCurrency);
    if (selectedRate) {
      const rate = priceType === 'buying' ? selectedRate.buying : selectedRate.selling;
      setResult(amount * rate);
    }
  };

  return (
    <div className="app-container">
      <h1>TCMB Döviz Kurları ve Hava Durumu</h1>

      <h2>Döviz Kurları</h2>
      <table>
        <thead>
          <tr>
            <th>Döviz Adı</th>
            <th>Alış</th>
            <th>Satış</th>
          </tr>
        </thead>
        <tbody>
          {rates.map((rate) => (
            <tr key={rate.currency}>
              <td>{rate.currency}</td>
              <td>{rate.buying.toFixed(4)}</td>
              <td>{rate.selling.toFixed(4)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>TL Değeri Hesaplama</h2>
      <div className="calculator-container">
        <label>Para Miktarı: </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value))}
        />

        <label>Para Birimi: </label>
        <select value={selectedCurrency} onChange={(e) => setSelectedCurrency(e.target.value)}>
          {rates.map((rate) => (
            <option key={rate.currency} value={rate.currency}>
              {rate.currency}
            </option>
          ))}
        </select>

        <div className="radio-group">
          <label>
            <input
              type="radio"
              value="buying"
              checked={priceType === 'buying'}
              onChange={() => setPriceType('buying')}
            />
            Alış
          </label>
          <label>
            <input
              type="radio"
              value="selling"
              checked={priceType === 'selling'}
              onChange={() => setPriceType('selling')}
            />
            Satış
          </label>
        </div>

        <button onClick={handleCalculate}>Hesapla</button>
      </div>

      {result !== null && (
        <div className="result">
          <h3>Hesaplanan TL Değeri: {result.toFixed(2)} TL</h3>
        </div>
      )}

      <h3>Hava Durumu</h3>
      <div className="dropdown-container">
        <label htmlFor="city-select">Şehir Seçin:</label>
        <select id="city-select" value={city} onChange={handleCityChange}>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>
      <Weather city={city} weather={weather} />
    </div>
  );
};

export default App;


