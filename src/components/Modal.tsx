import Button from "./Button";

interface ModalProps {
  text: string;
  closeModal: () => void;
}

function Modal({ text, closeModal }: ModalProps) {
  return (
    <div className="fixed flex justify-center items-center inset-0 z-50">
      <div className="p-3 flex flex-col justify-between bg-primary dark:bg-quaternary  text-center rounded-lg min-h-28 max-w-96">
        <span className="mx-5 text-quaternary dark:text-primary">{text}</span>
        <Button text="Dismiss" onClick={closeModal} />
      </div>
    </div>
  );
}

export default Modal;
