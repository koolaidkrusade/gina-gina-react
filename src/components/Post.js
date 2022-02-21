import { useState, Fragment, useEffect } from 'react';
import { getDatabase, ref, onValue} from 'firebase/database';
import { writeUserReactions, writeComment, createEmptyPostData } from '../firebase';
import Twemoji from './Twemoji';

const reactionList = ['sad', 'confused', 'angry', 'laughing', 'heart', 'yum', 'fist'];
const twemojiList  = ['😰', '😵‍💫', '🤬', '🤣', '🥰', '🤤', '✊🏿'];

const emptyReactionData = reactionList.reduce((object, value) => {
    object[value] = 0;
    return object;
}, {});

export default function Post(props) {
    const [postData, setPostData] = useState({ reactions: emptyReactionData });
    const [userReaction, setUserReaction] = useState(false);
    
    const sortComments = (comments) => {
        return Object.keys(comments).sort((a, b) => a - b).map(time => comments[time]);
    }

    const handleSubmit = (comment) => {
        if(comment !== '') writeComment(props.postName, props.currentUserUID, comment);
    }

    useEffect(() => {
        const postRef = ref(props.database, 'public/posts/' + props.postName);
        const userReactionRef = ref(props.database, 'users/' + props.currentUserUID + '/reactions/' + props.postName);
        // Listener to the content of this post
        onValue(postRef, (snapshot) => {
            const data = snapshot.val();
            if(data) {
                setPostData(data)
            } else {
                createEmptyPostData(props.postName, emptyReactionData);
            };
        });
        // Listener to the user's reaction to this post
        onValue(userReactionRef, (snapshot) => {
            const data = snapshot.val();
            if(data) {
                setUserReaction(data)
            } else {
                writeUserReactions(props.postName, props.currentUserUID, 'none', null)
            };
        });
    }, [props.database, props.postName, props.currentUserUID]);

    return(
        <article className='center'>
            {/* Gina's header ad */}
            <img
                src={props.data.ad}
                className='blog-ad'
                alt='Ads because Gina wants money'
                width='650'
                height='112'
            />

            {/* The poster tag (Most of the time, Gina has posted.) */}
            <p className='blog-poster-tag'> 
                <img
                    src='assets/images/default-profile.png' 
                    alt='Gina&apos;s profile'
                    width='49.5'
                    height='49.5'
                />
                <span>  </span> <b>{props.data.poster}</b>
            </p>

            {/* Title of the post */}
            <h1>{props.data.caption}</h1>
            {/* These are the reaction buttons.
                Every reaction and every count has a unique ID */}
            <div className="post-reaction-container">
                <Reactions
                    data={props.data}
                    postReactions={postData.reactions}
                    userReaction={userReaction}
                    currentUserUID={props.currentUserUID}
                    postName={props.postName}
                />
                {/* Image in the post */}
                <div className='post-photo-container'>
                    <img
                        src={props.data.image}
                        className='post-photo'
                        alt='Gina'
                    />
                </div>
            </div>

            <hr/>

            {/* The comment section, includes all comments 
                and the submission form */}
            <div className = 'comment-section'>
                <br/>
                {/* Predetermined Comments */}
                {
                    props.data.comments.map((comment, index) => (
                        <Comment
                            key={index}
                            isPredetermined={true}
                            profilePicture={comment['commenter-profile']}
                            userName={comment['commenter-user']}
                            comment={comment.comment}
                        />
                    ))
                }
                {/* Audience's Comments */}
                {
                    postData.comments && Object.keys(postData.comments).length > 0 ?
                        sortComments(postData.comments).map((comment, index) => (
                            <Comment
                                key={comment.userUID + index.toString()}
                                isPredetermined={false}
                                userUID={comment.userUID}
                                comment={comment.comment}
                            />
                        )) : null
                }
            </div>
            <Composer
                userName={props.currentUserData ?
                    props.currentUserData.userName : 'user'}
                profilePicture={props.currentUserData ?
                    props.currentUserData.profilePicture : 'assets/images/default-profile.png'}
                submit={handleSubmit}
            />

        {/* Above ends the comment section. */}
        </article>
    )
}

function Reactions(props) {
    const handleClick = (reaction) => {
        if(reaction === props.userReaction) writeUserReactions(props.postName, props.currentUserUID, 'none', props.userReaction);
        else writeUserReactions(props.postName, props.currentUserUID, reaction, props.userReaction);
    }

    return(
        <div key={props.userReaction} className='reaction-section'>
            {reactionList.map((reaction, index) => (
                <div
                    key={reaction}
                    className={props.userReaction === reaction ? 'reaction selected' : 'reaction'}
                    onClick={() => handleClick(reaction)}
                >
                    <Twemoji emoji={twemojiList[index]}/>
                    <div className='number'>
                        {!props.postReactions[reaction] ? props.data[reaction + '-num'] : props.data[reaction + '-num'] + props.postReactions[reaction]}
                    </div>
                </div>
            ))}
        </div>
    )
}

function Comment(props) {
    const [profilePicture, setProfilePicture] = useState( props.isPredetermined ? props.profilePicture : 'assets/images/default-profile.png' );
    const [userName, setUserName] = useState( props.isPredetermined ? props.userName : 'user' );

    useEffect(() => {
        // If the comment is not predetermined, fetch user's data from the server
        if(props.isPredetermined === false) {
            const database = getDatabase();
            const commentRef = ref(database, 'users/' + props.userUID);
            // Create a listener for commenter's user data
            onValue(commentRef, (snapshot) => {
                const data = snapshot.val();
                if(data !== null) {
                    setProfilePicture(data.profilePicture);
                    setUserName(data.userName);
                }
            });
        }
    }, [props.isPredetermined, props.userUID]);
    
    return(
        <Fragment>
            {/* This is a sample comment, including the profile picture,
                username, and comment itself. This sample comment in 
                particular tests how line breaks behave */}
            <span className='comment dont-break-out'>
            {/* Giada, this additional span is to provide a space
                between edge and profile picture */}
            <span></span>
            <img className="feed-profile-pictures"
                src={profilePicture} 
                alt={userName + '\'s profile picture'}
                width='35'
                height='35'
            />
            {/* Giada, this additional span is to provide a space
                between profile picture and comment */}
            <span></span>
            <span>
                <b>@{userName}: </b>{props.comment}
            </span>
            </span>
        </Fragment>
    )
}

function Composer(props) {
    const [comment, setComment] = useState('');

    const handleSubmit = () => {
        props.submit(comment);
        setComment('');
    }

    return(
        <div className="comment-upload">
            <img className="feed-profile-pictures"
                src={props.profilePicture}
                alt='Your profile'
                width='35'
                height='35'
            />
            <input
                className='commentbox'
                name='comment'
                type='text' 
                placeholder = {'Add a comment as ' + props.userName + '...'}
                value={comment || ''}
                onChange={(e) => setComment(e.target.value)}
            />
            <button
                className='comment-submit'
                onClick={handleSubmit}
                type = 'submit'>
                →
            </button>
        </div>
    )
}
