'use client'

import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from "@/components/ui/card"
import { FileText, Share2, Calendar as CalendarIcon, Text } from "lucide-react"

const Dashboard = () => {
  return (
    <div className="p-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 h-full">
      {/* Save Files Card */}
      <Link href="/documents" className="block group h-full">
        <Card className="shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer transform hover:-translate-y-1 hover:bg-gray-50 dark:hover:bg-gray-800 h-full">
          <CardContent className="pt-8 pb-8 flex flex-col h-full">
            <div className="flex flex-col gap-4 flex-1">
              <Text className="h-8 w-8 text-gray-500 group-hover:text-blue-500 dark:text-gray-400 dark:group-hover:text-blue-400 transition-colors" />
              <h3 className="text-lg font-semibold dark:text-gray-100">Write your note with AI</h3>
              <p className="text-gray-500 dark:text-gray-400">We automatically save your note as you type.</p>
            </div>
          </CardContent>
        </Card>
      </Link>

      {/* Reading PDF with Assistance Card */}
      <Link href="/pdf" className="block group h-full">
        <Card className="shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer transform hover:-translate-y-1 hover:bg-gray-50 dark:hover:bg-gray-800 h-full">
          <CardContent className="pt-8 pb-8 flex flex-col h-full">
            <div className="flex flex-col gap-4 flex-1">
              <FileText className="h-8 w-8 text-gray-500 group-hover:text-blue-500 dark:text-gray-400 dark:group-hover:text-blue-400 transition-colors" />
              <h3 className="text-lg font-semibold dark:text-gray-100">Reading PDF with Assistance</h3>
              <p className="text-gray-500 dark:text-gray-400">Upload and read PDF files with AI assistance.</p>
              
              
            </div>
          </CardContent>
        </Card>
      </Link>

      {/* practice-hubHub Card */}
      <Link href="/practice-hub" className="block group h-full">
        <Card className="shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer transform hover:-translate-y-1 hover:bg-gray-50 dark:hover:bg-gray-800 h-full">
          <CardContent className="pt-8 pb-8 flex flex-col h-full">
            <div className="flex flex-col gap-4 flex-1">
              <Share2 className="h-8 w-8 text-gray-500 group-hover:text-blue-500 dark:text-gray-400 dark:group-hover:text-blue-400 transition-colors" />
              <h3 className="text-lg font-semibold dark:text-gray-100">PracticeHub</h3>
              <p className="text-gray-500 dark:text-gray-400">Practice and improve your skills with interactive exercises.</p>
              
              <div className="flex items-center justify-center flex-1">
                <div className="h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  <div className="h-6 w-6 bg-gray-300 dark:bg-gray-500 rounded-full" />
                </div>
              </div>
              
              <div className="flex gap-4 justify-center mt-4">
                {['bg-blue-400', 'bg-green-400', 'bg-yellow-400', 'bg-purple-400'].map((color, i) => (
                  <div key={i} className={`h-8 w-8 rounded-full ${color}`} />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>

      {/* Calendar Card */}
      <Link href="/calendar" className="block group h-full">
        <Card className="shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer transform hover:-translate-y-1 hover:bg-gray-50 dark:hover:bg-gray-800 h-full">
          <CardContent className="pt-8 pb-8 flex flex-col h-full">
            <div className="flex flex-col gap-4 flex-1">
              <CalendarIcon className="h-8 w-8 text-gray-500 group-hover:text-blue-500 dark:text-gray-400 dark:group-hover:text-blue-400 transition-colors" />
              <h3 className="text-lg font-semibold dark:text-gray-100">Calendar</h3>
              <p className="text-gray-500 dark:text-gray-400">Use the calendar to filter your files by date.</p>
              
              <div className="grid grid-cols-7 gap-2 text-sm flex-1">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                  <div key={day} className="text-center text-gray-500 dark:text-gray-400">{day}</div>
                ))}
                {Array(31).fill(null).map((_, i) => (
                  <div key={i} className="text-center py-1 dark:text-gray-100">
                    {i + 1}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
};

export default Dashboard;