import { useEffect, useMemo, useState } from "react";

import PieCharts from "./PieCharts";
import { TruckElectric } from "lucide-react";

const UserSales = () => {
  const [sales, setSales] = useState<any[]>([]);
  const [accumSales, setAccumSales] = useState<any[]>([]);

  const [goalData, setGoalData] = useState({
    goal: 1000000,
    amount: 1000000,
    accum_goal: 10000000,
    accum_amount: 10000000,
  });

  const handleSalesData = () => {
    [
      {
        goal: 5000000, // 매출목표금액
        amount: 4200000, // 매출
        accum_goal: 15000000, // 누적매출목표금액
        accum_amount: 13200000, // 누적매출
      },
      {
        goal: 7000000,
        amount: 6500000,
        accum_goal: 22000000,
        accum_amount: 19700000,
      },
      {
        goal: 8000000,
        amount: 8100000,
        accum_goal: 30000000,
        accum_amount: 27800000,
      },
    ].map((item: any) => {
      const salesGoal = {
        id: "매출목표금액",
        label: "매출목표금액",
        value: item.goal,
        color: "#f1f5f9",
      };
      const salesAmount = {
        id: "매출",
        label: "매출",
        value: item.amount,
        color: "#3B82F6",
      };

      const accumSales = {
        id: "누적매출목표금액",
        label: "누적매출목표금액",
        value: item.accum_goal,
        color: "#f1f5f9",
      };
      const accumAmount = {
        id: "누적매출",
        label: "누적매출",
        value: item.accum_amount,
        color: "#A855F7",
      };
      setSales([salesGoal, salesAmount]);
      setAccumSales([accumSales, accumAmount]);
    });
  };

  useEffect(() => {
    handleSalesData();
  }, []);

  const salesData = useMemo(() => [...sales], [sales]);
  const accumSalesData = useMemo(() => [...accumSales], [accumSales]);
  const isLoading = false;

  return (
    <div className="flex flex-wrap gap-4 w-[860px]">
      <div className="flex w-full max-w-[420px] shadow rounded p-5">
        <section className="flex flex-col justify-around">
          <p>
            목표 매출 달성률
            {/* <strong className="flex items-center gap-1 p-2">
            <Trophy color="#fbbf24" />
            {`${data?.data[0].rank}위`}
            </strong> */}
            {isLoading ? (
              <>
                <b className="bg-slate-100 w-12 h-4 animate-pulse rounded mb-1"></b>
                <small className="bg-slate-100 w-28 h-4 animate-pulse rounded"></small>
              </>
            ) : (
              <>
                <b>{goalData.amount.toLocaleString()}</b>
                <small>{goalData.goal.toLocaleString()}</small>
              </>
            )}
          </p>
          {isLoading ? (
            <span className="bg-slate-100 w-20 h-4 animate-pulse rounded"></span>
          ) : (
            <span className="text-blue-600">
              {((goalData.amount / goalData.goal) * 100).toFixed(1)}%
            </span>
          )}
        </section>
        <PieCharts data={salesData} />
      </div>
      <div className="flex w-full max-w-[420px] shadow rounded p-5">
        <section className="flex flex-col justify-around">
          <p>
            누적 목표 매출 달성률
            {isLoading ? (
              <>
                <b className="bg-slate-100 w-12 h-4 animate-pulse rounded mb-1"></b>
                <small className="bg-slate-100 w-28 h-4 animate-pulse rounded"></small>
              </>
            ) : (
              <>
                <b>{goalData.accum_amount.toLocaleString()}</b>/
                <small>{goalData.accum_goal.toLocaleString()}</small>
              </>
            )}
          </p>
          {isLoading ? (
            <span className="bg-slate-100 w-20 h-4 animate-pulse rounded"></span>
          ) : (
            <span className="text-blue-600">
              {((goalData.accum_amount / goalData.accum_goal) * 100).toFixed(1)}%
            </span>
          )}
        </section>
        <PieCharts data={accumSalesData} />
      </div>
      <NetSales />
    </div>
  );
};

