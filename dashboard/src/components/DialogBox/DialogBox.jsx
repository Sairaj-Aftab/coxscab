import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

const DialogBox = ({ button, title, children, button2 }) => {
  return (
    <>
      <Dialog>
        <DialogTrigger>{button}</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <>{children}</>
          <DialogFooter>{button2}</DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DialogBox;
