'use client'

import { Button } from "@/components/ui/button"

// TODO: Get this from a config or API
const socialPlatforms = [
    { id: 'maps', icon: 'fa-map-marker-alt', title: 'Google Maps' },
    { id: 'tiktok', icon: 'fa-tiktok', title: 'TikTok' },
    { id: 'instagram', icon: 'fa-instagram', title: 'Instagram' },
    { id: 'facebook', icon: 'fa-facebook-f', title: 'Facebook' },
    { id: 'youtube', icon: 'fa-youtube', title: 'YouTube' },
    { id: 'telegram', icon: 'fa-telegram-plane', title: 'Telegram' },
]

interface SocialMediaControlProps {
    store: any; // TODO: Type this
}

export default function SocialMediaControl({ store }: SocialMediaControlProps) {
    // TODO: Implement modal logic to edit URLs
    return (
        <div className="control-group">
            <label className="label">Ubicación y Redes Sociales</label>
            <div className="flex flex-wrap gap-2 mt-2">
                {socialPlatforms.map(social => {
                    const isActive = !!store[`${social.id}_url`] || (social.id === 'telegram' && !!store.telegram_user)
                    return (
                        <Button key={social.id} variant={isActive ? "secondary" : "outline"} size="icon" title={social.title}>
                            <i className={`fab ${social.icon}`}></i>
                        </Button>
                    )
                })}
            </div>
        </div>
    )
}
