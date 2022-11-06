import { useState, useEffect, useRef } from 'react';


const Chats = ({ socket, name, msgs }) => {
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState(msgs)
    const [count, setCount] = useState(9)
    const [loadedMsgs, setLoadedMsgs] = useState(messages.slice(messages.length - count, messages.length))

    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        if (messages.length > 0) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
        }
    };

    const handleMsg = (e) => {
        e.preventDefault()
        socket.emit('send-msg', { message, name })
        setMessage('')
    }

    const loadMsgs = () => {
        if ((messages.length - count) > -1) {
            setCount(count + 10)
            return setLoadedMsgs(messages.slice(messages.length - count, messages.length))
        } 
        setLoadedMsgs(messages)
    }

    useEffect(scrollToBottom, [messages]);

    useEffect(loadMsgs, []);

    useEffect(() => {
        socket.on('recieve-msg', (msg) => {
            setMessages((messages) => [...messages, msg])
            setLoadedMsgs((loadedMsgs) => [...loadedMsgs, msg])
        })
        socket.on('deleted-msg', (msg) => {
            setMessages([])
            setLoadedMsgs([])
        })
        return () => {
            socket.off('recieve-msg');
            socket.off('deleted-msg');
        };
    }, [socket])


    return (
        <div className='msg'>
            <div className='msg-area' >
                {messages.length > 9 && messages.length !== loadedMsgs.length ? <p onClick={loadMsgs}>Load more</p> : null}
                {loadedMsgs.map((msg, index) => {
                    return (
                        <div className={msg.name === name ? 'sender msg-box ' : 'reciever msg-box'} ref={messagesEndRef} key={index}>{msg.msg} <p className='name'>{msg.name}</p></div>
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