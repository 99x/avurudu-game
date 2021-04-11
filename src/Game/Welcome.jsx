import React, { useState, useEffect } from 'react' 

import { useHistory } from "react-router";

import './../StyleSheets/Welcome.css'
import { TextField } from '@material-ui/core'

import fire from '../fire'


function Welcome() {
    const history = useHistory(); 
    const [ name, setName ] = useState(null)
    const [ email, setEmail ] = useState(null)
    const [ userData, setUserData ] = useState(null)

    useEffect(() => {
        let res = JSON.parse( localStorage.getItem('userData') ) 
        console.log(res)
        setUserData( res ) 
        if( res &&  res.completed=== false ){ 
            history.push({ pathname: "/game" }) 
        }    
    }, [])
    
    const getPlayerData = async (email) =>{
            const ref = fire.database().ref();
            let _data ;
            const res = await ref.child(`/players/`).orderByChild('email').equalTo(email).once("value", function(snapshot) {
                snapshot.forEach(function(data) {
                    _data = data.val() ; 
                });
            })
            return _data;
        }

    let toGame = async () =>{   
        const data = await getPlayerData(email)
        console.log(data)
        if( data ){
         localStorage.setItem("userData", JSON.stringify({  name , email , completed: false , highestScore: data.score , lastScore : 0  }));   
         if( data.name != name ) {

         }
        }else{
            localStorage.setItem("userData", JSON.stringify({  name , email , completed: false , highestScore: 0 , lastScore : 0  })); 
        }
        
        history.push({ pathname: "/game" }) 
    }

    return (
        <div className="main">
            <div className="welcome__greeting">
                <p className="welcome__greeting__sinhala" >සාදරයෙන් පිලිගන්නවා ඩිජිටල් අලියට ඇහැ තැබීමේ තරගයට  </p>
                <p className="welcome__greeting__english" >Welcome to Digital Aliyata Aha thabiima  </p>
                <p className="welcome__greeting__tamil" >டிஜிட்டல் அலியாட அஹ தபீமக்கு  வரவேட்கிறோம் </p>
            </div> 
            <div className="input__container">
                <TextField className="inputs"
                    onChange={(e)=>setName(e.target.value)}
                    required
                    id="outlined-required"
                    label="Your name"
                    variant="outlined"
                /> 
            </div>
            <div className="input__container">
                <TextField className="inputs"
                    onChange={(e)=>setEmail(e.target.value)}
                    required
                    id="outlined-required"
                    label="Your office email"
                    variant="outlined"
                />
            </div>
            <div>
            { (name && name.length > 0 &&  email && email.length > 0 ) ? ( 
                    <button type="button" className="play__now__btn" onClick={()=>{ toGame() }} > 
                        <p className="play__now__btn__sinhala">එහෙනම් පටාන් ගමු </p>
                        <p className="play__now__btn_english" >Let's play | விளையாடுவோம் </p>
                    </button>
                ) : null}
            </div> 

        </div>
    )
}

export default Welcome
