import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import '../StyleSheets/About.css'

const useStyles = makeStyles((theme) => ({
  root: { 
    marginLeft:'100px',
    marginRight:'100px',
    paddingTop:'65px'
  },
  paper: {
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
    marginInline:'20px',
    height:'55vh'
  },
}));

export default function About() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container spacing={0}>
        <Grid item xs={6}>
          <Paper className={classes.paper}>
            <div className="rule__topic">
                <p>Rules for the Game</p>
            </div>
            <div className='rules'>
                <ul>
                    <li>When you click <strong>'play'</strong> , a countdown will begin, and the elephant will begin to move</li>
                    <li>Once the countdown is over, the elephant will be hidden,  but it will <strong>continue to move around the game area</strong>.</li>
                    <li>You have to  <strong>guess</strong>  where the elephant is and click on its eye!</li>
                    <li>Depending on how close to the eye you click, you'll get a score.</li>
                    <li>Try to score as high as possible and beat your friends!</li>
                    <li>Good luck! Have fun!</li>
                </ul>
            </div> 
          </Paper>
        </Grid>
        <Grid item xs={6}>  
            <Paper className={classes.paper}>
            <div className="about__topic">
                <p>About</p>
            </div>
            <div className='about'>
                <ul>
                    <li>This game is inspired by the classic game played in <strong>Sinhala and Tamil New Year festivals</strong>.</li>
                    <li>Created with <strong>ReactJS</strong>. Hosted on <strong>Heroku</strong>.</li>
                    <li>Code is available at <a href="https://github.com/DhFernando/99x-awurudu-Game"> https://github.com/DhFernando/99x-awurudu-Game </a>.</li>
                    <li> <strong>Pull requests are always welcome</strong>. Pick an issue and help us out to make this game awesome!</li>
                    <li>Created with by <strong><a href="https://github.com/DhFernando">@dilshan</a></strong> , <strong><a href="https://github.com/ThanoshanMV">@thanoshan</a></strong> , <strong><a href="https://github.com/bihanviranga">@bihan</a></strong> . (github profile links).</li>
                    <li>Thank you for playing!.</li>
                </ul>
            </div>  
            </Paper>
        </Grid>
        {/* <Grid item xs={12}>
           <div>
                Button
           </div>
        </Grid> */}
      </Grid>
    </div>
  );
}
