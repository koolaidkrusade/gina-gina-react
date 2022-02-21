import { useState, Fragment, useEffect } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { useAuth, logout } from './firebase';

import cueData from './data/cues.json';
import './App.css';

import Signup from './containers/Signup';
import Login from './containers/Login';
import Operation from './containers/Operation';
import Quote from './containers/Quote';
import Feeds from './containers/Feeds';

export default function App() {
    const [page, setPage] = useState('signup');
    const [currentCue, setCurrentCue] = useState(0);
    const [currentUserData, setCurrentUserData] = useState();

    const database = getDatabase();
    const currentUser = useAuth();

    const changePage = (page) => setPage(page);
    
    const handleLogout = () => {
        setCurrentUserData()
        logout();
    }

    // Listener to the current number
    useEffect(() => {
        const currentCueRef = ref(database, 'public/currentCue');
        onValue(currentCueRef, (snapshot) => {
            const data = snapshot.val();
            setCurrentCue(data);
        });
    }, [database]);

    // Listener to the current user's data
    useEffect(() => {
        if(currentUser) {
	        console.log('User UID: ' + currentUser.uid);
            const userRef = ref(database, 'users/' + currentUser.uid);
            onValue(userRef, (snapshot) => {
                const data = snapshot.val();
                if(data !== null) setCurrentUserData(data);
            });
        }
    }, [database, currentUser]);

    let output = '';
    if(page === 'signup') {
        output = (<Signup
            currentUser={currentUser}
            currentUserData={currentUserData}
            changePage={changePage}
        />);
    } else if(page === 'login') {
        output = (<Login
            currentUser={currentUser}
            currentUserData={currentUserData}
            changePage={changePage}
        />);
    } else if(currentUser) {
        // If user has signed in
        if(currentUserData) {
            if(currentUserData.role === 'admin') {
                output = (<Operation
                    changePage={changePage}
                    logout={handleLogout}
                    currentCue={currentCue}
                    setCurrentCue={setCurrentCue}
                    cueList={cueData['cue-list']}
                />);
            } else if(currentUserData.role === 'audience') {
                if(page === 'quote') { 
                    output = (<Quote
                        changePage={changePage}
                        logout={handleLogout}
                    />);
                } else if(page === 'feeds') {
                    output = (<Feeds
                        database={database}
                        currentUser={currentUser}
                        currentUserData={currentUserData}
                        visiblePostList={cueData['cue-list'][currentCue]['visiblePostList']}
                        scrollToPost={cueData['cue-list'][currentCue]['scrollToPost']}
                        changePage={changePage}
                        logout={handleLogout}
                    />);
                }
            }
        }
    } else {
        changePage('login');
    }
    
    return(
        <Fragment>
            {output}
        </Fragment>
    )
}