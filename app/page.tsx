import { ChatContainer } from '@/components/chat-container'
import { TopAirlines } from '@/components/top-airlines'

export default function Home() {
  return (
    <div className="flex h-screen flex-col lg:flex-row bg-background">
      {/* Sidebar - Top Airlines Ranking */}
      <aside className="w-full lg:w-[400px] xl:w-[450px] border-b lg:border-b-0 lg:border-r bg-card overflow-y-auto">
        <TopAirlines />
      </aside>

      {/* Main - Chatbot */}
      <main className="flex-1 min-h-0">
        <ChatContainer />
      </main>
    </div>
  )
}
