'use client'

export default function EditorFooter() {
    return (
        <div className="sidebar-footer">
            <a href="https://www.donebolivia.com" target="_blank" rel="noopener noreferrer" className="footer-link" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                <span className="powered-by-text" style={{ fontSize: '12px', color: '#64748b', marginRight: '8px' }}>Powered by</span>
                <img src="/assets/img/done.png" alt="Done! Bolivia" className="powered-by-logo" style={{ height: '20px' }} />
            </a>
        </div>
    )
}
