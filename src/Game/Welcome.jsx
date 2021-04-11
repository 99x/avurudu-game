import React, { useState, useEffect } from 'react' 

import { useHistory } from "react-router";

import './../StyleSheets/Welcome.css'
import { TextField } from '@material-ui/core'

import fire from '../fire'


function Welcome() {
    const history = useHistory(); 
    const [ name, setName ] = useState(null)
    const [ email, setEmail ] = useState('')
    const [ userData, setUserData ] = useState(null)

    const [veryfiedEmail, setVeryfiedEmail] = useState(true)

    useEffect(() => {
        let res = JSON.parse( localStorage.getItem('userData') )  
        setUserData( res ) 
        if( res &&  res.completed=== false ){ 
            history.push({ pathname: "/game" }) 
        }    
    }, [])

    useEffect(()=>{
        if(email.indexOf('@99x.io') === -1){
            setVeryfiedEmail(false)
        }else{
            setVeryfiedEmail(true)
        }
    },[email])
    
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
        if( data ){
         localStorage.setItem("userData", JSON.stringify({  name , email , completed: false , highestScore: data.score , lastScore : 0  }));   
        }else{
            localStorage.setItem("userData", JSON.stringify({  name , email , completed: false , highestScore: 0 , lastScore : 0  })); 
        }
        history.push({ pathname: "/game" }) 
    }

    const cleanAll = () => {    
        localStorage.removeItem('userData')
        window.location.reload()
    }

    return (
        <div className="main">
            <div className="welcome__greeting">
                <p className="welcome__greeting__sinhala" >සාදරයෙන් පිලිගන්නවා ඩිජිටල් අලියට ඇහැ තැබීමේ තරගයට  </p>
                <p className="welcome__greeting__english" >Welcome to Digital Aliyata Aha thabiima  </p>
                <p className="welcome__greeting__tamil" >டிஜிட்டல் அலியாட அஹ தபீமக்கு  வரவேட்கிறோம் </p>
            </div> 
            {
                localStorage.getItem('userData') ? (<>
                    <div>
                    <button type="button" className="play__now__btn" onClick={()=> history.push({ pathname: "/game" }) } > 
                        <p className="play__now__btn__sinhala">ආයේ සෙල්ලම් කරමු</p>
                        <p className="play__now__btn_english" >Let's play again | விளையாடுவோம் </p>
                    </button>
                    <button type="button" className="play__now__btn" onClick={()=>{ cleanAll() }} > 
                        <p className="play__now__btn__sinhala">වෙන ක්‍රීඩකයෙක්</p>
                        <p className="play__now__btn_english" >New player | புதிய வீரர் </p>
                    </button>
                    </div>
                </>) : (
                    <>
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
                            { !veryfiedEmail ? <small style={{ color:'red', fontWeight:'700' }}>please enter valid company email</small> : null }
                        </div>
                    </>
                )  
            }
            
            <div>
            { (name && name.length > 0 &&  veryfiedEmail ) ? ( 
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
