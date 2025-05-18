import { useCallback, useState } from 'react';

import * as XLSX from 'xlsx';

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

export default useExcelToJson;

export const useExportToExcel = () => {
  const exportToExcel = (
    data: any[],
    fileName: string = 'data.xlsx',
    sheetName: string
  ) => {
    const worksheet = XLSX.utils.json_to_sheet(data);

    const columnWidths = Object.keys(data[0] || {}).map(key => {
      const maxLength = Math.max(
        key.length,
        ...data.map(row => (row[key] ? String(row[key]).length : 0))
      );
      return { wch: maxLength + 2 };
    });
    worksheet['!cols'] = columnWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };
  return { exportToExcel };
};
