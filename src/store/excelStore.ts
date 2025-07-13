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
