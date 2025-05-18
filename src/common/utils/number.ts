export const commaizeNumber = (value: number | string) => {
  const isNegative = String(value).startsWith('-');

  const numStr = String(value);
  const decimalPointIndex = numStr.indexOf('.');
  const commaizeRegExp = /(\d)(?=(\d{3})+(?!\d))/g;

  // 음수라면 부호를 떼어내고 처리
  const processNumStr = isNegative ? numStr.slice(1) : numStr;

  const formattedNumber =
    decimalPointIndex > -1
      ? processNumStr
          .slice(0, decimalPointIndex)
          .replace(commaizeRegExp, '$1,') +
        processNumStr.slice(decimalPointIndex)
      : processNumStr.replace(commaizeRegExp, '$1,');

  return isNegative ? `-${formattedNumber}` : formattedNumber;
};

export const decommaizeNumber = (numStr: string) => {
  if (numStr == null || numStr === '') {
    return 0;
  } else if (typeof numStr === 'number') {
    return numStr;
  }
  return Number(numStr.replace(/,/g, ''));
};

export const decommaizeExpNumber = (numStr: string) => {
  const isNegative = numStr.startsWith('-');
  if (isNegative) {
    numStr = numStr.slice(1).replace(/,/g, '');
    return -Number(numStr);
  }
  return Number(numStr.replace(/,/g, ''));
};

// export function percentage(a, b) {
//   if (a == null || a === 0 || isNaN(decommaizeNumber(a)) || b == null || b === 0 || isNaN(decommaizeNumber(b))) {
//     return '0%';
//   }
//   const firstNum = decommaizeNumber(a || 0);
//   const secondNum = decommaizeNumber(b || 1);
//   const percentage = `${((firstNum / secondNum) * 100).toFixed(2)}%`;
//   return percentage;
// }

export function inputNumberFormat(obj: any) {
  obj.value = commaizeNumber(decommaizeNumber(obj.value));
}

export const calculateTotal = (
  list: Array<Record<string, number>> = [{ itemKey: 0 }],
  itemKey: string
): string => {
  const total = list.reduce(
    (acc, item) => acc + Number(decommaizeNumber(String(item[itemKey])) || 0),
    0
  );
  return commaizeNumber(total);
};
