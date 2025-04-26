import "./App.css";

import { useEffect, useRef, useState } from "react";

function App() {
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(30);
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

  function startTimer() {
    if (timerRef.current) clearInterval(timerRef.current);
    const totalMilliseconds = (hours * 60 + minutes) * 60 * 1000;
    setEndTime(Date.now() + totalMilliseconds);
    setTimerDone(false); // Reset the "done" state
  }

  // Calculate hours, minutes, and seconds from secondsLeft
  const hrs = Math.floor(secondsLeft / 3600);
  const mins = Math.floor((secondsLeft % 3600) / 60);
  const secs = secondsLeft % 60;

  // Determine the background color based on the timer state
  let backgroundClass = "default-bg";
  if (endTime && !timerDone) {
    backgroundClass = "active-timer-bg"; // Active timer (orange)
  } else if (timerDone) {
    backgroundClass = "done-timer-bg"; // Timer done (green)
  }

  return (
    <div className={`container ${backgroundClass}`}>
      <h1>Cessate</h1>

      <div className="timer-display">
        {`${hrs.toString().padStart(2, "0")}:${mins
          .toString()
          .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`}
      </div>

      <div className="input-group">
        <input
          type="number"
          value={hours}
          min={0}
          onChange={(e) => setHours(Number(e.target.value))}
          className="time-input"
          placeholder="Hours"
        />
        <span className="label">H</span>

        <input
          type="number"
          value={minutes}
          min={0}
          onChange={(e) => setMinutes(Number(e.target.value))}
          className="time-input"
          placeholder="Minutes"
        />
        <span className="label">M</span>
      </div>

      <button onClick={startTimer} className="timer-button">
        Start
      </button>
    </div>
  );
}

export default App;
