import React, { useEffect, useState } from 'react';
import axios from 'axios';

const App = () => {
  const [events, SetEvents] = useState([])

  useEffect(() => {
    // let ws = new WebSocket('ws://127.0.0.1:8000/ws/chat/')
    let ws = new WebSocket('wss://eve-org.herokuapp.com/ws/chat/')
    ws.onopen = () => {
      console.log('connected')
    }
    ws.onmessage = evt => {
      console.log(evt)
    }
    axios.get('/api/getEvents/').then(res => {
      console.log(res.data)
      SetEvents(res.data)
    })
  }, [])

  return (
    <div className="App">
      <center>
        <h1>EveOrg</h1>
        <h5>Feasibility Test</h5>
        <table cellPadding="10px" cellSpacing="8px" style={{ textAlign: "center" }}>
          <thead>
            <tr>
              <th>Event Name</th>
              <th>Date</th>
              <th>College</th>
              <th>Address</th>
            </tr>
          </thead>
          <tbody>
            {events.map(event => {
              return (
                <tr>
                  <td>{event.EventName}</td>
                  <td>{event.EventDate}</td>
                  <td>{event.clgName}</td>
                  <td>{event.clgAdd}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </center>
    </div>
  );
}

export default App;
