import { render } from '@testing-library/react';
import React, { useEffect } from 'react';
import { useState } from 'react';
import firebase from '../fire';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import fire from '../fire';

import './../StyleSheets/Scorecard.css'

function Scorecard(){
    const [list, setList] = useState([]);
    const [currentUser, setCurrentUser] = useState();
    useEffect(()=>{
        getCurrentUserScore()
    },[]);

    useEffect(()=>{
        firebase.database().ref().child("players").orderByChild('score').limitToLast(10).on("value", snapshot => {
            let playerlist = [];
            snapshot.forEach(snap => {
                playerlist.push(snap.val());
            });
            setList(playerlist);
          });
          
    },[]);



    const getCurrentUserScore = async () => {
        let userData = localStorage.getItem("userData");
        const obj = JSON.parse(userData);
        if (obj === null){
            setCurrentUser(undefined);
        }
        else {
            const ref = fire.database().ref();
            let currentPlayerObject;
            const res = await ref.child(`/players/`).orderByChild('email').equalTo(obj.email).once("value", function(snapshot) {
                snapshot.forEach(function(data) {
                    currentPlayerObject = data.val();
                });
            })
            setCurrentUser(currentPlayerObject)
        }
    }

    const CurrentUserRow = () => {
            return (
    
                    <tr className="currentPlayer">
                        <td>-</td>
                        <td>{currentUser.name}</td>
                        <td>{currentUser.email}</td>
                        <td>{currentUser.score}</td>
                    </tr>
            )
    }

    const GetTableRows = () => {
        if (list.length === 0) {
            return <tr><td colSpan='4' style={{ textAlign : 'center' }}>Loading...</td></tr>
        }
        let rows = [];
        let place = 1; 
        let top10User = false;
        for (let i = list.length -1; i >= 0; i-- ) {
            const data = list[i];
            let top10UserStyle = false;
            let userData = localStorage.getItem("userData");
            const obj = JSON.parse(userData);
            if (obj) {
                if (data.email === obj.email) {
                    top10User = true;
                    top10UserStyle = true;
                }
            }
            
            rows.push(
                    <tr id='data-row' key={data.email} className={top10UserStyle ? "currentPlayer" : ""}>
                        <td>{place}</td>     
                        <td>{data.name}</td>
                        <td>{data.email}</td>
                        <td>{data.score}</td>
                    </tr>
            )
            place++;
        }

        if (!top10User && currentUser) {
            rows.push(
                <CurrentUserRow />
            )
        }
        return rows;
    }

    return (
        <Container maxWidth="sm">
            <Typography variant='h4' align ='center' color='textSecondary'>
                Scorecard: The Top Ten!
            </Typography>
            <div id= 'table-wrapper' style={{height: '70vh', overflowY: 'scroll'}}>
                <table id = "players">
                    <thead>
                        <tr>
                            <th>Place</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Score</th> 
                        </tr>
                    </thead>
                    <tbody>
                    <GetTableRows />
                    </tbody>
                </table>
            </div>
        </Container>
      );
}

export default Scorecard;
