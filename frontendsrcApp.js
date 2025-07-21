import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'https://yourusername.pythonanywhere.com/api';  // Change this later

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [files, setFiles] = useState([]);
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (loggedIn) loadFiles();
  }, [loggedIn]);

  const login = async () => {
    try {
      await axios.post(`${API_URL}/login`, { username, password });
      setLoggedIn(true);
    } catch {
      alert('Login failed');
    }
  };

  const logout = async () => {
    await axios.post(`${API_URL}/logout`);
    setLoggedIn(false);
  };

  const loadFiles = async () => {
    const res = await axios.get(`${API_URL}/files`);
    setFiles(res.data);
  };

  const uploadFile = async () => {
    const formData = new FormData();
    formData.append('file', file);
    await axios.post(`${API_URL}/upload`, formData);
    loadFiles();
  };

  const deleteFile = async (filename) => {
    await axios.delete(`${API_URL}/delete/${filename}`);
    loadFiles();
  };

  if (!loggedIn) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Login</h2>
        <input placeholder="Username" onChange={e => setUsername(e.target.value)} /><br />
        <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} /><br />
        <button onClick={login}>Login</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Dashboard</h2>
      <button onClick={logout}>Logout</button>
      <div>
        <input type="file" onChange={e => setFile(e.target.files[0])} />
        <button onClick={uploadFile}>Upload</button>
      </div>
      <ul>
        {files.map(f => (
          <li key={f}>
            <a href={`${API_URL}/download/${f}`} target="_blank" rel="noopener noreferrer">{f}</a>
            <button onClick={() => deleteFile(f)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
