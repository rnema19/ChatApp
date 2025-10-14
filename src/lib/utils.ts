import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function convertTOAscii(inputString:string){
  // Pinecone namespace: allow only lowercase letters, digits, hyphen and underscore; replace others with '-'
  const lower = (inputString || "").toLowerCase()
  const sanitized = lower.replace(/[^a-z0-9_-]+/g, "-")
  // Collapse multiple dashes and trim to 64 chars (Pinecone namespace limit)
  const collapsed = sanitized.replace(/-+/g, "-").replace(/^[-_]+|[-_]+$/g, "")
  return collapsed.substring(0, 64)
}
