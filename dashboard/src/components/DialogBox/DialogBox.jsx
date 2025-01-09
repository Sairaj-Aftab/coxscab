/* eslint-disable react/prop-types */
import {
  Dialog,
  DialogContent,
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
  onPointerDownOutside,
  onInteractOutside,
}) => {
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>{openButton}</DialogTrigger>
        <DialogContent
          className="max-h-[95vh] sm:max-w-[625px] overflow-y-auto"
          // onClick={(e) => e.stopPropagation()}
          onPointerDownOutside={onPointerDownOutside}
          onInteractOutside={onInteractOutside}
        >
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
