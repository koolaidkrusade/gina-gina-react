import { Fragment } from 'react';

export default function Operation(props) {

    return(
        <Fragment>
            <br/>
            <h2>Admin Page</h2>

            {/* This table is the cue list! The admin can press 'go' to publish 
            posts. In case of an emergency where an error occurred, they can 
            unpublish them as well by pressing 'unpublish'. */}
            <table className='center'>
                <tr>
                    <td>Cue 1</td>
                    <td><button type='button' id='cue-1'> 
                        Go </button></td> 
                    <td><button type='button' id='undo-cue-1'
                        className='unpublish-button'> 
                        Unpublish </button></td>
                </tr>
                <tr>
                    <td>Cue 2</td>
                    <td><button type='button' id='cue-2'>
                        Go </button></td> 
                    <td><button type='button' id='undo-cue-2'
                        className='unpublish-button'>
                        Unpublish </button></td>
                </tr>
                <tr>
                    <td>Cue 3</td>
                    <td><button type='button' id='cue-3'>
                        Go </button></td> 
                    <td><button type='button' id='undo-cue-3'
                        className='unpublish-button'>
                        Unpublish </button></td>
                </tr>
            </table>
            
            <br/>
            <br/>
            <br/>
            <br/>

            {/* This unpublishes all posts at once for post-show ease. */}
            <button type='button' className='unpublish-button'> 
                <b> HARD RESET </b> </button>
            <br/>
            <br/>

            {/* This links you to the log-in page. */}
            <div className='text-button' onClick={props.logout}>Log out</div>
            </Fragment>
    )
}