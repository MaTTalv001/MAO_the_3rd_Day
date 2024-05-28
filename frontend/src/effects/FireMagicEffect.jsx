import React, { useRef, useEffect } from "react";

const FireMagicEffect = ({ onComplete }) => {
  const fireRef = useRef(null);

  useEffect(() => {
    const fire = new window.mojs.Burst({
      parent: fireRef.current,
      radius: { 0: 100 },
      count: 10,
      children: {
        shape: "circle",
        fill: { "#ff0000": "#ffaa00" },
        radius: { 20: 5 },
        duration: 1000,
        easing: "cubic.out",
      },
    });

    const sparks = new window.mojs.Burst({
      parent: fireRef.current,
      radius: { 0: 75 },
      count: 20,
      children: {
        shape: "line",
        stroke: { "#ffaa00": "#ff0000" },
        strokeWidth: { 5: 0 },
        strokeLinecap: "round",
        angle: { 0: 360 },
        radius: { 30: 5 },
        duration: 1500,
        easing: "quad.out",
      },
    });

    const smokeRing = new window.mojs.Shape({
      parent: fireRef.current,
      shape: "circle",
      stroke: "rgba(255, 255, 255, 0.5)",
      strokeWidth: { 20: 0 },
      radius: { 0: 50 },
      duration: 1000,
      easing: "cubic.out",
    });

    const timeline = new window.mojs.Timeline();
    timeline.add(fire, smokeRing, sparks);
    timeline.play();

    setTimeout(onComplete, 1500);
  }, [onComplete]);

  return (
    <div
      ref={fireRef}
      style={{ position: "relative", width: "100%", height: "100%" }}
    />
  );
};

export default FireMagicEffect;
