
'use client'

import { signInWithGoogle } from "@/lib/auth-action"
import { Button } from "./ui/button"



const SigninWithGoogleButton = () =>{
    return(
        <Button type="submit" formAction={signInWithGoogle} variant='outline' className="w-full">
            Login with Google
        </Button>
    )
}



export default SigninWithGoogleButton;