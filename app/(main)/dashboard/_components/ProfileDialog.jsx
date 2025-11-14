import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import Credits from './Credits';

function ProfileDialog({children}) {
  return (
    <Dialog>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent>
            <DialogHeader>
            <DialogTitle> 
              //Are you absolutely sure? </DialogTitle>
            <DialogDescription>
               //This action cannot be undone.This will permanently delete your account and remove your date from our servers.
            </DialogDescription>
            <Credits/>
            </DialogHeader>
        </DialogContent>
    </Dialog>
  )
}
export default ProfileDialog;