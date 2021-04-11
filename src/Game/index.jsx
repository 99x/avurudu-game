import React, { Children, useEffect, useRef, useState } from 'react'
import data from './data';
import { useHistory } from "react-router";
import fire from '../fire';
import '../StyleSheets/Index.css'

function Index() {
    const history = useHistory();
    const  canvasRef = useRef(null);
    const [playerData, setPlayerData] = useState();
    const [localStorageData, setLocalStorageData] = useState();
    let elephentRun =  true
    let leftSpace = 0 
    let  time = 3 
    let gameStarted =  false;
    let u_data;
    let t = false
    let playerslist = [];

    let guess_x = 0; let guess_y = 0;

    const [gameCompleted, setGameCompleted] = useState(false)

    let actual_x;

    let canvas;
    let ctx;
    
    useEffect(()=>{
        u_data =  JSON.parse( localStorage.getItem('userData') ) 
        if(  u_data && u_data.started ){
            setGameCompleted( u_data.started )
            elephentRun = false
        } 
        if(  u_data === null ) {
            history.push({ pathname: "/" }) 
        }
        canvas = canvasRef.current;
        ctx = canvas.getContext("2d");
        render() 
    },[])

    let { elephantObj } = data;
    let x = elephantObj.x;
    let y = elephantObj.y;
    let direction = elephantObj.direction;
    let image = elephantObj.image;
    image.src = "https://res.cloudinary.com/dj8a0phpt/image/upload/v1617297689/99x%20awurudu%20game/ijhhtncmu8xvtxwqhubg.png"; 

    const render = ( ) => { 
        if(elephentRun){ 
            if(t == false){ 
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(image, x, y , 200,200);
            }
             
            if ( direction === 'leftToRight' ) {
                x += 8;
                if(x === canvas.width-200){
                    direction = "rightToLeft";
                }
            }else{
                x -= 8;
                if(x === 0){
                    direction = 'leftToRight';
                }
            }
            requestAnimationFrame(render);  
        }else {
            if( direction === 'leftToRight' ){
                actual_x =  x + leftSpace + 147 +26
                console.log(x + leftSpace + 147 +26  , y) // 8 -> 18 | 15 -> 11 |  20 -> 6
            }else{
                actual_x =  x + leftSpace + 147+ 28
                console.log(x + leftSpace + 147+ 28 , y)  // 8 -> 8 | 15 -> 14 | 20 -> 19    
            }
            
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(image, x, y , 200,200)
            
            setTimeout(()=>{
                console.log(guess_x, guess_y)
                ctx.arc(guess_x, guess_y, 6, 0, Math.PI * 2);
                ctx.fillStyle = "black";
                ctx.fill();
            },500)
             
            console.log(direction)
        }
    }; 

    const getPlayerData = async (email) =>{
        const ref = fire.database().ref();
        const res = await ref.child(`/players/`).orderByChild('email').equalTo(email).once("value", function(snapshot) {
            snapshot.forEach(function(data) {
                console.log(`${data.val()} HI`);
                setPlayerData({...data.val(), id: data.key});
            });
        })
        return res;
    }

    const calculateScore = async (guessPoint) =>{
        let score = 800 - Math.abs(actual_x - guessPoint);
        alert( score );
        let userData = localStorage.getItem("userData");
        const obj = JSON.parse(userData);
        obj.score = score;
        // check if user already played (check if user's email exist in db)
        // const res = await getPlayerData(obj.email);
        const ref = fire.database().ref();
        let pData = undefined;
        console.log('start fetch');
        const res = await ref.child(`/players/`).orderByChild('email').equalTo(obj.email).once("value", function(snapshot) {
            snapshot.forEach(function(data) {
                console.log(`${data.val()} HI`);
                pData = {...data.val(), id: data.key}
            });
        })
        console.log('end fetch', res);
        if (pData) {
            
            // already played
            if (obj.score > pData.score) {
                // update the DB
                console.log('updating score', pData.score);
                console.log('new score', obj.score);
                updateScore(obj, pData.id);
            }
        } else {
            // new player
            // update the DB
            addDataToFirebase(obj);
        }
    }

    const addDataToFirebase = (object) => {
        let child = fire.database().ref(`/players/`).push();
        // set() overwrites data at the specified location, including any child nodes.
        fire.database().ref(`/players/${child.key}/`).set(object);
    }
    const updateScore = (object, key) => {
        // fire.database().ref.child(`/players/${key}/score`).setValue(object.score);

        fire.database().ref(`/players/${key}`).set(object);
    }
    

    const getClickingCodinates = (e) =>{ 
          if(gameStarted){
            const canvas = canvasRef.current;
            var rect = canvas.getBoundingClientRect();
            guess_x = e.clientX - rect.left - 7 ;
            guess_y =  e.clientY - rect.top  ;

            setGameCompleted( true )
            localStorage.setItem("userData", JSON.stringify({  ...u_data , started: true   }));
            gameStarted = false
            elephentRun =false 
            const { pageX,pageY } = e 

            console.log({ pageX,pageY })
            setTimeout(()=>{
                calculateScore(pageX)
            }, 500) 
          }

            
         
    }
    const stopEle = ()=>{  
        let plyBtn = document.getElementById("playBtn")
        plyBtn.innerHTML = "" 
        const refInterval = setInterval(()=>{
            let countDown = document.getElementById("countDown")
            time --;
            if( time === 0 ){
                countDown.innerText = "ගෙස් කරමු අලියාගේ ඇහැ තියන තැන "
                clearInterval(refInterval)  
            }else{
              countDown.innerText = `තව තප්පර   ${time}`  
            }
        }, 1000)

        setTimeout(()=>{
            gameStarted = true;
            leftSpace =  window.innerWidth / 2 - 400 
            t=true
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d"); 
            ctx.fillStyle = "yellow";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        },time * 1000)
    }

    const reloadPage = () =>{
        let userData = localStorage.getItem("userData");
        const obj = JSON.parse(userData);
        localStorage.setItem("userData", JSON.stringify({  ...obj , started: false  , completed: false  }));
        window.location.reload()
    }

    return (
        <div className="__main">  
             
            {
                gameCompleted ? (
                    <>
                        <div>
                            <div className="final__greeting">
                                <p>එහෙනම් සැමට සුභ අලුත් අවුරුද්දක් වේවා ! </p> 
                                 <p className="final__greeting__small" >  So, Then Very Happy new year for All ! </p> 
                            </div>
                        </div> 
                        
                    </>
                ) : null
            } 

            

            {
                gameCompleted ? null : (
                    <> 
                        <div>
                            <div id="countDown" className="count__down">
                                <p className="countDown___large">තප්පර 5 යි හම්බෙන්නේ එබුවට පස්සේ</p>
                                <p className="countDown__small">
                                    You get 5 seconds after click the button | ஆரம்பித்த பின் உங்களுக்கு 5 நொடிகள் உண்டு 
                                </p>
                            </div> 
                        </div>
                    </>
                )
            }       
            <div className='canvas__container' >
                <canvas onClick={(e)=>{getClickingCodinates(e)}} className="canvas" ref={canvasRef} id="canvas" height="200" width="800" />
            </div>
            {
                gameCompleted ? null : (
                    <>
                        <div id="playBtn" >
                            <button type="button" className="play__now__btn" onClick={ ()=>stopEle() }  > 
                                <p className="play__now__btn__sinhala"> ඔබල පටන් ගමු </p>
                                <p className="play__now__btn_english" >Click to play | ஆரம்பிக்கலாமா</p>
                            </button>
                        </div>
                    </>
                )
            }
            {
                gameCompleted ? (
                    <>
                        <div  >
                            <button type="button" className="play__now__btn" onClick={ ()=>reloadPage() }  > 
                                <p className="play__now__btn__sinhala">අයෙ සෙල්ලම් කරමු ද  ?</p>
                                <p className="play__now__btn_english" >Let's play again ?</p>
                            </button>
                        </div>
                    </>
                ) : null
            }
        </div>
    )
}

export default Index;