'use client';
import React from 'react'
import { cn } from '@/lib/utils';

type Props = {
    messages : any[]
}

const MessageList = ({messages}: Props) => {
    if (!messages || messages.length === 0) {
        return(
            <div className="text-center text-gray-500 py-8">
                No messages to display!
            </div>
        )
    }
    
    // Helper function to get message content
    const getMessageContent = (message: any) => {
        if (message.content) return message.content;
        if (message.parts) {
            return message.parts.map((part: any) => part.text || part.content || '').join('');
        }
        return 'No content';
    };
    
  return (
    <div className='flex flex-col gap-3 px-4 py-2 h-full max-w-full overflow-auto '>
        {messages.map((message, index) => (
            <div key={message.id || index} 
                className={cn("flex max-w-full",
                {
                    "justify-end" : message.role === "user",
                    "justify-start" : message.role === "assistant"
                }
                )}>

                <div className={cn("rounded-lg px-3 py-2 text-sm shadow-md max-w-xs lg:max-w-md break-words",
                {
                    "bg-blue-600 text-white" : message.role === "user",
                    "bg-gray-200 text-black " : message.role === "assistant"
                }
                )}>
                    {/* Role indicator */}
                    <div className="text-xs opacity-70 mb-1 font-medium">
                        {message.role === 'user' ? 'You' : 'AI'}
                    </div>
                    <div>{getMessageContent(message)}</div>
                </div>
            </div>
        ))
        }
    </div>
  )
}

export default MessageList