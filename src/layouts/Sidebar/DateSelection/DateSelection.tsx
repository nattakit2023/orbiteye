import React from "react";
import DatePicker from "antd/es/date-picker";
import { CalendarOutlined } from "@ant-design/icons";

const { RangePicker } = DatePicker;

interface DateSelectionProps {
  onDateChange?: (dates: unknown, dateStrings: [string, string]) => void;
}

const DateSelection: React.FC<DateSelectionProps> = ({ onDateChange }) => {
  return (
    <div className="w-full">
      <div
        style={{
          marginBottom: "1rem",
          color: "#FFFFFF",
          fontSize: "14px",
          fontWeight: 600,
        }}
      >
        <CalendarOutlined style={{ marginRight: "8px", color: "#1890ff" }} />
        Select Date Range
      </div>

      <RangePicker
        style={{
          width: "100%",
          backgroundColor: "#293653",
          border: "1px solid #404d63",
          borderRadius: "8px",
          padding: "8px 12px",
        }}
        placeholder={["Start Date", "End Date"]}
        onChange={(dates: unknown, dateStrings: [string, string]) => {
          console.log("Date selected:", dates, dateStrings);
          onDateChange?.(dates, dateStrings);
        }}
        format="YYYY-MM-DD"
        size="large"
        className="dark"
        popupClassName="dark-calendar"
      />

      <style>{`
        .dark .ant-picker {
          background-color: #293653 !important;
          border-color: #404d63 !important;
          color: #FFFFFF !important;
        }
        .dark .ant-picker-input > input {
          color: #FFFFFF !important;
          background-color: transparent !important;
        }
        .dark .ant-picker-input > input::placeholder {
          color: #999999 !important;
        }
        .dark .ant-picker:hover,
        .dark .ant-picker-focused {
          border-color: #1890ff !important;
          box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2) !important;
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
      `}</style>
    </div>
  );
};

export default DateSelection;
