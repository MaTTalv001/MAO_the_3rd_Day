import React, { useRef, useEffect } from "react";

const SlashEffect = ({ onComplete }) => {
  const slashRef = useRef(null);

  useEffect(() => {
    const slash = new window.mojs.Shape({
      parent: slashRef.current,
      shape: "line",
      stroke: "red",
      strokeWidth: { 10: 0 },
      x: { [-100]: 100 },
      y: { [-50]: 50 },
      duration: 300,
      easing: "cubic.out",
      onComplete: onComplete,
    });

    slash.play();
  }, [onComplete]);

  return <div ref={slashRef} />;
};

export default SlashEffect;
