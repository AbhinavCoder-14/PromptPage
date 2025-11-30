"use client"; // Essential for Next.js App Router

import React, { createContext, useContext, useState } from "react";
import { useChat } from "@ai-sdk/react";

// 1. Define the shape of your context (optional but recommended for TS)
type SidebarContextType = {
    isOpen: boolean;
    input:string;
    setInput:any;
    webSearch:boolean;
    setWebSearch:any;
    messages:any;
    sendMessage:any;
    status:any;
    regenerate:any;
};

// 2. Create the Context (Not exported, kept internal)
const PromptData = createContext<SidebarContextType | null>(null);

// 3. The Provider Component (Exported)
// This is where your state/hook logic lives!
export function SidebarProvider({ children }: { children: React.ReactNode }) {
  // --- YOUR LOGIC STARTS HERE ---
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [webSearch, setWebSearch] = useState(false);
  const { messages, sendMessage, status, regenerate } = useChat();

  const toggle = () => setIsOpen((prev) => !prev);
  // --- YOUR LOGIC ENDS HERE ---

  return (

    <PromptData.Provider value={{ isOpen,isOpen,input,setInput,webSearch,setWebSearch,messages,sendMessage,status,regenerate}}>
      {children}
    <PromptData.Provider/>
  );
}

// 4. The Custom Hook (Exported)
// This is the ONLY thing your components need to import to use the data.
export function PromptDataObj() {
  const context = useContext(PromptData);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}