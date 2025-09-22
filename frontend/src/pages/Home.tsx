import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-thistle-400 flex flex-col justify-center py-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="text-center mb-2">
          <h1 className="text-4xl font-extrabold text-cinnabar-400 mb-4">
            Welcome To InternKaksha
          </h1>
          <p className="text-xl text-puce-100 mb-2">
            Manage your internship journey with ease
          </p>
        </div>
        
        
        <div className="bg-white py-4 px-10 shadow-xl rounded-xl">
          <div className="space-y-4">
            <Link 
              to="/login" 
              className="w-full flex justify-center py-3 px-2 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-puce-400 hover:bg-cinnabar-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-puce-300 transform transition duration-200 hover:scale-105"
            >
              Sign In
            </Link>
            
            <Link 
              to="/register" 
              className="w-full flex justify-center py-3 px-2 border-2 border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-puce-400  hover:bg-cinnabar-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-puce-300 transform transition duration-200 hover:scale-105"
            >
              Create Account
            </Link>
          </div>
          
          <div className="mt-8 pt-3 border-t border-dark_moss_green-800">
            <div className="grid grid-cols-1 gap-2">
              <div className="text-center p-4 bg-white rounded-lg">
                <div className="bg-cambridge_blue-50 p-3 rounded-lg border border-cambridge_blue-200 shadow-sm">
                <h3 className="font-medium text-puce-100 mb-1">For Interns</h3>
                <p className="text-sm text-puce-100">Track tasks, submit work, and manage your internship</p></div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg">
                 <div className="bg-cambridge_blue-50 p-3 rounded-lg border border-cambridge_blue-200 shadow-sm">
                <h3 className="font-medium text-puce-100 mb-1">For Admins</h3>
                <p className="text-sm text-puce-100">Create tasks, review submissions, and manage interns</p></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;