
F
import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [questions, setQuestions] = useState([]);
  const [score, setScore] = useState(0);
  const [current, setCurrent] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [token, setToken] = useState('');
  const [userRole, setUserRole] = useState('');
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/questions')
      .then(res => res.json())
      .then(data => setQuestions(data));
  }, []);

  const handleAnswer = (selected) => {
    if (selected === questions[current].answer) {
      setScore(score + 1);
    }
    const next = current + 1;
    if (next < questions.length) {
      setCurrent(next);
    } else {
      setShowScore(true);
      if (token) {
        fetch('http://localhost:5000/api/results', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token
          },
          body: JSON.stringify({ score: score + 1, total: questions.length })
        });
      }
    }
  };

  const handleLogin = async () => {
    const res = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'admin' })
    });
    const data = await res.json();
    setToken(data.token);
    const decoded = JSON.parse(atob(data.token.split('.')[1]));
    setUserRole(decoded.role);
    fetch('http://localhost:5000/api/results', {
      headers: { 'Authorization': data.token }
    })
    .then(res => res.json())
    .then(setResults);
  };

  const addQuestion = async () => {
    const question = prompt('Question text?');
    const options = prompt('Options (comma separated)?').split(',');
    const answer = prompt('Correct answer?');
    await fetch('http://localhost:5000/api/questions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify({ question, options, answer })
    });
    alert('Question added');
  };

  return (
    <div className="app">
      <h1>Quiz App</h1>
      {!token && <button onClick={handleLogin}>Login</button>}
      {userRole === 'admin' && <button onClick={addQuestion}>Add Question</button>}
      {showScore ? (
        <div>
          <h2>You scored {score} out of {questions.length}</h2>
          <h3>Past Attempts:</h3>
          <ul>{results.map((r, i) => <li key={i}>Score: {r.score}/{r.total} on {new Date(r.date).toLocaleString()}</li>)}</ul>
        </div>
      ) : (
        <div>
          <h3>{questions[current]?.question}</h3>
          <div>
            {questions[current]?.options.map((opt, idx) => (
              <button key={idx} onClick={() => handleAnswer(opt)}>{opt}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
