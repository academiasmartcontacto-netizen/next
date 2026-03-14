'use client'

import Link from 'next/link';
import { useEditor } from '@/contexts/EditorContext';

export default function EditorHeader() {
    const { store } = useEditor();

    // TODO: Implement device mode logic
    const setCanvasSize = (device: 'desktop' | 'mobile') => {
        console.log(`Setting device to ${device}`);
    };

    return (
        <div className="sidebar-header" style={{ position: 'relative', zIndex: 50 }}>
            <h2 style={{ marginLeft: '10px' }}>Editor</h2>
            
            <div className="device-toggles-mini" style={{ marginLeft: 'auto', display: 'flex', gap: '5px' }}>
                <Link href={`/tienda/${store.slug}`} target="_blank" className="btn-eye-link" title="Ver en vivo" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', padding: '8px' }}>
                    <i className="fas fa-eye"></i>
                </Link>
                <button className="device-btn active" onClick={() => setCanvasSize('desktop')} title="Escritorio" style={{ padding: '8px' }}>
                    <i className="fas fa-desktop"></i>
                </button>
                <button className="device-btn" onClick={() => setCanvasSize('mobile')} title="Móvil" style={{ padding: '8px' }}>
                    <i className="fas fa-mobile-alt"></i>
                </button>
            </div>
        </div>
    );
}
