import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Shirt, Sparkles } from 'lucide-react';
import SearchMethods from './components/SearchMethods';
import SearchInput from './components/SearchInput';
import Results from './components/Results';
import type { RecommendationResult } from './types';

const BASE_URL = 'https://surbhib-apparel-recommendation-system.hf.space/v1/recommend';

function App() {
  const [method, setMethod] = useState('tfidf');
  const [searchText, setSearchText] = useState('');
  const [results, setResults] = useState<RecommendationResult['results']>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchText.trim() && method !== 'cnn') {
      setError('Please enter a search term');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    try {
      const endpoint = method === 'bow' ? 'bog' : method;
      console.log(`Making request to: ${BASE_URL}/${endpoint}?input=${encodeURIComponent(searchText)}`);
      
      const response = await axios.get<RecommendationResult>(`${BASE_URL}/${endpoint}`, {
        params: { input: searchText },
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      console.log('API Response:', response.data);
      
      if (response.data && Array.isArray(response.data.results)) {
        setResults(response.data.results);
      } else {
        console.error('Invalid response format:', response.data);
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        });
        setError(`Error: ${error.response?.data?.message || error.message}`);
      } else {
        console.error('Error fetching recommendations:', error);
        setError('An unexpected error occurred. Please try again.');
      }
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    if (!file) {
      setError('Please select an image');
      return;
    }

    setIsLoading(true);
    setError(null);
    const formData = new FormData();
    formData.append('file', file);

    try {
      console.log('Uploading image to:', `${BASE_URL}/cnn`);
      console.log('File being uploaded:', file.name, file.type, file.size);

      const response = await axios.post<RecommendationResult>(
        `${BASE_URL}/cnn`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 30000, // 30 second timeout
        }
      );
      
      console.log('API Response:', response.data);
      
      if (response.data && Array.isArray(response.data.results)) {
        setResults(response.data.results);
      } else {
        console.error('Invalid response format:', response.data);
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        });
        if (error.code === 'ECONNABORTED') {
          setError('Request timed out. Please try again.');
        } else {
          setError(`Error: ${error.response?.data?.message || error.message}`);
        }
      } else {
        console.error('Error processing image:', error);
        setError('An unexpected error occurred while processing the image.');
      }
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-50">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-effect sticky top-0 z-10 border-b border-indigo-100 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center space-x-3">
            <div className="relative">
              <Shirt className="w-10 h-10 text-indigo-600" />
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                className="absolute -top-1 -right-1"
              >
                <Sparkles className="w-4 h-4 text-yellow-400" />
              </motion.div>
            </div>
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              Apparel Recommendation
            </h1>
          </div>
          <p className="text-center mt-2 text-gray-600">
            Discover perfect matches for your style preferences
          </p>
        </div>
      </motion.header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Choose Your Search Method
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Select from our three powerful search algorithms to find the perfect apparel recommendations
            tailored to your preferences.
          </p>
        </motion.div>

        <SearchMethods activeMethod={method} onMethodChange={(newMethod) => {
          setMethod(newMethod);
          setError(null);
          setResults([]);
        }} />
        
        <SearchInput
          method={method}
          searchText={searchText}
          onSearchTextChange={(text) => {
            setSearchText(text);
            setError(null);
          }}
          onImageUpload={handleImageUpload}
          isLoading={isLoading}
        />

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          </motion.div>
        )}

        {method !== 'cnn' && (
          <div className="flex justify-center">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSearch}
              disabled={isLoading}
              className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Search
            </motion.button>
          </div>
        )}

        <Results results={results} isLoading={isLoading} />
      </main>

      <footer className="glass-effect mt-16 border-t border-indigo-100">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <p className="text-center text-gray-600">
            Powered by advanced machine learning algorithms
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;