import React, { useState, useRef } from "react";
import FlightCards from "./components/FlightCard/FlightCard";
import "./assets/scss/index.scss";
import { RadioInput } from "./components/RadioInput/RadioInput";
import Price from "./components/Price/Price";
import { useEffect } from "react";
import Checkbox from "./components/Checkbox/Checkbox";

type Flights = 
 {id:string; startCity:string; startAirport:string; startDate:string; startAirportCode:string; endCity:string; endCountry:string; endDate:string; endAirport: string; endAirportCode: string; carrier:string; discount?:number; stops:number; price:number; duration:string}


const App = () => {
  const [flights, setFlights] = useState<Flights[] | []>([]);
  const [sortType, setSortType] = useState<string>("withoutSort");
  const [sortedFlights, setSortedFlights] = useState<Flights[] | []>([]);
  const [filteredFlights, setFilteredFlights] = useState<Flights[] | []>(flights);

  interface FiltersType {stops: number[], withDiscount: boolean, carrier: string[]}
  const [filters, setFilters] = useState<FiltersType>({
    stops: [],
    withDiscount: false,
    carrier: [],
  });
  type priceFilterType = {from: number, to: number}
  const [flightsToShow, setFlightsToShow] = useState<number>(2);
  const [priceFilter, setPriceFilter] = useState<priceFilterType>({ from: 0, to: 10000000 });
  const priceFrom : React.MutableRefObject<HTMLInputElement | null> = useRef(null);
  const priceTo : React.MutableRefObject<HTMLInputElement | null> = useRef(null);

  const handleFilterByDiscount = () => {
    setFilters({ ...filters, withDiscount: !filters.withDiscount });
    setFlightsToShow(2);
  };

  let stops = [...filters.stops];
  let carrier = [...filters.carrier];
  let allFlightsCarrier = flights.map((item: Flights) => item.carrier);

  const handleFilterByStops = (value : number) => {
    if (stops.includes(value)) {
      const index = stops.findIndex((e) => e === value);
      stops.splice(index, 1);
    } else {
      stops.push(value);
    }
    setFilters({ ...filters, stops: stops });
    setFlightsToShow(2);
  };
  const handleFilterByAirlines = (value: string) => {
    if (carrier.includes(value)) {
      const index = carrier.findIndex((e) => e === value);
      carrier.splice(index, 1);
    } else {
      carrier.push(value);
    }
    setFilters({ ...filters, carrier: carrier });
    setFlightsToShow(2);
  };

  const getFlights = async () => {
    const response = await fetch(
      "https://gist.githubusercontent.com/Korgehah/d98932a7a2cb57b43d1f67619d0de10e/raw/d948873437402d464f8cc94506e76cbcffc0e7c0/steops.json"
    );
    const data = await response.json();
    return data;
  };

  useEffect(() => {
    getFlights().then((flights) => setFlights(flights));
  }, []);

  const getPrice = () => {
    let priceToCurrent = priceTo?.current?.value;
    let priceFromCurrent = priceFrom?.current?.value;
    setPriceFilter({
      from: priceFromCurrent ? Number(priceFromCurrent) : 0,
      to: priceToCurrent ? Number(priceToCurrent) : 100000000,
    });
    setFlightsToShow(2);
  };

  const checkValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!/[0-9]/.test(event.target.value)) {
      event.preventDefault();
    }
  };

  // фильтрация
  useEffect(() => {
    if (flights) {
      setFilteredFlights(
        [...flights]
          .filter((e) => {
            if (!filters.withDiscount) {
              return e;
            } else {
              if (e.discount) {
                return e;
              }
            }
            return null;
          })
          .filter((e) => {
            if (filters.stops.length === 0) {
              return e;
            } else if (filters.stops.includes(e.stops)) {
              return e;
            }
            return null;
          })
          .filter((e) => {
            let total = e.discount ? e.price - e.discount : e.price;
            if (total > priceFilter.from && total < priceFilter.to) {
              return e;
            }

            return null;
          })
          .filter((e) => {
            if (filters.carrier.length === 0) {
              return e;
            } else if (filters.carrier.includes(e.carrier)) {
              return e;
            }
            return null;
          })
      );
    }
  }, [flights, filters, priceFilter]);
  // сортировка отфильтрованного массива
  useEffect(() => {
    if (flights) {
      if (sortType === "withoutSort") {
        setSortedFlights(filteredFlights);
      } else if (sortType === "priceLowToHigh") {
        setSortedFlights(
          [...filteredFlights].sort((a, b) => {
            const totalA = a.discount ? a.price - a.discount : a.price;
            const totalB = b.discount ? b.price - b.discount : b.price;
            return totalA - totalB;
          })
        );
      } else if (sortType === "priceHighToLow") {
        setSortedFlights(
          [...filteredFlights].sort((a, b) => {
            const totalA = a.discount ? a.price - a.discount : a.price;
            const totalB = b.discount ? b.price - b.discount : b.price;
            return totalB - totalA;
          })
        );
      } else if (sortType === "byTime") {
        setSortedFlights(
          [...filteredFlights].sort(
            (a, b) =>
              {const firstArray = a.duration.split(':');
            const secondArray = b.duration.split(':');
          const firstTime = Number(firstArray[0]) * 60 + Number(firstArray[1]);
        const secondTime = Number(secondArray[0]) * 60 + Number(secondArray[1]);
        return (firstTime - secondTime)
      }
      
          )
        );
      }
    }
  }, [sortType, filteredFlights, flights]);

  useEffect(() => {
    setFlightsToShow(2);
  }, [priceFilter]);

  const checkboxData = [
    {
      checkboxName: " - без сортировки",
      name: "sort",
      type: "radio",
      sortType: "withoutSort",
    },
    {
      checkboxName: " - по возрастанию цены",
      name: "sort",
      type: "radio",
      sortType: "priceLowToHigh",
    },
    {
      checkboxName: " - по убыванию цены",
      name: "sort",
      type: "radio",
      sortType: "priceHighToLow",
    },
    {
      checkboxName: " - по времени в пути",
      name: "sort",
      type: "radio",
      sortType: "byTime",
    },
  ];

  return (
    <div className="layout">
      <div className="filter">
        <h1 className="title">Сортировать</h1>
        {checkboxData.slice(0, 4).map((item, index) => (
          <RadioInput
            checkboxName={item.checkboxName}
            key={index}
            name={item.name}
            type={item.type}
            sortType={item.sortType}
            setSortType={setSortType}
            setFlightsToShow={setFlightsToShow}
          />
        ))}
        <h1 className="title">Фильтровать</h1>
        <Checkbox
          checkboxName={" - со скидкой"}
          type={"checkbox"}
          onChange={handleFilterByDiscount}
        />
        <Checkbox
          checkboxName={" - c 1 пересадкой"}
          type={"checkbox"}
          onChange={() => {
            handleFilterByStops(1);
          }}
        />
        <Checkbox
          checkboxName={" - c 2 пересадками"}
          type={"checkbox"}
          onChange={() => {
            handleFilterByStops(2);
          }}
        />
        <Checkbox
          checkboxName={" - c 3 пересадками"}
          type={"checkbox"}
          onChange={() => {
            handleFilterByStops(3);
          }}
        />

        <h1 className="title">Цена</h1>
        <label>
          От
          <Price
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              getPrice();
              checkValue(event);
            }}
            placeholder={"0"}
            ref={priceFrom}
            size = {20}
          />
        </label>
        <label>
          До
          <Price
            onChange={(event) => {
              getPrice();
              checkValue(event);
            }}
            placeholder={"1000000"}
            ref={priceTo}
            size = {20}
          />
        </label>
        <h1 className="title">Авиакомпании</h1>
        {allFlightsCarrier
          .filter((item, index) => allFlightsCarrier.indexOf(item) === index)
          .sort((a, b) => (a > b ? 1 : -1))
          .map((item, index) => (
            <Checkbox
              checkboxName={" - " + item}
              key={index}
              type={"checkbox"}
              onChange={() => handleFilterByAirlines(item)}
            />
          ))}
      </div>
      <div className="ticket">
        {sortedFlights.length > 0 ? (
          <FlightCards
            flights={sortedFlights}
            setFlightsToShow={setFlightsToShow}
            flightsToShow={flightsToShow}
            sortedFlights={sortedFlights}
          />
        ) : (
          <span className="alert">Билеты не найдены!</span>
        )}
      </div>
    </div>
  );
};

export default App;
