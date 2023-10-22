import { Header } from './../components/Header';
import { Body } from './../components/Body';
import { FunctionComponent } from "react";
import styles from "./Desktop1.module.css";

const Desktop1: FunctionComponent = () => {
  return (
    <div className={styles.desktop1}>
      <Header     />
      <Body     />
      <footer className={styles.bottom} />
    </div>
  );
};

export default Desktop1;

