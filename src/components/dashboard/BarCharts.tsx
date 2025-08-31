import { ResponsiveBar } from '@nivo/bar';

const BarCharts = ({
  data,
  keys,
  colors,
  scheme = 'set1',
  ariaLabel,
  enableTotals = false,
  labelSkip = 0,
  legendsAnchor = 'top-left',
  direction = 'row',
}: {
  data: any;
  keys: string[];
  scheme?: any;
  colors?: { datum: string };
  ariaLabel: string;
  enableTotals?: boolean;
  labelSkip?: number;
  legendsAnchor?: any;
  direction?: any;
}) => {
  return (
    <div className="h-[280px]">
      <ResponsiveBar
        data={data}
        keys={keys}
        indexBy="date"
        margin={{ top: 20, right: 100, bottom: 30, left: 30 }}
        padding={0.3}
        groupMode="grouped"
        valueScale={{ type: 'linear' }}
        indexScale={{ type: 'band', round: true }}
        colors={!colors ? { scheme } : colors}
        theme={{
          text: {
            fontSize: 14,
            fill: '#0f172a',
          },
        }}
        borderColor={{
          from: 'color',
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legendPosition: 'middle',
          legendOffset: 32,
          truncateTickAt: 0,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legendPosition: 'middle',
          legendOffset: -40,
          truncateTickAt: 0,
        }}
        labelSkipWidth={labelSkip}
        labelSkipHeight={labelSkip}
        enableTotals={enableTotals}
        legends={[
          {
            dataFrom: 'keys',
            anchor: legendsAnchor,
            direction,
            justify: false,
            translateX: 0,
            translateY: -20,
            itemsSpacing: 40,
            itemWidth: 100,
            itemHeight: 20,
            itemDirection: 'left-to-right',
            itemOpacity: 0.85,
            symbolSize: 20,
            effects: [
              {
                on: 'hover',
                style: {
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
        role="application"
        ariaLabel={ariaLabel}
      />
    </div>
  );
};

export default BarCharts;
