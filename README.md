## 연습페이지

업무에 사용되어야 하는 라이브러리나 컴포넌트들 미리 혹은 추가 작업 해본 것들

1. nivo chart

커스텀 요구사항들이 들어와서 옵션 적용을 열심히 찾아봤다. <br />
금액표시, 마우스 올리면 나오는 카드에 표시되는 데이터의 모양, 막대 중앙의 데이터 표시, 글씨는 더 작게 <br />
진짜 프로젝트에선 UI를 더 예쁘게 다듬었지만 여기선 옵션만 적용했다.

<img width="1851" height="829" alt="스크린샷 2025-09-15 010814" src="https://github.com/user-attachments/assets/8955b091-309f-418e-93bd-2cd0a11c17e6" />


---

2. 엑셀 업로드

- xlsx 라이브러리 사용해서 엑셀을 json으로 변환하고 파트에서 사용하는 테이블에 맞는 양식으로 변환하는 hook을 만들었다.
- 날짜 데이터와 금액 데이터의 key 값을 문자열 배열로 전달하면 데이터 포맷 로직을 타서 데이터를 똑바로 보여준다.
- 필수로 지정한 키값 열의 데이터가 비어있으면 빨간 테두리가 나온다. -> 이걸로 사용자가 에러 부분을 확인하게 하려고 했다.

엑셀 업로드 api에서 에러가 나는데 사용자들이 어디서 에러가 나는지 확인을 할 수 없으니 개발파트에 문의해서 오류사항을 수정하는 불편이 지속적으로 발생해서 제안한 아이디어였다. <br />

<img width="499" height="112" alt="스크린샷 2025-09-15 004625" src="https://github.com/user-attachments/assets/c9b88fd8-4692-4e3c-b633-23342f8fbf0c" />

- 업로드 하면 화면에 테이블 형식으로 보여진다.

<img width="852" height="429" alt="스크린샷 2025-09-15 004635" src="https://github.com/user-attachments/assets/79ed8e5d-5278-44b3-8e6d-6e5f1e3a8396" />

```typescript
const useExcelToJson = () => {
  const [jsonData, setJsonData] = useState<{ [key: string]: any[] }>(
    {}
  );
  const [sheetList, setSheetList] = useState<string[]>([]);
  const [invalidField, setInvalidField] = useState<any[]>([]);
  const [isValidExcel, setIsValidExcel] = useState<boolean>(false);
  const [columnList, setColumnList] = useState<
    {
      accessorKey: string;
      header: string;
    }[]
  >([]);
  const [workBook, setWorkBook] = useState<XLSX.WorkBook | null>(null);

  const convertSheetToJson = (workbook: XLSX.WorkBook, sheetName: string) => {
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) return []; // 존재하지 않는 시트일 경우 빈 배열 반환

    return XLSX.utils.sheet_to_json(sheet);
  };

  const getFirstRow: (
    workbook: XLSX.WorkBook,
    sheetName: string
  ) => string[] = (workbook: XLSX.WorkBook, sheetName: string) => {
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) return [];

    const allRows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    return (allRows[0] as string[]) || [];
  };

  const handleFileUpload = useCallback(
    (file: File, selectedSheetName?: string) => {
      const reader = new FileReader();

      reader.onload = e => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });

        setSheetList(workbook.SheetNames); // 모든 시트 이름 저장

        const newJsonData: { [key: string]: any[] } = {};
        workbook.SheetNames.forEach(sheetName => {
          const json = convertSheetToJson(workbook, sheetName);
          newJsonData[sheetName] = json;
        });

        // 선택된 시트가 있으면 해당 시트의 데이터만 가져오고, 없으면 첫 번째 시트를 선택
        const firstSheetName = selectedSheetName || workbook.SheetNames[0];
        setJsonData(newJsonData);
        setColumnList(
          getFirstRow(workbook, firstSheetName).map((head: any) => ({
            accessorKey: head,
            header: head,
          }))
        );
      };

      reader.readAsArrayBuffer(file);
    },
    []
  );

  const createExcelBlob = useCallback((jsonData: Record<string, any[]>) => {
    if (!jsonData || Object.keys(jsonData).length === 0) {
      console.error('No data to export');
      return null;
    }

    const workbook = XLSX.utils.book_new();

    Object.entries(jsonData).forEach(([sheetName, data]) => {
      if (!Array.isArray(data) || data.length === 0) {
        console.warn(`Skipping empty sheet: ${sheetName}`);
        return;
      }
      const worksheet = XLSX.utils.json_to_sheet(data);
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    });

    // 엑셀 파일을 Blob으로 변환
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    return new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
  }, []);

  const resetFile = useCallback(() => {
    setJsonData({});
    setSheetList([]);
    setInvalidField([]);
    setIsValidExcel(false);
    setColumnList([]);
    setWorkBook(null);
  }, []);

  return {
    jsonData,
    handleFileUpload,
    resetFile,
    sheetList,
    invalidField,
    isValidExcel,
    columnList,
    workBook,
    convertSheetToJson,
    createExcelBlob,
  };
};

```

