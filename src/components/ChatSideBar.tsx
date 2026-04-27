"use client"
import React from 'react'
import { DrizzleChat } from '@/lib/db/schema'
import Link from 'next/link'
import { Button } from './ui/button'
import { MessageCircleDashed, PlusCircleIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

type Props = {
    chats : DrizzleChat[],
    chatId : number
}

const ChatSideBar = ({chats,chatId}: Props) => {
  return (
    <div className='w-full h-screen p-4 text-white bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900'>
        <Link href={'/'}>            
            <Button className='w-full border-dashed border-gray-200 border mb-4 cursor-pointer'>
              <PlusCircleIcon className='mr-2 w-4 h-4'/>
                New Chat
            </Button>
        </Link>

        <div className='w-full flex-1 mr-2'>
              {
                chats.map((chat)=>(
                  <Link key={chat.id} href={`/chat/${chat.id}`}>
                    <div className={cn('rounded-lg p-3 text-slate-400 flex items-center',
                    {
                        "bg-blue-600 text-white" : Number(chat.id) === chatId,
                        "hover:text-gray-400" : Number(chat.id) !== chatId
                    }
                      )}>
                      <MessageCircleDashed className='mr-2 h-5 w-5 flex-shrink-0'/>
                      <p className='w-full truncate text-sm font-medium whitespace-nowrap text-ellipsis'>{chat.pdfName}</p>
                    </div>
                  </Link>
                ))
              }
        </div>

        <div className='absolute bottom-10 left-4'>
          <div className='flex items-center gap-2 text-sm text-red-300 flex-wrap'>
            <Link href={"/"}>Home</Link>
            <Link href={"/"}>Source</Link>
          </div>        
        </div>
    </div>
  )
}

export default ChatSideBar
