import { useEffect, useRef, useState } from "react";

import { SheetColumn, useSheetStore } from "../store/excelStore";

export const SalarySlipColumns = [
  {
    title: "PK",
    dataIndex: "id",
    key: "id",
    type: "text",
    readOnly: true,
  },
  {
    title: "성명",
    dataIndex: "user_name",
    key: "user_name",
    type: "text",
    readOnly: true,
  },
  {
    title: "주민번호",
    dataIndex: "resident_registration_number",
    key: "resident_registration_number",
    type: "text",
    readOnly: true,
  },
  {
    title: "입사일",
    dataIndex: "hired_date",
    key: "hired_date",
    type: "date",
    readOnly: true,
  },
  {
    title: "퇴사일",
    dataIndex: "resignation_date",
    key: "resignation_date",
    type: "date",
    readOnly: true,
  },
  {
    title: "사대보험가입",
    dataIndex: "employment_insurance_date",
    key: "employment_insurance_date",
    type: "date",
    readOnly: true,
  },
  {
    title: "사대보험상실",
    dataIndex: "employment_insurance_loss_date",
    key: "employment_insurance_loss_date",
    type: "date",
    readOnly: true,
  },
  {
    title: "팀",
    dataIndex: "dept",
    key: "dept",
    type: "text",
    readOnly: true,
  },
  {
    title: "파트",
    dataIndex: "team",
    key: "team",
    type: "text",
    readOnly: true,
  },
  {
    title: "직책",
    dataIndex: "position",
    key: "position",
    type: "text",
    readOnly: true,
  },
  {
    title: "근무일",
    dataIndex: "total_working_days",
    key: "total_working_days",
    type: "number",
    readOnly: false,
  },
  // {
  //   title: '차감일',
  //   dataIndex: 'minus_working_days',
  //   key: 'minus_working_days',
  //   type: 'tex',
  // },
  {
    category: "급여내역",
    title: "기 본 급(①)",
    dataIndex: "basic_salary",
    key: "basic_salary",
    type: "pay",
    readOnly: false,
  },
  {
    category: "급여내역",
    title: "인센티브",
    dataIndex: "incentive",
    key: "incentive",
    type: "pay",
    readOnly: false,
  },
  {
    category: "급여내역",
    title: "교육비",
    dataIndex: "education_expense",
    key: "education_expense",
    type: "pay",
    readOnly: false,
  },
  {
    category: "급여내역",
    title: "직책수당",
    dataIndex: "position_allowance",
    key: "position_allowance",
    type: "pay",
    readOnly: false,
  },
  {
    category: "급여내역",
    title: "연차수당",
    dataIndex: "annual_leave_allowance",
    key: "annual_leave_allowance",
    type: "pay",
    readOnly: false,
  },
  {
    category: "급여내역",
    title: "시상금",
    dataIndex: "award_bonus",
    key: "award_bonus",
    type: "pay",
    readOnly: false,
  },
  {
    category: "급여내역",
    title: "식대",
    dataIndex: "meal_allowance",
    key: "meal_allowance",
    type: "pay",
    readOnly: false,
  },
  {
    category: "급여내역",
    title: "차량유지비",
    dataIndex: "vehicle_maintenance",
    key: "vehicle_maintenance",
    type: "pay",
    readOnly: false,
  },
  {
    category: "급여내역",
    title: "지급합계",
    dataIndex: "total_payment",
    key: "total_payment",
    type: "pay",
    readOnly: false,
  },
  {
    category: "공제내역",
    title: "소득세",
    dataIndex: "income_tax",
    key: "income_tax",
    type: "pay",
    readOnly: false,
  },
  {
    category: "공제내역",
    title: "주민세",
    dataIndex: "local_income_tax",
    key: "local_income_tax",
    type: "pay",
    readOnly: false,
  },
  {
    category: "공제내역",
    title: "건강보험",
    dataIndex: "health_insurance",
    key: "health_insurance",
    type: "pay",
    readOnly: false,
  },
  {
    category: "공제내역",
    title: "고용보험",
    dataIndex: "employment_insurance",
    key: "employment_insurance",
    type: "pay",
    readOnly: false,
  },
  {
    category: "공제내역",
    title: "장기요양",
    dataIndex: "nursing_insurance",
    key: "nursing_insurance",
    type: "pay",
    readOnly: false,
  },
  {
    category: "공제내역",
    title: "건강보험재정산",
    dataIndex: "health_recalculation",
    key: "health_recalculation",
    type: "pay",
    readOnly: false,
  },
  {
    category: "공제내역",
    title: "장기요양재정산",
    dataIndex: "nursing_recalculation",
    key: "nursing_recalculation",
    type: "pay",
    readOnly: false,
  },
  {
    category: "공제내역",
    title: "국민연금",
    dataIndex: "national_pension",
    key: "national_pension",
    type: "pay",
    readOnly: false,
  },
  {
    category: "공제내역",
    title: "학자금상환액",
    dataIndex: "tuition_fee_repayment",
    key: "tuition_fee_repayment",
    type: "pay",
    readOnly: false,
  },
  {
    category: "공제내역",
    title: "연말정산소득세",
    dataIndex: "year_end_income_tax",
    key: "year_end_income_tax",
    type: "pay",
    readOnly: false,
  },
  {
    category: "공제내역",
    title: "연말정산지방세",
    dataIndex: "year_end_local_tax",
    key: "year_end_local_tax",
    type: "pay",
    readOnly: false,
  },
  {
    category: "공제내역",
    title: "대출원금상환",
    dataIndex: "loan_repayment",
    key: "loan_repayment",
    type: "pay",
    readOnly: false,
  },
  {
    category: "공제내역",
    title: "선지급금",
    dataIndex: "advance_payment",
    key: "advance_payment",
    type: "pay",
    readOnly: false,
  },

  {
    category: "공제내역",
    title: "합계(②)",
    dataIndex: "total_deduction",
    key: "total_deduction",
    type: "pay",
    readOnly: false,
  },
  {
    category: "공제내역",
    title: "차인지급",
    dataIndex: "net_salary",
    key: "net_salary",
    type: "pay",
    readOnly: false,
  },
  {
    category: "시상금제외",
    title: "시상금제외",
    dataIndex: "excluding_award_bonus",
    key: "excluding_award_bonus",
    type: "pay",
    readOnly: false,
  },
  {
    category: "산출서식",
    title: "기본급산출정보",
    dataIndex: "calculation_method_basic_salary",
    key: "calculation_method_basic_salary",
    type: "text",
    readOnly: false,
  },
  {
    category: "산출서식",
    title: "교육비산출정보",
    dataIndex: "calculation_method_education_expense",
    key: "calculation_method_education_expense",
    type: "text",
    readOnly: false,
  },
  {
    category: "산출서식",
    title: "직책수당산출정보",
    dataIndex: "calculation_method_position_allowance",
    key: "calculation_method_position_allowance",
    type: "text",
    readOnly: false,
  },
  {
    category: "산출서식",
    title: "연차수당산출정보",
    dataIndex: "calculation_method_annual_leave_allowance",
    key: "calculation_method_annual_leave_allowance",
    type: "text",
    readOnly: false,
  },
  {
    category: "산출서식",
    title: "인센티브산출정보",
    dataIndex: "calculation_method_incentive",
    key: "calculation_method_incentive",
    type: "text",
    readOnly: false,
  },
  {
    category: "산출서식",
    title: "시상금산출정보",
    dataIndex: "calculation_method_award_bonus",
    key: "calculation_method_award_bonus",
    type: "text",
    readOnly: false,
  },
  {
    category: "산출서식",
    title: "근로일수",
    dataIndex: "working_days",
    key: "working_days",
    type: "number",
    readOnly: false,
  },
  {
    category: "산출서식",
    title: "총근로시간수",
    dataIndex: "total_working_hours",
    key: "total_working_hours",
    type: "number",
    readOnly: false,
  },
  {
    category: "산출서식",
    title: "통상시급(원)",
    dataIndex: "hourly_wage",
    key: "hourly_wage",
    type: "pay",
    readOnly: false,
  },
  {
    category: "계좌정보",
    title: "계좌정보",
    dataIndex: "account_info",
    key: "account_info",
    type: "text",
    readOnly: true,
  },
];

