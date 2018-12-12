import React from 'react';
import {Router, Route, Switch, Link,NavLink} from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';
import NotFoundPage from '../components/NotFoundPage';
import CalendarPage from '../components/CalendarPage';
import Chat from '../components/Chat';
import Header from '../components/Header';
import HelpPage from '../components/HelpPage';
import InfoPage from '../components/InfoPage';
import ToDoPage from '../components/ToDoPage';
import LoginPage from '../components/LoginPage';
export const history = createHistory();


const AppRouter = () =>(
    <Router history={history}>
        <div>
            <Header />
                 <Switch>
                    <Route path="/" component={LoginPage} exact/>
                    <Route path="/info" component={InfoPage}/>
                    <Route path="/calendar" component={CalendarPage}/>
                    <Route path="/todo" component={ToDoPage}/>
                    <Route path="/chat" component={Chat}/>
                    <Route path="/help" component={HelpPage}/>
                    <Route component={NotFoundPage} />
                </Switch>
        </div>
    </Router>    
);

export default AppRouter;