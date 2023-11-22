import styles from "./GameBar.module.css";
import { useContext } from "react";
import { MyContext } from "../../context/PageContext";

export function GameBar () {
	const context = useContext(MyContext);
	if (!context) {
	throw new Error('useContext must be used within a MyProvider');
	}
	const { game } = context;
    return (
    <div className={styles.bar}>
        <div className={styles.leftText}>{game.player1} {":"} {game.points1} points</div>
        <div className={styles.rightText}>{game.player2} {":"} {game.points2} points</div>
    </div>)
}
