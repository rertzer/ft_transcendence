import "./Profile.scss";
import VictoryIcon from '@mui/icons-material/EmojiEventsOutlined';
import LoseIcon from '@mui/icons-material/SentimentVeryDissatisfiedOutlined';
import ChatIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import BlockIcon from '@mui/icons-material/BlockOutlined';

function Profile() {

    return (
        <div className="profile">
            <div className="images">
                <img src="https://img.lamontagne.fr/c6BQg2OSHIeQEv4GJfr_br_8h5DGcOy84ruH2ZResWQ/fit/657/438/sm/0/bG9jYWw6Ly8vMDAvMDAvMDMvMTYvNDYvMjAwMDAwMzE2NDYxMQ.jpg" alt="" className="profilePic" />
            </div>
            <div className="profileContainer">
                <div className="uInfo">
                    <div className="left">
                        Salut les gens
                    </div>
                    <div className="center">
                        <span>tgrasset</span>
                        <div className="info">
                            <div className="item">
                                <VictoryIcon />
                                <span>Victoires: 5</span>
                            </div>
                            <div className="item">
                                <LoseIcon />
                                <span>Défaites: 13556445</span>
                            </div>
                        </div>
                        <button>Ajouter</button>
                    </div>
                    <div className="right">
                        <ChatIcon />
                        <BlockIcon />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;