import React from "react";
import styles from "../../components/FlightCard/index.module.scss";

type Flights = 
 {id:string; startCity:string; startAirport:string; startDate:string; startAirportCode:string; endCity:string; endCountry:string; endDate:string; endAirport: string; endAirportCode: string; carrier:string; discount?:number; stops:number; price:number; duration:string}

interface IFlightItem {
  item: Flights;
}
const FlightItem = ({ item } : IFlightItem) => {
  const duration = item.duration.split(":");
  const hours = duration[0];
  const minutes = duration[1];

  const getDay = (date : string) => {
    const dates = new Date(date);
    const time = dates.toLocaleTimeString([], {
      hour: "numeric",
      minute: "numeric",
    });
    const day = dates.toLocaleDateString("ru", {
      day: "numeric",
      month: "short",
      weekday: "short",
    });
    return { time: time, day: day };
  };
  const convertedStartDate = getDay(item.startDate);
  const convertedEndDate = getDay(item.endDate);

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.flight__logo}>LOGO</div>
        <div className={styles.flight__price}>
          <span className={styles.flight__amount}>
            {item.discount ? (
              <span className={styles.gold}>
                {item.price - item.discount}
                <span className={styles.crossed}>{item.price}</span>
              </span>
            ) : (
              <span className={styles.amount}>{item.price}</span>
            )}{" "}
            руб{" "}
          </span>
          <span className={styles.flight__priceDescription}>
            Стоимость на одного взрослого пассажира
          </span>
        </div>
      </div>
      <div className={styles.flight}>
        <div className={styles.flightThere}>
          <div className={styles.flightThere__city}>
            <span className={styles.flightThere__departure}>
              {item.startCity}, {item.startAirport}
            </span>
            <span className={styles.flightThere__uid}>
              ({item.startAirportCode})
              <svg
                className={styles.flight__arrow}
                version="1.0"
                xmlns="http://www.w3.org/2000/svg"
                width="1280.000000pt"
                height="640.000000pt"
                viewBox="0 0 1280.000000 640.000000"
                preserveAspectRatio="xMidYMid meet"
              >
                <g
                  transform="translate(0.000000,640.000000) scale(0.100000,-0.100000)"
                  fill="#1f99eb"
                  stroke="none"
                >
                  <path
                    d="M9079 6154 l-24 -26 -3 -694 -2 -694 -4481 0 c-4886 0 -4536 4 -4559
-55 -13 -35 -14 -2934 0 -2969 5 -14 23 -32 39 -41 27 -13 486 -15 4515 -15
l4486 0 2 -694 3 -694 24 -26 c29 -31 84 -35 121 -9 14 10 747 609 1630 1332
883 723 1680 1376 1772 1450 91 75 174 150 183 167 19 32 16 65 -8 95 -11 15
-3526 2846 -3577 2882 -37 26 -92 22 -121 -9z"
                  />
                </g>
              </svg>{" "}
            </span>
            <span className={styles.flightThere__arrival}>
              {item.endCity}
              {item.endAirport ? "," + item.endAirport : ""}
            </span>
            <span className={styles.flightThere__uid}>
              ({item.endAirportCode})
            </span>
          </div>
        </div>

        <div className={styles.period}>
          <div className={styles.arrive}>
            <span className={styles.time}>{convertedStartDate.time}</span>
            <span className={styles.date}>{convertedStartDate.day}</span>
          </div>

          <span className={styles.duration}>
            {hours} ч {minutes} мин
          </span>
          <div className={styles.arrive}>
            <span className={styles.date}>{convertedEndDate.day}</span>
            <span className={styles.time}>{convertedEndDate.time}</span>
          </div>
        </div>

        <div className={styles.transfer}>
          <span className={styles.transfer_number}>
            Пересадок: {item.stops}
          </span>
        </div>
        <span className={styles.airline}>Рейс выполняет: {item.carrier}</span>
        <button className={styles.button}>ВЫБРАТЬ</button>
      </div>
    </div>
  );
};

interface IFLightCard {
  flights: Flights[]; setFlightsToShow: React.Dispatch<React.SetStateAction<number>>; flightsToShow: number; sortedFlights: Flights[]
}
const FlightCards = ({
  flights,
  setFlightsToShow,
  flightsToShow,
  sortedFlights,
} : IFLightCard) => {
  return (
    <div className={styles.flight_cards}>
      {flights ? (
        flights
          .slice(0, flightsToShow)
          .map((item) => <FlightItem key={item.id} item={item} />)
      ) : (
        <span> Loading...</span>
      )}
      {flightsToShow < sortedFlights.length && (
        <button
          className={styles.button__show}
          onClick={() => {
            setFlightsToShow(flightsToShow + 3);
          }}
        >
          Показать ещё
        </button>
      )}
    </div>
  );
};

export default FlightCards;
