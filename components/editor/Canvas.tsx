'use client'

import { useEffect, useRef } from 'react'
import { useEditor } from '@/contexts/EditorContext'

export default function Canvas() {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const { store } = useEditor()

  useEffect(() => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage({
        type: 'EDITOR_UPDATE',
        payload: store
      }, '*'); // In production, you should use a more specific target origin
    }
  }, [store]);

  // We need to get the store slug from the context
  const storeSlug = store.slug; 

  return (
    <main className="editor-canvas-container">
      <div className="canvas-wrapper">
        <iframe 
          ref={iframeRef}
          id="storeFrame" 
          src={`/tienda/${storeSlug}?editor_mode=1`} 
          className="store-iframe desktop"
        ></iframe>
      </div>
    </main>
  )
}
