import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from "../context/AuthContext";
import { FiUserPlus, FiUserCheck } from "react-icons/fi";
const Log = () => {
  let { afterAuth } = useContext(AuthContext);
  let [createNew, setCreateNew] = useState(false); //to indicate signup
  let [email, setEmail] = useState("");
  let [pass, setPass] = useState("");
  let [confirmPass, setConfirmPass] = useState("");
  let [collegeID, setCollegeID] = useState("");
  let [clgDetails, setClgDetails] = useState(false);
  let [clgName, setClgName] = useState("");
  let [clgAddr, setClgAddr] = useState("");
  let [error, setError] = useState("");
  let [type, setType] = useState("student");
  let [vEmail, setvEmail] = useState(false);
  let [vPass, setvPass] = useState(false);
  let [samepass, setsamePass] = useState(false);
  let [ok, setOk] = useState(false);

  let checkEmail = () => {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      setvEmail(true)
    } else {
      setvEmail(false)
    }
  };

  let checkPassword = () => {
    if (/^[A-Za-z0-9]\w{7,}$/.test(pass)) {
      setvPass(true);
    } else {
      setvPass(false)
    }
  };

  let checkConfirmPassword = () => {
    if (pass == confirmPass) {
      setsamePass(true)
    } else {
      setsamePass(false)
    }
  };

  let signUp = () => {
    axios.post('/api/college/register/', { email, pass }).then(res => {
      console.log(res.data, res)
    }).catch(err => {
      console.log("caught", err)
    })
  }

  let signIn = () => {
    axios.post('/api/college/login/', { email, pass }).then(res => {
      console.log(res.data, res.statusText, res.status)
    })
  }

  let checkCID = () => {
    axios.get(`/api/auth/${collegeID}/`).then(res => {
      console.log(res.data, res.data.error, res.data.name)
      if (res.data.name != undefined && res.data.error == undefined) {
        setClgName(res.data.name);
        setClgAddr(`${res.data.city}, ${res.data.state}`)
      }
    })
  }

  useEffect(() => {
    checkEmail();
    checkPassword();
    checkConfirmPassword();
  }, [email, pass, confirmPass, createNew])

  useEffect(() => {
    if (!createNew) {
      if (vEmail && vPass) {
        document.getElementById("log").className = "enabled";
        setOk(true)
      } else {
        document.getElementById("log").className = "disabled";
        setOk(false)
      }
    } else {
      if (type == "student") {
        if (vEmail && vPass && samepass && createNew) {
          document.getElementById("reg").className = "enabled";
          setOk(true)
        } else {
          document.getElementById("reg").className = "disabled";
          setOk(false)
        }
      } else if (type == "college") {
        if (vEmail && vPass && samepass && createNew && clgAddr != "" && clgName != "" && collegeID != "") {
          document.getElementById("reg").className = "enabled";
          setOk(true)
        } else {
          document.getElementById("reg").className = "disabled";
          setOk(false)
        }
      }
    }
  }, [vEmail, vPass, samepass, createNew, collegeID, clgName, clgAddr]);

  useEffect(() => { console.log(type) }, [type])

  return (
    <div>
      <center>
        <br />
        <br />
        <div className="blueCard" id="loginForm">
          <div className="fl-row">
            {createNew ? (<h3>Create New Account</h3>) : (<h3>Login to your account</h3>)}
            <div className="fl">
              <center>
                {createNew ? (<FiUserPlus className="fl-ico" />) : (<FiUserCheck className="fl-ico" />)}
              </center>
            </div>
          </div>
          <h4>Email <span>- Provide a Valid Email</span></h4>
          <input type="text" onChange={e => setEmail(e.target.value)} />
          <h4>Password <span>- Minimum of 8 Characters</span></h4>
          <input type="text" onChange={e => setPass(e.target.value)} />
          {createNew ? (
            <div>
              <h4>Confirm Password  <span> - Passwords must matching</span></h4>
              <input type="text" onChange={e => setConfirmPass(e.target.value)} />
            </div>
          ) :
            (<span></span>)}
          {createNew && type == "college" ?
            (
              <div>
                <h4>College ID <span> - Eg., C-XYZ</span></h4>
                <input type="text" value={collegeID} onChange={e => setCollegeID(e.target.value)} />
                {clgAddr != "" && clgName != "" ? (
                  <div>
                    <h4>College Address </h4>
                    <input type="text" value={clgName} onChange={e => setClgName(e.target.value)} />
                    <h4>College Location </h4>
                    <input type="text" value={clgAddr} onChange={e => setClgAddr(e.target.value)} />
                    <center>
                      <button onClick={() => { setClgName(""); setCollegeID(""); setClgAddr("") }} style={{ background: "#fff", marginTop: "15px" }}><div><h3 style={{ color: "#142850" }}>Not this College ?</h3><FiUserCheck size="25px" color="#142850" /></div></button>
                    </center>
                  </div>
                ) : (
                    <center>
                      <button onClick={() => { checkCID() }} style={{ background: "#fff", marginTop: "15px" }}><div><h3 style={{ color: "#142850" }}>Fetch Details</h3><FiUserCheck size="25px" color="#142850" /></div></button>
                    </center>
                  )}
              </div>
            ) : (<span></span>)}
          <br />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-start" }}>
            <h3 style={{ color: "#fff" }}>Im a </h3>
            <div style={{ marginLeft: "10px" }}>
              <select onChange={e => setType(e.target.value)} value={type}>
                <option value="student">Student</option>
                <option value="college">College Admin</option>
              </select>
            </div>
          </div>
          <center>
            <br />
            {createNew ?
              (
                <button
                  id="reg"
                  className="disabled"
                  onClick={() => {
                    if (ok) {
                      signUp()
                    }
                  }}>
                  <div> <h3>Get set go..</h3><FiUserPlus size="25px" /></div>
                </button>
              ) : (
                <button
                  id="log"
                  className="disabled"
                  onClick={() => {
                    if (ok) {
                      signIn()
                    }
                  }}>
                  <div> <h3>Let me in..</h3><FiUserCheck size="25px" /></div>
                </button>)
            }
            <br />
            {createNew ?
              (<button onClick={() => { setCreateNew(false) }}><div> <h3>Already Having ?</h3><FiUserCheck size="25px" /></div></button>)
              :
              (<button onClick={() => { setCreateNew(true) }}><div> <h3>Create New...</h3><FiUserPlus size="25px" /></div></button>)
            }
          </center>

        </div>
      </center>
    </div>
  );
}

export default Log;
