import ExcelTable from "./components/ExcelTable";
import ExcelUploader from "./components/ExcelUploader";
import { columnsForExcelTable, dataForExcelTable } from "./components/mockData";
import SalesHome from "./components/SalesHome";

function App() {
  return (
    <div className="flex flex-col justify-center items-center">
      <SalesHome />
      <ExcelUploader requiredKeys={["a", "b"]} dateList={["a"]} payList={["b"]} />
      <ExcelTable data={dataForExcelTable} columns={columnsForExcelTable} />
    </div>
  );
}

export default App;
