import { writeCurrentCue, resetAllPostData } from '../firebase';
import './Operation.css';

export default function Operation(props) {
    const cueListLength = props.cueList.length;

    const goNextCue = () => {
        if(props.currentCue >= cueListLength-1) {
            writeCurrentCue(props.currentCue);
        } else {
            writeCurrentCue(props.currentCue + 1);
        }
    }

    const goPreviousCue = () => {
        if(props.currentCue > 0) {
            writeCurrentCue(props.currentCue - 1);
        } else {
            writeCurrentCue(0);
        }
    }
    
    const handleReset = () => {
        const confirmBox = window.confirm('Are you sure to reset all the posts?');
        if(confirmBox) resetAllPostData();
    }

    return(
        <div className='op-container'>
            <br/>
            <h2>Admin Page</h2>

            {/* This table is the cue list! The admin can press 'go' to publish 
            posts. In case of an emergency where an error occurred, they can 
            unpublish them as well by pressing 'unpublish'. */}
            <div className='op-panel'>
                <div className='cue-info'>
                    <b>Current Cue: {props.cueList[props.currentCue].no}</b> /
                    {props.currentCue >= cueListLength-1 ?
                        ' This is the end' :
                        ' Next Cue: ' + props.cueList[props.currentCue+1].no
                    }
                </div>
                <div className='buttons'>
                    {props.currentCue > 0 ?
                        <button className='back-button' onClick={goPreviousCue}>BACK</button> : 
                        <button className='back-button disabled'>BACK</button>
                    }
                    {props.currentCue >= cueListLength-1 ?
                        <button className='go-button disabled'>Go</button> : 
                        <button className='go-button' onClick={goNextCue}>GO</button>
                    }
                </div>
            </div>
            <button 
                className='unpublish-button'
                onClick={() => { handleReset() }}>
                <b>HARD RESET</b>
            </button>

            {/* This links you to the log-in page. */}
            <div className='text-button' onClick={props.logout}>Log out</div>
        </div>
    )
}