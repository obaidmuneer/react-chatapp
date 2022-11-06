import { useState, useEffect } from 'react';
import io from 'socket.io-client'
import './App.css';
import Chats from './components/chats';

const socket = io('http://localhost:8080');

function App() {
  const [name, setName] = useState('')
  const [msgs, setMsgs] = useState('')
  const [flag, setFlag] = useState(false)

  const deleteMsgs = () => {
    socket.emit('delete-msgs')
  }

  useEffect(() => {
    socket.on('connect', () => {
      console.log(socket.id);
    })
    socket.on('msgs', (msgs) => {
      console.log(msgs);
      setMsgs(msgs)
    })
    return () => {
      socket.off('connect');
      socket.off('msgs');
    };
  }, [])

  const joinChat = (e) => {
    e.preventDefault()
    if (name && name != 'bot') {
      setFlag(true)
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <h3>Realtime Chat App {flag && <button onClick={deleteMsgs} >Delete</button>} </h3>

        {flag ? <Chats socket={socket} name={name} msgs={msgs} /> : <div>
          <form onSubmit={joinChat}>
            <input type="text" placeholder='Enter your name' onChange={(e) => setName(e.target.value)} value={name} />
            <button type="submit">Join Chat</button>
          </form>
        </div>}

      </header>
    </div>
  );
}

export default App;
