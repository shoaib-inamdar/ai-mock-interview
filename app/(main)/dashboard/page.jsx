import React from 'react'
import FeatureAssitants from './_components/FeatureAssitants'
import History from './_components/History'
import Feedback from './_components/Feedback'

function Dashboard() {
  return (
    <div>
      <FeatureAssitants/>
      <div className="flex justify-between gap-10 mt-20">
        <History/>
        <Feedback/>
      </div>
    </div>
  )
}

export default Dashboard