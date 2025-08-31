import { useEffect, useMemo, useState } from "react";

import PieCharts from "./PieCharts";

const UserNaverTransfer = () => {
  const [naverData, setNaverData] = useState({
    transfer_in_amount: 0,
    transfer_out_amount: 0,
    transfer_in_count: 0,
    transfer_out_count: 0,
    transfer_in_data: [],
    transfer_out_data: [],
  });

  const [naverTransfer, setNaverTransfer] = useState<any[]>([]);

  const handleNaverTransferData = () => {
    [
      {
        transfer_in_amount: 1200000, // 이관매출
        transfer_out_amount: 800000, // 피이관매출
      },
      {
        transfer_in_amount: 2000000,
        transfer_out_amount: 1500000,
      },
      {
        transfer_in_amount: 1700000,
        transfer_out_amount: 1900000,
      },
    ].map((item: any) => {
      const transferIn = {
        id: "이관매출",
        label: "이관매출",
        value: item.transfer_in_amount,
        color: "#84cc16",
      };
      const transferOut = {
        id: "피이관매출",
        label: "피이관매출",
        value: item.transfer_out_amount,
        color: "#ff836c",
      };
      setNaverTransfer([transferIn, transferOut]);
    });
  };

  const naverTransferData = useMemo(() => [...naverTransfer], [naverTransfer]);

  useEffect(() => {
    handleNaverTransferData();
  }, []);

  return (
    <div className="dashboard_naver_container">
      <div>
        <p className="dashboard_naver_text"></p>
        <PieCharts data={naverTransferData} isUnSimple={true} />
      </div>
      <div className="w-full">
        <ul className="dashboard_naver_ul">
          {naverData?.transfer_in_data?.map((item: any) => (
            <li key={item.id}>
              <small>{item.type}</small>
              {item.advertiser_info?.media}
              <span>
                {!item.advertiser_info?.advertiser_name
                  ? item.advertiser_info?.advertiser_nickname
                  : item.advertiser_info?.advertiser_name.slice(0, 7)}
              </span>
              <b>{item.last_month_exhaustion.toLocaleString()}원</b>
              {/* {item.recv_bill_type}
            {item.agent_login_id} */}
            </li>
          ))}
          {naverData?.transfer_out_data.map((item: any) => (
            <li key={item.id}>
              <small>{item.type}</small>
              {item.advertiser_info?.media}
              <span>
                {!item.advertiser_info?.advertiser_name
                  ? item.advertiser_info?.advertiser_nickname
                  : item.advertiser_info?.advertiser_name.slice(0, 7)}
              </span>
              <b>{item.last_month_exhaustion.toLocaleString()}원</b>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserNaverTransfer;
