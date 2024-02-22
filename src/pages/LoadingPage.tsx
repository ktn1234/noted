import { AiOutlineLoading3Quarters } from "react-icons/ai";

function LoadingPage() {
  return (
    <>
      <div className="fixed flex justify-center items-center w-full max-h-full inset-0 z-50">
        <AiOutlineLoading3Quarters className="animate-spin" size={"2em"} />
      </div>
    </>
  );
}

export default LoadingPage;
