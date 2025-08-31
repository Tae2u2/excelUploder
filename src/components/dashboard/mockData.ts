// mockData.ts

// 1. 매출 / 누적매출
export const mockSalesData = {
  data: [
    {
      goal: 5000000,
      amount: 4200000,
      accum_goal: 15000000,
      accum_amount: 13200000,
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
  ],
};

// 2. 순매출 / 누적순매출
export const mockNetData = {
  data: [
    {
      goal: 3000000,
      amount: 2500000,
      accum_goal: 9000000,
      accum_amount: 7800000,
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
  ],
};

// 3. 이관 / 피이관 매출
export const mockTransferData = {
  data: [
    {
      transfer_in_amount: 1200000,
      transfer_out_amount: 800000,
    },
    {
      transfer_in_amount: 2000000,
      transfer_out_amount: 1500000,
    },
    {
      transfer_in_amount: 1700000,
      transfer_out_amount: 1900000,
    },
  ],
};

// 4. 콜 건수 / 유효 콜 건수
export const mockCallCountData = {
  data: [
    {
      data: [
        { date: "2025-08-01", count: 120, valid_count: 95 },
        { date: "2025-08-02", count: 140, valid_count: 110 },
        { date: "2025-08-03", count: 100, valid_count: 85 },
        { date: "2025-08-04", count: 160, valid_count: 130 },
      ],
    },
  ],
};

// 5. 콜 시간
export const mockCallTimeData = [
  { date: "2025-08-01", duration: 320 },
  { date: "2025-08-02", duration: 280 },
  { date: "2025-08-03", duration: 450 },
  { date: "2025-08-04", duration: 390 },
];

// 6. 순위 데이터
export const mockRankData = [
  { date: "2025-08-01", rank: 1 },
  { date: "2025-08-02", rank: 2 },
  { date: "2025-08-03", rank: 3 },
  { date: "2025-08-04", rank: 1 },
];
