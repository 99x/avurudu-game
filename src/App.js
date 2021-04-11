import './App.css';
import Index from './Game/index.jsx'
import Welcome from './Game/Welcome.jsx'
import Header from './Game/Header.jsx'
import Scorecard from './Game/Scorecard';
import About from './Game/About';
import Container from '@material-ui/core/Container';

import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'


function App() {

  const isLogin = () => {
    return true
  }

  return (    
    <> 
        <div >
          <Router>
            <Header />
            <div className="left__border" > </div>
            <div className="App" >
            <Container maxWidth={ "xl" }>
                <Switch>
                  <Route exact path="/" component={ Welcome } />
                  <Route path="/game"  component={ () => isLogin() ?  <Index /> :<Welcome /> } />
                  <Route exact path="/score" component={ Scorecard } />
                  <Route exact path="/about" component={ About } />
                </Switch>
              </Container>
            </div>
          <div className="right__border" > </div>
          <div className="footer" >
          </div>
          </Router>
        </div> 
    </>
  );
}

export default App;
