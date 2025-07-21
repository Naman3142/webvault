======================================
📄 Interactive File Upload Web App
======================================

This is a simple, interactive web application with:
✅ Secure login page
✅ File upload (.jpg, .pdf, etc.)
✅ File download & delete
✅ Fully interactive dashboard
✅ Mobile-friendly UI

It has two parts:
- 🐍 Backend: Flask (Python) API
- 🌐 Frontend: React (JavaScript)

--------------------------------------
📁 Folder Structure
--------------------------------------

interactive-files-app/
├── backend/
│   ├── app.py
│   ├── uploads/          (empty folder for uploaded files)
│   └── requirements.txt
│
├── frontend/
│   ├── package.json
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js
│   │   └── index.js
│   └── README.txt


======================================
🐍 BACKEND CODE (backend/app.py)
======================================

from flask import Flask, request, jsonify, send_from_directory, session
from flask_cors import CORS
import os

app = Flask(__name__)
app.secret_key = 'your-secret-key'
CORS(app)

UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

USERNAME = 'admin'
PASSWORD = 'password'

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    if data['username'] == USERNAME and data['password'] == PASSWORD:
        session['logged_in'] = True
        return jsonify({'success': True})
    return jsonify({'success': False, 'message': 'Invalid credentials'}), 401

@app.route('/api/logout', methods=['POST'])
def logout():
    session.pop('logged_in', None)
    return jsonify({'success': True})

@app.route('/api/upload', methods=['POST'])
def upload():
    if 'file' not in request.files:
        return jsonify({'success': False, 'message': 'No file part'}), 400
    file = request.files['file']
    file.save(os.path.join(UPLOAD_FOLDER, file.filename))
    return jsonify({'success': True})

@app.route('/api/files', methods=['GET'])
def list_files():
    files = os.listdir(UPLOAD_FOLDER)
    return jsonify(files)

@app.route('/api/download/<filename>', methods=['GET'])
def download_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename, as_attachment=True)

@app.route('/api/delete/<filename>', methods=['DELETE'])
def delete_file(filename):
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    if os.path.exists(filepath):
        os.remove(filepath)
        return jsonify({'success': True})
    return jsonify({'success': False, 'message': 'File not found'}), 404

if __name__ == '__main__':
    app.run(debug=True)


======================================
📄 backend/requirements.txt
======================================

Flask
Flask-Cors


======================================
🌐 FRONTEND CODE (frontend/src/App.js)
======================================

import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'https://yourusername.pythonanywhere.com/api';  // Change this

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


======================================
📄 frontend/src/index.js
======================================

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);


======================================
🚀 How to Run
======================================

### Backend (Flask)
