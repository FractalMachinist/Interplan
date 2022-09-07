import { Link } from "react-router-dom";

export default function Home(){
    return <div>
        <h1>
            Welcome to Interplan!
        </h1>
        <p>
            This software is under active development.
        </p>
        <nav>
            <Link to="/task">View Tasks</Link>
        </nav>
        

    </div>
}