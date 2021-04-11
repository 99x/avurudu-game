import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    color:"black"
  },
}));

export default function Header() {

  const [user, setUser] = useState(null)
 
  useEffect(() => {
    const getUser =  setInterval(()=>{
      if( localStorage.getItem('userData')){
        setUser( JSON.parse(localStorage.getItem('userData')) )
        clearInterval(getUser) 
      }
    },1000)
  }, [ user ])

  const classes = useStyles();
  const history = useHistory(); 

  const gotoHome = () =>{
    if(JSON.parse(localStorage.getItem('userData')) && JSON.parse(localStorage.getItem('userData')).completed){
      history.push({ pathname: "/" })
    } else{
      history.push({ pathname: "/game" })
    }
    
  } 
  const gotoScorecard = () => history.push({ pathname: "/score" })
  const gotoAbout = () => history.push({ pathname: "/about" })

  return (
    <div className={classes.root}>
      <AppBar  position="static" style={{ background: '#ffea00', height:"15vh", padding: "25px" }}>
        <Toolbar variant="dense">
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title} onClick={()=>gotoHome()}  >
              <strong>99x  අවුරුදු Game | අලියට ඇහැ තැබීම | அலியாட அஹ தபீம  </strong>
          </Typography> 
          {user ? (
            <div style={{ borderRight: '1px solid gray', marginInline: '10px', paddingRight: "10px", textAlign:"center" }}>
              <p style={{ borderBottom : '1px solid gray', }} > Hi <strong>{user.name}</strong>  </p>
              <p style={{ color:"black" }} >
               Your HS : <strong>{user.highestScore}</strong> | Last Score : <strong>{user.lastScore}</strong>
              </p>
            </div>
          ) : null}
          <Button style={{ marginRight:'10px'}} onClick={ ()=>gotoScorecard() } variant="contained" color="secondary"><span style={{ textDecoration: 'none', color: 'white', fontWeight: '600' }}>Scorecard</span></Button>
          <Button onClick={ ()=>gotoAbout() } variant="contained" color="secondary"><span style={{ textDecoration: 'none', color: 'white', fontWeight: '600' }}>About</span></Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}
