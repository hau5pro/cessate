import "./App.css";

import { useEffect, useRef, useState } from "react";

function App() {
  const [hours, setHours] = useState<number>(2);
  const [minutes, setMinutes] = useState<number>(0);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [secondsLeft, setSecondsLeft] = useState<number>(0);
  const [timerDone, setTimerDone] = useState<boolean>(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!endTime) return;

    timerRef.current = window.setInterval(() => {
      const newSecondsLeft = Math.max(
        Math.round((endTime - Date.now()) / 1000),
        0
      );
      setSecondsLeft(newSecondsLeft);

      if (newSecondsLeft === 0) {
        if (timerRef.current) clearInterval(timerRef.current);
        setTimerDone(true); // Set timer done after reaching 0

        // Trigger mobile vibration
        if (navigator.vibrate) {
          navigator.vibrate([300, 100, 300]);
        }
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [endTime]);

  function toggleTimer() {
    if (timerRef.current) clearInterval(timerRef.current);
    if (endTime) {
      setEndTime(null); // Reset the timer if already running
      setTimerDone(false); // Reset the "done" state
      setSecondsLeft(0); // Reset the seconds left when timer is reset
    } else {
      const totalMilliseconds = (hours * 60 + minutes) * 60 * 1000;
      setEndTime(Date.now() + totalMilliseconds);
      setTimerDone(false); // Reset the "done" state
      setSecondsLeft(totalMilliseconds / 1000); // Start with the total time in seconds
    }
  }

  // Ensure hours are within the range [0, 99]
  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(99, Math.max(0, Number(e.target.value)));
    setHours(value);
  };

  // Ensure minutes are within the range [0, 59]
  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(59, Math.max(0, Number(e.target.value)));
    setMinutes(value);
  };

  // Calculate hours, minutes, and seconds from secondsLeft
  const hrs = Math.floor(secondsLeft / 3600);
  const mins = Math.floor((secondsLeft % 3600) / 60);
  const secs = secondsLeft % 60;

  // Determine the background color based on the timer state
  let backgroundClass = "default-bg";
  if (endTime && !timerDone) {
    backgroundClass = "active-timer-bg"; // Active timer (orange)
  }

  // Conditional emoji based on timer state
  const emoji = endTime && !timerDone ? "🚭" : "🚬";

  return (
    <div className={`container ${backgroundClass}`}>
      <div className="content">
        <h1>Cessate</h1>

        <span className="emoji">{emoji}</span>

        <div className="timer-display">
          {`${hrs.toString().padStart(2, "0")}:${mins
            .toString()
            .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`}
        </div>

        <div className="input-group">
          <div className="input">
            <input
              type="number"
              value={hours}
              min={0}
              max={99}
              onChange={handleHoursChange}
              className="time-input"
              placeholder="Hours"
            />
            <span className="label">Hours</span>
          </div>
          <div className="input">
            <input
              type="number"
              value={minutes}
              min={0}
              max={59}
              onChange={handleMinutesChange}
              className="time-input"
              placeholder="Minutes"
            />
            <span className="label">Minutes</span>
          </div>
        </div>

        <button
          onClick={toggleTimer}
          className={endTime ? "timer-button reset" : "timer-button start"}
        >
          {endTime ? "Reset" : "Start"}
        </button>
      </div>
    </div>
  );
}

export default App;
