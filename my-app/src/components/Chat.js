import { ChatInput } from "./ChatInput";
import { ChatLoader } from "./ChatLoader";
import { ChatBubble } from "./ChatBubble";

export const Chat = ({ messages, loading, onSendMessage }) => {
  return (
    <>
      <div className="fles fles-col rounded-lg px-2 sm:p-4 sm:border border-neutral-300">
        {messages.map((message, index) => (
          <div key={index} className="my-1 sm:my-1.5">
            <ChatBubble message={message} />
          </div>
        ))}

        {loading && (
          <div className="my-1 sm:my-1.5">
            <ChatLoader />
          </div>
        )}

        <div className="mt-4 sm:mt-8 bottom-[56px] left-0 w-full">
          <ChatInput onSendMessage={onSendMessage} />
        </div>
      </div>
    </>
  );
};
