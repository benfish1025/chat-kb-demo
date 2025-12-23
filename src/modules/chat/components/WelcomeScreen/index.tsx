import React from "react";
import brandRobot from "@/assets/brand-robot.png";
import decorativeCurve from "@/assets/decorative-curve.svg";
import { useAppStyles } from "@/common/styles/useAppStyles";

export const WelcomeScreen: React.FC = () => {
  const { styles } = useAppStyles();

  return (
    <div className={styles.welcomeArea}>
      <div className={styles.welcomeContent}>
        <img src={brandRobot} width={275} height={275} alt="Robot" draggable={false} />
        <div className={styles.welcomeText}>
          <div className={styles.welcomeTextLine1}>Hi！我是小K</div>
          <div className={styles.welcomeTextLine2}>遇到什么疑问，尽管问我</div>
          <div className="app-styled-decorative-curve">
            <img
              src={decorativeCurve}
              alt=""
              aria-hidden="true"
              draggable={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

