import { useState } from "react";

interface ReactionProps {
  emoji: string;
  count: number;
  users: string[];
}

function Reaction({ emoji, count, users }: ReactionProps) {
  const [showReactors, setShowReactors] = useState(false);

  const reactorsText = users.reduce((prev, curr, idx, arr) => {
    if (idx === 0) {
      return curr;
    }
    if (idx === arr.length - 1) {
      return `${prev}, and ${curr}`;
    }
    return `${prev}, ${curr}`;
  });

  return (
    <>
      <div
        onMouseEnter={() => setShowReactors(true)}
        onMouseLeave={() => setShowReactors(false)}
        className="relative"
      >
        {showReactors && (
          <>
            <div className="absolute p-1 rounded-lg text-center bg-secondary dark:bg-primary w-32 bottom-10 -right-1/2 z-10">
              {`${reactorsText} reacted with ${emoji}`}
            </div>
            <div className="absolute bottom-7 -right-[3px] border-l-transparent border-r-transparent border-l-[16px] border-r-[16px] border-t-[16px] border-t-primary"></div>
          </>
        )}
        <div className="bg-secondary text-quaternary dark:bg-primary rounded-lg px-1.5 pt-1 text-left relative top-0.5">
          {emoji} {count}
        </div>
      </div>
    </>
  );
}

export default Reaction;
