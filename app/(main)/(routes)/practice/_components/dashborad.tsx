'use client'

import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from "@/components/ui/card"
import { Bell, BookOpen, Share2, Calendar as CalendarIcon, WholeWord } from "lucide-react" // Updated icon import
import { MessagesSquare, User } from "lucide-react"

const Dashboard = () => {
  const notifications = [
    {
      icon: <MessagesSquare className="h-8 w-8 p-1.5 bg-pink-100 text-pink-500 rounded-full dark:bg-pink-900 dark:text-pink-300" />,
      title: "New message",
      subtitle: "Magic UI",
      time: "5m ago"
    },
    {
      icon: <User className="h-8 w-8 p-1.5 bg-yellow-100 text-yellow-500 rounded-full dark:bg-yellow-900 dark:text-yellow-300" />,
      title: "User signed up",
      subtitle: "Magic UI",
      time: "10m ago"
    },
    {
      icon: <Bell className="h-8 w-8 p-1.5 bg-blue-100 text-blue-500 rounded-full dark:bg-blue-900 dark:text-blue-300" />,
      title: "Payment received",
      subtitle: "Magic UI",
      time: "15m ago"
    }
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 h-full">
      {/* Word Memorising Card */}
      <Link href="/practice/words" className="block group h-full">
        <Card className="shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer transform hover:-translate-y-1 hover:bg-gray-50 dark:hover:bg-gray-800 h-full">
          <CardContent className="pt-8 pb-8 flex flex-col h-full">
            <div className="flex flex-col gap-4 flex-1">
              <WholeWord className="h-8 w-8 text-gray-500 group-hover:text-blue-500 dark:text-gray-400 dark:group-hover:text-blue-400 transition-colors" /> {/* Updated icon */}
              <h3 className="text-lg font-semibold dark:text-gray-100">Word Memorising</h3> {/* Updated title */}
              <p className="text-gray-500 dark:text-gray-400">Improve your vocabulary with spaced repetition techniques.</p> {/* Updated description */}
            </div>
          </CardContent>
        </Card>
      </Link>

      {/* Notifications Card */}
      <Link href="/notifications" className="block group h-full">
        <Card className="shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer transform hover:-translate-y-1 hover:bg-gray-50 dark:hover:bg-gray-800 h-full">
          <CardContent className="pt-8 pb-8 flex flex-col h-full">
            <div className="flex flex-col gap-4 flex-1">
              <Bell className="h-8 w-8 text-gray-500 group-hover:text-blue-500 dark:text-gray-400 dark:group-hover:text-blue-400 transition-colors" />
              <h3 className="text-lg font-semibold dark:text-gray-100">-----------</h3>
              <p className="text-gray-500 dark:text-gray-400">------------</p>
              
              <div className="space-y-4 flex-1">
                {notifications.map((notification, index) => (
                  <div key={index} className="flex items-center gap-3">
                    {notification.icon}
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <p className="font-medium dark:text-gray-100">{notification.title}</p>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{notification.time}</span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{notification.subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>

      {/* PracticeHub Card */}
      <Link href="/practice-hub" className="block group h-full">
        <Card className="shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer transform hover:-translate-y-1 hover:bg-gray-50 dark:hover:bg-gray-800 h-full">
          <CardContent className="pt-8 pb-8 flex flex-col h-full">
            <div className="flex flex-col gap-4 flex-1">
              <Share2 className="h-8 w-8 text-gray-500 group-hover:text-blue-500 dark:text-gray-400 dark:group-hover:text-blue-400 transition-colors" />
              <h3 className="text-lg font-semibold dark:text-gray-100">-----------</h3>
              <p className="text-gray-500 dark:text-gray-400">-------------------</p>
              
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
              <h3 className="text-lg font-semibold dark:text-gray-100">-------------</h3>
              <p className="text-gray-500 dark:text-gray-400">----------</p>
              
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