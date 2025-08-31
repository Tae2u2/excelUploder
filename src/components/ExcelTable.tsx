import { useEffect, useRef, useState } from "react";

import { SheetColumn, useSheetStore } from "../store/excelStore";

const ExcelTable = ({
  data,
  columns,
}: {
  data: any[];
  columns: {
    title: string;
    dataIndex: string;
    key: string;
    type: string;
    readOnly: boolean;
  }[];
}) => {
  const { sheet, updateCell, setSheetFromData } = useSheetStore((state) => state);
  const [rowCount, setRowCount] = useState(10);
  const [colCount, setColCount] = useState(8);

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
      const colLength = columns.length;
      setColCount(colLength);
      setSheetFromData({ data, columns });
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

type CellProps = {
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

export const Cell = ({
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
}: CellProps) => {
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
