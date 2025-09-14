import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ExcelTable from "../ExcelTable";
import { columnsForExcelTable, dataForExcelTable } from "../mockData";

// ✅ Cell 모킹
jest.mock("./Cell", () => ({
  __esModule: true,
  default: ({ id, value }: { id: string; value: string }) => (
    <td data-testid={`cell-${id}`}>{value}</td>
  ),
}));

// ✅ useSheetStore 모킹
jest.mock("../store/useSheetStore", () => ({
  useSheetStore: (fn: any) =>
    fn({
      sheet: {},
      updateCell: jest.fn(),
      setSheetFromData: jest.fn(),
    }),
}));

describe("ExcelTable", () => {
  it("renders table headers correctly", () => {
    render(<ExcelTable data={dataForExcelTable} columns={columnsForExcelTable} />);
    // 열 헤더: A, B
    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();
  });

  it("renders row numbers correctly", () => {
    render(<ExcelTable data={dataForExcelTable} columns={columnsForExcelTable} />);
    // 행 번호
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("renders Cell components for each data cell", () => {
    render(<ExcelTable data={dataForExcelTable} columns={columnsForExcelTable} />);
    // 첫 번째 행: A1, B1
    expect(screen.getByTestId("cell-A1")).toBeInTheDocument();
    expect(screen.getByTestId("cell-B1")).toBeInTheDocument();
    // 두 번째 행: A2, B2
    expect(screen.getByTestId("cell-A2")).toBeInTheDocument();
    expect(screen.getByTestId("cell-B2")).toBeInTheDocument();
  });
});
