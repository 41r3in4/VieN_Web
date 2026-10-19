'use client';
import { useEffect,useRef,useState,type FormEvent } from 'react';
import { Bot,Send,RotateCcw } from 'lucide-react';
import { ASSISTANT_TOPICS,assistantReply,type AssistantMessage } from '@/lib/heritage-assistant';

export function AiChatPanel() {
  const [messages,setMessages]=useState<AssistantMessage[]>([]);
  const [text,setText]=useState('');
  const stream=useRef<HTMLDivElement>(null);
  useEffect(()=>{ if(stream.current) stream.current.scrollTop=stream.current.scrollHeight; },[messages]);
  function send(question:string) {
    const content=question.trim();
    if(!content) return;
    setMessages(previous=>[...previous,{role:'user',content},{role:'assistant',content:assistantReply(content)}]);
    setText('');
  }
  function submit(event:FormEvent) { event.preventDefault(); send(text); }
  return <div className="ai-chat-panel">
    <div className="ai-chat-toolbar"><span><Bot size={16}/> Trợ lý VieN</span><button type="button" disabled={!messages.length} onClick={()=>setMessages([])}><RotateCcw size={14}/> Cuộc trò chuyện mới</button></div>
    <div ref={stream} className="community-stream ai-stream" aria-live="polite" aria-relevant="additions text">
      <p className="community-channel-note">Trợ lý tự động · Trả lời theo nội dung có sẵn, không kết nối dịch vụ AI.</p>
      {!messages.length && <div className="ai-welcome"><div className="ai-bot-mark"><Bot size={30}/></div><h3>Cùng VieN khám phá di sản</h3><p>Chọn chủ đề hoặc nhập câu hỏi để được hướng dẫn.</p></div>}
      {messages.map((message,index)=><article key={index} className={`ai-message ai-message-${message.role}`}><strong>{message.role==='user'?'Bạn':'Trợ lý VieN'}</strong><div>{message.content}</div></article>)}
      <div className="ai-suggestions" aria-label="Các câu hỏi có sẵn">{ASSISTANT_TOPICS.map(item=><button type="button" key={item.question} onClick={()=>send(item.question)}>{item.question}</button>)}</div>
    </div>
    <p className="ai-chat-note">Nội dung trò chuyện chỉ giữ trong cửa sổ này và được xóa khi đóng.</p>
    <form className="community-composer ai-composer" onSubmit={submit}><textarea value={text} onChange={event=>setText(event.target.value)} maxLength={2000} rows={2} placeholder="Hỏi về di sản hoặc cách dùng VieN…" aria-label="Câu hỏi dành cho trợ lý"/><button type="submit" disabled={!text.trim()} aria-label="Gửi câu hỏi"><Send size={19}/></button></form>
  </div>;
}
