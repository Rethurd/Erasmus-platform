import React from 'react';
import {Router, Route, Switch, Link,NavLink} from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';
import NotFoundPage from '../components/NotFoundPage';
import CalendarPage from '../components/CalendarPage';
import Chat from '../components/Chat';
import Header from '../components/Header';
import Footer from '../components/Footer';
import HelpPage from '../components/HelpPage';
import InfoPage from '../components/InfoPage';
import ToDoPage from '../components/ToDoPage';
import LoginPage from '../components/LoginPage';
import FriendsPage from '../components/FriendsPage';
import PublicRoute from './PublicRoute';
import PrivateRoute from './PrivateRoute';
export const history = createHistory();


const AppRouter = () =>(
    <Router history={history}>
        <div className="appContainer">
            <Header />
                 <Switch >
                    <PublicRoute path="/" component={LoginPage} exact/>
                    <PrivateRoute path="/info" component={InfoPage}/>
                    <PrivateRoute path="/calendar" component={CalendarPage}/>
                    <PrivateRoute path="/todo" component={ToDoPage}/>
                    <PrivateRoute path="/chat" component={Chat}/>
                    <PrivateRoute path="/help" component={HelpPage}/>
                    <PrivateRoute path="/friends" component={FriendsPage}/>
                    <Route component={NotFoundPage} />
                </Switch>
            <Footer />
        </div>
    </Router>    
);

export default AppRouter;