import { MonthRangePicker } from "@/components/parts/month-range-picker";
import { RangeSelector } from "@/components/parts/range-selector";
import { useEffect, useState } from "react";

function App() {
  useEffect(() => {
    // bodyとhtmlのマージン・パディングをリセット
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.documentElement.style.margin = "0";
    document.documentElement.style.padding = "0";
  }, []);

  // 開発環境かどうかを判定
  const isDev = import.meta.env.DEV;
  // ローカル開発時はランディングページのポート、本番時は相対パス
  const homeUrl = isDev ? "http://localhost:3004" : "../";

  const containerStyle = {
    minHeight: "100vh",
    width: "100vw",
    background: "linear-gradient(to bottom right, #dbeafe, #e0e7ff)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "Arial, sans-serif",
    margin: 0,
    padding: 0,
    boxSizing: "border-box" as const,
  };

  const contentStyle = {
    textAlign: "center" as const,
    padding: "2rem",
  };

  const emojiStyle = {
    fontSize: "6rem",
    marginBottom: "2rem",
  };

  const titleStyle = {
    fontSize: "2.5rem",
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: "1rem",
  };

  const messageStyle = {
    fontSize: "1.25rem",
    color: "#4b5563",
    marginBottom: "2rem",
  };

  const buttonStyle = {
    display: "inline-block",
    backgroundColor: "#10b981",
    color: "white",
    padding: "0.75rem 1.5rem",
    borderRadius: "0.375rem",
    textDecoration: "none",
    transition: "background-color 0.2s",
    border: "none",
    cursor: "pointer",
  };

  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [startMonth, setStartMonth] = useState<Date | undefined>(undefined);
  const [endMonth, setEndMonth] = useState<Date | undefined>(undefined);
  const [startWeekRange, setStartWeekRange] = useState<{ from: Date; to: Date } | undefined>(
    undefined,
  );
  const [endWeekRange, setEndWeekRange] = useState<{ from: Date; to: Date } | undefined>(undefined);

  return (
    <>
      <div style={containerStyle}>
        <div style={contentStyle}>
          <div style={emojiStyle}>🚧</div>
          <h1 style={titleStyle}>福井駅周辺データ可視化</h1>
          <p style={messageStyle}>現在開発中です</p>
          <div
            style={{
              border: "2px solid #e5e7eb",
              borderRadius: "1rem",
              background: "#f9fafb",
              padding: "2rem",
              marginBottom: "2rem",
              display: "inline-block",
            }}
          >
            <p style={messageStyle}>月別</p>
            <MonthRangePicker
              startMonth={startMonth}
              endMonth={endMonth}
              onChange={(start, end) => {
                setStartMonth(start);
                setEndMonth(end);
              }}
            />
          </div>
          <div
            style={{
              border: "2px solid #e5e7eb",
              borderRadius: "1rem",
              background: "#f9fafb",
              padding: "2rem",
              marginBottom: "2rem",
              display: "inline-block",
            }}
          >
            <p style={messageStyle}>週別</p>
            <RangeSelector
              type="week"
              start={startWeekRange}
              end={endWeekRange}
              setStart={setStartWeekRange}
              setEnd={setEndWeekRange}
            />
          </div>
          <div
            style={{
              border: "2px solid #e5e7eb",
              borderRadius: "1rem",
              background: "#f9fafb",
              padding: "2rem",
              marginBottom: "2rem",
              display: "inline-block",
            }}
          >
            <p style={messageStyle}>日別/時間別</p>
            <RangeSelector
              type="date"
              start={startDate}
              end={endDate}
              setStart={setStartDate}
              setEnd={setEndDate}
            />
          </div>
          <a
            href={homeUrl}
            style={buttonStyle}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#059669")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#10b981")}
          >
            ← トップページに戻る
          </a>
        </div>
      </div>
    </>
  );
}

export default App;
