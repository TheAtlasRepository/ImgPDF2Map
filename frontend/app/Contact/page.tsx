'use client';
import Navbar from '@/components/ui/navbar';

export default function About() {
  return (
    <main className="flex flex-col bg-white dark:bg-gray-900 min-h-screen">
      <Navbar
        activePage="Contact"
      />

      <div className="flex justify-center p-2 py-5 pt-10">
        <div className="flex flex-col w-1/2 justify-between">
            <h1 className="text-5xl font-bold text-primary mb-5 px-6 dark:text-gray-300">
                Contact Us<br />
            </h1>
          <div className="w-100 p-6 card dark:bg-gray-800">
            <p className="text-lg text-secondary dark:text-gray-300">
                Do you have any questions, comments, or feedback about our service? We would love to hear from you! Please feel free to reach out to us through the form below:
            </p>
            <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 mt-5 dark:bg-gray-700">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300" htmlFor="name">
                    Name
                    </label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-800 dark:border-0 dark:text-gray-400" id="name" type="text" placeholder="Your name" />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300" htmlFor="email">
                    Email
                    </label>
                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-800 dark:border-0 dark:text-gray-400" id="email" type="email" placeholder="Your email" />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300" htmlFor="message">
                    Message
                    </label>
                    <textarea className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-800 dark:border-0 dark:text-gray-400" id="message" placeholder="Your message" rows={6}></textarea>
                </div>
                <div className="flex items-center justify-between">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline dark:bg-blue-800 dark:hover:bg-blue-900" type="submit">
                    Send
                    </button>
                </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}