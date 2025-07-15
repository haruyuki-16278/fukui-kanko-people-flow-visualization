import { MonthPicker } from "@/components/parts/month-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useEffect, useState } from "react";
import { ChevronDownIcon } from "lucide-react";

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

  const [openStart, setOpenStart] = useState(false);
  const [openEnd, setOpenEnd] = useState(false);
  const [openStartMonth, setOpenStartMonth] = useState(false);
  const [openEndMonth, setOpenEndMonth] = useState(false);
  const [openStartWeek, setOpenStartWeek] = useState(false);
  const [openEndWeek, setOpenEndWeek] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [startMonth, setStartMonth] = useState<Date | undefined>(undefined);
  const [endMonth, setEndMonth] = useState<Date | undefined>(undefined);
  const [startWeekRange, setStartWeekRange] = useState<{ from: Date; to: Date } | undefined>(
    undefined,
  );
  const [endWeekRange, setEndWeekRange] = useState<{ from: Date; to: Date } | undefined>(undefined);

  function getWeekRange(date: Date) {
    const sunday = new Date(date);
    sunday.setDate(date.getDate() - sunday.getDay());
    const saturday = new Date(sunday);
    saturday.setDate(sunday.getDate() + 6);
    return { from: sunday, to: saturday };
  }

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
            <div className="flex flex-row gap-6 mb-6">
              <div className="flex flex-col gap-3">
                <Label htmlFor="date" className="px-1">
                  開始
                </Label>
                <Popover open={openStartMonth} onOpenChange={setOpenStartMonth}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      id="date"
                      className="w-48 justify-between font-normal"
                    >
                      <span>
                        {startMonth
                          ? `${startMonth.getFullYear()}/${String(startMonth.getMonth() + 1).padStart(2, "0")}`
                          : "Select month"}
                      </span>
                      <ChevronDownIcon />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                    <MonthPicker
                      selected={startMonth}
                      onChange={(date) => {
                        setStartMonth(date);
                        setOpenStartMonth(false);
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="date" className="px-1">
                  終了
                </Label>
                <Popover open={openEndMonth} onOpenChange={setOpenEndMonth}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      id="date"
                      className="w-48 justify-between font-normal"
                    >
                      <span>
                        {endMonth
                          ? `${endMonth.getFullYear()}/${String(endMonth.getMonth() + 1).padStart(2, "0")}`
                          : "Select month"}
                      </span>
                      <ChevronDownIcon />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                    <MonthPicker
                      selected={endMonth}
                      onChange={(date) => {
                        setEndMonth(date);
                        setOpenEndMonth(false);
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
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
            <div className="flex flex-row gap-6 mb-6">
              <div className="flex flex-col gap-3">
                <Label htmlFor="date" className="px-1">
                  開始
                </Label>
                <Popover open={openStartWeek} onOpenChange={setOpenStartWeek}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      id="date"
                      className="w-48 justify-between font-normal"
                    >
                      <span>
                        {startWeekRange
                          ? `${startWeekRange.from.getFullYear()}/${startWeekRange.from.getMonth() + 1}/${startWeekRange.from.getDate()} ~ ${startWeekRange.to.getFullYear()}/${startWeekRange.to.getMonth() + 1}/${startWeekRange.to.getDate()}`
                          : "Select week"}
                      </span>
                      <ChevronDownIcon />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                    <Calendar
                      mode="range"
                      selected={startWeekRange}
                      captionLayout="dropdown"
                      onSelect={(date) => {
                        if (date?.from) {
                          setStartWeekRange(getWeekRange(date.from));
                          setOpenStartWeek(false);
                        }
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="date" className="px-1">
                  終了
                </Label>
                <Popover open={openEndWeek} onOpenChange={setOpenEndWeek}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      id="date"
                      className="w-48 justify-between font-normal"
                    >
                      <span>
                        {endWeekRange
                          ? `${endWeekRange.from.getFullYear()}/${endWeekRange.from.getMonth() + 1}/${endWeekRange.from.getDate()} ~ ${endWeekRange.to.getFullYear()}/${endWeekRange.to.getMonth() + 1}/${endWeekRange.to.getDate()}`
                          : "Select week"}
                      </span>
                      <ChevronDownIcon />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                    <Calendar
                      mode="range"
                      selected={endWeekRange}
                      captionLayout="dropdown"
                      onSelect={(date) => {
                        if (date?.from) {
                          setEndWeekRange(getWeekRange(date.from));
                          setOpenEndWeek(false);
                        }
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
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
            <div className="flex flex-row gap-6 mb-6">
              <div className="flex flex-row gap-6 mb-6">
                <div className="flex flex-col gap-3">
                  <Label htmlFor="date" className="px-1">
                    開始
                  </Label>
                  <Popover open={openStart} onOpenChange={setOpenStart}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        id="date"
                        className="w-48 justify-between font-normal"
                      >
                        <span>
                          {startDate
                            ? `${startDate.getFullYear()}/${String(startDate.getMonth() + 1).padStart(2, "0")}/${String(startDate.getDate()).padStart(2, "0")}`
                            : "Select date"}
                        </span>
                        <ChevronDownIcon />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        captionLayout="dropdown"
                        onSelect={(date) => {
                          setStartDate(date);
                          setOpenStart(false);
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex flex-col gap-3">
                  <Label htmlFor="date" className="px-1">
                    終了
                  </Label>
                  <Popover open={openEnd} onOpenChange={setOpenEnd}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        id="date"
                        className="w-48 justify-between font-normal"
                      >
                        <span>
                          {endDate
                            ? `${endDate.getFullYear()}/${String(endDate.getMonth() + 1).padStart(2, "0")}/${String(endDate.getDate()).padStart(2, "0")}`
                            : "Select date"}
                        </span>
                        <ChevronDownIcon />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        captionLayout="dropdown"
                        onSelect={(date) => {
                          setEndDate(date);
                          setOpenEnd(false);
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
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
