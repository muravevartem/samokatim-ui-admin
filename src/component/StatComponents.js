import React, {useEffect, useState} from "react";
import {ResponsiveLine} from "@nivo/line";

export function MyStatComponent({loader, legendX, legendY}) {
    const [data, setData] = useState([]);

    async function load() {
        // let loadedData = await rentStatService.loadAmountStat(moment().subtract(10, 'days'), moment());
        let loadedData = await loader();
        setData(loadedData);
    }

    useEffect(() => {
        load()
    }, [])

    return (
        <ResponsiveLine
            data={data}
            margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
            xScale={{ type: 'point' }}
            yScale={{
                type: 'linear',
                min: 'auto',
                max: 'auto',
                stacked: true,
                reverse: false
            }}
            yFormat=" >-.0f"
            axisTop={null}
            axisRight={null}
            axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: legendX,
                legendOffset: 36,
                legendPosition: 'middle'
            }}
            axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: legendY,
                legendOffset: -40,
                legendPosition: 'middle'
            }}
            pointSize={10}
            pointColor={{ theme: 'background' }}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'serieColor' }}
            pointLabelYOffset={-12}
            useMesh={true}
        />
    )
}
