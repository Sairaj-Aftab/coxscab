import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

const DialogBox = ({
  open,
  onOpenChange,
  openButton,
  title,
  children,
  button2,
}) => {
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTrigger>{openButton}</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <>{children}</>
          {button2 && <DialogFooter>{button2}</DialogFooter>}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DialogBox;
