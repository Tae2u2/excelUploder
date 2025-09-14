import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ExcelUploader from "../ExcelUploader";
import useExcelToJson from "../../hooks/useExcelToJson";

// 훅 mock
jest.mock("../hooks/useExcelToJson", () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockHandleFileUpload = jest.fn();
const mockResetFile = jest.fn();
const mockCreateExcelBlob = jest.fn();

const mockJsonData = {
  Sheet1: [
    { No: 1, name: "홍길동", amount: "10000", date: "45000" },
    { No: 2, name: "이몽룡", amount: "20000", date: "45001" },
  ],
};

const mockColumnList = [
  { header: "이름", accessorKey: "name" },
  { header: "금액", accessorKey: "amount" },
  { header: "날짜", accessorKey: "date" },
];

beforeEach(() => {
  (useExcelToJson as jest.Mock).mockReturnValue({
    jsonData: mockJsonData,
    handleFileUpload: mockHandleFileUpload,
    resetFile: mockResetFile,
    sheetList: ["Sheet1"],
    columnList: mockColumnList,
    createExcelBlob: mockCreateExcelBlob,
  });
});

test("렌더링 및 기본 요소 표시", () => {
  render(
    <ExcelUploader requiredKeys={["name", "amount"]} dateList={["date"]} payList={["amount"]} />
  );

  expect(screen.getByText("서버로 전송")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /서버로 전송/i })).toBeVisible();
  expect(screen.getByRole("button")).toBeInTheDocument(); // reset 버튼
  expect(screen.getByText("Sheet1")).toBeInTheDocument();
});

test("파일 선택 시 handleFileUpload 호출", () => {
  render(
    <ExcelUploader requiredKeys={["name", "amount"]} dateList={["date"]} payList={["amount"]} />
  );

  const file = new File(["test"], "test.xlsx", {
    type: "application/vnd.ms-excel",
  });
  const input = screen.getByLabelText(/file/i) || screen.getByRole("textbox");
  fireEvent.change(input, { target: { files: [file] } });

  expect(mockHandleFileUpload).toHaveBeenCalledWith(file);
});

test("reset 버튼 클릭 시 resetFile 호출", () => {
  render(
    <ExcelUploader requiredKeys={["name", "amount"]} dateList={["date"]} payList={["amount"]} />
  );

  const resetButton = screen.getByRole("button");
  fireEvent.click(resetButton);
  expect(mockResetFile).toHaveBeenCalled();
});

test("uploadFn 호출 확인", () => {
  const mockUploadFn = jest.fn();
  render(
    <ExcelUploader
      requiredKeys={["name", "amount"]}
      dateList={["date"]}
      payList={["amount"]}
      uploadFn={mockUploadFn}
    />
  );

  fireEvent.click(screen.getByText("서버로 전송"));

  expect(mockUploadFn).toHaveBeenCalledWith(
    expect.objectContaining({
      date: expect.any(String),
      file: expect.any(File),
    })
  );
});
