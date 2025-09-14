import { useEffect, useMemo, useState } from "react";

import BarCharts from "./BarCharts";
import LineCharts from "./LineCharts";
import { mockRankData } from "./mockData";

const UserCallAmount = () => {
  //tab
  const tabList = ["(유효)통화건수", "통화시간", "순위(통화시간기준)"];

  const [currentTab, setCurrentTab] = useState<string>(tabList[0]);
  const onTabClick = (tabName: string) => {
    setCurrentTab(tabName);
  };

  const [callTime, setCallTime] = useState<any[]>([]);
  const [callCount, setCallCount] = useState<any[]>([]);

  const [rank, setRankData] = useState<any[]>([]);

  const handleCallCountChartData = () => {
    setCallCount([]);
    [
      {
        date: "2025-08-01", // 날짜
        count: 120, // 전체 콜 수
        valid_count: 95, // 유효 콜 수
      },
      {
        date: "2025-08-02",
        count: 140,
        valid_count: 110,
      },
      {
        date: "2025-08-03",
        count: 100,
        valid_count: 85,
      },
      {
        date: "2025-08-04",
        count: 160,
        valid_count: 130,
      },
      {
        date: "2025-08-05",
        count: 180,
        valid_count: 150,
      },
      {
        date: "2025-08-06",
        count: 200,
        valid_count: 170,
      },
      {
        date: "2025-08-07",
        count: 220,
        valid_count: 190,
      },
    ].map((item: any) => {
      const countData = {
        date: item.date,
        call_count: item.count,
        valid_call_count: item.valid_count,
        call_count_color: "#06b6d4",
        valid_call_count_color: "#ef4444",
      };
      setCallCount((prev) => [...prev, countData]);
    });
  };

  const handleCallTimeData = () => {
    setCallTime([]);
    [
      {
        date: "2025-08-01", // 날짜
        duration: 320, // 통화시간 (초 단위라 가정)
      },
      {
        date: "2025-08-02",
        duration: 280,
      },
      {
        date: "2025-08-03",
        duration: 450,
      },
      {
        date: "2025-08-04",
        duration: 390,
      },
      {
        date: "2025-08-05",
        duration: 500,
      },
      {
        date: "2025-08-06",
        duration: 600,
      },
      { date: "2025-08-07", duration: 700 },
    ].map((item: any) => {
      const columns = {
        date: item.date.slice(5, 10),
        call_time: item.duration,
        color: "#0d9488",
      };
      setCallTime((prev) => [...prev, columns]);
    });
  };

  const handleRankData = () => {
    setRankData([]);
    mockRankData.map((item: any) => {
      const columns = { x: item.date.slice(5, 10), y: item.rank };
      setRankData((prev) => [...prev, columns]);
    });
  };

  const chartData = useMemo(() => {
    return [...callTime];
  }, [callTime]);

  const callCountData = useMemo(() => {
    return [...callCount];
  }, [callCount]);

  const rankChartData = useMemo(() => {
    return [{ id: "rank", color: "hsl(26, 70%, 50%)", data: [...rank] }];
  }, [rank]);

  useEffect(() => {
    handleCallCountChartData();
    handleCallTimeData();
    handleRankData();
  }, []);

  return (
    <div className="p-5 shadow rounded w-full max-w-[860px]">
      <div className="dashboard-call-wrapper">
        <h4 className="mb-2 text-base">개인 업무량 차트</h4>
        <div className="flex gap-1">
          {tabList.map((tabItem) => (
            <button
              type="button"
              key={tabItem}
              className="bg-sky-600 text-white px-3 py-1 rounded hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => onTabClick(tabItem)}
            >
              {tabItem}
            </button>
          ))}
        </div>
      </div>
      <div className="p-2 mt-4">
        <>
          {currentTab === tabList[0] && (
            <BarCharts
              data={callCountData}
              ariaLabel="유효통화건수, 통화건수 차트"
              keys={["valid_call_count", "call_count"]}
            />
          )}
          {currentTab === tabList[1] && (
            <BarCharts
              data={chartData}
              ariaLabel="개인 업무량 차트"
              colors={{ datum: "data.color" }}
              keys={["call_time"]}
            />
          )}
          {currentTab === tabList[2] && <LineCharts data={rankChartData} />}
        </>
      </div>
    </div>
  );
};

export default UserCallAmount;
