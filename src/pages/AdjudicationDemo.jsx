import React, { useState, useEffect } from 'react';
import AdjudicationTree from '../components/AdjudicationTree';

const AdjudicationDemo = () => {
  const [treeData, setTreeData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/claims_logic_validated.json');
        if (!response.ok) {
          throw new Error('Failed to load data');
        }
        const data = await response.json();
        setTreeData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Claims Adjudication Rules</h1>
      {treeData && <AdjudicationTree data={treeData} />}
    </div>
  );
};

export default AdjudicationDemo; 