개선점은 엑셀파일에 빈칸이 있으면 에러가 나는 거였다.
undefined를 반환하는 값을 빈문자열로 변환하는 로직을 추가하면 해결되지만 추가작업하지 말라는 답을 들었는데, 더 본질적인 해결을 해야 하는 건가? 라고 생각해 아래 엑셀 시트를 개발했다.


---

4. 엑셀 시트

- zustand 를 활용해서 시트 내부 값을 전역에 두고 있다. 추가 기능 개발 건이 생기면 컴포넌트 분리할 생각으로 적용했다.

  <img width="977" height="641" alt="스크린샷 2025-09-14 235119" src="https://github.com/user-attachments/assets/8a689ec6-429d-4ebc-9a7a-4d6888091d5b" />


```javascript
import { create } from 'zustand';

type CellData = {
  value: string;
  merge?: { colspan: number; rowspan: number };
  merged?: boolean;
};

type SheetData = Record<string, CellData>;

export interface SheetColumn {
  title: string;
  dataIndex: string;
  key: string;
  type: string;
  readOnly: boolean;
  category?: string;
}

type State = {
  sheet: SheetData;
  updateCell: (id: string, value: string) => void;
  setSheetFromData: ({
    data,
    columns,
  }: {
    data: Record<string, any>[];
    columns: SheetColumn[];
  }) => void;
};

export type SheetCell = {
  value: any;
  merge?: { colspan: number; rowspan: number };
  merged?: boolean;
};
export type Sheet = Record<string, SheetCell>;

export const useSheetStore = create<State>(set => ({
  sheet: {
    A1: { value: '이름을 입력하세요', merge: { colspan: 4, rowspan: 1 } },
    B1: { value: '', merged: true },
    C1: { value: '', merged: true },
    D1: { value: '', merged: true },
  },
  updateCell: (id, value) =>
    set(state => ({
      sheet: {
        ...state.sheet,
        [id]: { ...state.sheet[id], value },
      },
    })),
  setSheetFromData: ({
    data,
    columns,
  }: {
    data: Record<string, any>[]; // 각 행의 데이터 객체 배열
    columns: { key: string; title: string }[]; // 열 정의 (key: data에서의 필드명, title: 한글명)
  }) => {
    const sheet: Sheet = {};

    // 🔡 열 인덱스를 Excel 스타일 알파벳(A, B, ..., AA, AB, ...)으로 변환하는 함수
    function getColumnLetter(colIndex: number): string {
      let result = '';
      let n = colIndex;

      while (n >= 0) {
        result = String.fromCharCode((n % 26) + 65) + result; // 65 = 'A'
        n = Math.floor(n / 26) - 1;
      }

      return result;
    }

    // 🧩 헤더 셀 구성 (1행에 한글 제목 출력)
    columns.forEach((col, colIndex) => {
      const colLetter = getColumnLetter(colIndex); // A, B, ..., AA, AB 등
      const cellId = `${colLetter}1`; // 헤더는 항상 첫 번째 행
      sheet[cellId] = {
        value: col.title, // 한글 제목
        merge: { colspan: 1, rowspan: 1 }, // 병합은 기본값으로 설정
      };
    });

    // 📄 실제 데이터 셀 구성 (2행부터 시작)
    data.forEach((row, rowIndex) => {
      columns.forEach((col, colIndex) => {
        const colLetter = getColumnLetter(colIndex); // 동일하게 알파벳 열 생성
        const cellId = `${colLetter}${rowIndex + 2}`; // 데이터는 2행부터 시작
        sheet[cellId] = {
          value: row[col.key], // 해당 키 값
        };
      });
    });

    // ✅ Zustand에 sheet 상태 저장
    set({ sheet });
  },
}));


```

- 키보드 핸들링 부분까지 작업 진행해서 프로토타입이라고 보여드렸는데 기각당했다. 개발파트가 귀찮아진다는 이유였다.
- 추가작업을 해보려고 내 개인 저장소로 코드를 옮겨와서 prop으로 데이터를 넘겨받아서 표시하는 작업까지 해둔 상태다.



---

