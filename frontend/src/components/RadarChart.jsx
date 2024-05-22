import React, { useEffect, useRef } from "react";

const RadarChart = ({ currentUser }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");

    const data = {
      labels: ["筋力", "知力", "精神", "敏捷", "魅力"],
      datasets: [
        {
          label: "ステータス",
          data: [
            currentUser.latest_status.strength,
            currentUser.latest_status.intelligence,
            currentUser.latest_status.wisdom,
            currentUser.latest_status.dexterity,
            currentUser.latest_status.charisma,
          ],
          backgroundColor: "rgba(34, 202, 236, 0.2)",
          borderColor: "rgba(34, 202, 236, 1)",
          borderWidth: 2,
        },
      ],
    };

    const options = {
      scales: {
        r: {
          angleLines: {
            display: true,
          },
          grid: {
            color: "white",
          },
          pointLabels: {
            color: "white",
            font: {
              size: 14,
            },
          },
          suggestedMin: 0,
          suggestedMax: 30,
          ticks: {
            stepSize: 10,
            color: "white",
            backdropColor: "rgba(0, 0, 0, 0)", // 背景のないテキストにする
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
    };

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    chartInstanceRef.current = new window.Chart(ctx, {
      type: "radar",
      data: data,
      options: options,
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [currentUser]);

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <canvas
        ref={chartRef}
        style={{ maxWidth: "300px", maxHeight: "300px" }}
      />
    </div>
  );
};

export default RadarChart;
