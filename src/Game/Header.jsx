import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function Header() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static" style={{ background: '#ffea00', height:"100px", padding: "25px" }}>
        <Toolbar variant="dense">
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
              <Link href='/' style={{ textDecoration: 'none', color: 'white', fontWeight: '600' }}>99x  අවුරුදු ගේම් | අලියට ඇහැ තැබීම</Link>
          </Typography>
          <Button variant="contained" color="secondary"><Link href='/score' style={{ textDecoration: 'none', color: 'white', fontWeight: '600' }}>Scorecard</Link></Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}
