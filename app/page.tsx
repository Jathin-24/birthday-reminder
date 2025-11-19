'use client'
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-black text-center p-4 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="space-y-8 max-w-3xl relative z-10"
      >
        <div className="space-y-4">
          <h1 className="text-5xl font-extrabold tracking-tight lg:text-7xl">
            Never Forget a <br />
            <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
              Birthday Again
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            The most secure and beautiful way to track special dates. Get timely reminders via email and ensure you're always the first to wish them well.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/login">
            <Button size="lg" className="rounded-full px-8 h-12 text-lg bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all">
              Get Started for Free
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="rounded-full px-8 h-12 text-lg border-2">
              Log In
            </Button>
          </Link>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="mt-20 relative"
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl blur opacity-30"></div>
        <div className="relative p-6 bg-white dark:bg-gray-900 rounded-xl shadow-2xl transform rotate-[-2deg] hover:rotate-0 transition-transform duration-500 border border-gray-100 dark:border-gray-800 max-w-sm mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-xl">🎂</div>
                <div className="text-left">
                  <div className="font-bold text-gray-900 dark:text-white">Mom</div>
                  <div className="text-xs text-gray-500">Turning 50</div>
                </div>
              </div>
              <span className="text-pink-600 font-bold text-sm bg-pink-50 px-2 py-1 rounded-full">In 2 days</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg opacity-60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-xl">🎁</div>
                <div className="text-left">
                  <div className="font-bold text-gray-900 dark:text-white">Best Friend</div>
                  <div className="text-xs text-gray-500">Turning 28</div>
                </div>
              </div>
              <span className="text-gray-500 font-bold text-sm">In 14 days</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
