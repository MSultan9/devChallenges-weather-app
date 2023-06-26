import { useRef, useState } from "react";
import { ICountry } from "../App";

const Search = ({ setSearchClicked, onLocationClick }: { setSearchClicked: (value: boolean) => void , onLocationClick: (value: ICountry) => void}) => {

    const inputRef = useRef<HTMLInputElement>(null)
    const [countries, setCountries] = useState<ICountry[]>([])

    const fetchLocation = async (name: string) => {
        try {
            const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${name}`);
            const jsonData = await response.json();
            setCountries(jsonData.results)
        } catch {
            console.log('error')
        }
    };

    const onSearch = () => {
        if (inputRef.current?.value)
            fetchLocation(inputRef.current.value)
    }

    return (
        <div className="search">
            <div className="close" onClick={() => setSearchClicked(false)}>X</div>
            <div className="search-container">
                <input ref={inputRef} placeholder="search location" />
                <button onClick={onSearch}>Search</button>
            </div>
            <div className="results">
                {countries.map(country => {
                    return(
                        <div key={country.id} className="result" onClick={() => onLocationClick(country)}>{country.country}</div>
                    )
                })}
            </div>
        </div>
    )
}

export default Search;