import React, { useState, useCallback } from 'react';

const JsonLoader = ({ onJsonLoaded, children }) => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadJsonFromFile = useCallback(async (file) => {
    setIsLoading(true);
    setError(null);

    try {
      const text = await file.text();
      const json = JSON.parse(text);
      onJsonLoaded(json);
    } catch (err) {
      setError(err.message);
      console.error('Error loading JSON:', err);
    } finally {
      setIsLoading(false);
    }
  }, [onJsonLoaded]);

  const loadJsonFromUrl = useCallback(async (url) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const json = await response.json();
      onJsonLoaded(json);
    } catch (err) {
      setError(err.message);
      console.error('Error loading JSON:', err);
    } finally {
      setIsLoading(false);
    }
  }, [onJsonLoaded]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      loadJsonFromFile(file);
    }
  };

  const handleUrlSubmit = (event) => {
    event.preventDefault();
    const url = event.target.elements.jsonUrl.value;
    if (url) {
      loadJsonFromUrl(url);
    }
  };

  return (
    <div className="space-y-4">
      {/* File Upload */}
      <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg">
        <input
          type="file"
          accept=".json"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
      </div>

      {/* URL Input */}
      <form onSubmit={handleUrlSubmit} className="flex gap-2">
        <input
          type="url"
          name="jsonUrl"
          placeholder="Enter JSON URL"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Load
        </button>
      </form>

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
          {error}
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        children
      )}
    </div>
  );
};

export default JsonLoader; 