import { db } from '@/lib/db'
import { chats } from '@/lib/db/schema'
import { auth } from '@clerk/nextjs/server'
import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import React from 'react'
import ChatSideBar from '@/components/ChatSideBar'
import PDFViewerWrapper from '@/components/PDFViewerWrapper'
import ChatComponent from '@/components/ChatComponent'

type Props = {
  params : Promise<{
    chatId : string
  }>
}

const ChatPage = async({params}: Props) => {
  const {chatId} = await params
  const parsedChatId = Number.parseInt(chatId, 10)
  console.log("chat id: ", parsedChatId);
  
  if (Number.isNaN(parsedChatId)) {
      console.log("Invalid chat ID!!!")
      return redirect('/')
  }
  
  const {userId} = await auth()
  if (!userId) {
      // toast.error("Sign in first!!!")
      console.log("Sign in first!!");
      return redirect('/sign-in')
  }
  
  const allChats = await db.select().from(chats).where(eq( chats.userId, userId))
  if (!allChats) {
      // toast.error("No chats present!")
      console.log("No chats present!");      
      return redirect('/')
  }
  // return allChats

  const currentChat = allChats.find((chat)=>{
    return Number(chat.id) === parsedChatId
  })
  console.log("currentChat: ", currentChat);

  if (!currentChat) {
      // toast.error("No chat present with that ID!!!")
      console.log("No chat present with that ID!!!");      
      return redirect('/')
  }

  // Extract userId from the current chat
  const chatUserId = currentChat.userId
  console.log("User ID from current chat:", chatUserId)
  console.log("Authenticated user ID:", userId)

  return (
    <div className='flex max-h-screen overflow-scroll'>
      <div className='flex w-full max-h-screen overflow-auto'>

        {/* chat sidebar */}
        <div className='flex-2 max-w-sw'>
          <ChatSideBar chats={allChats} chatId={parsedChatId}/>
        </div>

        {/* pdf viewer */}
        <div className='flex-6 max-h-screen px-4 py-2 overflow-scroll'>
          <PDFViewerWrapper pdfURL={currentChat?.pdfUrl || ""}/>
        </div>

        {/* chat Component */}
        <div className='flex-3 border-l-2 border-l-slate-500' >
          <ChatComponent chatId={parsedChatId}/>
        </div>
      </div>
    </div>
  )
}

export default ChatPage
