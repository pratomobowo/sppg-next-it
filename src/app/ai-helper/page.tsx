'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useAuth } from '@/lib/auth'
import { buildSppgContext } from '@/lib/sppg-context-data'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import {
  BotIcon,
  SendIcon,
  Loader2Icon,
  SparklesIcon,
  RotateCcwIcon,
  TrendingDownIcon,
  AlertTriangleIcon,
  BarChart2Icon,
  PackageIcon,
  DollarSignIcon,
  ChefHatIcon,
  ActivityIcon,
  DatabaseIcon,
} from 'lucide-react'

// ─── Types ─────────────────────────────────────────────────────────────────────
type MessageRole = 'user' | 'assistant'

interface Message {
  id: string
  role: MessageRole
  content: string
  timestamp: Date
}

// ─── Analytic Suggestion Chips ─────────────────────────────────────────────────
const SUGGESTIONS = [
  { icon: TrendingDownIcon, label: 'Dapur Merugi', color: 'text-red-500', prompt: 'Dapur mana yang merugi atau melebihi anggaran? Berikan analisis lengkap dengan angka dan rekomendasi perbaikannya.' },
  { icon: AlertTriangleIcon, label: 'Anomali Keuangan', color: 'text-orange-500', prompt: 'Apakah ada anomali atau pengeluaran tidak wajar dalam keuangan SPPG? Deteksi dan jelaskan risiko yang ada.' },
  { icon: PackageIcon, label: 'Stok Kritis', color: 'text-yellow-500', prompt: 'Bahan baku mana yang stoknya kritis atau menipis? Apa dampaknya ke produksi dan apa yang harus dilakukan segera?' },
  { icon: ChefHatIcon, label: 'Menu Terbaik', color: 'text-green-500', prompt: 'Menu mana yang paling optimal dari segi gizi dan biaya? Bandingkan semua menu minggu ini dan beri rekomendasi.' },
  { icon: DollarSignIcon, label: 'Kondisi Kas', color: 'text-blue-500', prompt: 'Bagaimana kondisi kas SPPG saat ini? Apakah ada risiko kekurangan dana? Berikan proyeksi dan saran pengelolaan.' },
  { icon: BarChart2Icon, label: 'Performa Dapur', color: 'text-violet-500', prompt: 'Buat ranking performa semua dapur berdasarkan utilisasi kapasitas dan efisiensi anggaran. Siapa terbaik dan terburuk?' },
  { icon: ActivityIcon, label: 'Procurement', color: 'text-indigo-500', prompt: 'Ada berapa DO yang masih pending approval? Apa risikonya jika tidak segera diproses? Rekomendasikan prioritas.' },
  { icon: DatabaseIcon, label: 'Ringkasan Operasional', color: 'text-teal-500', prompt: 'Berikan ringkasan kondisi operasional SPPG hari ini secara menyeluruh: keuangan, dapur, stok, dan procurement.' },
]

// ─── Markdown-lite renderer ─────────────────────────────────────────────────────
function renderMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^### (.+)$/gm, '<h3 class="text-sm font-semibold mt-3 mb-1 text-foreground">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-base font-bold mt-4 mb-2 text-foreground">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-lg font-bold mt-4 mb-2 text-foreground">$1</h1>')
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc leading-relaxed">$1</li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li class="ml-4 list-decimal leading-relaxed">$2</li>')
    .replace(/(<li[\s\S]*?<\/li>(\n|$))+/g, '<ul class="space-y-1 my-2">$&</ul>')
    .replace(/`([^`]+)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-xs font-mono">$1</code>')
    .replace(/⚠️/g, '<span class="text-orange-500">⚠️</span>')
    .replace(/🔴/g, '<span class="text-red-500">🔴</span>')
    .replace(/✅/g, '<span class="text-green-500">✅</span>')
    .replace(/\n\n/g, '</p><p class="mt-2">')
    .replace(/\n/g, '<br/>')
}

