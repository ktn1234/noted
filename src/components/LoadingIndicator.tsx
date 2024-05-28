import { AiOutlineLoading3Quarters } from "react-icons/ai";

interface LoadingIndicatorProps {
  className?: string;
}

function LoadingIndicator({ className }: LoadingIndicatorProps): JSX.Element {
  return (
    <>
      <div
        className={`flex justify-center items-center w-full max-h-full inset-0 z-50 ${className}`}
      >
        <AiOutlineLoading3Quarters className="animate-spin" size={"2em"} />
      </div>
    </>
  );
}

export default LoadingIndicator;
