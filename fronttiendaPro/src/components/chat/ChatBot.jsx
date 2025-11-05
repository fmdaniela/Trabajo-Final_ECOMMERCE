import { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
import chatService from '../../services/chatService';

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Cargar historial guardado
  useEffect(() => {
    const saved = localStorage.getItem('chatHistory');
    if (saved) {
      setMessages(JSON.parse(saved));
    } else {
      setMessages([
        { sender: 'bot', text: '👋 ¡Hola! Soy el asistente virtual de Vitalia. ¿En qué puedo ayudarte hoy?', time: new Date().toISOString() }
      ]);
    }
    setOpen(false); // empieza cerrado
  }, []);

  // Guardar historial
  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(messages));
  }, [messages]);

  // Scroll automático
  useEffect(() => {
    const chatDiv = document.getElementById("chatMessages");
    if (chatDiv) {
      setTimeout(() => { chatDiv.scrollTop = chatDiv.scrollHeight; }, 100);
    }
  }, [messages, open]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.toLowerCase();
    const timeNow = new Date().toISOString();
    const newMessage = { sender: 'user', text: input, time: timeNow };
    setMessages((prev) => [...prev, newMessage]);
    setInput('');
    setLoading(true);

    try {
      let respuestaLocal = null;

      // ✨ Saludos
      const saludoKeywords = ["hola", "buenos días", "buenas", "hi", "hey"];
      if (saludoKeywords.some(k => userText.includes(k))) {
        respuestaLocal = "👋 ¡Hola! Soy el asistente virtual de Vitalia. ¿En qué puedo ayudarte?";
      } else if (userText.includes("stock")) {
        respuestaLocal = "🩷 ¡Sí! Hay stock disponible. Podés verlo de acuerdo a la talla y color el detalle del producto";
      } else {
        // Pregunta sobre talles, colores, productos o info general -> pasar al backend
        const res = await chatService.sendMessage(input);
        respuestaLocal = res.reply;
      }

      const botReply = { sender: 'bot', text: respuestaLocal, time: new Date().toISOString() };
      setMessages((prev) => [...prev, botReply]);

    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: 'Hubo un error al obtener respuesta.', time: new Date().toISOString() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-5 right-5 bg-pink-600 hover:bg-pink-700 text-white p-3 rounded-full shadow-lg transition"
      >
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {open && (
        <div className="fixed bottom-20 right-5 w-80 max-h-[500px] bg-white shadow-2xl rounded-2xl border border-gray-200 flex flex-col">
          <div className="bg-pink-600 text-white p-3 rounded-t-2xl text-center font-semibold">
            Asistente Vitalia 🛍️
          </div>

          <div
            className="flex-1 p-3 overflow-y-auto overflow-x-hidden space-y-2 max-h-[400px]"
            id="chatMessages"
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-2 rounded-lg max-w-[70%] break-words ${msg.sender === 'user' ? 'bg-pink-100 self-end ml-auto' : 'bg-gray-100 text-gray-800'}`}
              >
                <div>{msg.text}</div>
                <div className="text-[10px] text-gray-400 text-right mt-1">
                  {formatTime(msg.time)}
                </div>
              </div>
            ))}
            {loading && <p className="text-sm text-gray-400">Escribiendo...</p>}
          </div>

          <form onSubmit={handleSend} className="p-2 border-t flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribí tu mensaje..."
              className="flex-1 border rounded-lg p-2 text-sm focus:outline-none"
            />
            <button
              type="submit"
              className="bg-pink-600 text-white px-3 rounded-lg hover:bg-pink-700"
              disabled={loading}
            >
              Enviar
            </button>
          </form>
        </div>
      )}
    </>
  );
}






