import ExcelUploader from "./components/ExcelUploader";

function App() {
  return (
    <div className="App">
      <ExcelUploader
        requiredKeys={[
          "성명",
          "주민번호",
          "입사일",
          "팀명",
          "기 본 급(①)",
          "지급합계",
        ]}
        dateList={[
          "입사일",
          "퇴사일",
          "생년월일",
          "사대보험가입",
          "사대보험상실",
        ]}
        payList={[
          "성명",
          "주민번호",
          "입사일",
          "팀명",
          "기 본 급(①)",
          "지급합계",
          "입사일",
          "퇴사일",
          "생년월일",
          "사대보험가입",
          "사대보험상실",
        ]}
      />
    </div>
  );
}

export default App;
