'use client'

import EditorHeader from './EditorHeader'
import EditorAccordion from './EditorAccordion'
import EditorFooter from './EditorFooter'

export default function Sidebar() {
  return (
    <aside className="editor-sidebar" id="editorSidebar">
      <EditorHeader />
      <div className="sidebar-content">
         <EditorAccordion />
      </div>
      <EditorFooter />
    </aside>
  )
}
