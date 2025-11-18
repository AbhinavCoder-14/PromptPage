import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export function TextareaWithButton() {
  return (
    <div className="flex flex-row justify-center items-center w-full gap-2 mt-4">
      <Textarea className="p-3 w-full "placeholder="Type your message here." />
      <Button>Send</Button>
    </div>
  )
}
