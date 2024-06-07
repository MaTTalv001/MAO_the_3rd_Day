import { useEffect } from "react";

const ParticlesComponent = () => {
  useEffect(() => {
    const loadParticles = async () => {
      if (window.tsParticles) {
        console.log("tsParticles loaded");
        await window.tsParticles.load("particles-container", {
          background: {
            color: {
              value: "#0d47a1",
            },
          },
          fpsLimit: 60,
          interactivity: {
            events: {
              onClick: {
                enable: true,
                mode: "push",
              },
              onHover: {
                enable: false, // ホバー効果を無効にして落ち着いた感じにします
                mode: "repulse",
              },
              resize: true,
            },
          },
          particles: {
            color: {
              value: "#ffffff",
            },

            collisions: {
              enable: true,
            },
            move: {
              direction: "none",
              enable: true,
              outMode: "bounce",
              random: false,
              speed: 0.6,
              straight: false,
            },
            number: {
              density: {
                enable: true,
                value_area: 800,
              },
              value: 30,
            },
            opacity: {
              value: 0.7,
            },
            shape: {
              type: "circle",
            },
            size: {
              random: true,
              value: 5,
            },
          },
          detectRetina: true,
        });
      } else {
        console.error("エラー");
      }
    };

    loadParticles();
  }, []);

  return (
    <div
      id="particles-container"
      style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: -1,
      }}
    ></div>
  );
};

export default ParticlesComponent;
