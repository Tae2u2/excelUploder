import { ResponsivePie } from '@nivo/pie';

const PieCharts = ({
  data,
  isUnSimple = false,
}: {
  data: any;
  isUnSimple?: boolean;
}) => {
  return (
    <div
      className={`${isUnSimple ? 'h-[250px] w-[250px]' : 'h-[200px] w-[200px]'}`}
    >
      <ResponsivePie
        data={data}
        margin={{ top: 10, right: 30, bottom: 10, left: isUnSimple ? 30 : 10 }}
        innerRadius={0.7}
        activeOuterRadiusOffset={8}
        colors={{ datum: 'data.color' }}
        borderWidth={1}
        borderColor={{ theme: 'background' }}
        arcLinkLabelsSkipAngle={10}
        enableArcLinkLabels={false}
        enableArcLabels={isUnSimple}
        arcLinkLabelsTextColor="#333333"
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: 'color' }}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor="black"
        valueFormat={d => d.toLocaleString()}
        legends={[
          {
            anchor: 'bottom',
            direction: 'row',
            justify: false,
            translateX: 0,
            translateY: 56,
            itemsSpacing: 0,
            itemWidth: 100,
            itemHeight: 18,
            itemTextColor: '#999',
            itemDirection: 'left-to-right',
            itemOpacity: 1,
            symbolSize: 18,
            symbolShape: 'circle',
            effects: [
              {
                on: 'hover',
                style: {
                  itemTextColor: '#000',
                },
              },
            ],
          },
        ]}
      />
    </div>
  );
};

export default PieCharts;
