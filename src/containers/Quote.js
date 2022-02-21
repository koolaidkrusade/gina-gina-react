import { Fragment } from 'react';

export default function Quote(props) {
    return (
        <Fragment>
            <header>
                {/* Gina's logo
                    Later in the process, try making this logo responsive
                    for width and resolution. */}
                <img
                    src='assets/images/logo.png' 
                    alt='Gina Gina Blog logo, elegant and bougie'
                    width='300'
                    height='253'
                />
            </header>
            <h2>Quote</h2>
            <button onClick={() => props.changePage('feeds')}>→</button>
            <br/><br/>
            <br/><br/>
        </Fragment>
    );
}