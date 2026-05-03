import { auth } from '@/auth'
import { NexusChat } from './nexus-chat'

/**
 * Server component wrapper for NexusChat.
 * Resolves the user session on the server and passes it as props
 * to the client-side chat widget.
 */
export async function NexusChatWrapper() {
  const session = await auth()

  return (
    <NexusChat
      userName={session?.user?.name}
      isAuthenticated={!!session?.user?.id}
    />
  )
}
