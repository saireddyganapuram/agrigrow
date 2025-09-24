import { useState, useRef } from 'react'
import { getChatResponse, uploadPdf } from '../lib/api'

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm AgriBot. How can I help you today?", sender: 'bot' }
  ])
  const [inputText, setInputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef(null)

  const predefinedResponses = {
    'hello': 'Hello! How can I assist you with your farming needs?',
    'hi': 'Hi there! What farming question can I help you with?',
    'crop': 'I can help you with crop selection, planting schedules, and crop care tips. What specific crop are you interested in?',
    'weather': 'For weather information, I recommend checking local weather services. Generally, monitor rainfall and temperature for optimal crop growth.',
    'fertilizer': 'For fertilizers, consider soil testing first. Organic compost and NPK fertilizers are commonly used. What crop do you need fertilizer advice for?',
    'pest': 'For pest control, identify the pest first. Use integrated pest management - combine biological, cultural, and chemical methods when necessary.',
    'irrigation': 'Proper irrigation depends on crop type and soil. Drip irrigation is efficient for water conservation. What irrigation method are you considering?',
    'help': 'I can help with: crop advice, fertilizers, pest control, irrigation, weather tips, and general farming questions. What would you like to know?'
  }

  const getBotResponse = async (userMessage) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        return "Please login to use the chatbot."
      }

      const response = await getChatResponse(userMessage, token)
      return response.response
    } catch (error) {
      console.error('Error getting AI response:', error)
      // Fallback to predefined responses
      const message = userMessage.toLowerCase()
      
      for (const [key, response] of Object.entries(predefinedResponses)) {
        if (message.includes(key)) {
          return response
        }
      }
      
      return "I'm here to help with farming questions! Try asking about crops, fertilizers, pest control, irrigation, or weather."
    }
  }

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return

    const userMessage = { id: Date.now(), text: inputText, sender: 'user' }
    setMessages(prev => [...prev, userMessage])
    setInputText('')
    setIsLoading(true)

    try {
      const responseText = await getBotResponse(inputText)
      const botResponse = { 
        id: Date.now() + 1, 
        text: responseText, 
        sender: 'bot' 
      }
      setMessages(prev => [...prev, botResponse])
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = async (event) => {
    const file = event.target.files[0]
    if (!file || isLoading) return

    if (file.type !== 'application/pdf') {
      alert('Please select a PDF file')
      return
    }

    const userMessage = { 
      id: Date.now(), 
      text: `📄 Uploaded: ${file.name}`, 
      sender: 'user' 
    }
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('Please login to upload files')
      }

      const response = await uploadPdf(file, token)
      const botResponse = { 
        id: Date.now() + 1, 
        text: response.response, 
        sender: 'bot' 
      }
      setMessages(prev => [...prev, botResponse])
    } catch (error) {
      console.error('Error uploading PDF:', error)
      const errorMessage = error.response?.data?.details || error.message || 'Unknown error'
      const errorResponse = { 
        id: Date.now() + 1, 
        text: `Failed to analyze PDF: ${errorMessage}. Please try again or ask me a direct question.`, 
        sender: 'bot' 
      }
      setMessages(prev => [...prev, errorResponse])
    } finally {
      setIsLoading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage()
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-96 h-[500px] bg-white rounded-lg shadow-xl border border-agri-200 flex flex-col">
          {/* Header */}
          <div className="bg-agri-600 text-white p-3 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">🤖</span>
              <span className="font-medium">AgriBot</span>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-agri-200"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-3 overflow-y-auto space-y-2">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-sm px-3 py-2 rounded-lg text-sm ${
                    message.sender === 'user'
                      ? 'bg-agri-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 px-3 py-2 rounded-lg text-sm flex items-center gap-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-agri-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-agri-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-agri-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                  <span className="text-gray-600">AgriBot is thinking...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-200">
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about farming..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-agri-500"
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading}
                className="px-3 py-2 bg-agri-600 text-white rounded-lg hover:bg-agri-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Sending...' : 'Send'}
              </button>
            </div>
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className="flex items-center gap-1 px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50"
              >
                📎 Upload PDF
              </button>
              <span className="text-xs text-gray-500">Upload agricultural documents for analysis</span>
            </div>
          </div>
        </div>
      )}

      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-20 h-20 bg-agri-600 text-white rounded-full shadow-lg hover:bg-agri-700 flex items-center justify-center text-4xl transition-colors"
      >
        🤖
      </button>
    </div>
  )
}