const ExcelTable = ({ data }: { data: any[] }) => {
  const { sheet, updateCell, setSheetFromData } = useSheetStore((state) => state);
  const [rowCount, setRowCount] = useState(10);
  const [colCount, setColCount] = useState(8);

  const [clickedTh, setClickedTh] = useState(0);

  const getColumnLetter = (colIndex: number) => {
    const result: string[] = [];

    for (let i = 0; i < colIndex; i++) {
      let s = "";
      let n = i;
      while (n >= 0) {
        s = String.fromCharCode((n % 26) + 65) + s;
        n = Math.floor(n / 26) - 1;
      }
      result.push(s);
    }

    return result;
  };

  const rows = Array.from({ length: rowCount }, (_, r) => r);
  const cols = Array.from(
    { length: colCount },
    (_, c) => getColumnLetter(colCount)[c] || `COL${c + 1}`
  );

  useEffect(() => {
    if (data) {
      const rowLength = data.length;
      setRowCount(rowLength);
      const colLength = SalarySlipColumns.length;
      setColCount(colLength);
      setSheetFromData({ data, columns: SalarySlipColumns });
    }
  }, [data]);

  return (
    <div className="p-4">
      <div className="w-full overflow-scroll scroll-design">
        <table className="table-fixed border border-gray-400">
          <thead>
            <tr>
              <th>#</th>
              {getColumnLetter(colCount).map((col) => (
                <th key={col} className="bg-slate-100 border border-slate-300 px-2 py-1 text-sm">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row}>
                <td className="border align-top text-center px-1 bg-slate-100">{i + 1}</td>
                {cols.map((col, j) => {
                  const key = `${col}${row + 1}`;
                  const cell = sheet[key];
                  if (cell?.merged) return null;
                  return (
                    <Cell
                      key={key}
                      id={key}
                      row={i} // ← 행 인덱스
                      col={j}
                      value={cell?.value ?? ""}
                      colSpan={cell?.merge?.colspan ?? 1}
                      rowSpan={cell?.merge?.rowspan ?? 1}
                      colCount={colCount}
                      setColCount={setColCount}
                      rowCount={rowCount}
                      setRowCount={setRowCount}
                    />
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExcelTable;

type Props = {
  id: string;
  value: string;
  row: number;
  col: number;
  rowSpan: number;
  colSpan: number;
  colCount: number;
  setColCount: (count: number) => void;
  rowCount: number;
  setRowCount: (count: number) => void;
};

export const Cell: React.FC<Props> = ({
  id,
  row,
  col,
  value,
  rowSpan,
  colSpan,
  colCount,
  setColCount,
  rowCount,
  setRowCount,
}) => {
  const updateCell = useSheetStore((state) => state.updateCell);
  const [editing, setEditing] = useState(false);
  const [temp, setTemp] = useState(value);

  const handleBlur = () => {
    updateCell(id, temp);
    setEditing(false);
  };

  const ref = useRef<HTMLTableCellElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const move = { row: 0, col: 0 };

    switch (e.key) {
      case "ArrowUp":
        move.row = -1;
        break;
      case "ArrowDown":
        if (row === rowCount - 1) {
          setRowCount(rowCount + 1);
          return;
        }
        move.row = 1;
        break;
      case "ArrowLeft":
        move.col = -1;
        break;
      case "ArrowRight":
        if (col === colCount - 1) {
          setColCount(colCount + 1);
          return;
        }
        move.col = 1;
        break;
      default:
        return;
    }

    e.preventDefault();

    const next = document.querySelector<HTMLTableCellElement>(
      `td[data-row="${row + move.row}"][data-col="${col + move.col}"]`
    );

    next?.focus();
  };

  const keyActions: Record<string, (e: React.KeyboardEvent) => void> = {
    F2: (e) => {
      e.preventDefault();
      setEditing(true);
    },
    Enter: (e) => {
      if (editing) {
        e.preventDefault();
        handleBlur();
        setEditing(false);
      }
    },
    ArrowUp: handleKeyDown,
    ArrowDown: handleKeyDown,
    ArrowLeft: handleKeyDown,
    ArrowRight: handleKeyDown,
  };

  return (
    <td
      ref={ref}
      data-row={row}
      data-col={col}
      className="border border-gray-300 outline-green-700 text-sm min-w-[80px] h-4 align-top"
      rowSpan={rowSpan}
      colSpan={colSpan}
      onKeyDown={(e) => {
        const action = keyActions[e.key];
        if (action) {
          action(e);
          return;
        }
        setEditing(true);
      }}
      onClick={() => setEditing(true)}
      tabIndex={0}
      onContextMenu={(e) => {
        e.preventDefault();
        setEditing(true);
      }}
    >
      {editing ? (
        <input
          className="w-full max-w-[90px] outline-green-700 px-1 py-[1px] rounded-none border-none"
          value={temp}
          onChange={(e) => {
            e.stopPropagation();
            setTemp(e.target.value);
          }}
          onBlur={handleBlur}
          autoFocus
        />
      ) : (
        <span className="inline-block px-1 py-[1px] w-[90px] h-5 overflow-hidden">{temp}</span>
      )}
    </td>
  );
};
