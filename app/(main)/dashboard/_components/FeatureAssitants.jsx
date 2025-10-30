'use client'
import { Button } from '@/components/ui/button'
import { CoachingOptions } from '@/services/Options'
import { UserButton, useUser } from '@stackframe/stack'
import Image from 'next/image'

import React from 'react'

function FeatureAssitants() {
    const user=useUser()
  return (
    <div>
        <div className="flex justify-between items-center">
            <div className="">

        <h2 className='font-medium text-gray-500 '>My workspace</h2>
        <h2 className='text-3xl font-bold'>Welcome back, {user?.displayName}</h2>
            </div>
            <Button>Profile</Button>
        </div>
        <div className="w-full h-full flex flex-wrap  gap-5 mt-10">
          {CoachingOptions.map((option,index)=>{
            return <div key={index} className='p-3 bg-secondary rounded-3xl flex flex-col justify-center items-center'>
              <Image src={option.icon} alt={option.name} width={120} height={150} className="h-40 w-44"/>
              <h2 className='text-black mt-2'>{option.name}</h2>
            </div>
          })}
        </div>
    </div>
  )
}

export default FeatureAssitants

// 1:05:00