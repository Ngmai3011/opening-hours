import importedData from "./data.json";
import {Day, Days, days_of_week} from "./types";

export default function Opening() {
  const data: Days = importedData as Days;

  const convertTime = (seconds: number | undefined) => {
    if (seconds === undefined) return;

    let hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const period = hours < 12 ? "AM" : "PM";

    if (hours > 12) {
      hours = hours % 12 || 12;
    }
    return `${hours}${minutes ? `:${minutes}` : ""} ${period}`;
  };

  const printOpeningHours = (index: number, day: Day[]) => {
    const openingHour = day.find((dayValue) => dayValue.type === "open");
    let openingTime = "";

    if (openingHour) {
      for (let i = 0; i < day.length; i++) {
        const currentHour = day[i];
        const nextHour = day[i + 1];
        if (currentHour.type === "open") {
          if (openingTime !== "") openingTime += ", ";
          openingTime += convertTime(currentHour.value);

          if (nextHour && nextHour.type === "close") {
            openingTime += ` - ${convertTime(nextHour.value)} `;
            i++;
          } else if (!nextHour) {
            if (index === 6) index = -1;
            const nextDay = days_of_week[index + 1];
            const nextDayValue = (data as Record<string, Day[]>)[nextDay];

            const closingHour = nextDayValue.find(
              (dayValue) => dayValue.type === "close"
            );

            openingTime += ` - ${convertTime(closingHour!.value)} `;
          }
        }
      }
      return openingTime;
    }

    return <span className="closed">Closed</span>;
  };

  const printDay = (dayName: string) => {
    return `${dayName.charAt(0).toUpperCase() + dayName.slice(1)}`;
  };

  const printMarker = (index: number) => {
    const todayIndex = new Date().getDay();
    if (todayIndex - 1 === index) return <span className="today">TODAY</span>;
  };

  return (
    <div>
      {Object.entries(data).map(([dayName, dayValue], index) => (
        <div key={dayName} className="day">
          <div className="day-name">
            {printDay(dayName)} {printMarker(index)}
          </div>
          <div className="day-value">{printOpeningHours(index, dayValue)} </div>
        </div>
      ))}
    </div>
  );
}
