import { useEffect, useRef, useState } from 'react'
import clouds from './assets/Cloud-background.png'
import shower from './assets/Shower.png'
import clear from './assets/Clear.png'
import lightCloud from './assets/LightCloud.png'
import heavyCloud from './assets/HeavyCloud.png'
import lightRain from './assets/LightRain.png'
import heavyRain from './assets/HeavyRain.png'
import freezeRain from './assets/Sleet.png'
import snow from './assets/Snow.png'
import thunder from './assets/Thunderstorm.png'
import Search from './components/Search'

interface ITemperatures {
  min: number;
  max?: number;
  time?: string;
  code: number;
  wind?: number;
  visibility?: number;
  pressure?: number;
  humidity?: number;
}

export interface ICountry {
  id?: number;
  country: string;
  longitude: number;
  latitude: number;
}

function App() {

  const [data, setData] = useState<ITemperatures[]>([])
  const [searchClicked, setSearchClicked] = useState(false)
  const selectedLocation = useRef<ICountry>({ country: 'Beirut', latitude: 33.8558223, longitude: 35.5181623 })

  useEffect(() => {
    fetchWeather(); // Fetch data on component mount
  }, []);

  const fetchWeather = async (lat = 33.8558223, long = 35.5181623) => {
    try {
      const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&hourly=temperature_2m,relativehumidity_2m,weathercode,surface_pressure,visibility,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min&windspeed_unit=mph&timezone=Africa%2FCairo`);
      const jsonData = await response.json();
      const daily = jsonData.daily
      const hourly = jsonData.hourly
      const combinedArray = [] as ITemperatures[];

      for (var i = 0; i < daily.time.length; i++) {
        var obj = {
          min: Math.round(daily.temperature_2m_min[i]),
          max: Math.round(daily.temperature_2m_max[i]),
          time: daily.time[i],
          code: daily.weathercode[i]
        };
        combinedArray.push(obj);
      }
      const selectedArray = combinedArray.slice(1, 6);
      selectedArray.unshift(
        {
          min: Math.round(hourly.temperature_2m[0]),
          wind: hourly.windspeed_10m[0],
          code: hourly.weathercode[0],
          visibility: hourly.visibility[0],
          pressure: Math.round(hourly.surface_pressure[0]),
          humidity: hourly.relativehumidity_2m[0]
        }
      )
      setData(selectedArray)
    } catch {
      console.log('error')
    }
  };

  const getCode = (code: number | undefined) => {
    if (code !== undefined)
      if (code === 0)
        return { text: 'Clear', img: clear }
      else if (code < 4)
        return { text: 'Light Cloud', img: lightCloud }
      else if (code < 49)
        return { text: 'Heavy Cloud', img: heavyCloud }
      else if (code < 56)
        return { text: 'Light Rain', img: lightRain }
      else if (code < 66)
        return { text: 'Heavy Rain', img: heavyRain }
      else if (code < 68)
        return { text: 'Freezing Rain', img: freezeRain }
      else if (code < 78)
        return { text: 'Snow', img: snow }
      else if (code < 87)
        return { text: 'Shower', img: shower }
      else if (code < 100)
        return { text: 'Thunderstorm', img: thunder }
      else
        return null
    return null
  }

  const onLocationClick = (location: ICountry) => {
    selectedLocation.current = location
    setSearchClicked(false)
    fetchWeather(location.latitude, location.longitude)
  }

  const today = data.length > 0 ? data[0] : null
  const week = data.length > 0 ? data.slice(1, 6) : []

  return (
    <main className="app-wrapper">
      <div className="sidebar">
        {searchClicked ?
          <Search setSearchClicked={setSearchClicked} onLocationClick={onLocationClick} />
          :
          <>
            <button onClick={() => setSearchClicked(true)}>Search for places</button>
            <img src={clouds} className='clouds' />
            <div className='image-container'>
              <img src={getCode(today?.code)?.img} className='weather' />
            </div>
            <h1>{today?.min}<span>°C</span></h1>
            <h2>{getCode(today?.code)?.text}</h2>
            <div className='date'>Today &#12539; {new Date().toLocaleDateString('en-Us', { weekday: 'short', day: 'numeric', month: 'short' })}</div>
            <div className='location'>{selectedLocation.current.country}</div>
          </>
        }
      </div>
      <div className="content">
        <div className="content-container">
          <div className='week-cards'>
            {week.map((temp, i) => {
              return (
                <div className='card' key={temp.time}>
                  <div className='day'>{i === 0 ? 'Tomorrow' : temp.time}</div>&&
                  <img src={getCode(temp.code)?.img} />
                  <div className='temperature'>
                    <span>{temp.max}°C</span>
                    <span>{temp.min}°C</span>
                  </div>
                </div>)
            })}

          </div>
          <h3>Today's Highlights</h3>
          <div className='highlights'>
            <div className='highlight'>
              <div className='title'>Wind status</div>
              <div className='value'>{today?.wind}<span>mph</span></div>
            </div>
            <div className='highlight'>
              <div className='title'>Humidity</div>
              <div className='value'>{today?.humidity}<span>%</span></div>
              <div className='progress-container'>
                <div className='percentages'>
                  <span>0</span>
                  <span>50</span>
                  <span>100</span>
                </div>
                <div className='progress-bar'>
                  <div className='progress' style={{ width: `${today?.humidity}%` }}></div>
                </div>
                <div className='percentage'>%</div>
              </div>
            </div>
            <div className='highlight'>
              <div className='title'>Visibility</div>
              <div className='value'>{today?.visibility}<span>miles</span></div>
            </div>
            <div className='highlight'>
              <div className='title'>Air Pressure</div>
              <div className='value'>{today?.pressure}<span>mb</span></div>
            </div>
          </div>
          <div className='footer'>
            created by Msultan9 - devChallenges.io
          </div>
        </div>
      </div>
    </main>
  )
}

export default App
