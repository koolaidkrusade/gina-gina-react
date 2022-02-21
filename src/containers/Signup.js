import { useState, Fragment, useEffect } from 'react';
import { signup, writeUserData, upload } from '../firebase';

const defaultPhotoURL = 'assets/images/default-profile.png';

export default function Signup(props) {
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [hasFilled, setHasFilled] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const [userName, setUserName] = useState('');
    const [userPassword, setUserPassword] = useState('');
    const [userConfirmedPassword, setUserConfirmedPassword] = useState('');
    const [photoURL, setPhotoURL] = useState(defaultPhotoURL);
    
    const handleAddPhoto = (e) => {
        if (e.target.files[0]) upload(e.target.files[0], setPhotoURL, setIsLoading, setIsUploading);
    }

    const handleRemovePhoto = () => {
        setIsLoading(true);
        setIsUploading(true);
        const timer = setTimeout(() => {
            setPhotoURL(defaultPhotoURL);
            setIsLoading(false);
            setIsUploading(false);
        }, 250);
        return () => clearTimeout(timer);
    }

    const checkLogin = () => {
        // var specialRegex = "/[a-z0-9]/"
        // if (specialRegex.test(userName) === true) {
        //     setErrorMessage('Usernames cannot include special characters.');

        if (userName.length > 20) {
            setErrorMessage('Usernames cannot exceed 20 characters.');
        
        } else if(userPassword !== '') {
            if (userPassword !== userConfirmedPassword) {
                setErrorMessage('Those passwords didn\'t match. Please try again.');
        } else {
             handleSignUp();
            }
        }
    }

    const handleSignUp = async function() {
        setIsLoading(true);
        signup(userName, userPassword)
            .then((userCredential) => {
                const user = userCredential.user;
                writeUserData(user.uid, userName, photoURL);
                props.changePage('quote')
                setIsLoading(false);
            })
            .catch((error) => {
                if (error.code === 'auth/email-already-in-use') {
                    setErrorMessage('That username is already in use. Please try again.');
                } else if (error.code === 'auth/weak-password') {
                    setErrorMessage('Passwords must be at least 6 characters.');
                } else {
                    setErrorMessage('An error occurred. Please try again.');
                }
                setIsLoading(false);
            });
    }

    useEffect(() => {
        setHasFilled(userName !== '' && userPassword !== '' && userConfirmedPassword !== '');
    }, [userName, userPassword, userConfirmedPassword]);

    useEffect(() => {
        if(props.currentUser) {
            if(props.currentUserData) {
                props.changePage('quote');
            }
        }
    }, [props]);

    return (
        <Fragment>
            <header>
                <img
                    src='assets/images/logo.png' 
                    alt='Gina Gina Blog logo, elegant and bougie'
                    width='300'
                    height='253'
                /> 
            </header>
            <h2>Create an account to access and interact with Gina Gina blog content.</h2>
            {errorMessage !== '' ? (<p className='error'>{errorMessage}</p>) : null}
            <br/> 
            <div className='profile-pic-container' key='photoURL'>
                <img
                    src={photoURL}
                    className='profile-pic'
                    alt='Profile'
                    width='85'
                    height='85'
                />
                {isUploading ? <div className='profile-pic-spinner'></div> : null}
            </div>
            
            <br/>
            {/* Sign-up form, once completed takes you to the blog --> */}
            <form>
                {/* Profile picture upload */}
                {photoURL === defaultPhotoURL ?
                    <label className='custom-file-upload'>
                        <input type='file' onChange={handleAddPhoto} />
                        <b style={{color: '#4193AC'}}>Add profile photo</b>
                    </label>
                    :
                    <label className='custom-file-upload'>
                        <b style={{color: '#4193AC'}} onClick={handleRemovePhoto}>Remove profile photo</b>
                    </label>
                }
                <br/>
                <span className="upload-message"> (Optional)
                </span>
                <br/><br/>
                <input
                    id='username'
                    name='username'
                    type='text'
                    placeholder='Username'
                    value={userName || ''}
                    onChange={(e) => setUserName(e.target.value)}
                />
                <br/>
                <input
                    id='password'
                    name='password'
                    type='password'
                    placeholder='Password'
                    value={userPassword || ''}
                    onChange={(e) => setUserPassword(e.target.value)}
                />
                <br/>
                <input
                    id='confirmed_password'
                    name='password'
                    type='password'
                    placeholder='Confirm Password' 
                    value={userConfirmedPassword || ''}
                    onChange={(e) => setUserConfirmedPassword(e.target.value)}
                />
            </form>
            <br/> <br/>
            {hasFilled && !isLoading && !props.currentUser ? (
                <button onClick={checkLogin}>→</button>
            ) : (
                <button disabled style={{background: 'gray', cursor: 'default'}}>→</button>
            )} <br/><br/>
            {/* This links you to the log-in page. */}
            <div className='redirect'>Already have an account?&nbsp;
                <div className='text-button' onClick={() => props.changePage('login')}>Log in here.</div>
            </div>
            <br/><br/>
        </Fragment>
    )
}