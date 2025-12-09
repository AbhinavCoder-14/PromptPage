import { streamText, UIMessage, convertToModelMessages } from "ai";
import { NextResponse } from "next/server";

interface dataType {
  message: string;
}


async function microserviceResponse({
  messages,
  model,
  webSearch,
}: {
  messages: UIMessage[];
  model: string;
  webSearch: boolean;
}) {
  const currentMessage = messages[messages.length - 1];
  console.log(currentMessage);

  const microserviceResponse = await fetch("http://localhost:8000/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(currentMessage),
  });

  if (!microserviceResponse.ok) {
    throw new Error(`Microservice error: ${microserviceResponse.statusText}`);
  }
  const data: dataType = await microserviceResponse.json();

  return data;
}




export async function POST(req: Request) {

    console.log("Enter in backend api")
  const body = await req.json();
    const sessionId = "guest"
  try {
    // const data = await microserviceResponse({
    //   messages: body.messages,
    //   model: body.model,
    //   webSearch: body.webSearch,
    // });

    // console.log(data.message)

    return new Response("this is from ai assistent message....")

    // return NextResponse.json({
    //   role: "assistant",
    //   content: data.message,
    //   data: data,
    // });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  } 
}




