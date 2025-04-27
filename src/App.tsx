import "./App.css";

import { useEffect, useRef, useState } from "react";

interface BreakEntry {
  startTime: number;
  endTime: number;
  duration: number;
  targetDuration: number;
  date: string; // Date when the break started
  color: string;
}

const MAX_HISTORY_DAYS = 7;

function App() {
  const [hours, setHours] = useState<number>(2);
  const [minutes, setMinutes] = useState<number>(0);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [secondsLeft, setSecondsLeft] = useState<number>(0);
  const [timerDone, setTimerDone] = useState<boolean>(false);
  const [historyVisible, setHistoryVisible] = useState<boolean>(false); // Track visibility of history modal
  const [history, setHistory] = useState<BreakEntry[]>([]); // Store break history
  const timerRef = useRef<number | null>(null);
  const historyContentRef = useRef<HTMLDivElement | null>(null);

  // Calculate hours, minutes, and seconds from secondsLeft
  const hrs = Math.floor(secondsLeft / 3600);
  const mins = Math.floor((secondsLeft % 3600) / 60);
  const secs = secondsLeft % 60;

  const targetDurationInSeconds = (hours * 60 + minutes) * 60;

  let normalizedPercentage = 0; // Default to 0 if no endTime

  if (endTime) {
    const elapsedTimeInSeconds = (endTime - Date.now()) / 1000;
    normalizedPercentage = Math.max(
      0,
      Math.min(1, elapsedTimeInSeconds / targetDurationInSeconds)
    );
  }

  // Determine the background color based on the timer state
  let backgroundClass = "default-bg";
  if (endTime && !timerDone) {
    backgroundClass = "active-timer-bg";
  }

  const emoji = endTime && !timerDone ? "🚭" : "🚬";

  // Group the history by day
  const groupedHistory = history.reduce((groups, entry) => {
    const dateKey = entry.date;
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(entry);
    return groups;
  }, {} as { [key: string]: BreakEntry[] });

  useEffect(() => {
    if (!endTime) return;

    // Define targetDuration before using it
    const targetDuration = (hours * 60 + minutes) * 60 * 1000;

    timerRef.current = window.setInterval(() => {
      const newSecondsLeft = Math.max(
        Math.round((endTime - Date.now()) / 1000),
        0
      );
      setSecondsLeft(newSecondsLeft);

      if (newSecondsLeft === 0 && !timerDone) {
        if (timerRef.current) clearInterval(timerRef.current);
        setTimerDone(true); // Mark timer as done

        // Trigger mobile vibration
        if (navigator.vibrate) {
          navigator.vibrate([300, 100, 300]);
        }

        // Calculate the actual duration before calling saveBreakHistory
        const actualDuration = targetDuration - newSecondsLeft * 1000; // corrected here
        const startTime = endTime - targetDuration;

        saveBreakHistory(startTime, actualDuration, targetDuration);

        // Reset the timer automatically after saving the history
        setEndTime(null);
        setTimerDone(false);
        setSecondsLeft(0);
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [endTime, timerDone, hours, minutes]);

  useEffect(() => {
    if (historyVisible && historyContentRef.current) {
      historyContentRef.current.scrollTop =
        historyContentRef.current.scrollHeight;
    }
  }, [historyVisible]);

  const saveBreakHistory = (
    startTime: number,
    duration: number,
    targetDuration: number
  ): void => {
    const percentageElapsed =
      1 - Math.max(0, Math.min(1, duration / targetDuration));
    const color = interpolateColor(percentageElapsed);

    const newEntry: BreakEntry = {
      startTime,
      endTime: startTime + duration,
      duration,
      targetDuration,
      date: new Date(startTime).toLocaleDateString(),
      color,
    };

    // Load existing history from localStorage
    const storedHistory: BreakEntry[] = JSON.parse(
      localStorage.getItem("breakHistory") || "[]"
    );

    // Add the new entry to the history
    storedHistory.push(newEntry);

    // Filter history to keep only the last 7 days
    const filteredHistory = storedHistory.filter((entry) => {
      const timeDiff = Date.now() - new Date(entry.startTime).getTime();
      return timeDiff <= MAX_HISTORY_DAYS * 24 * 60 * 60 * 1000;
    });

    // Save the updated history to localStorage
    localStorage.setItem("breakHistory", JSON.stringify(filteredHistory));
    setHistory(filteredHistory); // Update the state
  };

  const loadBreakHistory = (): void => {
    const storedHistory: BreakEntry[] = JSON.parse(
      localStorage.getItem("breakHistory") || "[]"
    );
    setHistory(storedHistory);
  };

  const clearHistory = () => {
    // Clear history from state and localStorage
    localStorage.removeItem("breakHistory");
    setHistory([]); // Clear the history state
  };

  const toggleTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);

    const currentTime = Date.now();

    if (endTime && !timerDone) {
      // Timer is currently running, but the user clicked "reset"
      // Save the break history before resetting
      const elapsedTime =
        currentTime - (endTime - (hours * 60 + minutes) * 60 * 1000); // Time elapsed since timer started
      const actualDuration = elapsedTime;
      const targetDuration = (hours * 60 + minutes) * 60 * 1000;

      // Save the break history with the actual elapsed time
      saveBreakHistory(
        endTime - targetDuration,
        actualDuration,
        targetDuration
      );

      // Reset the timer states
      setEndTime(null);
      setTimerDone(false);
      setSecondsLeft(0);
    } else {
      // Timer is being started or reset after completion
      const totalMilliseconds = (hours * 60 + minutes) * 60 * 1000;
      setEndTime(currentTime + totalMilliseconds);
      setTimerDone(false); // Reset timerDone flag
      setSecondsLeft(totalMilliseconds / 1000); // Convert back to seconds for the state
    }
  };

  // Handle the input changes for hours and minutes
  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(99, Math.max(0, Number(e.target.value)));
    setHours(value);
  };

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(59, Math.max(0, Number(e.target.value)));
    setMinutes(value);
  };

  // Handle the visibility of the history modal
  const toggleHistoryModal = () => {
    if (historyVisible) {
      // Add the closing class to trigger the slide-up animation
      document.body.classList.add("history-closing");
      setTimeout(() => {
        setHistoryVisible(false);
        document.body.classList.remove("history-closing");
      }, 500); // Delay should match the duration of the slide-out animation
    } else {
      setHistoryVisible(true);
      loadBreakHistory(); // Load history when modal is opened
    }
  };

  const interpolateColor = (percentage: number) => {
    console.log("percentage ", percentage);
    // Ensure percentage is between 0 and 1
    percentage = Math.max(0, Math.min(1, percentage));

    const colors = [
      { pct: 0.0, color: { r: 107, g: 203, b: 119 } }, // Green
      { pct: 0.5, color: { r: 255, g: 179, b: 71 } }, // Amber
      { pct: 1.0, color: { r: 255, g: 107, b: 107 } }, // Red
    ];

    let lower = colors[0];
    let upper = colors[colors.length - 1];

    for (let i = 1; i < colors.length; i++) {
      if (percentage < colors[i].pct) {
        upper = colors[i];
        lower = colors[i - 1];
        break;
      }
    }

    const range = upper.pct - lower.pct;
    const rangePct = range === 0 ? 0 : (percentage - lower.pct) / range;

    const r = Math.round(
      lower.color.r + (upper.color.r - lower.color.r) * rangePct
    );
    const g = Math.round(
      lower.color.g + (upper.color.g - lower.color.g) * rangePct
    );
    const b = Math.round(
      lower.color.b + (upper.color.b - lower.color.b) * rangePct
    );

    return `rgb(${r},${g},${b})`;
  };

  return (
    <div className={`container ${backgroundClass}`}>
      <div className="content">
        <h1>Cessate</h1>
        <span className="emoji">{emoji}</span>

        <div
          className="timer-display"
          style={{
            color: interpolateColor(normalizedPercentage),
          }} // Apply the interpolated color to font
        >
          {`${hrs.toString().padStart(2, "0")}:${mins
            .toString()
            .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`}
        </div>

        <div className="input-group">
          <div className="input">
            <input
              type="number"
              inputMode="numeric"
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
              inputMode="numeric"
              value={minutes}
              min={0}
              max={59}
              onChange={handleMinutesChange}
              className="time-input"
              placeholder="Minutes"
            />
            <span className="label">Minutes</span>
          </div>

          {/* History icon */}
          <button className="history-icon" onClick={toggleHistoryModal}>
            <span>📜</span>
          </button>
        </div>

        <button
          onClick={toggleTimer}
          className={endTime ? "timer-button reset" : "timer-button start"}
        >
          {endTime ? "Reset" : "Start"}
        </button>
      </div>

      <div className={`history-modal ${historyVisible ? "open" : ""}`}>
        <div className="modal-header">
          <h2>History</h2>
          <button className="clear-history-button" onClick={clearHistory}>
            🧹
          </button>
        </div>

        {/* Iterate through grouped history by day */}
        <div className="history-content" ref={historyContentRef}>
          {Object.entries(groupedHistory).length === 0 ? (
            <div className="no-data-message">No history available.</div>
          ) : (
            Object.entries(groupedHistory).map(([date, entries]) => (
              <div key={date} className="day-entry">
                <div className="date">
                  {date} - {entries.length} Sessions
                </div>
                <div className="history-items">
                  {entries.map((entry, idx) => (
                    <div key={idx} className="history-item">
                      <span className="entry">
                        <span className="history-item-label">Start</span>{" "}
                        {new Date(entry.startTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      <span className="entry">
                        <span className="history-item-label duration-label">
                          Duration
                        </span>{" "}
                        <span
                          style={{
                            color: entry.color,
                          }}
                        >
                          {Math.floor(entry.duration / 60000)} min
                          {" ("}
                          {Math.floor(
                            (entry.duration / entry.targetDuration) * 100
                          )}
                          {"%)"}
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        <button className="close-modal" onClick={toggleHistoryModal}>
          Dismiss
        </button>
      </div>
    </div>
  );
}

export default App;
