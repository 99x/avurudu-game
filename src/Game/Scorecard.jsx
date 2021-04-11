import { render } from '@testing-library/react';
import React, { useEffect } from 'react';
import { useState } from 'react';
import firebase from '../fire';

import './../StyleSheets/Scorecard.css'

function Scorecard(){
    const [list, setList] = useState({playerslist : []});
    useEffect(()=>{
        firebase.database().ref("players").on("value", snapshot => {
            let playerlist = [];
            snapshot.forEach(snap => {
                playerlist.push(snap.val());
            });
            setList({ playerslist: playerlist });
          });
    },[]);

    return (
        <div>
          <div>
              <h3>Scorecard</h3>
          </div>
          <div>
          <table id = "players">
            <thead>
                <tr>
                    <th>Email</th>
                    <th>Name</th>
                    <th>Score</th>
                </tr>
            </thead>
            <tbody>
            {list["playerslist"].map(data => {
                return (
                    <tr key="{data}">     
                    <td>{data.email}</td>
                    <td>{data.name}</td>
                    <td>{data.score}</td>
                    </tr>
                );
                })}
            </tbody>
         </table>
     </div>
        </div>
      );

}

export default Scorecard;
