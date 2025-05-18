import { Trash } from "lucide-react";
import { useEffect, useRef, useState, ChangeEvent } from "react";
import useExcelToJson from "../hooks/useExcelToJson";
import { dateFormatter } from "../common/utils/date";
import TableContainer from "../common/table/TableContainer";
import DatePicker from "../common/date/DatePicker";

const ExcelUploader = ({
  requiredKeys,
  dateList,
  payList,
  uploadFn,
}: {
  requiredKeys: string[];
  dateList: string[];
  payList: string[];
  uploadFn?: (data: any) => void;
}) => {
  const {
    jsonData,
    handleFileUpload,
    resetFile,
    sheetList,
    columnList,
    createExcelBlob,
  } = useExcelToJson();
  const [currentSheet, setCurrentSheet] = useState<string>(sheetList[0] || "");
  const [formData, setFormData] = useState<{ [key: string]: string | number }>(
    {}
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleReset = () => {
    resetFile(); // 상태 초기화
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // 파일 선택 초기화
    }
  };

  const validCheck = (data: any, key: string) => {
    if (requiredKeys.includes(key) && (!data || data === "")) {
      return false;
    }

    return true;
  };

  const dateTransfer = (data: string, key: string) => {
    if (!data) return "";

    const formatter = new Intl.NumberFormat("ko-KR", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    if (payList.includes(key)) {
      if (!isNaN(Number(data))) {
        return formatter.format(Number(data));
      }
      return data;
    }

    if (dateList.includes(key)) {
      const serial = Number(data);
      if (serial > 0) {
        const utcDays = serial - 25569; // 1900년 1월 1일 기준 보정
        const utcValue = utcDays * 86400; // 초 단위로 변환
        return new Date(utcValue * 1000).toISOString().slice(0, 10); // YYYY-MM-DD 형식 변환
      }
      return data;
    }
    return data;
  };

  const [excelFileName, setExcelFileName] = useState<string>("");

  const [editedData, setEditedData] = useState<any[]>([]);
  const handleInputChange = (e: any, id: number, key: string) => {
    setEditedData((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [key]: e.target.value,
      },
    }));
  };
  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setExcelFileName(file.name);
      handleFileUpload(file);
    }
  };

  const jsonToFile = (jsonData: any, fileName = "data.json"): File => {
    const jsonString = JSON.stringify(jsonData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    return new File([blob], fileName, { type: "application/json" });
  };

  const [uploadDate, setUploadDate] = useState([
    dateFormatter("yyyy-mm-01", new Date()),
  ]);

  const onUploadClick = () => {
    const uploadExcel = jsonToFile(editedData, excelFileName);
    if (uploadFn) {
      uploadFn({
        date: uploadDate[0],
        file: uploadExcel,
      });
    }
  };

  useEffect(() => {
    if (jsonData[currentSheet]?.length > 0) {
      setEditedData(jsonData[currentSheet]);
    }
  }, [jsonData, currentSheet]);

  return (
    <div className="card p-4">
      <div className="flex justify-start items-center gap-3 border border-dotted p-2 max-w-[600px] mb-3">
        <input
          type="file"
          accept=".xlsx, .xls"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="w-full max-w-[600px]"
        />
        <button
          type="button"
          onClick={handleReset}
          className="button-basic-red"
        >
          <Trash size={19} />
        </button>
      </div>
      <div className="w-full max-w-[500px] flex justify-between items-center mb-3 gap-3">
        <DatePicker date={uploadDate} setDate={setUploadDate} />
        <button
          type="button"
          className="button-basic-blue break-keep w-[160px]"
          onClick={onUploadClick}
        >
          서버로 전송
        </button>
      </div>

      {sheetList?.length > 0 ? (
        <div className="flex ">
          {sheetList.map((sheet) => (
            <button
              key={sheet}
              className="bg-neutral-100 px-7 py-1 shadow rounded-t-2xl hover:bg-neutral-300"
              onClick={() => setCurrentSheet(sheet)}
            >
              {sheet}
            </button>
          ))}
        </div>
      ) : null}

      {jsonData[currentSheet]?.length > 0 ? (
        <div className="w-full overflow-x-scroll">
          <TableContainer
            tdClassName="max-w-[130px]"
            columns={columnList.map((column, index) => {
              return {
                ...column,
                cell: (cell: any) => {
                  return (
                    <input
                      type="text"
                      onChange={(e) =>
                        handleInputChange(
                          e,
                          cell.original.No,
                          column.accessorKey
                        )
                      }
                      value={dateTransfer(cell.data, column.accessorKey)}
                      className={`${
                        validCheck(cell.data, column.accessorKey)
                          ? "border border-slate-300"
                          : "border-2 border-red-300"
                      } max-w-[120px] p-1`}
                    />
                  );
                },
              };
            })}
            data={jsonData[currentSheet] ?? []}
          />
        </div>
      ) : null}
    </div>
  );
};

export default ExcelUploader;
