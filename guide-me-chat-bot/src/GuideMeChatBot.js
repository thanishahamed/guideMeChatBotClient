import React from 'react';
import { useRef, useState } from 'react';
import './guide-me-style.css'

const GuideMeChatBot = ({ token = 'default', onResponse = (data) => {}, server = "http://localhost:3000", isAdmin = true }) => {
    const [chats, setChats] = useState([]);
    const [currentChat, setCurrentChat] = useState({});
    const [response, setResponse] = useState({});
    const [trainingMode, setTrainingMode] = useState(false);

    const formRef = useRef(null);
    const trainingFormRef = useRef(null);

    const submitChat = async (event) => {
        event.preventDefault();
        const msg = event.target['chat-input'].value;

        setCurrentChat({
            sent: {
                message: msg,
                time: getTimeIn12HourFormat(new Date())
            },
            received: {
                message: 'typing...',
                time: ''
            }
        })

        setTimeout(() => processReponse(msg), 1000);

        formRef.current.reset();
    }

    const processReponse = (msg) => {
        const postData = {
            token: token,
            message: msg,
        };

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData)
        };

        const url = server + '/get';

        fetch(url, options)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                onResponse(data);
                setResponse(data);
                setCurrentChat((old) => ({
                    ...old,
                    received: {
                        message: data?.message,
                        time: getTimeIn12HourFormat(new Date())
                    }
                }));

                setChats((old) => [...old, currentChat]);
            })
            .catch(error => {
                setCurrentChat((old) => ({
                    ...old,
                    received: {
                        message: 'There was a problem with the fetch operation:',
                        time: getTimeIn12HourFormat(new Date())
                    }
                }));
            });
    }

    const getTimeIn12HourFormat = (currentTime) => {
        let hours = currentTime.getHours();
        let minutes = currentTime.getMinutes();
        let ampm = hours >= 12 ? 'PM' : 'AM';

        hours = hours % 12;
        hours = hours ? hours : 12;

        minutes = minutes < 10 ? '0' + minutes : minutes;

        let timeString = hours + ':' + minutes + ' ' + ampm;

        return timeString;
    }

    const onClickTraining = () => {
        setTrainingMode(true);
    }

    const onSubmitTrainingData = (event) => {
        event.preventDefault();

        if (token === 'default') {
            alert('Please submit a token before train a model!')
            return;
        }

        const trainData = [
            {
                intent: event.target['intent'].value,
                questions: event.target['questions'].value.split(","),
                answers: event.target['answers'].value.split(","),
            }
        ]

        const postData = {token, trainData};

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData)
        };

        // URL to which the POST request will be sent
        const url = server + '/train';

        // Make the POST request
        fetch(url, options)
            .then(response => {
                // Check if response is successful
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                // Parse response JSON
                return response.json();
            })
            .then(data => {
                trainingFormRef.current.reset();
                alert('Trained! Submit another or close training mode')
            })
            .catch(error => {
                alert('Trained Failed ;(! Something went wrong')
            });
    }

    if (trainingMode) {
        return (
            <div>
                <div className="guide-me-chat-container">
                    <div className="guide-me-chat-header">
                        <h2>Training Mode</h2>
                        <button style={{marginTop: 10, backgroundColor: 'red'}} onClick={() => {
                            setTrainingMode(false);
                            setCurrentChat({});
                            setResponse({});
                        }}>Close Training Mode</button>
                    </div>
                    <div className="guide-me-chat-messages">
                        <form ref={trainingFormRef} onSubmit={onSubmitTrainingData}>
                            <input type="text" name="intent" placeholder="Enter a category (eg: greeting)" style={{width: '95%'}} required/>
                            <div><textarea name='questions' placeholder='Type question patterns. Seperate each with a comma (,) - example: hi,hello,how are you' rows={5} cols={40} required/></div>
                            <div><textarea name='answers' placeholder='Type answer patterns. Seperate each with a comma (,) - example: hi,hello,how are you' rows={5} cols={40} required/></div>
                            <div><button id="send-button" style={{marginTop: 20}}>Submit</button></div>
                        </form>
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div>
                <div className="guide-me-chat-container">
                    <div className="guide-me-chat-header">
                        <h2>Guide Me!</h2>
                        <h5>Get Real AI Experience!</h5>
                        {isAdmin ? <div className='guide-me-chat-input' style={{ justifyContent: 'center' }}><button onClick={onClickTraining} id="send-button" style={{ backgroundColor: 'green' }}>Train Model</button></div>: <></>}
                    </div>
                    <div className="guide-me-chat-messages">
                        <div className="guide-me-message received">
                            <div className="guide-me-message-content">
                                Hello! How can I help you today?
                            </div>
                            <div className="guide-me-message-timestamp">{getTimeIn12HourFormat(new Date())}</div>
                        </div>
                        {chats.map((chat, index) => {
                            if (chat.sent) {
                                return (
                                    <div key={index} className='guide-me-chat-messages' style={{padding: 0}}>
                                        <div className="guide-me-message sent">
                                            <div className="guide-me-message-content">
                                                {chat.sent?.message}
                                            </div>
                                            <div className="guide-me-message-timestamp">{chat.sent?.time}</div>
                                        </div>
                                        <div className="guide-me-message received">
                                            <div className="guide-me-message-content">
                                                {chat.received?.message}
                                            </div>
                                            <div className="guide-me-message-timestamp">{chat.received?.time}</div>
                                        </div>
                                    </div>
                                )
                            }
                        })}
                        {
                            currentChat.sent ?
                                <>
                                    <div className="guide-me-message sent">
                                        <div className="guide-me-message-content">
                                            {currentChat.sent?.message}
                                        </div>
                                        <div className="guide-me-message-timestamp">{currentChat.sent?.time}</div>
                                    </div>
                                    <div className="guide-me-message received">
                                        <div className="guide-me-message-content fade-in">
                                            {currentChat.received?.message}
                                        </div>
                                        <div className="guide-me-message-timestamp">{currentChat.received?.time}</div>
                                    </div>
                                </> : <></>
                        }
                    </div>
                    {
                        response.trainMe && isAdmin ? <div className='guide-me-chat-input' style={{ justifyContent: 'center' }}><button onClick={onClickTraining} id="send-button" style={{ backgroundColor: 'green' }}>Train Model</button></div> :
                            <form className='guide-me-chat-input' onSubmit={submitChat} ref={formRef}>
                                <input type="text" name="chat-input" placeholder="Type a message..." />
                                <button id="send-button">Send</button>
                            </form>
                    }

                </div>
            </div>
        )
    }
}

export default GuideMeChatBot;