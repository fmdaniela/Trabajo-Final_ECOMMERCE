import api from './api'; 

const chatService = {
  sendMessage: async (message) => {
    const { data } = await api.post('/chat/chat-query', { message });
    return data;
  },
};

export default chatService;
