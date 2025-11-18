

import { LoginForm } from "@/components/login-form";
import { createClient } from "@/utils/supabase/client";
import { Crete_Round } from "next/font/google";
// import { useEffect, useState } from "react";
import { redirect } from "next/navigation";

export default async function Page() {
  const client = await createClient();

  // const [user, setUser] = useState<any>(null);

  // useEffect(() => {
  //   const fetchUser = async () => {
  //     const {
  //       data: { user },
  //     } = await client.auth.getUser();
  //     setUser(user);
  //   };

  //   fetchUser();
  // }, []);

  // if (user !== null) {
  //   return (<>{redirect("/")}</>);
  // }

  return (
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </div>
    );
}
