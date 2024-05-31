import logo from './logo.svg';
import './App.css';
// import GuideMeChatBot from 'guide-me-chat-bot';
import GuideMeChatBot from './components/GuideMeChatBot';

function App() {
  const onResponse = (data) => {
    const result = data.message;

    if (result === "openGoogle") {
      window.location.replace('https://www.google.com/');
    }


    // console.log('respons received....', data)
  }

  return (
    <div className="App">
      <div style={{fontSize: 100, paddingTop: 200}}>This Can Be Any Web Site</div>
      <GuideMeChatBot
        token={'default'}
        onResponse={onResponse}
        server='http://localhost:3000'
        isAdmin={true}
      />
    </div>
  );
}

export default App;