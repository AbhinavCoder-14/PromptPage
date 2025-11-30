import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"

export function TextareaWithButton() {

  



  return (
    <div className="flex flex-row justify-center items-center w-full gap-2 rounded-2xl ">
      {/* <input className="p-2 w-full "placeholder="Ask Anything About The Uploaded PDF" onChange={()=>{ */}
      <Textarea className= "border-input focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive flex w-full px-3 text-base transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm flex-1 resize-none rounded-none border-0 bg-transparent py-3 shadow-none focus-visible:ring-0 dark:bg-transparent field-sizing-content max-h-48 min-h-16" placeholder="Ask anything about the pdf" onChange={()=>{

      }} />
      <Button>Send</Button>
    </div>
  )
}
