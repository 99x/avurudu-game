import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
}));

export default function Header() {
  const classes = useStyles();
  const history = useHistory(); 

  const gotoHome = () => history.push({ pathname: "/" }) 

  return (
    <div className={classes.root}>
      <AppBar position="static" style={{ background: '#ffea00', height:"100px", padding: "25px" }}>
        <Toolbar variant="dense">
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" onClick={()=>gotoHome()}  >
              <strong>99x  අවුරුදු Game | අලියට ඇහැ තැබීම | அலியாட அஹ தபீம  </strong>
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
}
