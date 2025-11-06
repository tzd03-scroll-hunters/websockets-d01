import { useRef, useState } from 'react'
import './App.css'
import { useEffect } from 'react'
import io from 'socket.io-client'

const SOCKET_URL = 'http://localhost:5000'

function App() {
  const [socket, setSocket] = useState(null)
  const [history, setHistory] = useState([])

  // hier speichern wir die referenz zum input feld
  const refMsg = useRef()

  // dieser useEffect läuft nur einmal beim Start der App
  // erstellen verbindung zu socket servcer
  useEffect(() => {
    const newSocket = io(SOCKET_URL)
    setSocket(newSocket)
  }, [])

  // wenn verbindung erstellt ist
  useEffect(() => {
    if (!socket) return

    socket.on("connect", () => {
      console.log("Connected to socket server with id:", socket.id)

      // hier kommen message vom SERVER, also von Messages von ANDEREN usern rein
      socket.on("message", (msg) => {
        console.log("Erhalte Chat Nachricht", msg)
        setHistory(historyOld => [...historyOld, "In: " + msg])
      })

      socket.on("update", (updateMsg) => {
        console.log("Erhalte Update vom Server:", updateMsg)
        // setHistory(historyOld => [...historyOld, "Update: " + updateMsg])
      })

    })
  }, [socket])


  const sendMessageToServer = () => {

    if(!refMsg.current.value) return

    // const msgNew = "Hello from client!" + Date.now()
    const msgNew = refMsg.current.value
    
    // Syntax von emit
    // erster param => der Name des Kanals im Backend
    // zweiter param => die Daten die gesendet werden
    socket.emit("message", msgNew)

    // speichere die gesendete nachricht in meiner history
    setHistory(historyOld => [...historyOld, "Sent: "+ msgNew])
  }

  return (
    <>
      <h1>Socket IO Demo</h1>
      <div className="card">
        <input ref={refMsg} style={{ padding: 10 }}  type='text' placeholder='Type a message...' />
        <button style={{ padding: 10 }} onClick={sendMessageToServer}>
          Send Message
        </button>
      </div>
      <div className="history">
        <h2>Message History</h2>
        <ul>
          {history.map((msg, index) => (
            <div key={index}>{msg}</div>
          ))}
        </ul>
      </div>
    </>
  )
}

export default App
