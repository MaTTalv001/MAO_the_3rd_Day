import React, { useEffect, useRef } from "react";

const LineChart = ({ currentUser }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    // currentUserが存在し、activitiesがある場合のみ実行する
    if (!currentUser || !currentUser.activities) {
      return;
    }

    // Chart.jsに必要な2Dコンテキストを取得
    const ctx = chartRef.current.getContext("2d");

    // Activityデータを日付ごと、カテゴリごとに集計する
    const dataByDateAndCategory = {};
    const categories = ["運動", "学習", "親交", "仕事", "娯楽"];

    // 各活動を日付ごと、カテゴリごとに集計し、dataByDateAndCategoryオブジェクトに格納する
    currentUser.activities.forEach((activity) => {
      const date = new Date(activity.created_at).toISOString().split("T")[0];
      const category = activity.category.name;
      if (!dataByDateAndCategory[date]) {
        dataByDateAndCategory[date] = {};
      }
      if (!dataByDateAndCategory[date][category]) {
        dataByDateAndCategory[date][category] = 0;
      }
      dataByDateAndCategory[date][category] += 1;
    });

    // 日付ごとの累計データを作成する
    const dates = Object.keys(dataByDateAndCategory).sort(
      (a, b) => new Date(a) - new Date(b)
    );
    // カテゴリごとの累積データを初期化するために、dates配列の長さ分の0を持つ配列を作成する
    const cumulativeData = categories.reduce((acc, category) => {
      acc[category] = Array(dates.length).fill(0);
      return acc;
    }, {});

    // 各日付ごとにカテゴリごとの累積データを計算し、cumulativeDataに格納する
    dates.forEach((date, index) => {
      categories.forEach((category) => {
        const count = dataByDateAndCategory[date]?.[category] || 0;
        if (index === 0) {
          cumulativeData[category][index] = count;
        } else {
          cumulativeData[category][index] =
            cumulativeData[category][index - 1] + count;
        }
      });
    });

    // チャートに渡すデータを設定
    const chartData = {
      labels: dates,
      datasets: categories.map((category) => ({
        label: category,
        data: cumulativeData[category],
        fill: false,
        tension: 0.1,
      })),
    };

    // チャートのオプションを設定
    const options = {
      scales: {
        x: {
          type: "time",
          time: {
            unit: "day",
            displayFormats: {
              day: "yyyy/MM/dd",
            },
          },
          title: {
            display: true,
            text: "日付",
            color: "white",
          },
          ticks: {
            color: "white",
          },
          grid: {
            color: "rgba(255, 255, 255, 0.1)",
          },
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "累積数",
            color: "white",
          },
          ticks: {
            color: "white",
          },
          grid: {
            color: "rgba(255, 255, 255, 0.1)",
          },
        },
      },
      plugins: {
        legend: {
          position: "top",
          labels: {
            color: "white",
          },
        },
      },
    };

    // 既存のチャートインスタンスがある場合は破棄する
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    try {
      // 新しいチャートを作成する
      chartInstanceRef.current = new window.Chart(ctx, {
        type: "line",
        data: chartData,
        options: options,
      });
    } catch (error) {
      console.error("チャート作成エラー:", error);
    }

    // コンポーネントがアンマウントされたときにチャートを破棄する
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
        width="600"
        height="400"
        style={{ maxWidth: "600px", maxHeight: "400px" }}
      />
    </div>
  );
};

export default LineChart;
