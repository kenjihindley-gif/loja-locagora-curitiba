"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function BackButton({ className }: { className?: string }) {
  const router = useRouter()
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={() => router.back()} 
      className={cn("hover:bg-white/10 p-2 rounded-full transition-all active:scale-95 duration-150", className)}
    >
      <ArrowLeft />
    </Button>
  )
}
