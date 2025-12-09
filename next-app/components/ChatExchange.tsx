"use client";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
  MessageActions,
  MessageAction,
} from "@/components/ai-elements/message";
import { CopyIcon, RefreshCcwIcon } from "lucide-react";
import {
  Source,
  Sources,
  SourcesContent,
  SourcesTrigger,
} from "@/components/ai-elements/sources";
import { Loader } from "@/components/ai-elements/loader";
import { usePromptDataObj } from "@/app/context/chatContext";

const ChatBotDemo = () => {
  const {
    messages,
    status,
    regenerate,
  } = usePromptDataObj();
  console.log(messages)

  return (
    <div className="max-w-4xl mx-auto p-6 relative size-full rounded-2xl">
      <div className="flex flex-col h-full">
        <Conversation className="h-full">
          <ConversationContent>
            {messages.map((message: any) => (
              <div key={message.id}>
                {message.role === "assistant" &&
                  message.parts &&
                  message.parts.filter((part: any) => part.type === "source-url")
                    .length > 0 && (
                    <Sources>
                      <SourcesTrigger
                        count={
                          message.parts.filter(
                            (part: any) => part.type === "source-url"
                          ).length
                        }
                      />
                      {message.parts
                        .filter((part: any) => part.type === "source-url")
                        .map((part: any, i: any) => (
                          <SourcesContent key={`${message.id}-${i}`}>
                            <Source
                              key={`${message.id}-${i}`}
                              href={part.url}
                              title={part.url}
                            />
                          </SourcesContent>
                        ))}
                    </Sources>
                  )}

                {message.content ? (
                  <Message from={message.role}>
                    <MessageContent>
                      <MessageResponse>{message.content}</MessageResponse>
                    </MessageContent>
                    {message.role === "assistant" &&
                      messages.indexOf(message) === messages.length - 1 && (
                        <MessageActions>
                          <MessageAction
                            onClick={() => regenerate()}
                            label="Retry"
                          >
                            <RefreshCcwIcon className="size-3" />
                          </MessageAction>
                          <MessageAction
                            onClick={() =>
                              navigator.clipboard.writeText(message.content)
                            }
                            label="Copy"
                          >
                            <CopyIcon className="size-3" />
                          </MessageAction>
                        </MessageActions>
                      )}
                  </Message>
                ) : (
                  /* 3. Fallback for 'parts' if content is empty (e.g. older logic) */
                  message.parts?.map((part: any, i: any) => {
                    if (part.type === "text") {
                      return (
                        <Message key={`${message.id}-${i}`} from={message.role}>
                          <MessageContent>
                            <MessageResponse>{part.text}</MessageResponse>
                          </MessageContent>
                        </Message>
                      );
                    }
                    return null;
                  })
                )}
              </div>
            ))}
            
            {/* Loading Indicator */}
            {status === "submitted" && <Loader />}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>
      </div>
    </div>
  );
};

export default ChatBotDemo;