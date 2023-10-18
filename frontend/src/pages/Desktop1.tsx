import { FunctionComponent } from "react";
import Numbers from "../components/Numbers";
import Letters from "../components/Letters";
import styles from "./Desktop1.module.css";
import RepeatingComponent from "../components/Numbers_dynamic";

const Desktop1: FunctionComponent = () => {
  return (
    <div className={styles.desktop1}>
      <div className={styles.desktop1Child} />
      <div className={styles.body}>
        <div className={styles.background} />
        <div className={styles.grid}>
          <img className={styles.gridImgIcon} alt="" src="/grid-img@2x.png" />
        </div>
        <div className={styles.rightLettersFrame}>
          <div className={styles.rightLettersBackground} />
          <RepeatingComponent />
          <div className={styles.numbers}>
            {/* <div className={styles.numberGroup4}>
              <div className={styles.numberGroupChild} />
              <div className={styles.div}>2</div>
            </div> */}
          </div>
          <div className={styles.up} />
        </div>
        <div className={styles.letters}>
          <div className={styles.abc2}>
            <div className={styles.a}>
              <div className={styles.upLetter} />
              <Letters />
            </div>
            <div className={styles.b}>
              <div className={styles.upLetter} />
              <div className={styles.b1}>B</div>
            </div>
            <div className={styles.c}>
              <div className={styles.upLetter} />
              <div className={styles.b1}>C</div>
            </div>
            <div className={styles.d}>
              <div className={styles.upLetter} />
              <div className={styles.b1}>D</div>
            </div>
            <div className={styles.e}>
              <div className={styles.upLetter} />
              <div className={styles.b1}>E</div>
            </div>
            <div className={styles.f}>
              <div className={styles.upLetter} />
              <div className={styles.b1}>F</div>
            </div>
            <div className={styles.g}>
              <div className={styles.upLetter} />
              <div className={styles.b1}>G</div>
            </div>
            <div className={styles.h}>
              <div className={styles.upLetter} />
              <div className={styles.b1}>H</div>
            </div>
            <div className={styles.i}>
              <div className={styles.upLetter} />
              <div className={styles.b1}>I</div>
            </div>
            <div className={styles.j}>
              <div className={styles.upLetter} />
              <div className={styles.b1}>J</div>
            </div>
            <div className={styles.k}>
              <div className={styles.upLetter} />
              <div className={styles.b1}>K</div>
            </div>
            <div className={styles.l}>
              <div className={styles.upLetter} />
              <div className={styles.b1}>L</div>
            </div>
            <div className={styles.m}>
              <div className={styles.upLetter} />
              <div className={styles.b1}>M</div>
            </div>
            <div className={styles.n}>
              <div className={styles.upLetter} />
              <div className={styles.b1}>N</div>
            </div>
            <div className={styles.o}>
              <div className={styles.upLetter} />
              <div className={styles.b1}>O</div>
            </div>
            <div className={styles.p}>
              <div className={styles.upLetter} />
              <div className={styles.b1}>P</div>
            </div>
            <div className={styles.q}>
              <div className={styles.upLetter} />
              <div className={styles.b1}>Q</div>
            </div>
            <div className={styles.r}>
              <div className={styles.upLetter} />
              <div className={styles.b1}>R</div>
            </div>
            <div className={styles.s}>
              <div className={styles.upLetter} />
              <div className={styles.b1}>S</div>
            </div>
            <div className={styles.t}>
              <div className={styles.upLetter} />
              <div className={styles.b1}>T</div>
            </div>
            <div className={styles.u}>
              <div className={styles.upLetter} />
              <div className={styles.b1}>U</div>
            </div>
            <div className={styles.v}>
              <div className={styles.upLetter} />
              <div className={styles.b1}>V</div>
            </div>
            <div className={styles.w}>
              <div className={styles.upLetter} />
              <div className={styles.b1}>W</div>
            </div>
            <div className={styles.x}>
              <div className={styles.upLetter} />
              <div className={styles.b1}>X</div>
            </div>
            <div className={styles.y}>
              <div className={styles.upLetter} />
              <div className={styles.b1}>Y</div>
            </div>
            <div className={styles.z}>
              <div className={styles.upLetter} />
              <div className={styles.b1}>Z</div>
            </div>
          </div>
          <div className={styles.abc1}>
            <div className={styles.a}>
              <div className={styles.upLetter} />
              <div className={styles.b1}>A</div>
            </div>
            <div className={styles.b}>
              <div className={styles.upLetter} />
              <div className={styles.b1}>B</div>
            </div>
            <div className={styles.c}>
              <div className={styles.upLetter} />
              <div className={styles.b1}>C</div>
            </div>
            <div className={styles.d}>
              <div className={styles.upLetter} />
              <div className={styles.b1}>D</div>
            </div>
            <div className={styles.e}>
              <div className={styles.upLetter} />
              <div className={styles.b1}>E</div>
            </div>
            <div className={styles.f}>
              <div className={styles.upLetter} />
              <div className={styles.b1}>F</div>
            </div>
            <div className={styles.g}>
              <div className={styles.upLetter} />
              <div className={styles.b1}>G</div>
            </div>
            <div className={styles.h}>
              <div className={styles.upLetter} />
              <div className={styles.b1}>H</div>
            </div>
            <div className={styles.i}>
              <div className={styles.upLetter} />
              <div className={styles.b1}>I</div>
            </div>
            <div className={styles.j}>
              <div className={styles.upLetter} />
              <div className={styles.b1}>J</div>
            </div>
            <div className={styles.k}>
              <div className={styles.upLetter} />
              <div className={styles.b1}>K</div>
            </div>
            <div className={styles.l}>
              <div className={styles.upLetter} />
              <div className={styles.b1}>L</div>
            </div>
            <div className={styles.m}>
              <div className={styles.upLetter} />
              <div className={styles.b1}>M</div>
            </div>
            <div className={styles.n}>
              <div className={styles.upLetter} />
              <div className={styles.b1}>N</div>
            </div>
            <div className={styles.o}>
              <div className={styles.upLetter} />
              <div className={styles.b1}>O</div>
            </div>
            <div className={styles.p}>
              <div className={styles.upLetter} />
              <div className={styles.b1}>P</div>
            </div>
            <div className={styles.q}>
              <div className={styles.upLetter} />
              <div className={styles.b1}>Q</div>
            </div>
            <div className={styles.r}>
              <div className={styles.upLetter} />
              <div className={styles.b1}>R</div>
            </div>
            <div className={styles.s}>
              <div className={styles.upLetter} />
              <div className={styles.b1}>S</div>
            </div>
            <div className={styles.t}>
              <div className={styles.upLetter} />
              <div className={styles.b1}>T</div>
            </div>
            <div className={styles.u}>
              <div className={styles.upLetter} />
              <div className={styles.b1}>U</div>
            </div>
            <div className={styles.v}>
              <div className={styles.upLetter} />
              <div className={styles.b1}>V</div>
            </div>
            <div className={styles.w}>
              <div className={styles.upLetter} />
              <div className={styles.b1}>W</div>
            </div>
            <div className={styles.x}>
              <div className={styles.upLetter} />
              <div className={styles.b1}>X</div>
            </div>
            <div className={styles.y}>
              <div className={styles.upLetter} />
              <div className={styles.b1}>Y</div>
            </div>
            <div className={styles.z}>
              <div className={styles.upLetter} />
              <div className={styles.b1}>Z</div>
            </div>
          </div>
        </div>
        <div className={styles.racketPlayer2}>
          <div className={styles.rightScrollZone} />
          <div className={styles.racket2} />
        </div>
        <div className={styles.racketPlayer1}>
          <div className={styles.rightScrollZone1} />
          <div className={styles.racket1} />
        </div>
      </div>
      <footer className={styles.bottom} />
      <header className={styles.headerFrame}>
        <div className={styles.headerBackground} />
        <div className={styles.line3}>
          <div className={styles.tchatbox} />
          <img className={styles.buttonsIcon} alt="" src="/buttons.svg" />
          <div className={styles.menu}>
            <div className={styles.menuBackground} />
            <div className={styles.buttpn}>
              <div className={styles.buttonBackground} />
              <img className={styles.buttpnChild} alt="" src="/star-1.svg" />
            </div>
            <div className={styles.frameText}>
              <div className={styles.basicSansCs}>User2</div>
            </div>
          </div>
        </div>
        <div className={styles.line2}>
          <div className={styles.menu1}>
            <div className={styles.menuBackground} />
            <div className={styles.buttpn}>
              <div className={styles.buttonBackground} />
              <img className={styles.buttpnChild} alt="" src="/star-1.svg" />
            </div>
            <div className={styles.frameText1}>
              <div className={styles.pt}>0 pt</div>
            </div>
          </div>
          <div className={styles.menu2}>
            <div className={styles.menuBackground} />
            <div className={styles.buttpn}>
              <div className={styles.buttonBackground} />
              <img className={styles.buttpnChild} alt="" src="/star-1.svg" />
            </div>
            <div className={styles.frameText}>
              <div className={styles.basicSansCs}>Basic Sans Cs</div>
            </div>
          </div>
        </div>
        <div className={styles.textBar}>
          <div className={styles.textBar1} />
          <div className={styles.file}>
            <div className={styles.file1}>File</div>
          </div>
          <div className={styles.settings}>
            <div className={styles.settings1}>Settings</div>
          </div>
          <div className={styles.contact}>
            <div className={styles.settings1}>Contact</div>
          </div>
          <div className={styles.data}>
            <div className={styles.data1}>Data</div>
          </div>
          <div className={styles.history}>
            <div className={styles.settings1}>History</div>
          </div>
          <div className={styles.profile}>
            <div className={styles.profile1}>Profile</div>
          </div>
        </div>
        <div className={styles.titleBar}>
          <div className={styles.titleBarBackground} />
          <div className={styles.untitled1}>Untitled 1 - PongOffice Calc</div>
          <div className={styles.user}>
            <img className={styles.userChild} alt="" src="/ellipse-1@2x.png" />
            <div className={styles.user1}>User</div>
            <img className={styles.crossIcon} alt="" src="/cross.svg" />
          </div>
        </div>
      </header>
    </div>
  );
};

export default Desktop1;
function newFunction() {
  return <div className={styles.numberGroup1}>
    <div className={styles.numberGroupChild} />
    <div className={styles.div}>5</div>
  </div>;
}

