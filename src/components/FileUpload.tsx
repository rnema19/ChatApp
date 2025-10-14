"use client"
import React, { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import {Inbox,Loader2} from "lucide-react"
import { uploadToS3 } from '@/lib/s3'
import { useMutation } from '@tanstack/react-query'
import toast, { Toaster } from 'react-hot-toast'
import axios from 'axios'
import { useRouter } from 'next/navigation'

const FileUpload = () => {
  const router = useRouter()
  // create state for loading and setloading options to displaying loading after uploading
  const [uploading,setUploading] = useState(false)

  const {mutate} = useMutation({
    mutationFn: async({file_key,file_name}:{file_key:string,file_name:string}) => {
      const response = await axios.post("/api/create-chat",{file_key,file_name})
      return response.data
    },
  })

  const {getRootProps, getInputProps} = useDropzone({
    accept:{"application/pdf":[".pdf"]},
    maxFiles : 1,
    onDrop: async(acceptedFiles, fileRejections) =>{
        const file = acceptedFiles[0]

        if (acceptedFiles.length>0) {
            console.log("Accepted files: ", acceptedFiles);      
        }
        else{
            console.log("Files rejected: ", fileRejections); 
        }
        if (file.size > 10*1024*1024) {
          toast.error("Please upload a smaller file!")
          // alert("Please upload a smaller file!")
          return
        }
        try {
          setUploading(true)
          const data = await uploadToS3(file)
          if (!data?.file_key || !data?.file_name) {
              toast.error("Something went wrong...")              
              // alert("Something went wrong...")
              return
          }
          mutate({
            file_key: data.file_key,
            file_name: data.file_name
            },{
              onSuccess({chat_id}) {
                  toast.success("Successful in creating a chat!")  
                  router.push(`/chat/${chat_id}`)
              },
              onError(error) {
                  toast.error("Something went wrong...");
              },
            })
          console.log("File uploaded to S3! Data: ", data);
        } catch (error) {
          console.error("Failed to upload via Fileuploader: ",error)
        }
        finally{
          setUploading(false)
        }
    },
  })

  return (
    <div className='flex flex-col justify-center'>
        <div {...getRootProps({
            className : "border-dashed border-2 border-blue-700 rounded-2xl bg-gray-200 py-6 flex items-center justify-center cursor-pointer"
        })}>
        <input {...getInputProps()} />
            <div className='flex items-center space-x-1'>{
              uploading ? (
                // Loading state
                <>
                  <Loader2 className='w-10 h-10  text-blue-600 animate-spin'></Loader2>
                  <p className='text-center text-base'>Loading to extract insights...</p>
                </>
              ) : (
                // when not loading
                <>
                  <Inbox className='w-10 h-10  text-blue-800'></Inbox>
                  <p className='text-center text-base'>Drag 'n' drop some files here, or click to select files</p>
                </>
              )
            } 
            
            </div>
            
        </div>
    </div>
  )
}

export default FileUpload