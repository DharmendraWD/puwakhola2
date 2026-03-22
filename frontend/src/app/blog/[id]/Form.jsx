"use client"

import React from 'react'



// Reusable Button Component for the form
const SubmitButton = ({ children }) => (
    <button
        type="submit"
        className="w-full bg-white text-indigo-700 font-bold py-3 px-4 rounded-xl transition duration-200 hover:bg-gray-100 shadow-md"
    >
        {children}
    </button>
);


export const Form = () => {
  return (
    <div>

                    <form onSubmit={(e) => { e.preventDefault(); console.log('Subscribed!'); }}>
                <div className="mb-4">
                    <label htmlFor="email" className="sr-only">Email</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="Your email"
                        required
                        className="w-full p-3 rounded-xl border-2 border-indigo-500 focus:border-white focus:outline-none transition duration-200 text-gray-800 placeholder-gray-500"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="name" className="sr-only">Name</label>
                    <input
                        id="name"
                        type="text"
                        placeholder="Your name (Optional)"
                        className="w-full p-3 rounded-xl border-2 border-indigo-500 focus:border-white focus:outline-none transition duration-200 text-gray-800 placeholder-gray-500"
                    />
                </div>
                <SubmitButton>
                    Submit
                </SubmitButton>
            </form>
    </div>
  )
}