// ─── Message Bubble ─────────────────────────────────────────────────────────────
function MessageBubble({ message, userInitials }: { message: Message; userInitials: string }) {
  const isUser = message.role === 'user'
  const html = isUser ? message.content : renderMarkdown(message.content)

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} items-end`}>
      <Avatar className="size-8 shrink-0 shadow-sm">
        {isUser ? (
          <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
            {userInitials}
          </AvatarFallback>
        ) : (
          <AvatarFallback className="bg-gradient-to-br from-violet-500 to-indigo-600 text-white">
            <BotIcon className="size-4" />
          </AvatarFallback>
        )}
      </Avatar>

      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm text-sm leading-relaxed ${
          isUser
            ? 'bg-primary text-primary-foreground rounded-br-sm'
            : 'bg-muted/60 text-foreground rounded-bl-sm border border-border/40'
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: `<p class="mt-0">${html}</p>` }}
          />
        )}
        <p
          className={`text-[10px] mt-1.5 ${
            isUser ? 'text-primary-foreground/60 text-right' : 'text-muted-foreground'
          }`}
        >
          {message.timestamp.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  )
}

// ─── Typing Indicator ───────────────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="flex gap-3 items-end">
      <Avatar className="size-8 shrink-0 shadow-sm">
        <AvatarFallback className="bg-gradient-to-br from-violet-500 to-indigo-600 text-white">
          <BotIcon className="size-4" />
        </AvatarFallback>
      </Avatar>
      <div className="bg-muted/60 border border-border/40 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
        <div className="flex gap-1 items-center h-4">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="size-1.5 rounded-full bg-muted-foreground/60 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ──────────────────────────────────────────────────────────────────
export default function AiHelperPage() {
  const { currentUser } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const hasMessages = messages.length > 0

  const userInitials = currentUser
    ? `${currentUser.firstName.charAt(0)}${currentUser.lastName.charAt(0)}`.toUpperCase()
    : 'U'

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const sendMessage = useCallback(
    async (text?: string) => {
      const content = (text ?? input).trim()
      if (!content || isLoading) return

      const userMsg: Message = {
        id: `${Date.now()}-user`,
        role: 'user',
        content,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, userMsg])
      setInput('')
      setIsLoading(true)
      setError(null)

      try {
        const history = [...messages, userMsg].map((m) => ({
          role: m.role,
          content: m.content,
        }))

        // Build SPPG data context to send with every request
        const contextData = buildSppgContext()

        const res = await fetch('/api/ai-helper', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: history, contextData }),
        })

        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.error ?? 'Terjadi kesalahan.')
        }

        const aiMsg: Message = {
          id: `${Date.now()}-ai`,
          role: 'assistant',
          content: data.reply,
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, aiMsg])
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : 'Gagal menghubungi AI.'
        setError(errMsg)
      } finally {
        setIsLoading(false)
        textareaRef.current?.focus()
      }
    },
    [input, isLoading, messages]
  )

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const clearChat = () => {
    setMessages([])
    setError(null)
    setInput('')
    textareaRef.current?.focus()
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-h-[900px] gap-0">
      {/* ── Header ── */}
      <Card className="rounded-b-none border-b-0 px-6 py-4 bg-gradient-to-r from-violet-500/10 via-indigo-500/5 to-background">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <SparklesIcon className="size-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-foreground flex items-center gap-2 flex-wrap">
                AI Helper
                <Badge
                  variant="secondary"
                  className="text-[10px] px-1.5 py-0 bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20"
                >
                  DeepSeek V4 Pro
                </Badge>
                <Badge
                  variant="secondary"
                  className="text-[10px] px-1.5 py-0 bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20 gap-1"
                >
                  <span className="size-1.5 rounded-full bg-green-500 inline-block animate-pulse" />
                  Data SPPG Terhubung
                </Badge>
              </h1>
              <p className="text-xs text-muted-foreground">
                Asisten analitik — paham kondisi nyata dapur, keuangan &amp; operasional SPPG Anda
              </p>
            </div>
          </div>
          {hasMessages && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearChat}
              className="text-muted-foreground hover:text-foreground gap-1.5 text-xs shrink-0"
            >
              <RotateCcwIcon className="size-3.5" />
              Bersihkan
            </Button>
          )}
        </div>
      </Card>

      {/* ── Chat Area ── */}
      <Card className="flex-1 rounded-none border-x overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-6 space-y-4 min-h-full">
            {!hasMessages ? (
              /* ── Welcome Screen ── */
              <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center gap-6 py-8">
                <div className="relative">
                  <div className="size-20 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-xl shadow-violet-500/30 mx-auto">
                    <BotIcon className="size-10 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 size-6 rounded-full bg-green-500 border-2 border-background flex items-center justify-center animate-pulse">
                    <span className="size-2.5 rounded-full bg-white" />
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-1">
                    Halo, {currentUser?.firstName ?? 'Pengguna'}! 👋
                  </h2>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    Saya AI Helper SPPG yang sudah terhubung dengan data operasional Anda. 
                    Tanyakan apa saja — dapur mana yang merugi, anomali keuangan, stok kritis, hingga rekomendasi menu terbaik.
                  </p>
                  <div className="flex items-center justify-center gap-2 mt-3">
                    <span className="size-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                      Data SPPG real-time tersambung — 12 dapur, keuangan, stok &amp; procurement
                    </span>
                  </div>
                </div>

                {/* Suggestion chips grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full max-w-2xl">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s.label}
                      onClick={() => sendMessage(s.prompt)}
                      disabled={isLoading}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-border/60 bg-muted/30 hover:bg-muted/70 hover:border-violet-500/40 transition-all text-left text-xs text-muted-foreground hover:text-foreground group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <s.icon className={`size-3.5 shrink-0 ${s.color} group-hover:scale-110 transition-transform`} />
                      <span className="font-medium leading-tight">{s.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* ── Messages ── */
              <>
                {messages.map((msg) => (
                  <MessageBubble key={msg.id} message={msg} userInitials={userInitials} />
                ))}
                {isLoading && <TypingIndicator />}
                {error && (
                  <div className="flex justify-center">
                    <div className="bg-destructive/10 border border-destructive/20 text-destructive text-xs rounded-lg px-4 py-2.5 max-w-sm text-center">
                      ⚠️ {error}
                    </div>
                  </div>
                )}
              </>
            )}
            <div ref={bottomRef} />
          </div>
        </ScrollArea>
      </Card>

      {/* ── Input Area ── */}
      <Card className="rounded-t-none border-t-0 p-4">
        {/* Quick suggestion chips when in chat */}
        {hasMessages && (
          <div className="flex gap-1.5 mb-3 overflow-x-auto pb-1 scrollbar-none">
            {SUGGESTIONS.slice(0, 5).map((s) => (
              <button
                key={s.label}
                onClick={() => sendMessage(s.prompt)}
                disabled={isLoading}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-border/50 bg-muted/20 hover:bg-muted/50 transition-all text-[11px] text-muted-foreground hover:text-foreground shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <s.icon className={`size-3 ${s.color}`} />
                {s.label}
              </button>
            ))}
          </div>
        )}

        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <Textarea
              ref={textareaRef}
              id="ai-helper-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Tanya kondisi SPPG Anda… misal: 'Dapur mana yang paling boros?' atau 'Ada anomali keuangan?'"
              className="resize-none min-h-[44px] max-h-[160px] pr-4 text-sm rounded-xl border-border/60 focus-visible:border-violet-500/60 focus-visible:ring-violet-500/20 transition-all"
              rows={1}
              disabled={isLoading}
            />
          </div>
          <Button
            id="ai-helper-send"
            onClick={() => sendMessage()}
            disabled={!input.trim() || isLoading}
            size="icon"
            className="size-11 rounded-xl shrink-0 bg-gradient-to-br from-violet-500 to-indigo-600 hover:from-violet-600 hover:to-indigo-700 shadow-lg shadow-violet-500/25 transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
          >
            {isLoading ? (
              <Loader2Icon className="size-4 animate-spin" />
            ) : (
              <SendIcon className="size-4" />
            )}
          </Button>
        </div>
        <p className="text-[10px] text-muted-foreground mt-2 text-center">
          AI menganalisis data dari 12 dapur · keuangan · stok · procurement SPPG Anda secara real-time
        </p>
      </Card>
    </div>
  )
}
