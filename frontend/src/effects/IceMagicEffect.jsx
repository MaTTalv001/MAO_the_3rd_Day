import React, { useRef, useEffect } from "react";

const IceMagicEffect = ({ onComplete }) => {
  const iceRef = useRef(null);

  useEffect(() => {
    const iceShards = new window.mojs.Burst({
      parent: iceRef.current,
      radius: { 0: 100 },
      count: 10,
      children: {
        shape: "polygon",
        points: 10,
        fill: { "#1E90FF": "#00FFFF" },
        angle: { 0: 360 },
        radius: { 20: 5 },
        duration: 1000,
        easing: "cubic.out",
      },
    });

    const iceRing = new window.mojs.Shape({
      parent: iceRef.current,
      shape: "circle",
      fill: { "#4169E1": "#00FFFF" },
      stroke: "rgba(224, 255, 255, 0.7)",
      strokeWidth: { 20: 0 },
      radius: { 0: 75 },
      duration: 1000,
      easing: "cubic.out",
    });

    const iceSpikes = new window.mojs.Burst({
      parent: iceRef.current,
      radius: { 0: 50 },
      count: 5,
      children: {
        shape: "line",
        stroke: "#b0e0e6",
        strokeWidth: { 10: 0 },
        strokeLinecap: "round",
        angle: { 0: 360 },
        radius: { 30: 10 },
        duration: 1500,
        easing: "quad.out",
      },
    });

    const timeline = new window.mojs.Timeline();
    timeline.add(iceShards, iceRing, iceSpikes);
    timeline.play();

    setTimeout(onComplete, 1500);
  }, [onComplete]);

  return (
    <div
      ref={iceRef}
      style={{ position: "relative", width: "100%", height: "100%" }}
    />
  );
};

export default IceMagicEffect;
