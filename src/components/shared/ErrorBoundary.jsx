import React from 'react';
import { toast } from 'react-hot-toast';

export default class ErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('App Error:', error, info);
    toast.error('A critical error occurred. Please refresh.');
  }

  render() {
    return this.state.hasError ? (
      <div className="p-8 text-center">
        <h1 className="text-2xl text-red-500 mb-4">⚠️ App Crashed</h1>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Reload App
        </button>
      </div>
    ) : this.props.children;
  }
}