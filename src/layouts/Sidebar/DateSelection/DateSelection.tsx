import React, { useState } from "react";
import DatePicker from "antd/es/date-picker";
import { CalendarOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";

interface DateSelectionProps {
  onDateChange?: (dates: unknown, dateStrings: [string, string]) => void;
}

const DateSelection: React.FC<DateSelectionProps> = ({ onDateChange }) => {
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);

  const handleStartDateChange = (date: Dayjs | null) => {
    setStartDate(date);
    if (date && endDate) {
      onDateChange?.(
        [date, endDate],
        [date.format("YYYY-MM-DD"), endDate.format("YYYY-MM-DD")],
      );
    }
  };

  const handleEndDateChange = (date: Dayjs | null) => {
    setEndDate(date);
    if (startDate && date) {
      onDateChange?.(
        [startDate, date],
        [startDate.format("YYYY-MM-DD"), date.format("YYYY-MM-DD")],
      );
    }
  };

  return (
    <div className="w-full">
      <div
        style={{
          marginBottom: "1rem",
          color: "#E0E0E0",
          fontSize: "14px",
          fontWeight: 600,
        }}
      >
        <CalendarOutlined style={{ marginRight: "8px", color: "#E0E0E0" }} />
        Acquistion date
      </div>

      <div style={{ display: "flex", gap: "20px" }}>
        <div>
          <DatePicker
            value={startDate}
            onChange={handleStartDateChange}
            style={{
              width: "100%",
              backgroundColor: "transparent",
              border: "1px solid #404d63",
              borderRadius: "8px",
              color: "#E0E0E0",
            }}
            placeholder="Pick a date"
            format="YYYY-MM-DD"
            size="middle"
            className="dark"
            popupClassName="dark-calendar"
          />
        </div>

        <div>
          <DatePicker
            value={endDate}
            onChange={handleEndDateChange}
            style={{
              width: "100%",
              backgroundColor: "transparent",
              border: "1px solid #404d63",
              borderRadius: "8px",
              color: "#E0E0E0",
            }}
            placeholder="Pick a date"
            format="YYYY-MM-DD"
            size="middle"
            className="dark"
            popupClassName="dark-calendar"
          />
        </div>
      </div>

      <style>{`
        .dark .ant-picker {
          background-color: transparent !important;
          border-color: #404d63 !important;
          color: #E0E0E0 !important;
        }
        .dark .ant-picker-input > input {
          color: #E0E0E0 !important;
          background-color: transparent !important;
        }
        .dark .ant-picker-input > input::placeholder {
          color: #626972 !important;
        }
        .dark .ant-picker-suffix {
          color: #E0E0E0 !important;
        }
        .dark svg{
          color: #E0E0E0 !important;
        }
        .dark-calendar .ant-picker-panel-container {
          background-color: #1a2332 !important;
          border: 1px solid #404d63 !important;
        }
        .dark-calendar .ant-picker-header,
        .dark-calendar .ant-picker-body {
          color: #FFFFFF !important;
        }
        .dark-calendar .ant-picker-header-view button {
          color: #FFFFFF !important;
        }
        .dark-calendar .ant-picker-header button {
          color: #FFFFFF !important;
        }
        .dark-calendar .ant-picker-cell {
          color: #FFFFFF !important;
        }
        .dark-calendar .ant-picker-cell:hover {
          background-color: rgba(24, 144, 255, 0.2) !important;
        }
        .dark-calendar .ant-picker-cell-selected .ant-picker-cell-inner {
          background-color: #1890ff !important;
          border: none !important;
        }
        .dark-calendar .ant-picker-cell-in-view {
          color: #FFFFFF !important;
        }
        .dark-calendar .ant-picker-cell-disabled {
          color: #666666 !important;
        }
        .dark-calendar .ant-picker-today .ant-picker-cell-inner {
          border: 1px solid #1890ff !important;
        }
        .dark-calendar .ant-picker-footer {
          border-top-color: #404d63 !important;
        }
        .dark-calendar .ant-picker-ok button {
          background-color: #1890ff !important;
          border-color: #1890ff !important;
          color: #FFFFFF !important;
        }
        .dark-calendar .ant-picker-content th {
        color: #FFFFFF !important;
        }
      `}</style>
    </div>
  );
};

export default DateSelection;
