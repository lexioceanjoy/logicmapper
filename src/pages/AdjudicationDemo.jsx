import React, { useState, useEffect } from 'react';
import AdjudicationTree from '../components/AdjudicationTree';

const AdjudicationDemo = () => {
  const [treeData, setTreeData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/claims_logic_validated.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to load adjudication rules');
        }
        return response.json();
      })
      .then(data => {
        setTreeData(data);
        setIsLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading adjudication rules...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center text-red-500">
          <h2 className="text-2xl font-bold mb-2">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Claims Adjudication Rules
        </h1>
        <div className="bg-white rounded-xl shadow-lg">
          {treeData && <AdjudicationTree data={treeData} />}
        </div>
      </div>
    </div>
  );
};

export default AdjudicationDemo; 