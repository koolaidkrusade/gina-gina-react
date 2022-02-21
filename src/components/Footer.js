import { logout } from '../firebase';

export default function Footer(props) {
    
    const handleLogout = () => {
        logout();
        // props.changePage('login');
    }

    return(
        <footer>
            <br/>
            {/* Gina's footer ad */}
            <img src = 'assets/images/ad-0-8.png' 
            className = 'center'
            alt = 'Ads because Gina wants money'
            width = '650' height = '112'/> <br/> <br/>
            
            {/* Gina's footer lock, so I don't have to make 
                thousands of posts for an archive */}
            <img src = 'assets/images/lock.png' 
            alt = 'A lock indicating that Gina wants money for more access to her content'
            width = '50' height = '43'/> 
            <br/><br/>
            <div className = 'redirect'> To access the Gina Gina post archive, 
                join Patreon and link your account.
                <br/><br/>
                {/* This links you to the log-in page. */}
                <div className='text-button' onClick={handleLogout}>Log out</div>
            </div>
            <br/><br/>
        </footer>
    )
}