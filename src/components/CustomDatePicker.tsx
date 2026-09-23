'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, ChevronDown, Check, Info } from 'lucide-react';
import styles from './CustomDatePicker.module.css';

interface CustomDatePickerProps {
  value: string; // 'YYYY-MM-DD'
  onChange: (dateStr: string) => void;
  minDate?: string; // 'YYYY-MM-DD'
  className?: string;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const WEEKDAYS = [
  { label: 'Su', full: 'Sunday', isTuesday: false },
  { label: 'Mo', full: 'Monday', isTuesday: false },
  { label: 'Tu', full: 'Tuesday (Closed)', isTuesday: true },
  { label: 'We', full: 'Wednesday', isTuesday: false },
  { label: 'Th', full: 'Thursday', isTuesday: false },
  { label: 'Fr', full: 'Friday', isTuesday: false },
  { label: 'Sa', full: 'Saturday', isTuesday: false },
];

/**
 * Checks if a given Date is a Tuesday (getDay() === 2)
 */
export function isTuesday(date: Date): boolean {
  return date.getDay() === 2;
}

/**
 * Returns 'YYYY-MM-DD' string for a Date object in local time
 */
export function formatDateToStr(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Formats 'YYYY-MM-DD' into a user-friendly format e.g. "Wed, Sep 24, 2026"
 */
export function formatDisplayDate(dateStr: string): string {
  if (!dateStr) return 'Select Delivery Date';
  const [y, m, d] = dateStr.split('-').map(Number);
  if (!y || !m || !d) return dateStr;
  
  const date = new Date(y, m - 1, d);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const compareDate = new Date(y, m - 1, d);
  compareDate.setHours(0, 0, 0, 0);

  const diffTime = compareDate.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
  const monthName = date.toLocaleDateString('en-US', { month: 'short' });
  const formatted = `${dayName}, ${monthName} ${d}, ${y}`;

  if (diffDays === 0) return `Today (${formatted})`;
  if (diffDays === 1) return `Tomorrow (${formatted})`;
  return formatted;
}

export const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  value,
  onChange,
  minDate,
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse initial selected date or fallback to current
  const parsedValue = value ? (() => {
    const [y, m, d] = value.split('-').map(Number);
    return new Date(y, m - 1, d);
  })() : new Date();

  // Current viewing month and year in calendar
  const [viewYear, setViewYear] = useState<number>(parsedValue.getFullYear());
  const [viewMonth, setViewMonth] = useState<number>(parsedValue.getMonth());

  // Today in local midnight
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = formatDateToStr(today);

  const effectiveMinStr = minDate || todayStr;
  const [minY, minM, minD] = effectiveMinStr.split('-').map(Number);
  const minDateTime = new Date(minY, minM - 1, minD).getTime();

  // Keep view in sync if value changes externally
  useEffect(() => {
    if (value) {
      const [y, m] = value.split('-').map(Number);
      if (y && m) {
        setViewYear(y);
        setViewMonth(m - 1);
      }
    }
  }, [value]);

  // Handle outside clicks to close calendar
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((prev) => prev - 1);
    } else {
      setViewMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((prev) => prev + 1);
    } else {
      setViewMonth((prev) => prev + 1);
    }
  };

  // Generate days grid for viewYear and viewMonth
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const handleSelectDay = (day: number) => {
    const selected = new Date(viewYear, viewMonth, day);
    if (isTuesday(selected)) return; // Block Tuesdays
    if (selected.getTime() < minDateTime) return; // Block past dates

    const dateStr = formatDateToStr(selected);
    onChange(dateStr);
    setIsOpen(false);
  };

  // Quick Action: Earliest Available Day
  const handleSelectEarliest = (e: React.MouseEvent) => {
    e.stopPropagation();
    const candidate = new Date();
    candidate.setHours(0, 0, 0, 0);
    // If today is Tuesday, advance to Wednesday
    if (isTuesday(candidate)) {
      candidate.setDate(candidate.getDate() + 1);
    }
    const dStr = formatDateToStr(candidate);
    onChange(dStr);
    setIsOpen(false);
  };

  // Quick Action: Tomorrow (if not Tuesday)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  const isTomorrowTuesday = isTuesday(tomorrow);

  const handleSelectTomorrow = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isTomorrowTuesday) return;
    const dStr = formatDateToStr(tomorrow);
    onChange(dStr);
    setIsOpen(false);
  };

  return (
    <div className={`${styles.datePickerContainer} ${className || ''}`} ref={containerRef}>
      {/* Input Trigger */}
      <button
        type="button"
        className={`${styles.datePickerTrigger} ${isOpen ? styles.datePickerTriggerOpen : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
      >
        <div className={styles.datePickerValue}>
          <CalendarIcon size={16} className={styles.calendarIcon} />
          <span className={styles.selectedDateText}>{formatDisplayDate(value)}</span>
        </div>
        <ChevronDown
          size={16}
          className={`${styles.dropdownChevron} ${isOpen ? styles.dropdownChevronRotate : ''}`}
        />
      </button>

      {/* Beautiful Popover Calendar */}
      {isOpen && (
        <div className={styles.calendarPopover}>
          {/* Header */}
          <div className={styles.calendarHeader}>
            <div className={styles.monthTitleWrapper}>
              <span className={styles.monthTitle}>
                {MONTH_NAMES[viewMonth]} {viewYear}
              </span>
            </div>
            <div className={styles.navButtons}>
              <button
                type="button"
                className={styles.navBtn}
                onClick={handlePrevMonth}
                aria-label="Previous Month"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                className={styles.navBtn}
                onClick={handleNextMonth}
                aria-label="Next Month"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className={styles.quickShortcuts}>
            <button
              type="button"
              className={styles.shortcutChip}
              onClick={handleSelectEarliest}
            >
              ⚡ Earliest Delivery
            </button>
            {!isTomorrowTuesday && (
              <button
                type="button"
                className={styles.shortcutChip}
                onClick={handleSelectTomorrow}
              >
                Tomorrow
              </button>
            )}
          </div>

          {/* Weekday Labels */}
          <div className={styles.weekdaysGrid}>
            {WEEKDAYS.map((wd) => (
              <div
                key={wd.label}
                className={`${styles.weekdayCell} ${wd.isTuesday ? styles.tuesdayHeader : ''}`}
                title={wd.full}
              >
                {wd.label}
                {wd.isTuesday && <span className={styles.offDot} title="Closed on Tuesdays">•</span>}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className={styles.daysGrid}>
            {/* Empty slots for month start offset */}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} className={styles.emptyDayCell} />
            ))}

            {/* Month Days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNumber = i + 1;
              const dateObj = new Date(viewYear, viewMonth, dayNumber);
              dateObj.setHours(0, 0, 0, 0);
              const dateStr = formatDateToStr(dateObj);

              const isPast = dateObj.getTime() < minDateTime;
              const isClosedTuesday = isTuesday(dateObj);
              const isDisabled = isPast || isClosedTuesday;
              const isSelected = value === dateStr;
              const isCurrentToday = dateStr === todayStr;

              return (
                <button
                  key={`day-${dayNumber}`}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => handleSelectDay(dayNumber)}
                  className={`
                    ${styles.dayCell}
                    ${isSelected ? styles.daySelected : ''}
                    ${isCurrentToday && !isSelected ? styles.dayToday : ''}
                    ${isClosedTuesday ? styles.dayTuesdayBlocked : ''}
                    ${isPast ? styles.dayPastDisabled : ''}
                  `}
                  title={
                    isClosedTuesday
                      ? 'No delivery on Tuesdays (Kitchen Closed)'
                      : isPast
                      ? 'Past date unavailable'
                      : `Select ${formatDisplayDate(dateStr)}`
                  }
                >
                  <span className={styles.dayNumber}>{dayNumber}</span>
                  {isSelected && <Check size={11} className={styles.selectedCheck} />}
                  {isClosedTuesday && <span className={styles.closedTag}>OFF</span>}
                  {isCurrentToday && !isSelected && !isClosedTuesday && (
                    <span className={styles.todayIndicatorDot} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Kitchen Notice Banner */}
          <div className={styles.calendarFooterBanner}>
            <Info size={13} className={styles.footerInfoIcon} />
            <span>
              <strong>Note:</strong> Delivery available <strong>Wed – Mon</strong>. Tuesdays are closed for kitchen prep.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
