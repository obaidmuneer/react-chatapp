import { useState, useEffect } from 'react';


const Chats = ({ socket, name ,msgs}) => {
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState(msgs)

    useEffect(() => {
        // setMessages((messages) => [...messages, msgs])
        socket.on('recieve-msg', (msg) => {
            setMessages((messages) => [...messages, msg])
        })
        return () => {
            socket.off('recieve-msg');
        };
    }, [socket])

    const handleMsg = (e) => {
        e.preventDefault()
        socket.emit('send-msg', { message, name })
        setMessage('')
    }

    return (
        <div className='msg'>
            <div className='msg-area'>
                {messages.map((msg, index) => {
                    return (
                        <div className={msg.name === name ? 'sender msg-box ':'reciever msg-box'} key={index}>{msg.message} <p className='name'>{msg.name}</p> </div>
                    )
                })}
            </div>
            <div className='msg_form'>
                <form onSubmit={handleMsg}>
                    <input className='msg_input' type="text" onChange={(e) => setMessage(e.target.value)} value={message} />
                    <button className='msg-btn' type="submit">Send msg</button>
                </form>
            </div>
        </div>
    )
}

export default Chats