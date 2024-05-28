import React, { useRef, useEffect } from "react";

const SlashEffect = ({ onComplete }) => {
  const slashRef = useRef(null);

  useEffect(() => {
    const slash = new window.mojs.Shape({
      parent: slashRef.current,
      shape: "line",
      stroke: "white",
      strokeWidth: { 20: 0 },
      strokeLinecap: "round",
      x: { [-150]: 150 },
      y: { [-75]: 75 },
      angle: { 0: 135 },
      duration: 200,
      easing: "cubic.out",
      onComplete: onComplete,
    });

    const burst = new window.mojs.Burst({
      parent: slashRef.current,
      radius: { 0: 100 },
      count: 5,
      children: {
        shape: "line",
        stroke: "white",
        strokeWidth: { 5: 0 },
        strokeLinecap: "round",
        angle: { 0: 360 },
        radius: { 30: 5 },
        duration: 300,
        easing: "quad.out",
      },
    });

    const timeline = new window.mojs.Timeline();
    timeline.add(slash, burst);
    timeline.play();
  }, [onComplete]);

  return (
    <div
      ref={slashRef}
      style={{ position: "relative", width: "100%", height: "100%" }}
    />
  );
};

export default SlashEffect;
