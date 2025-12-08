import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { usePromptDataObj } from "@/app/context/chatContext"


import {
  PromptInput,
  PromptInputActionAddAttachments,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuTrigger,
  PromptInputAttachment,
  PromptInputAttachments,
  PromptInputBody,
  PromptInputButton,
  PromptInputHeader,
  type PromptInputMessage,
  PromptInputSelect,
  PromptInputSelectContent,
  PromptInputSelectItem,
  PromptInputSelectTrigger,
  PromptInputSelectValue,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";


export function TextareaWithButton() {
  const {input, setInput, isOpen, setIsOpen,messages,sendMessage, status, regenerate,webSearch, setWebSearch,model, setModel} = usePromptDataObj();


  const handleSubmit = (message: PromptInputMessage) => {

      console.log("Entered in handle submit function")
      const hasText = Boolean(message.text);
      const hasAttachments = Boolean(message.files?.length);
      if (!(hasText || hasAttachments)) {
        return;
      }
      sendMessage(
        {
          text: message.text || "Sent with attachments",
          files: message.files,
        },
        {
          body: {
            model: model,
            webSearch: webSearch,
          },
        }
      );
      setInput("");
    };




  return (
    <div className="flex flex-row justify-center items-center w-full gap-2 rounded-2xl ">
      {/* <input className="p-2 w-full "placeholder="Ask Anything About The Uploaded PDF" onChange={()=>{ */}
      <Textarea className= "border-input focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive flex w-full px-3 text-base transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm flex-1 resize-none rounded-none border-0 bg-transparent py-3 shadow-none focus-visible:ring-0 dark:bg-transparent field-sizing-content max-h-48 min-h-16" placeholder="Ask anything about the pdf" onChange={(e)=>{
        setInput(e.target.value)
        
      }} />
      <Button onClick={()=>handleSubmit({text: input, files: []})}>Send</Button>
    </div>
  )
}
