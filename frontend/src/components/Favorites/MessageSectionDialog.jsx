import * as React from "react";

import { useMediaQuery } from '@custom-react-hooks/use-media-query'
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import MessageSection from "./MessageSection";
import UserProfile from "./UserProfile";

    function MessageSectionDialog({
    children,
    clientName,
    productOwnerName,
    initialMessages,
    activeStatus,
    }) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  if (isDesktop) {
    return (
      <Dialog className="max-h-[460px]">
        <DialogTrigger>
          {children}
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              <UserProfile
                classname="border-b-1 "
                activeStatus={activeStatus}
                username={productOwnerName}
              ></UserProfile>
            </DialogTitle>
            <DialogDescription>
              <MessageSection
                clientName={clientName}
                productOwnerName={productOwnerName}
                initialMessages={initialMessages}
              ></MessageSection>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger>
      {children}
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>
            <UserProfile
              classname="border-b-1 "
              activeStatus={activeStatus}
              username={productOwnerName}
            ></UserProfile>
          </DrawerTitle>
        </DrawerHeader>

          <DrawerDescription>
            <MessageSection
              clientName={clientName}
              productOwnerName={productOwnerName}
              initialMessages={initialMessages}
            ></MessageSection>
          </DrawerDescription>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default MessageSectionDialog;
