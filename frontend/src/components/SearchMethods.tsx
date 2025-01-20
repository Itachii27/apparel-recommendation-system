import React from 'react';
import { motion } from 'framer-motion';
import { Search, Image, BarChart2 } from 'lucide-react';

interface SearchMethodsProps {
  activeMethod: string;
  onMethodChange: (method: string) => void;
}

const methods = [
  { id: 'tfidf', name: 'TF-IDF Search', icon: Search, description: 'Text-based search using TF-IDF algorithm' },
  { id: 'bow', name: 'Bag of Words', icon: BarChart2, description: 'Text-based search using BoW algorithm' },
  { id: 'cnn', name: 'Image Search', icon: Image, description: 'Visual search using CNN' },
];

export default function SearchMethods({ activeMethod, onMethodChange }: SearchMethodsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mx-auto mb-8">
      {methods.map((method) => (
        <motion.button
          key={method.id}
          whileHover={{ scale: 1.02, y: -5 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onMethodChange(method.id)}
          className={`p-8 rounded-2xl transition-all ${
            activeMethod === method.id
              ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-xl shadow-indigo-200'
              : 'glass-effect text-gray-800 hover:shadow-xl hover:shadow-indigo-100'
          } border border-indigo-100`}
        >
          <div className="flex flex-col items-center space-y-4">
            <div className={`p-3 rounded-xl ${
              activeMethod === method.id
                ? 'bg-white/20'
                : 'bg-indigo-50'
            }`}>
              <method.icon className={`w-8 h-8 ${
                activeMethod === method.id
                  ? 'text-white'
                  : 'text-indigo-600'
              }`} />
            </div>
            <h3 className="font-semibold text-lg">{method.name}</h3>
            <p className="text-sm text-center opacity-80">{method.description}</p>
          </div>
        </motion.button>
      ))}
    </div>
  );
}