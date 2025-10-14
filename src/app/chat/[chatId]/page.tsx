import { db } from '@/lib/db'
import { chats } from '@/lib/db/schema'
import { auth } from '@clerk/nextjs/server'
import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import React from 'react'
import toast from 'react-hot-toast'
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
  console.log("chat id: ", parseInt(chatId));
  
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
    return chat.id === parseInt(chatId)
  })!
  
  // Extract userId from the current chat
  const chatUserId = currentChat.userId
  console.log("User ID from current chat:", chatUserId)
  console.log("Authenticated user ID:", userId)

  if (!currentChat) {
      // toast.error("No chat present with that ID!!!")
      console.log("No chat present with that ID!!!");      
      return redirect('/')
  }
  return (
    <div className='flex max-h-screen overflow-scroll'>
      <div className='flex w-full max-h-screen overflow-auto'>

        {/* chat sidebar */}
        <div className='flex-2 max-w-sw'>
          <ChatSideBar chats={allChats} chatId={parseInt(chatId)}/>
        </div>

        {/* pdf viewer */}
        <div className='flex-6 max-h-screen px-4 py-2 overflow-scroll'>
          <PDFViewerWrapper pdfURL={currentChat?.pdfUrl || ""}/>
        </div>

        {/* chat Component */}
        <div className='flex-3 border-l-2 border-l-slate-500' >
          <ChatComponent chatId={parseInt((await params).chatId)}/>
        </div>
      </div>
    </div>
  )
}

export default ChatPage