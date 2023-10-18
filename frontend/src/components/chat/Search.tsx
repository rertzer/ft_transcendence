import React, { KeyboardEvent, useState } from 'react';
import "./Search.scss"

const Search = () => {

    // const [searched, setSearched] = useState("");
    // const [found, setFound] = useState(null);
    // const [err, setErr] = useState(false);

    // const handleSearch = () => {

    // }

    // const handleKey= (e: KeyboardEvent<HTMLImageElement>) => {
    //     e.code == "Enter" && handleSearch();
    // }

    return (
        <div className='chatsearch'>
            <div className="searchForm">
                {/* <input type="text" placeholder="Find contacts or channels" onKeyDown={handleKey} onChange={e=>setSearched(e.target.value)}/> */}
                <input type="text" placeholder="Find contacts or channels" />
            </div>
            <div className="userChat">
                <img src="https://img.lamontagne.fr/c6BQg2OSHIeQEv4GJfr_br_8h5DGcOy84ruH2ZResWQ/fit/657/438/sm/0/bG9jYWw6Ly8vMDAvMDAvMDMvMTYvNDYvMjAwMDAwMzE2NDYxMQ.jpg" />
                <div className='userChatInfo'>
                    <span>mbocquel</span>
                </div>
            </div>
        </div>
    )
}

export default Search;