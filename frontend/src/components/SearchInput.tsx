import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { Upload, ImagePlus } from 'lucide-react';

interface SearchInputProps {
  method: string;
  searchText: string;
  onSearchTextChange: (text: string) => void;
  onImageUpload: (file: File) => void;
  isLoading: boolean;
}

export default function SearchInput({ method, searchText, onSearchTextChange, onImageUpload, isLoading }: SearchInputProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onImageUpload(acceptedFiles[0]);
    }
  }, [onImageUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    multiple: false
  });

  if (method === 'cnn') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl mx-auto"
      >
        <div
          {...getRootProps()}
          className={`glass-effect border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${
            isDragActive 
              ? 'border-indigo-600 bg-indigo-50/50' 
              : 'border-indigo-200 hover:border-indigo-400 hover:shadow-lg'
          }`}
        >
          <input {...getInputProps()} />
          <motion.div
            animate={isDragActive ? {
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            } : {}}
            transition={{ duration: 0.5 }}
          >
            {isDragActive ? (
              <ImagePlus className="w-16 h-16 mx-auto mb-4 text-indigo-600" />
            ) : (
              <Upload className="w-16 h-16 mx-auto mb-4 text-indigo-400" />
            )}
          </motion.div>
          <p className="text-xl font-medium text-gray-700 mb-2">
            {isDragActive ? 'Drop your image here' : 'Upload an image'}
          </p>
          <p className="text-gray-500">
            {isDragActive 
              ? 'Release to start the search' 
              : 'Drag & drop an image here, or click to select'}
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="glass-effect rounded-2xl p-2 shadow-lg">
        <input
          type="text"
          value={searchText}
          onChange={(e) => onSearchTextChange(e.target.value)}
          placeholder="Enter apparel description (e.g., red jacket)"
          className="w-full px-6 py-4 text-lg bg-transparent border-none rounded-xl focus:ring-2 focus:ring-indigo-200 outline-none transition-all placeholder-gray-400"
          disabled={isLoading}
        />
      </div>
    </motion.div>
  );
}