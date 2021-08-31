import React, { useCallback, useContext, useState, useEffect } from "react";
import CssBaseline from '@material-ui/core/CssBaseline';
import '../../css/Login.css';
import Button from '@material-ui/core/Button';
import VpnKeyOutlined from '@material-ui/icons/VpnKeyOutlined';
import firebase from "firebase/app";
import "firebase/auth";
import {db} from '../../config/base'
import KUTE from 'kute.js/dist/kute'
import Alert from '@material-ui/lab/Alert';

export default function Login({ history }) {
  const [currentUser, setCurrenUser] = useState(null);
  const [errorDisplay, setErrorDisplay] = useState('none');

  useEffect(() => {
    if(currentUser !== undefined && currentUser !== null){
      var data_IDs = []
      var data_Data = []
      db.collection('users')
        .get()
        .then( snapshot => {
          snapshot.forEach(doc => {
            let data = doc.data()
            data_IDs.push(doc.id)
            data_Data.push({...data, id:doc.id})
          })
          if(data_IDs.includes(currentUser.user.uid)){
            var pos = data_Data.findIndex(obj => obj['id'] === currentUser.user.uid)
            if(!['Fejlesztő', 'Oktató'].includes(data_Data[pos].title)){
              firebase.auth().signOut();
              history.push("/login");
              setErrorDisplay('inherit')
            }else{
              history.push("/");
            }
          }else{
            firebase.auth().signOut();
            history.push("/login");
            setErrorDisplay('inherit')
          }
        })
        .catch( error => console.log(error))
    }
  }, [currentUser]);
  useEffect(() => {
    const tween = KUTE.fromTo(
      '#blob1',
      {path: '#blob1'},
      {path: '#blob2'},
      {repeat: 999, duration: 3000, yoyo: true}
    )
    tween.start()
  },[])
  const handleLogin = useCallback(
   
    async event => {
      event.preventDefault();
      const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
      try {
        await firebase.auth()
        .signInWithPopup(googleAuthProvider).then((result) =>{
          setCurrenUser(result)
        })
      } catch (error) {
        console.log(error)
      }
    },
    [history]
  );
  return (
    <React.Fragment>
      <CssBaseline />
      <div className="main-container">
        <div className="centered-box">
        <div className="layer spacer flip totop"></div>
          <svg 
            id="visual" 
            viewBox="0 0 450 900" 
            width="100%" 
            height="100vh" 
            version="1.1"
            className="blob-motion"
            >
            <g 
              transform="translate(226.58677843153959 445.7563885244432)">
              <path 
                id="blob1"
                d="M155.5 -272.6C205.3 -240.5 252 -206.5 276.3 -160.8C300.5 -115 302.3 -57.5 287 -8.8C271.7 39.8 239.3 79.7 210.1 116.8C180.8 153.9 154.7 188.2 120.2 233.9C85.7 279.6 42.8 336.7 4.8 328.3C-33.2 319.9 -66.3 246.1 -87.6 192.8C-109 139.5 -118.4 106.7 -159.5 77.9C-200.6 49.2 -273.3 24.6 -293.7 -11.8C-314.1 -48.2 -282.2 -96.3 -238.6 -120.7C-195 -145.1 -139.8 -145.7 -98 -182.5C-56.3 -219.2 -28.2 -292.1 12.3 -313.5C52.8 -334.8 105.7 -304.7 155.5 -272.6" 
                fill="#1c2442">
              </path>
            </g>
            <g 
              style={{visibility: "hidden"}}
              transform="translate(247.48610215162435 471.69067936423977)"
            >
              <path 
                id="blob2"
                d="M149 -282.4C170.3 -245.7 149.1 -159.8 152.3 -104.5C155.6 -49.2 183.3 -24.6 205.4 12.8C227.6 50.2 244.1 100.3 239 152.4C233.9 204.5 207.2 258.6 163.8 261.3C120.3 264.1 60.2 215.5 3.6 209.3C-53 203.1 -106 239.3 -161.7 243.6C-217.4 247.9 -275.9 220.5 -283.9 174.6C-291.9 128.7 -249.4 64.3 -250.5 -0.6C-251.7 -65.6 -296.3 -131.3 -275.2 -154.3C-254 -177.4 -167 -158 -110.2 -174.2C-53.3 -190.4 -26.7 -242.2 18.6 -274.4C63.8 -306.6 127.7 -319.1 149 -282.4" 
                fill="#1c2442">
              </path>
            </g>
          </svg>
          <div className="title">SZEMA-BETA</div>
          <div className="secondary-title">Bejelentkezés</div>
          <Button
            style={{zIndex : "3"}}
            variant="contained"
            color="default"
            startIcon={<VpnKeyOutlined />}
            onClick={handleLogin}
          >
            <div className="google-button">Tovább Google fiókkal</div>
          </Button>
          <Alert severity="error" style={{zIndex : "3", display: errorDisplay, marginTop: "10vh", backgroundColor:"rgb(24, 6, 5)", color: "#FAB3AE", maxWidth: "80%"}} onClose={(event) => {setErrorDisplay('none')}}>
            Nem rendelkezik az adatbázisban rögzített felhasználói fiókkal és/vagy megfelelő jogosultsággal.
            Próbálkozzon másik email címmel, vagy lépjen kapcsolatba az adminisztrátorral.
          </Alert>
          <div className="spacer layer tobottom"></div>
        </div>
      </div>
    </React.Fragment>
  );
}
