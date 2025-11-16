
'use client'

import { signInWithGoogle } from "@/lib/auth-action"
import { Button } from "./ui/button"



const SigninWithGoogleButton = () =>{
    return(
        <Button type="button" variant='outline' className="w-full" onClick={()=>{
            signInWithGoogle();
        }}>
            Login with Google
        </Button>
    )
}



export default SigninWithGoogleButton;