import "./App.css";

import { useEffect, useRef, useState } from "react";

interface BreakEntry {
  startTime: number;
  endTime: number;
  duration: number;
  date: string; // Date when the break started
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

        // Save break history when timer is done
        saveBreakHistory(
          Date.now() - newSecondsLeft * 1000,
          newSecondsLeft * 1000
        );
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [endTime]);

  useEffect(() => {
    if (historyVisible && historyContentRef.current) {
      historyContentRef.current.scrollTop =
        historyContentRef.current.scrollHeight;
    }
  }, [historyVisible]);

  const saveBreakHistory = (startTime: number, duration: number): void => {
    const newEntry: BreakEntry = {
      startTime,
      endTime: startTime + duration,
      duration,
      date: new Date(startTime).toLocaleDateString(),
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

    if (endTime) {
      // Timer is being reset, calculate the elapsed time
      const elapsedTime = Date.now() - (endTime - secondsLeft * 1000); // Elapsed time in milliseconds

      // Save the break history with the actual elapsed time
      saveBreakHistory(Date.now() - elapsedTime, elapsedTime);

      // Reset the timer states
      setEndTime(null);
      setTimerDone(false);
      setSecondsLeft(0);
    } else {
      // Timer is being started
      const totalMilliseconds = (hours * 60 + minutes) * 60 * 1000;
      setEndTime(Date.now() + totalMilliseconds);
      setTimerDone(false);
      setSecondsLeft(totalMilliseconds / 1000);
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
    if (!historyVisible) {
      loadBreakHistory(); // Load history when modal is opened
    }
    setHistoryVisible(!historyVisible);
  };

  // Calculate hours, minutes, and seconds from secondsLeft
  const hrs = Math.floor(secondsLeft / 3600);
  const mins = Math.floor((secondsLeft % 3600) / 60);
  const secs = secondsLeft % 60;

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
            📜
          </button>
        </div>

        <button
          onClick={toggleTimer}
          className={endTime ? "timer-button reset" : "timer-button start"}
        >
          {endTime ? "Reset" : "Start"}
        </button>
      </div>

      {/* History Modal */}
      {historyVisible && (
        <div className="history-modal">
          <div className="modal-header">
            <h2>Break History</h2>
            <button className="clear-history-button" onClick={clearHistory}>
              🧹
            </button>
          </div>

          {/* Iterate through grouped history by day */}
          <div className="history-content" ref={historyContentRef}>
            {Object.entries(groupedHistory).map(([date, entries]) => (
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
                        <span className="history-item-label">Duration</span>{" "}
                        {Math.floor(entry.duration / 60000)} minutes
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <button className="close-modal" onClick={toggleHistoryModal}>
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
