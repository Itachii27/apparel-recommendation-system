import React from 'react';
import { motion } from 'framer-motion';
import type { RecommendationResult } from '../types';

interface ResultsProps {
  results: RecommendationResult['results'];
  isLoading: boolean;
}

export default function Results({ results, isLoading }: ResultsProps) {
  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center py-16">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 border-4 border-indigo-200 rounded-full animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!results.length) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="mt-12"
    >
      <h2 className="text-2xl font-semibold text-gray-800 text-center mb-8">
        Recommended Items
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl mx-auto">
        {results.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-effect rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all border border-indigo-100"
          >
            <div className="aspect-square overflow-hidden">
              <img
                src={item.url}
                alt={item.title}
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-6">
              <h3 className="font-semibold text-lg mb-3 line-clamp-2 text-gray-800">
                {item.title}
              </h3>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}