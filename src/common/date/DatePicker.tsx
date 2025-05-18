import { CalendarRange, X } from "lucide-react";
import Flatpickr from "react-flatpickr";

import flatpickr from "flatpickr";
import { Korean } from "flatpickr/dist/l10n/ko.js";

flatpickr.localize(Korean);

const DatePicker = ({
  date,
  setDate,
  placeholder = "Date",
  className,
  disable,
  name,
  datePickerRef,
}: {
  date: any[];
  setDate: (date: any[]) => void;
  placeholder?: string;
  className?: string;
  disable?: any;
  name?: string;
  datePickerRef?: any;
}) => {
  return (
    <div className={`relative w-full ${className}`}>
      <CalendarRange className="absolute size-4 ltr:left-3 rtl:right-3 top-3 text-slate-500 dark:text-zinc-200" />
      <Flatpickr
        ref={datePickerRef}
        name={name || "date"}
        className="border p-2 w-full rounded border-slate-200 dark:border-zinc-500 focus:outline-none focus:border-blue-500 disabled:bg-slate-100 dark:disabled:bg-zinc-600 disabled:border-slate-300 dark:disabled:border-zinc-500 dark:disabled:text-zinc-200 disabled:text-slate-500 dark:text-zinc-100 dark:bg-zinc-700 dark:focus:border-blue-800 placeholder:text-slate-400 dark:placeholder:text-zinc-200 ltr:pl-10 rtl:pr-10"
        options={{ dateFormat: "Y-m-d", disable: [disable] }}
        placeholder={placeholder}
        value={date}
        onChange={setDate as any}
      />
      <X
        className="hover:text-red-500 cursor-pointer inline-block size-4 absolute ltr:right-2.5 rtl:left-2.5 top-2.5 text-slate-500 dark:text-zinc-200 fill-slate-100 dark:fill-zinc-600"
        onClick={() => setDate([null])}
      />
    </div>
  );
};

export default DatePicker;
