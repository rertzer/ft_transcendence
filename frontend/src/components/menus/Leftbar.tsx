import "./Leftbar.scss";
import GamepadIcon from '@mui/icons-material/GamepadOutlined';
import VideogameIcon from '@mui/icons-material/VideogameAssetOutlined';
import EsportsIcon from '@mui/icons-material/SportsEsportsOutlined';
import QuestionMarkIcon from '@mui/icons-material/QuestionMarkOutlined';
import {Link} from "react-router-dom";

function Leftbar() {

    return (
        <div className="leftbar">
            <div className="container">
                <div className="menu">
                    <span>Modes de jeu</span>
					<Link to="/game" style={{textDecoration:"none"}}>
                    	<div className="item">
                        	<GamepadIcon />
                        	<span>Classic</span>
                   		</div>
					</Link>
                    <div className="item">
                        <VideogameIcon />
                        <span>Brickbreaker</span>
                    </div>
                    <div className="item">
                        <EsportsIcon />
                        <span>Turfu</span>
                    </div>
                    <div className="item">
                        <QuestionMarkIcon />
                        <span>Random</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Leftbar;
