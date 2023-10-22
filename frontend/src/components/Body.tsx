import styles from "../pages/Desktop1.module.css";
import Numbers from "./Body/Numbers_dynamic";
import Letters from "./Body/Letters_dynamic";
import Grid from "./Body/Grid_dynamic";

export function Body({}) {
  return <div className={styles.body}>
        <div className={styles.background} />
        <div className={styles.grid}>
        <Grid />
        </div>
        <div className={styles.rightLettersFrame}>
          <div className={styles.rightLettersBackground} />
          <Numbers />
          <div className={styles.up} />
        </div>
        <div className={styles.letters}>
          <Letters />
        </div>
        <div className={styles.racketPlayer2}>
          <div className={styles.rightScrollZone} />
          <div className={styles.racket2} />
        </div>
        <div className={styles.racketPlayer1}>
          <div className={styles.rightScrollZone1} />
          <div className={styles.racket1} />
        </div>
      </div>;
}
  