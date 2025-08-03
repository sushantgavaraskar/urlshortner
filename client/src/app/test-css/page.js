'use client';

import React from 'react';

export default function TestCSS() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">CSS Test Page</h1>
        
        {/* Basic Tailwind Classes */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Basic Styling</h2>
            <p className="text-gray-600 mb-4">This tests basic Tailwind CSS classes.</p>
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
              Test Button
            </button>
          </div>

          {/* Custom CSS Classes */}
          <div className="card">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Custom CSS Classes</h2>
            <p className="text-gray-600 mb-4">This tests custom CSS classes from globals.css.</p>
            <div className="space-y-2">
              <div className="btn-primary">Primary Button</div>
              <div className="btn-secondary">Secondary Button</div>
              <div className="btn-danger">Danger Button</div>
            </div>
          </div>

          {/* Animations */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Animations</h2>
            <div className="space-y-4">
              <div className="fade-in bg-blue-100 p-4 rounded">Fade In Animation</div>
              <div className="slide-up bg-green-100 p-4 rounded">Slide Up Animation</div>
              <div className="bounce-in bg-purple-100 p-4 rounded">Bounce In Animation</div>
            </div>
          </div>

          {/* Gradients */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Gradients</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="gradient-bg h-20 rounded-lg flex items-center justify-center text-white font-medium">
                Primary Gradient
              </div>
              <div className="gradient-bg-alt h-20 rounded-lg flex items-center justify-center text-white font-medium">
                Secondary Gradient
              </div>
              <div className="bg-gradient-to-r from-green-400 to-blue-500 h-20 rounded-lg flex items-center justify-center text-white font-medium">
                Tailwind Gradient
              </div>
            </div>
          </div>

          {/* Glass Effect */}
          <div className="glass-card p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Glass Effect</h2>
            <p className="text-gray-600">This tests the glassmorphism effect.</p>
          </div>
        </div>
      </div>
    </div>
  );
} 