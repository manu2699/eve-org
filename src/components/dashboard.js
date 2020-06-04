import React, { useEffect, useState } from 'react';
import axios from 'axios';
import QrReader from 'react-qr-reader'

const Dashboard = () => {
  let [state, setState] = useState("")


  let handleScan = data => {
    if (data) {
      setState(data)
    }
  }

  let handleError = err => {
    console.error(err)
  }

  useEffect(() => {
  }, [])

  return (
    <center>
      <QrReader
        className="qr"
        delay={300}
        onError={handleError()}
        onScan={handleScan()}
        facingMode='environment'
        // legacyMode={true}
        style={{ width: '50%', color: "#142850" }}
      />
      {state}
    </center>
  );
}

export default Dashboard;
