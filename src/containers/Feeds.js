import React, { useEffect, useRef } from 'react';
import { scrollIntoView } from "seamless-scroll-polyfill";

import Post from '../components/Post';
import Footer from '../components/Footer';
import postData from '../data/posts.json';

export default function Feeds(props) {
    // Reference to the post scrolled to
    const scrollToPostRef = useRef(null);

    // Listener to the current user's data
    // useEffect(() => {
    //     if(props.currentUser) {
    //         const userRef = ref(props.database, 'users/' + props.currentUser.uid);
    //         onValue(userRef, (snapshot) => {
    //             const data = snapshot.val();
    //             if(data !== null) setCurrentUserData(data);
    //         });
    //     }
    // }, [props.database, props.currentUser]);

    // Once enter a new cue, scroll to the post according to the cue list
    useEffect(() => {
        console.log('Visible Post(s): ' + props.visiblePostList);
        // Check if the reference exists
        if(scrollToPostRef.current) {
            // Add a delay to the scroll effect for user's loading
            
            const timer = setTimeout(() => {
                scrollIntoView(scrollToPostRef.current, {
                    behavior: 'smooth',
                    block: 'start',
                    inline: 'start'
                });
                // scrollIntoView isn't supported by Safari
                // scrollToPostRef.current.scrollIntoView({
                //     behavior: 'smooth',
                //     block: 'start',
                //     inline: 'start'
                // });
            }, 100);
            return () => clearTimeout(timer);
        };
    }, [props.visiblePostList])

    return(
        <div className='feeds-container'>
            <div className='feeds'>
                <header className='nav'>
                    {/* Gina's logo */}
                    <img
                        src='assets/images/blog-logo.png' 
                        alt='Gina Gina Blog logo, elegant and bougie'
                        width='150'
                        height='64'
                    /> 
                </header>
                <div className='blog-page'>
                    {/* Each article is an individual blog post
                        with reactions and a comment section. */}
                    {props.visiblePostList.map(postName => (
                        postName === props.scrollToPost ? 
                        <div key={postName} ref={scrollToPostRef}>
                            <Post
                                postName={postName}
                                data={postData.posts[postName]}
                                database={props.database}
                                currentUserUID={props.currentUser.uid}
                                currentUserData={props.currentUserData}
                            />
                        </div>
                        :
                        <div key={postName}>
                            <Post
                                postName={postName}
                                data={postData.posts[postName]}
                                database={props.database}
                                currentUserUID={props.currentUser.uid}
                                currentUserData={props.currentUserData}
                            />
                        </div>
                    ))}
                    {/* Above ends the individual blog post. */}
                </div>
                <Footer
                    logout={props.logout}
                    changePage={props.changePage}
                />
            </div>
        </div>
    )
}

