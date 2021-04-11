import { render } from '@testing-library/react';
import React, { useEffect } from 'react';
import { useState } from 'react';
import firebase from '../fire';
import Container from '@material-ui/core/Container';

import './../StyleSheets/Scorecard.css'

function Scorecard(){
    const [list, setList] = useState([]);
    useEffect(()=>{
        firebase.database().ref().child("players").orderByChild('score').on("value", snapshot => {
            let playerlist = [];
            snapshot.forEach(snap => {
                playerlist.push(snap.val());
            });
            
            setList(playerlist);
          });
    },[]);

    const GetTableRows = () => {
        if (list.length === 0) {
            return <tr><td colSpan='4' style={{ textAlign : 'center' }}>Loading...</td></tr>
        }
        let rows = [];
        let place = 1; 
        for (let i = list.length -1; i >= 0; i-- ) {
            const data = list[i];
            console.log('data', data);
            rows.push(
                    <tr key={data.email}>
                        <td>{place}</td>     
                        <td>{data.name}</td>
                        <td>{data.email}</td>
                        <td>{data.score}</td>
                    </tr>
            )
            place++;
        }
        console.log(rows);
        return rows;
    }

    return (
        <Container maxWidth="sm">
            <div>
                <h3>Scorecard</h3>
            </div>
            <div>
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
