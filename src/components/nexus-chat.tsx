'use client'

import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {
  X, Send, Loader2, Sparkles,
  Bot, User, Plus, History, ChevronLeft, MessageCircle,
} from 'lucide-react'

// ─── Types ───────────────────────────────────────────────
interface Conversation {
  id: string
  title: string | null
  updatedAt: string
}

interface NexusChatProps {
  userName?: string | null
  isAuthenticated?: boolean
}

// ─── Main Component ──────────────────────────────────────
export function NexusChat({ userName, isAuthenticated = false }: NexusChatProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [hasNewMessage, setHasNewMessage] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Ref to hold the conversationId setter (avoids stale closures in fetch)
  // Ref to hold the conversationId setter (avoids stale closures in fetch)
  const conversationIdRef = useRef<string | null>(null)
  conversationIdRef.current = conversationId

  const {
    messages,
    setMessages,
    status,
    error,
    sendMessage,
  } = useChat({
    transport: new DefaultChatTransport({ 
      api: '/api/nexus',
      body: { conversationId },
    }),
    onError: (err: Error) => {
      console.error('[Nexus Chat Error]:', err)
    },
  })

  const isLoading = status === 'streaming' || status === 'submitted'

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [isOpen])

  // Load conversations list for authenticated users
  const loadConversations = useCallback(async () => {
    if (!isAuthenticated) return
    try {
      const res = await fetch('/api/nexus?list=true')
      const data = await res.json()
      if (data.conversations) {
        setConversations(data.conversations)
      }
    } catch (e) {
      console.error('Failed to load conversations:', e)
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (isOpen && isAuthenticated) {
      loadConversations()
    }
  }, [isOpen, isAuthenticated, loadConversations])

  // Load a specific conversation's messages
  const loadConversation = async (convoId: string) => {
    try {
      const res = await fetch(`/api/nexus?conversationId=${convoId}`)
      const data = await res.json()
      if (data.messages) {
        setMessages(
          data.messages.map((m: { id: string; role: string; content: string }) => ({
            id: m.id,
            role: m.role as 'user' | 'assistant',
            content: m.content,
            parts: [{ type: 'text' as const, text: m.content }],
          }))
        )
      }
      setConversationId(convoId)
      setShowHistory(false)
    } catch (e) {
      console.error('Failed to load conversation:', e)
    }
  }

  // Start new conversation
  const startNewConversation = () => {
    setConversationId(null)
    setMessages([])
    setShowHistory(false)
  }

  // Submit message
  const submitMessage = () => {
    const text = inputValue.trim()
    if (!text || isLoading) return

    sendMessage({ text })
    setInputValue('')

    // Reset textarea height
    if (inputRef.current) {
      inputRef.current.style.height = 'auto'
    }
  }

  // Handle Enter key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submitMessage()
    }
  }

  // Quick action chips
  const handleQuickAction = (text: string) => {
    if (isLoading) return
    sendMessage({ text })
  }

  // Notification dot
  useEffect(() => {
    if (!isOpen && messages.length > 0) {
      setHasNewMessage(true)
    }
  }, [messages, isOpen])

  useEffect(() => {
    if (isOpen) setHasNewMessage(false)
  }, [isOpen])

  // Note: Multi-step tool execution is handled server-side via stopWhen: stepCountIs(5)
  // No client-side auto-trigger needed

  // Extract text content from message parts
  const getMessageText = (message: { content?: string; parts?: Array<{ type: string; text?: string }> }) => {
    let textStr = ''
    if (message.parts && message.parts.length > 0) {
      textStr = message.parts
        .filter((p) => p.type === 'text' && p.text)
        .map((p) => p.text)
        .join('')
    } else {
      textStr = message.content || ''
    }

    // Check for tool invocations in parts (SDK v6 format)
    if (!textStr && message.parts?.some((p) => p.type === 'tool-invocation')) {
      return '⏳ *Analizando tu solicitud y consultando la base de datos...*'
    }

    return textStr
  }

  return (
    <>
      {/* ── Floating Button ── */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-[9999] h-14 w-14 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 dark:shadow-blue-500/20 flex items-center justify-center hover:shadow-xl hover:shadow-blue-500/40 transition-shadow cursor-pointer"
            aria-label="Abrir asistente Nexus"
            id="nexus-chat-trigger"
          >
            <Sparkles className="h-6 w-6" />
            {hasNewMessage && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 border-2 border-white dark:border-gray-900 animate-pulse" />
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Chat Panel ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-[9999] w-[400px] h-[600px] max-w-[calc(100vw-2rem)] max-h-[calc(100vh-3rem)] flex flex-col rounded-2xl overflow-hidden border border-slate-200/80 dark:border-white/10 shadow-2xl shadow-black/20 dark:shadow-black/50 backdrop-blur-xl bg-white/95 dark:bg-[#0d1323]/95"
            id="nexus-chat-panel"
          >
            {/* ── Header ── */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shrink-0">
              <div className="flex items-center gap-3">
                {showHistory && (
                  <button
                    onClick={() => setShowHistory(false)}
                    className="p-1 rounded-lg hover:bg-white/20 transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                )}
                <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm leading-none">
                    {showHistory ? 'Historial' : 'Nexus'}
                  </h3>
                  <p className="text-[11px] text-white/70 mt-0.5">
                    {showHistory
                      ? 'Tus conversaciones'
                      : isLoading
                        ? 'Pensando...'
                        : 'Asistente de Abastto'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {isAuthenticated && !showHistory && (
                  <>
                    <button
                      onClick={startNewConversation}
                      className="p-2 rounded-lg hover:bg-white/20 transition-colors cursor-pointer"
                      title="Nueva conversación"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        setShowHistory(true)
                        loadConversations()
                      }}
                      className="p-2 rounded-lg hover:bg-white/20 transition-colors cursor-pointer"
                      title="Historial"
                    >
                      <History className="h-4 w-4" />
                    </button>
                  </>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg hover:bg-white/20 transition-colors cursor-pointer"
                  title="Cerrar"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* ── History View ── */}
            {showHistory ? (
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {conversations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-slate-400 dark:text-slate-500 gap-2">
                    <MessageCircle className="h-8 w-8" />
                    <p className="text-sm">Sin conversaciones previas</p>
                  </div>
                ) : (
                  conversations.map((convo) => (
                    <button
                      key={convo.id}
                      onClick={() => loadConversation(convo.id)}
                      className={`w-full text-left p-3 rounded-xl transition-all cursor-pointer ${
                        conversationId === convo.id
                          ? 'bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30'
                          : 'hover:bg-slate-50 dark:hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                        {convo.title || 'Conversación sin título'}
                      </p>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                        {new Date(convo.updatedAt).toLocaleDateString('es-GT', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </button>
                  ))
                )}
              </div>
            ) : (
              <>
                {/* ── Messages Area ── */}
                <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 scroll-smooth">
                  {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center gap-4 p-4">
                      <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 dark:from-blue-500/20 dark:to-indigo-500/20 flex items-center justify-center">
                        <Sparkles className="h-8 w-8 text-blue-500" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-800 dark:text-slate-200">
                          ¡Hola{userName ? `, ${userName.split(' ')[0]}` : ''}! 👋
                        </h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                          Soy <strong>Nexus</strong>, tu asistente inteligente.
                          {isAuthenticated
                            ? ' Pregúntame sobre tus licitaciones, proveedores o lo que necesites.'
                            : ' Pregúntame lo que quieras sobre Abastto.'}
                        </p>
                      </div>
                      {/* Quick Actions */}
                      <div className="flex flex-wrap justify-center gap-2 mt-2">
                        {isAuthenticated ? (
                          <>
                            <QuickChip text="¿Cuántas licitaciones tengo?" onClick={handleQuickAction} />
                            <QuickChip text="Buscar proveedores" onClick={handleQuickAction} />
                            <QuickChip text="Info de mi empresa" onClick={handleQuickAction} />
                          </>
                        ) : (
                          <>
                            <QuickChip text="¿Qué es Abastto?" onClick={handleQuickAction} />
                            <QuickChip text="¿Cómo funciona?" onClick={handleQuickAction} />
                            <QuickChip text="¿Es gratis?" onClick={handleQuickAction} />
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {messages
                    .map((message) => {
                    const text = getMessageText(message as any)
                    if (!text) return null

                    return (
                      <div
                        key={message.id}
                        className={`flex gap-2.5 ${
                          message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                        }`}
                      >
                        {/* Avatar */}
                        <div
                          className={`shrink-0 h-7 w-7 rounded-full flex items-center justify-center text-white ${
                            message.role === 'user'
                              ? 'bg-slate-600 dark:bg-slate-500'
                              : 'bg-gradient-to-br from-blue-500 to-indigo-600'
                          }`}
                        >
                          {message.role === 'user' ? (
                            <User className="h-3.5 w-3.5" />
                          ) : (
                            <Bot className="h-3.5 w-3.5" />
                          )}
                        </div>

                        {/* Message Bubble */}
                        <div
                          className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                            message.role === 'user'
                              ? 'bg-blue-600 text-white rounded-tr-md'
                              : 'bg-slate-100 dark:bg-white/5 text-slate-800 dark:text-slate-200 rounded-tl-md border border-slate-200/50 dark:border-white/5'
                          }`}
                        >
                          {message.role === 'assistant' ? (
                            <div className="nexus-markdown prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0.5 prose-headings:my-2 prose-a:text-blue-500 prose-a:no-underline hover:prose-a:underline prose-pre:bg-slate-800 prose-pre:text-slate-100 prose-code:text-blue-600 dark:prose-code:text-blue-400">
                              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {text}
                              </ReactMarkdown>
                            </div>
                          ) : (
                            <p>{text}</p>
                          )}
                        </div>
                      </div>
                    )
                  })}

                  {/* Loading indicator */}
                  {isLoading && (
                    <div className="flex gap-2.5">
                      <div className="shrink-0 h-7 w-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white">
                        <Bot className="h-3.5 w-3.5" />
                      </div>
                      <div className="bg-slate-100 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 rounded-2xl rounded-tl-md px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-blue-500 animate-bounce [animation-delay:0ms]" />
                          <span className="h-2 w-2 rounded-full bg-blue-500 animate-bounce [animation-delay:150ms]" />
                          <span className="h-2 w-2 rounded-full bg-blue-500 animate-bounce [animation-delay:300ms]" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Error display */}
                  {error && (
                    <div className="mx-auto max-w-[90%] p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-300 text-xs text-center">
                      No pude procesar tu solicitud. Intenta de nuevo.
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* ── Input Area ── */}
                <div className="shrink-0 p-3 border-t border-slate-200/80 dark:border-white/5 bg-white/50 dark:bg-black/20 backdrop-blur-sm">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      submitMessage()
                    }}
                    className="flex items-end gap-2"
                  >
                    <textarea
                      ref={inputRef}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={
                        isAuthenticated
                          ? 'Escribe tu pregunta...'
                          : 'Pregunta sobre Abastto...'
                      }
                      rows={1}
                      className="flex-1 resize-none rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-3.5 py-2.5 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 dark:focus:border-blue-500 transition-all max-h-[120px] overflow-y-auto"
                      style={{
                        height: 'auto',
                        minHeight: '40px',
                      }}
                      onInput={(e) => {
                        const target = e.target as HTMLTextAreaElement
                        target.style.height = 'auto'
                        target.style.height = Math.min(target.scrollHeight, 120) + 'px'
                      }}
                    />
                    <button
                      type="submit"
                      disabled={!inputValue.trim() || isLoading}
                      className="shrink-0 h-10 w-10 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white flex items-center justify-center transition-colors cursor-pointer disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </button>
                  </form>
                  <p className="text-[10px] text-slate-400 dark:text-slate-600 text-center mt-2">
                    Nexus puede cometer errores. Verifica información importante.
                  </p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// ─── Quick Chip Component ────────────────────────────────
function QuickChip({ text, onClick }: { text: string; onClick: (text: string) => void }) {
  return (
    <button
      type="button"
      onClick={() => onClick(text)}
      className="px-3 py-1.5 text-xs font-medium rounded-full border border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-blue-300 bg-blue-50/50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors cursor-pointer whitespace-nowrap"
    >
      {text}
    </button>
  )
}
