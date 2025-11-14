import React from 'react'
// import FeatureAssistant from './_components/FeatureAssistant'
import History from './_components/History'
import Feedback from './_components/Feedback'
import ProfileDialog from './_components/ProfileDialog'
import { UserButton } from '@stackframe/stack'
import { ArrowRight } from 'lucide-react'
import FeatureAssistant from './_components/FeatureAssitants'

export default function Dashboard() {
    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 pb-20 -mt-20 w-full">
            {/* Hero Section */}
            <div className="w-full px-6 pt-12 pb-8 flex flex-col md:flex-row items-center justify-between gap-8">
                <div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 drop-shadow-sm">
                        Welcome to your <span className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">AI Workspace</span>
                    </h1>
                    <p className="text-lg text-gray-600 mb-6 max-w-xl">
                        Access all your AI-powered learning tools, track your progress, and get personalized feedback—all in one place.
                    </p>
                    <ProfileDialog>
                        {/* <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all">
                            View Profile <ArrowRight className="ml-2 w-5 h-5" />
                        </button> */}

                    </ProfileDialog>
                </div>
                {/*<div className="flex flex-col items-center gap-4">
                    <UserButton />
                </div>*/}
            </div>

            {/* Feature Grid */}
            <section className="w-full px-6 py-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 -mt-10">AI Coaching Modes</h2>
<FeatureAssistant/>            </section>

            {/* History & Feedback */}
            <section className="w-full px-6 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="bg-white/80 rounded-3xl shadow-lg p-8 border border-gray-100 hover:shadow-2xl transition-all">
                        <History />
                    </div>
                    <div className="bg-white/80 rounded-3xl shadow-lg p-8 border border-gray-100 hover:shadow-2xl transition-all">
                        <Feedback />
                    </div>
                </div>
            </section>
        </div>
    )
}
