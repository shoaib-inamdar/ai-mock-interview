"use client"
import { Button } from '@/components/ui/button';
import { ExpertsList } from '@/services/Options';
import { useUser } from '@stackframe/stack'
import Image from 'next/image';
import React from 'react'
import { BlurFade } from '@/components/magicui/blur-fade';
import UserInputDialog from './UserInputDialog';
import ProfileDialog from './ProfileDialog';

function FeatureAssistant() {
    const user = useUser() ;
    return (
        <div>

            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-10 -mt-10'>
                {ExpertsList.map((option, index) => (
                    <BlurFade key={option.icon} delay={0.25 + index * 0.05} inView>
                         <div key = {index} className='p-3 bg-secondary rounded-3xl flex flex-col items-center justify-center gap-10 hover:bg-secondary/80 transition-all cursor-pointer mt-10'>
                            <UserInputDialog ExpertsList={option}>
                            <div key = {index} className='flex flex-col items-center justify-center cursor-pointer'>
                                <Image src={option.icon} alt={option.name} width={200} height={120} className='h-[70px] w-[90px] mt-2 hover:rotate-8 transition-all' />
                                <h2 className='mt-0'>{option.name}</h2>
                            </div>
                        </UserInputDialog>
                        </div>
                   </BlurFade>
                ))}
            </div>
        </div>
    )
}

export default FeatureAssistant