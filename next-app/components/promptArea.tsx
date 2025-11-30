import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"

export function TextareaWithButton() {



  return (
    <div className="flex flex-row justify-center items-center w-full gap-2 rounded-2xl">
      <Textarea className="p-3 w-full "placeholder="Ask Anything About The Uploaded PDF" onChange={()=>{

      }} />
      <Button>Send</Button>
    </div>
  )
}
