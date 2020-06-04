import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BsFillInfoSquareFill } from 'react-icons/bs'
const Home = (props) => {
  const [events, SetEvents] = useState([])

  let getEvents = () => {
    axios.get('/api/getEvents/').then(res => {
      console.log(res.data)
      SetEvents(res.data)
    })
  }

  useEffect(() => {
    let ws = new WebSocket('ws://127.0.0.1:8000/ws/event/')
    // let ws = new WebSocket('wss://eve-org.herokuapp.com/ws/chat/')
    ws.onopen = () => {
      console.log('connected')
    }
    ws.onmessage = evt => {
      console.log(evt.data)
      if (evt.data == "newEvent")
        getEvents();
    }
    getEvents();
  }, [])

  return (
    <div>
      <div className="row">
        {events.map(event => {
          return (
            <div className="blueCard">
              <div className="fl-row">
                <h3>{event.EventName}</h3>
              </div>
              <center>
                <h4>on {event.EventDate}</h4>
                <h4>at {event.clgName}, {event.clgAdd}{event.clgName}, {event.clgAdd}{event.clgName}, {event.clgAdd}</h4>
                {/* <h4></h4> */}
                <div className="fl-row">
                  <button>Register.</button>
                  {" "}
                  <button>More info.</button>
                </div>
              </center>
            </div>
          )
        })}
      </div>
      <center>
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

export default Home;
