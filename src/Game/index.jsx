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
    let  time = 6 
    let gameStarted =  false;
    let u_data;
    let t = false
    let playerslist = [];
    let canvas;
    let ctx;
    let guess_x = 0; let guess_y = 0;

    const [gameCompleted, setGameCompleted] = useState(false)

    let actual_x;

    const [ score, setScore ] = useState(null) 
    
    useEffect(()=>{
        u_data =  JSON.parse( localStorage.getItem('userData') ) 
        if(  u_data && u_data.completed ){
            setGameCompleted( u_data.completed )
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
                 // 8 -> 18 | 15 -> 11 |  20 -> 6
            }else{
                actual_x =  x + leftSpace + 147+ 28
                 // 8 -> 8 | 15 -> 14 | 20 -> 19    
            }
            
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(image, x, y , 200,200)
            
            setTimeout(()=>{ 
                ctx.arc(guess_x, guess_y, 6, 0, Math.PI * 2);
                ctx.fillStyle = "black";
                ctx.fill();
            },500)
             
            
        }
    }; 

    const getPlayerData = async (email) =>{
        const ref = fire.database().ref();
        const res = await ref.child(`/players/`).orderByChild('email').equalTo(email).once("value", function(snapshot) {
            snapshot.forEach(function(data) {
                setPlayerData({...data.val(), id: data.key});
            });
        })
        return res;
    }

    const calculateScore = async (guessPoint) =>{
        let score = 800 - Math.abs(actual_x - guessPoint); 

        setScore( score )
        let userData = localStorage.getItem("userData");
        const obj = JSON.parse(userData);
        obj.score = score; 
        const ref = fire.database().ref();
        let pData = undefined; 
        const res = await ref.child(`/players/`).orderByChild('email').equalTo(obj.email).once("value", function(snapshot) {
            snapshot.forEach(function(data) { 
                pData = {...data.val(), id: data.key}
            });
        }) 
        if (pData) {
            // already played
            if (obj.score > pData.score) { 
                updateScore(obj, pData.id);
                localStorage.setItem( 'userData', JSON.stringify({  ...JSON.parse( localStorage.getItem('userData') ), completed: true, highestScore :obj.score , lastScore: obj.score   })  )
            }
            localStorage.setItem( 'userData', JSON.stringify({  ...JSON.parse( localStorage.getItem('userData') ), completed: true , lastScore: obj.score   })  )
        } else {
            // new player
            // update the DB
            addDataToFirebase(obj); 
            localStorage.setItem( 'userData', JSON.stringify({  ...JSON.parse( localStorage.getItem('userData') ), completed: true, highestScore :obj.score , lastScore: obj.score   })  )
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
            guess_y =  e.clientY - rect.top - 7 ;

            setGameCompleted( true )
            gameStarted = false
            elephentRun =false 
            const { pageX,pageY } = e  
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
                countDown.innerHTML = `
                    <p style='padding-left:80px'>ගෙස් කරමු අලියාගේ ඇහැ තියන තැන</p>
                    <p style='font-size:15px'>
                        Let's guess where the elephent Eye | யானையின் கண்ணை கண்டுப்பிடிப்போம் 
                    </p>
                `
                clearInterval(refInterval)  
            }else{
              countDown.innerText = `තව තප්පර   ${time} යි `  
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
        localStorage.setItem("userData", JSON.stringify({  ...obj , completed: false  }));
        window.location.reload()
    }

    return (
        <div className="__main">  
             
            {
                gameCompleted ? (
                    <>
                        <div>
                            <div className="final__greeting">
                                <p className="final__greeting__large">එහෙනම් සැමට සුභ අලුත් අවුරුද්දක් වේවා ! </p> 
                                <p className="final__greeting__small" >  
                                    So, Then Very Happy new year for All ! | இனிய புத்தாண்டு நல்வாழ்த்துக்கள் !
                                </p> 
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