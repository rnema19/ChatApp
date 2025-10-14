"use client"
import React, { useEffect } from 'react'
import { useChat } from '@ai-sdk/react';
import { useState } from 'react';
import { Button } from './ui/button';
import { Send } from 'lucide-react';
import MessageList from './MessageList';
import { DefaultChatTransport } from 'ai';
import { Input } from './ui/input';

type Props = {
    chatId : number
}

const ChatComponent = ({chatId}: Props) => {

    const { messages, sendMessage} = useChat({
        transport: new DefaultChatTransport({
        api: '/api/chat',
        body : {chatId}
        }),
    });
    const [input, setInput] = useState('');

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>){
        setInput(e.target.value)
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        if (input.trim()) {
            sendMessage({ text: input });
            setInput('');
        }
    }

    useEffect(()=>{
        const messageContainer = document.getElementById("message-container")
        if (messageContainer) {
            messageContainer.scrollTo({
                top : messageContainer.scrollHeight,
                behavior : 'smooth'
            })
        }
    },[messages])

    return (
        <div className='relative h-full w-full overflow-auto p-2 bg-gradient-to-r from-yellow-200 via-green-200 to-green-300 flex flex-col' id='message-container'>
            <div className='py-2 bg-blue-950 text-white font-bold text-center rounded-lg text-xl mb-2'>
                Chat
            </div>

            <div>
                <MessageList messages={messages}/>
            </div>

            <div className='relative bottom-0 left-0 right-0 bg-white border-2 border-gray-400 rounded-lg flex justify-center p-1 max-w-full'>
                <form 
                    onSubmit={(e) => 
                        handleSubmit(e)
                    }
                    className='flex items-center flex-3'>
                    <Input
                        value={input} 
                        onChange={(e)=>handleInputChange(e)}
                        placeholder='Shoot your questions...'
                        className='flex-3 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500'
                    />
                    <Button className='bg-blue-700 ml-1 mr-1 hover:bg-violet-950'>
                        <Send className='h-4 w-4'></Send>
                    </Button>
                </form>
            </div>
        </div>
    )
}

export default ChatComponent