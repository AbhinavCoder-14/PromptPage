"use client"; // Essential for Next.js App Router

import React, { createContext, useContext, useState } from "react";
import { useChat } from "@ai-sdk/react";

// 1. Define the shape of your context (optional but recommended for TS)
type SidebarContextType = {
    isOpen: boolean;
    input:string;
    setIsOpen:any;
    setInput:any;
    webSearch:boolean;
    setWebSearch:any;
    messages:any;
    sendMessage:any;
    status:any;
    regenerate:any;
    model:string;
    setModel:any;
};


const models = [
  {
    name: "GPT 4o",
    value: "openai/gpt-4o",
  },
  {
    name: "Deepseek R1",
    value: "deepseek/deepseek-r1",
  },
];
// 2. Create the Context (Not exported, kept internal)
const PromptData = createContext<SidebarContextType | null>(null);

// 3. The Provider Component (Exported)
// This is where your state/hook logic lives!
export function ChatContext({ children }: { children: React.ReactNode }) {
  // --- YOUR LOGIC STARTS HERE ---
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [webSearch, setWebSearch] = useState(false);
  const { messages, sendMessage, status, regenerate } = useChat();
  const [model, setModel] = useState<string>(models[0].value);

  return (
    <PromptData.Provider value={{ isOpen,setIsOpen,input,setInput,webSearch,setWebSearch,messages,sendMessage,status,regenerate,model,setModel}}>
      {children}
    </PromptData.Provider>
  );
}


export function usePromptDataObj() {
  const context = useContext(PromptData);
  if (!context) {

    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}