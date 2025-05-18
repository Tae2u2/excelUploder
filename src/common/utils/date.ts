type DateType = Date | string | number;

const zero = (value: number | string) => value.toString().padStart(2, '0');

export const dateFormatter = (
  format: string,
  date: DateType = Date.now()
): string => {
  if (!date) return '';
  const _date = new Date(date);

  return format.replace(
    /(yyyy|yy|mm|m|dd|d|HH|H|MM|M|SS|S)/g,
    (t: string): any => {
      switch (t) {
        case 'yyyy':
          return _date.getFullYear();
        case 'yy':
          return _date.getFullYear().toString().slice(2);
        case 'mm':
          return zero(_date.getMonth() + 1);
        case 'm':
          return _date.getMonth() + 1;
        case 'dd':
          return zero(_date.getDate());
        case 'd':
          return _date.getDate();
        case 'HH':
          return zero(_date.getHours());
        case 'H':
          return _date.getHours();
        case 'MM':
          return zero(_date.getMinutes());
        case 'M':
          return _date.getMinutes();
        case 'SS':
          return zero(_date.getSeconds());
        case 'S':
          return _date.getSeconds();
        default:
          return '';
      }
    }
  );
};

export const timeFormatter = (format: string, seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  return format.replace(/(HH|H|MM|M|SS|S)/g, match => {
    switch (match) {
      case 'HH':
        return zero(h);
      case 'H':
        return h.toString();
      case 'MM':
        return zero(m);
      case 'M':
        return m.toString();
      case 'SS':
        return zero(s);
      case 'S':
        return s.toString();
      default:
        return match;
    }
  });
};

const timeStringToDate = (timeString: string) => {
  const [hours, minutes, seconds] = timeString.split(':').map(Number);
  const now = new Date();
  return new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    hours,
    minutes,
    seconds
  );
};

export const timeStringDiff = (
  currentTime = '00:00:00',
  targetTime: string
) => {
  const current = timeStringToDate(currentTime);
  const target = timeStringToDate(targetTime);

  if (target < current) {
    target.setDate(target.getDate() + 1);
  }

  return target.getTime() - current.getTime();
};

export const prevDate = (currentDate: Date) => {
  const prevDate = new Date(currentDate);
  prevDate.setDate(prevDate.getDate() - 1);
  return prevDate;
};

export const nextDate = (currentDate: Date) => {
  const nextDate = new Date(currentDate);
  nextDate.setDate(nextDate.getDate() + 1);
  return nextDate;
};

export const prevMonth = (currentDate: Date) => {
  const prevMonth = new Date(currentDate);
  prevMonth.setMonth(prevMonth.getMonth() - 1);
  return prevMonth;
};

export const nextMonth = (currentDate: Date) => {
  const nextMonth = new Date(currentDate);
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  return nextMonth;
};

export const sixMonthsAgo = (defaultDate = new Date()) => {
  // const defaultDate = new Date();
  defaultDate.setMonth(defaultDate.getMonth() - 6);
  return defaultDate;
};

export const yearAgo = (defaultDate = new Date()) => {
  defaultDate.setFullYear(defaultDate.getFullYear() - 1);
  return defaultDate;
};

export const monthAgo = (defaultDate = new Date()) => {
  defaultDate.setMonth(defaultDate.getMonth() - 1);
  return defaultDate;
};

export const dateKoFormatter = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 1을 더함
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

export const timeToWithKorean = (time: string) => {
  const [hours, minutes] = time.split(':');

  const isAfternoon = Number(hours) >= 12;
  const hours12 = isAfternoon ? Number(hours) - 12 : Number(hours);
  const ampm = isAfternoon ? '오후' : '오전';
  return `${ampm} ${hours12}시 ${minutes}분`;
};

type TimeString = `${number}:${number}:${number}`;

const timeStringToSeconds = (time: TimeString): number => {
  const [hours, minutes, seconds] = time.split(':').map(Number);
  return hours * 3600 + minutes * 60 + seconds;
};

/**
 * 초를 `00:00:00` 형식으로 변환
 */
const secondsToTimeString = (totalSeconds: number): TimeString => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}` as TimeString;
};

/**
 * `00:00:00` 형식의 시간 배열을 합산
 */
export const sumTimeStrings = (timeStrings: TimeString[]): TimeString => {
  const totalSeconds = timeStrings?.reduce(
    (acc, time) => acc + timeStringToSeconds(time),
    0
  );
  return secondsToTimeString(totalSeconds);
};

type ItemWithDate = {
  id: number;
  name: string;
  date: string; // ISO 8601 형식 ('YYYY-MM-DD')
};

/**
 * 객체 배열을 날짜 기준으로 정렬하는 함수
 * @param items - 정렬할 객체 배열
 * @param ascending - true면 오름차순, false면 내림차순
 */
export const sortByDate = (items: any[], ascending: boolean = true): any[] => {
  return [...items].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return ascending ? dateA - dateB : dateB - dateA;
  });
};

export const formatDateToMinute = (isoString: string): string => {
  const date = new Date(isoString);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작함
  const dd = String(date.getDate()).padStart(2, '0');
  const hh = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
};
