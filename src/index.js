import ReactDOM from 'react-dom/client';
import {Game} from "./Page/Game/Game";
import {CorsTest} from "./Page/CorsTest/CorsTest";
import axios from "axios";
axios.defaults.withCredentials = true;

const root = ReactDOM.createRoot(document.getElementById("root"));
const multiHr = (n)=>{
    return Array(n).fill(<hr/>);
}


root.render(
    <div>
        <h3>CorsTest</h3>
        <CorsTest/>
        {multiHr(10)}
        <h3>first learn</h3>
        <Game boardN={5}/>
    </div>
);

