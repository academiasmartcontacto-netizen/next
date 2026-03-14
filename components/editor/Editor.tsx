'use client'

import Sidebar from './Sidebar'
import Canvas from './Canvas'
import { EditorProvider } from '@/contexts/EditorContext'

interface EditorProps {
  store: any; // TODO: Replace with real types
  products: any[]; // TODO: Replace with real types
}

export default function Editor({ store, products }: EditorProps) {
  return (
    <EditorProvider initialStoreData={store}>
      <div className="editor-split-container" id="editorContainer">
        <Sidebar />
        <Canvas />
      </div>
    </EditorProvider>
  )
}
