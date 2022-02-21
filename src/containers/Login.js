import { useState, Fragment, useEffect } from 'react';
import { login } from '../firebase';

export default function Login(props) {
    const [isLoading, setIsLoading] = useState(false);
    const [hasFilled, setHasFilled] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const [userName, setUserName] = useState('');
    const [userPassword, setUserPassword] = useState('');
    
    const handleLogin = async function() {
        setIsLoading(true);
        login(userName, userPassword)
            .then(() => {
                props.changePage('quote')
                setIsLoading(false);
            })
            .catch((error) => {
                if(error.code === 'auth/wrong-password') {
                    setErrorMessage('The password is incorrect. Please try again.');
                } else if(error.code === 'auth/user-not-found') {
                    setErrorMessage('The username is not found. Please try again.');
                } else {
                    setErrorMessage('An error occurred. Please try again.');
                }
                setIsLoading(false);
            });
    }

    useEffect(() => {
        setHasFilled(userName !== '' && userPassword !== '');
    }, [userName, userPassword]);

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
                <img src = 'assets/images/logo.png' 
                alt = 'Gina Gina Blog logo, elegant and bougie'
                width = '300' height = '253'/> 
            </header>
            <h2>Log in to access and interact with Gina Gina blog content.</h2>
            {errorMessage !== '' ? (<p className='error'>{errorMessage}</p>) : null}
            <br/>
            <form>
                <input
                    id='username'
                    name='username'
                    type='text'
                    placeholder='Username'
                    value={userName || ''}
                    onChange={(e) => setUserName(e.target.value)}
                ></input>
                <br/>
                <input
                    id='password'
                    name='password'
                    type='password'
                    placeholder = 'Password'
                    value={userPassword || ''}
                    onChange={(e) => setUserPassword(e.target.value)}
                ></input>
                <br/><br/>
            </form>
            
            {hasFilled && !isLoading && !props.currentUser ? (
                <button onClick={handleLogin}>→</button>
            ) : (
                <button disabled style={{background: 'gray', cursor: 'default'}}>→</button>
            )} <br/><br/>
            <div className='redirect'>Don't have an account?&nbsp;
                <div className='text-button' onClick={() => props.changePage('signup')}>Sign up here.</div>
            </div>
            <br/><br/>
        </Fragment>
    );
}