import React from 'react';
import '../style/MediaTitle.css';

//const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];


class MediaTitle extends React.Component {
    render() {
        //console.log(this.props.filename, this.props.mediaMetadata.creationTime);
        const dateRegex = /[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}\.[0-9]{2}\.[0-9]{2}\.[a-z]+/g;
        let dateObject;
        if (this.props.filename.match(dateRegex)) {
            // filename is a datetime - we'll believe it
            const year = parseInt(this.props.filename.substring(0,4)), 
                  month = parseInt(this.props.filename.substring(5,2)), 
                  day = parseInt(this.props.filename.substring(8,2))
            dateObject = new Date(year, month, day);
            
        } else {
            dateObject = new Date(this.props.mediaMetadata.creationTime);
        }
        
        const dateString = dateObject.getDate() + ' ' + monthNames[dateObject.getMonth()] + ' ' + dateObject.getFullYear();
       
        return <div className="title">
            <h1>{dateString}</h1>
        </div>;
    }
}

export default MediaTitle;