export default UserSales;

export const NetSales = () => {
  const [netGoalData, setNetGoalData] = useState({
    goal: 0,
    amount: 0,
    accum_goal: 0,
    accum_amount: 0,
  });
  const [netAmount, setNetAmount] = useState<any[]>([]);
  const [accumNetAmount, setAccumNetAmount] = useState<any[]>([]);

  const handleNetData = () => {
    [
      {
        goal: 3000000, // 순목표금액
        amount: 2500000, // 순매출
        accum_goal: 9000000, // 누적순목표금액
        accum_amount: 7800000, // 누적순매출
      },
      {
        goal: 4500000,
        amount: 4700000,
        accum_goal: 13500000,
        accum_amount: 12500000,
      },
      {
        goal: 5000000,
        amount: 4800000,
        accum_goal: 18500000,
        accum_amount: 17300000,
      },
    ].map((item: any) => {
      const netGoal = {
        id: "순목표금액",
        label: "순목표금액",
        value: item.goal,
        color: "#f1f5f9",
      };
      const netAmount = {
        id: "순매출",
        label: "순매출",
        value: item.amount,
        color: "#EF4444",
      };

      const accumNetGoal = {
        id: "누적순목표금액",
        label: "누적순목표금액",
        value: item.accum_goal,
        color: "#f1f5f9",
      };
      const accumNet = {
        id: "누적순매출",
        label: "누적순매출",
        value: item.accum_amount,
        color: "#249782",
      };
      setNetAmount([netGoal, netAmount]);
      setAccumNetAmount([accumNetGoal, accumNet]);
    });
  };

  const netDataAmount = useMemo(() => [...netAmount], [netAmount]);

  const accumNetDataAmount = useMemo(() => [...accumNetAmount], [accumNetAmount]);

  const isLoading = false;

  useEffect(() => {
    handleNetData();
  }, []);

  return (
    <>
      <div className="flex w-full max-w-[420px] shadow rounded p-5">
        <section className="flex flex-col justify-around">
          <p>
            목표 순매출 달성률
            <br />
            {isLoading ? (
              <>
                <b className="bg-slate-100 w-12 h-4 animate-pulse rounded mb-1"></b>
                <small className="bg-slate-100 w-28 h-4 animate-pulse rounded"></small>
              </>
            ) : (
              <>
                <b>{netGoalData.amount.toLocaleString()}</b>/
                <small>{netGoalData.goal.toLocaleString()}</small>
              </>
            )}
          </p>
          {isLoading ? (
            <span className="bg-slate-100 w-20 h-4 animate-pulse rounded"></span>
          ) : (
            <span className="text-blue-600">
              {((netGoalData.amount / netGoalData.goal) * 100).toFixed(1)}%
            </span>
          )}
        </section>

        <PieCharts data={netDataAmount} />
      </div>
      <div className="flex w-full max-w-[420px] shadow rounded p-5">
        <section className="flex flex-col justify-around">
          <p>
            누적 목표 순매출 달성률
            {isLoading ? (
              <>
                <b className="bg-slate-100 w-12 h-4 animate-pulse rounded mb-1"></b>
                <small className="bg-slate-100 w-28 h-4 animate-pulse rounded"></small>
              </>
            ) : (
              <>
                <b>{netGoalData.accum_amount.toLocaleString()}</b>/
                <small>{netGoalData.accum_goal.toLocaleString()}</small>
              </>
            )}
          </p>
          {isLoading ? (
            <span className="bg-slate-100 w-20 h-4 animate-pulse rounded"></span>
          ) : (
            <span className="text-blue-600">
              {((netGoalData.accum_amount / netGoalData.accum_goal) * 100).toFixed(1)}%
            </span>
          )}
        </section>
        <PieCharts data={accumNetDataAmount} />
      </div>
    </>
  );
};
