import React, { useState } from 'react';
import TreeNode from './components/TreeNode';
import './App.css';

function App() {
  const [jsonData, setJsonData] = useState(null);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        setJsonData(data);
      } catch (err) {
        console.error('Error loading JSON:', err);
        alert('Error loading JSON file. Please make sure it is valid JSON.');
      }
    }
  };

  return (
    <div className="app">
      <h1>JSON Tree Viewer</h1>
      
      <div className="json-uploader">
        <input
          type="file"
          accept=".json"
          onChange={handleFileChange}
        />
      </div>

      {jsonData && (
        <div className="tree-container">
          <TreeNode data={jsonData} />
        </div>
      )}
    </div>
  );
}

export default App;
