import React, { useState, useEffect } from 'react' 

import { useHistory } from "react-router";

import './../StyleSheets/Welcome.css'
import { TextField } from '@material-ui/core'


function Welcome() {
    const history = useHistory(); 
    const [ name, setName ] = useState(null)
    const [ email, setEmail ] = useState(null)
    const [ userData, setUserData ] = useState(null)

    useEffect(() => {
        let res = JSON.parse( localStorage.getItem('userData') ) 
        console.log(res)
        setUserData( res ) 
        if( res &&  res.played=== false ){
            console.log("LLL")
            history.push({ pathname: "/game" }) 
        }    
    }, [])  

    let toGame = () =>{   
        localStorage.setItem("userData", JSON.stringify({  name , email , played: false   }));
        history.push({ pathname: "/game" }) 
    }

    return (
        <div className="main">
            <div>
                <h4>Welcome page</h4>
            </div>
            {
               (userData &&  userData.played=== true )  ? null :  (
                    <div>
                    <TextField
                        onChange={(e)=>setName(e.target.value)}
                        required
                        id="outlined-required"
                        label="Your name"
                        variant="outlined"
                    /> 
                    <TextField
                        onChange={(e)=>setEmail(e.target.value)}
                        required
                        id="outlined-required"
                        label="Your Email"
                        variant="outlined"
                    />
                    <div>
                        { (name && name.length > 0 &&  email && email.length > 0 ) ? ( <button onClick={()=>{ toGame() }} className="start__button">Go to Game</button> ) : null}
                    </div> 
                </div>
                )
            }  
        </div>
    )
}

export default Welcome
