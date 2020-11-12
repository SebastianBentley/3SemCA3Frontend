import './App.css';
import React, { useState, useEffect } from "react";
import DoLogin from "./login.js"
import Kanye1 from "./images/kanye1.png"
import Kanye2 from "./images/kanye2.png"
import {
    Switch,
    Route,
    NavLink,
    useLocation,
    useHistory
} from "react-router-dom";
import loginFacade from './apiFacade';

function App() {
    const [isLoggedIn, setLoggedIn] = useState(false)
    let history = useHistory();
    const goHome = () => {
        history.push("/");
    }
    return (
        <div>
            <Header loginMsg={
                isLoggedIn ? "Logout" : "Login"
            }
                isLoggedIn={isLoggedIn} />
            <Switch>
                <Route exact path="/">
                    <Home />
                </Route>
                <Route exact path="/login">
                    <DoLogin loggedIn={isLoggedIn} setLoggedIn={setLoggedIn} goHome={goHome} />
                </Route>
                <Route exact path="/kanye">
                    <ExternDataKanye />
                </Route>
                {isLoggedIn && (
                    <React.Fragment>
                        <Route exact path="/dog">
                            <ExternDataDog />
                        </Route>
                    </React.Fragment>
                )}
                <Route>
                    <NoMatch />
                </Route>
            </Switch>
        </div>

    );
}

function Header({ isLoggedIn, loginMsg }) {
    return (
        <ul className="header">
            <li>
                <NavLink exact activeClassName="active" to="/">Home</NavLink>
            </li>
            <li>
                <NavLink activeClassName="active" to="/kanye">Kanye Says</NavLink>
            </li>
            {isLoggedIn && (
                <li>
                    <NavLink activeClassName="active" to="/dog">Dog Picture</NavLink>
                </li>

            )}

            <li>
                <NavLink activeClassName="active" to="/login">
                    {loginMsg}</NavLink>
            </li>

        </ul>

    )
}


function Home() {
    return (
        <div>
            <h1>Home</h1>
            <h2>How StartCode was used:</h2>
            <h3>Backend</h3>
            <ul>
                <li>Unwanted extern API calls and DTO were removed to avoid potential unnecessary errors </li>
                <li>Instead of a combined Endpoint, Kanye and Dog have been given their own endpoint "api/info/kanye" and "api/info/dog"</li>
                <li>New Entity called "FavTVShow" was added and linked as OneToOne Relation to User</li>
                
            </ul>
            <h3>Frontend</h3>
            <ul>
                <li>URLs were adjustet</li>
                <li>Changes were made to index.css to change colors and image size</li>
                <li>functions were added to fetch from new endpoints</li>
                <li>React components were added for the new enpoints</li>     
                <li>Conditional Rendering were added for the User-secure enpoint for dog (logged in or not)</li>           
            </ul>
        </div>
    )
}


function ExternDataDog() {
    const [data, setData] = useState(null);
    useEffect(() => {
        setData(null);
        loginFacade.fetchDog().then(res => setData(res))
            .catch(err => {
                if (err.status) {
                    console.log(err.message);
                }
            });

    }, [])

    const toShow = data ? (
        <div>
            <p>Reference: https://dog.ceo/api/breeds/image/random</p>
            <h3>Dog Picture</h3>
            <img src={data.message} alt=""></img>
        </div>
    ) : "Loading..."

    return (
        <div>
            <h2>Data from extern server</h2>
            {toShow}
        </div>
    )

}


function ExternDataKanye() {
    const [data, setData] = useState(null);
    const [show, setShow] = useState(false);

    useEffect(() => {
        setData(null);
        loginFacade.fetchKanye().then(res => setData(res))
            .catch(err => {
                if (err.status) {
                    console.log(err.message);
                }
            });

    }, [])

    function rollover() {
        setShow(!show);
    }

    const kanye = show ? (
        <div>
            <img alt="" src={Kanye2} onMouseEnter={rollover} onMouseOut={rollover} />
            <br />
            <em>"{data.quote}"</em>
        </div>
    ) : <div>
            <img alt="" src={Kanye1} onMouseEnter={rollover} onMouseOut={rollover} />

        </div>


    const toShow = data ? (
        <div>
            <p>Reference: https://api.kanye.rest/</p>
            <h3>Hover mouse over Kanye, to hear his wisdom</h3>
            {kanye}
        </div>
    ) : "Loading..."

    return (
        <div>
            <h2>Data from extern server</h2>
            {toShow}
        </div>
    )
}


function NoMatch() {
    let location = useLocation();
    return (
        <div>
            <h3>No match for
                <code>{
                    location.pathname
                }</code>
            </h3>
        </div>
    )
}

export default App;
