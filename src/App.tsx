import ExcelTable from "./components/ExcelTable";
import { columnsForExcelTable, dataForExcelTable } from "./components/mockData";

function App() {
  return (
    <div className="flex flex-col justify-center items-center">
      <ExcelTable data={dataForExcelTable} columns={columnsForExcelTable} />
    </div>
  );
}

export default App;
