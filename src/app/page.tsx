import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import FileUpload from "@/components/FileUpload";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { ArrowRight } from "lucide-react";

export default async function Home() {
  const {userId} = await auth()
  const isAuth = !!userId
  let userChats = null
  if (userId) {
      const userChatList = await db.select().from(chats).where(eq(chats.userId,userId))
      if (userChatList && userChatList.length > 0) {
        userChats = userChatList[0]
      }
  }
  return (
    <div className="w-screen min-h-screen bg-gradient-to-tr from-green-200 via-green-400 to-purple-700 flex 
    items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="flex flex-col items-center text-center">
          <h1 className="mr-3 text-5xl font-semibold mb-3">Chat with any PDF</h1>
            <UserButton />
        
          <p className="max-w-xl mt-2 mb-2 text-lg text-slate-600">
              Hey, you want to talk with your document? Let's chat with your document to extract information, data, insights to reduce your manual efforts just with the help of AI.
          </p>

          <div className="flex mt-2">
            {isAuth && userChats &&
            (
              <> 
                <Link href={`/chat/${userChats.id}`}>
                  <Button className="cursor-pointer">Go to Chats <ArrowRight className="ml-1"/></Button> 
                </Link> 
              </>
            )
            }
          </div>
          <div className="w-full mt-4">
             { isAuth ? (
              <FileUpload/>
             ):
             (
                <Link href={"/sign-in"}>
                  <Button className="cursor-pointer">
                    Login to get Started!
                  </Button>
                </Link>
              )}
          </div>
        </div>
      </div>
    </div>

    
  );
}
