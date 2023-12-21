'use client';
import { useState } from 'react';
import { Resizable } from 're-resizable';
import {
  ChattingContainer,
  ChattingHeader,
  ChattingTab,
} from './Chatting.styles';
import GeneralChatting from './GeneralChatting';
import AIChatting from './AIChatting';
import useGeneralChatStore from '@/store/useChattingStore';

const Chatting = () => {
  const [activeTab, setActiveTab] = useState<string>('채팅');
  const users = useGeneralChatStore(state => state.users);

  const handleClick = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <Resizable
      defaultSize={{
        width: '300px',
        height: 'calc(100vh - 50px)',
      }}
      enable={{
        top: false, // 위쪽으로만 리사이징 가능
        right: false,
        bottom: false,
        left: true,
        topRight: false,
        bottomRight: false,
        bottomLeft: false,
        topLeft: false,
      }}
      minWidth={'140px'}
      maxWidth={'400px'}
    >
      <ChattingContainer>
        <ChattingHeader>
          <ChattingTab
            onClick={() => handleClick(`채팅 (${users})`)}
            $isActive={activeTab === `채팅 (${users})`}
          >
            {`채팅 (${users})`}
          </ChattingTab>
          <ChattingTab
            onClick={() => handleClick('AI✨')}
            $isActive={activeTab === 'AI✨'}
          >
            AI✨
          </ChattingTab>
        </ChattingHeader>
        {activeTab === `채팅 (${users})` ? <GeneralChatting /> : <AIChatting />}
      </ChattingContainer>
    </Resizable>
  );
};

export default Chatting;
