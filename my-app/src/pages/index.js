import Head from "next/head";
import { Chat } from "@/components/Chat";
import { useEffect, useRef, useState } from "react";
import { db } from "@/firebase";
import {
  collection,
  query,
  doc,
  getDocs,
  addDoc,
  deleteDoc,
  orderBy,
} from "firebase/firestore";

const issave = true;
const logs = collection(db, "messagelogs");

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async (message) => {
    const updatedMessages = [...messages, message];
    console.log(updatedMessages);
    setMessages(updatedMessages);
    setLoading(true);

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: updatedMessages.slice(-6),
      }),
    });

    console.log(1, response);
    if (!response.ok) {
      setLoading(false);
      throw new Error(response.statusText);
    }

    if (issave) {
      const now = new Date();
      const docRef = await addDoc(logs, {
        role: message.role,
        content: message.content,
        date: now,
      });
    }

    const result = await response.json();
    if (!result) {
      return;
    }

    console.log(result);
    setLoading(false);
    setMessages((messages) => [...messages, result]);

    if (issave) {
      const now = new Date();
      const docRef = await addDoc(logs, {
        role: result.role,
        content: result.content,
        date: now,
      });
    }
  };

  const handleReset = async () => {
    const q = query(logs, orderBy("date", "asc"));
    const logs_data = await getDocs(q);
    const logs_arr = [];
    logs_data.docs.forEach((doc) => {
      logs_arr.push({
        role: doc.data()["role"],
        content: doc.data()["content"],
      });
    });
    setMessages([
      ...logs_arr,
      {
        role: "assistant",
        content: "안녕? 나는 영희야. 오늘은 무슨 일이 있었니?",
      },
    ]);
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    handleReset();
  }, []);

  const deletelog = async () => {
    const q = query(logs);
    const logs_data = await getDocs(q);
    logs_data.forEach((doc) => {
      deleteDoc(doc.ref);
    });
    setMessages([
      {
        role: "assistant",
        content: "챗봇 'GPT'입니다. 무엇을 도와드릴까요?",
      },
    ]);
  };
  return (
    <>
      <Head>
        <title> A Simple Chatbot </title>
        <meta name="description" content="A Simple Chatbot" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex flex-col h-screen">
        <div className="flex h-[50px] sm:h-[60px] border-b border-neutral-300 py-2 px-2 sm:px-8 items-center justify-between">
          <div className="font-bold text-3xl flex text-center">
            <a
              className="ml-2 hover:opacity-50"
              href="https://code-scaffold.vercel.app"
            >
              A Simple Chatbot
            </a>
          </div>
        </div>

        <div className="flex-1 overflow-auto sm:px-10 pb-4 sm:pb-10">
          <div className="max-w-[800px] mx-auto mt-4 sm:mt-12">
            <Chat
              messages={messages}
              loading={loading}
              onSendMessage={handleSend}
            />

            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="flex h-[30px] sm:h-[50px] border-t border-neutral-300 py-2 px-8 items-center sm:justify-between justify-center"></div>
      </div>
    </>
  );
}
