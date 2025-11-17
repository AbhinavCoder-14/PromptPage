"use client";
import { createClient } from "@/utils/supabase/client";
import React, { useState, useEffect } from "react";
import LoginButton from "./loginLogoutbtn";


export default async function GreetPage() {
  const [user, setUser] = useState<any>(null);
  const client = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await client.auth.getUser();
      setUser(user);
    };

    fetchUser();
  }, []);


  if (user!==null) {
    return(<>
        <div>hello {user.user_metadata.full_name ?? "guest user"}</div>
    </>)
  } 

  return <><div>
    Getting started 
    <LoginButton/>
    </div>
    
  
  
  </>;
}
