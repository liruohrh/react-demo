import React from 'react';
import axios from "axios";

class CorsTest extends React.Component {
    constructor(props) {
        super(props);
        this.handlerOnClick = this.handlerOnClick.bind(this);
        this.state = {
            isLoaded: false,
            users: []
        }
    }

    handlerOnClick() {
        axios.post("http://localhost:7100/cors/1", {
            headers: {
                contentType: 'application/json',
            },
            withCredentials: true
        }).then(resp => {
            console.log(resp.data)
            let cookie = resp.headers.get('Set-Cookie');
            if (cookie) {
                document.cookie = cookie;
            }
            console.log(`cookie = ${cookie}`)
            console.log(resp)

            this.setState({
                isLoaded: true,
                users: resp.data
            });
        }).catch(error => {
            console.log(error)
            this.setState({
                isLoaded: true,
                error
            });
        });
    }

    render() {
        let dataView;
        if (!this.state.isLoaded) {
            dataView = <p>click button to send get request</p>
        } else if (this.state.error) {
            dataView = <p><strong>{this.state.error.toString()}</strong></p>;
        } else {
            dataView = this.state.users.map(user =>
                <ul key={user.id}>
                    <li>name={user.name}</li>
                    <li>age={user.age}</li>
                </ul>);
        }
        return <div>
            <h4>cors-test</h4>
            <div>
                {dataView}
            </div>
            <button style={{width: 50, height: 35}} value={"get1"} onClick={this.handlerOnClick}/>
        </div>
    }
}

export {
    CorsTest
}