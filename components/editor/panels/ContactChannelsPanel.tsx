'use client'

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import SocialMediaControl from "../controls/SocialMediaControl"

interface ContactChannelsPanelProps {
    store: any; // TODO: Type this
}

export default function ContactChannelsPanel({ store }: ContactChannelsPanelProps) {
    return (
        <div className="space-y-6">
            <div className="control-group">
                <Label>WhatsApp</Label>
                <Input defaultValue={store.whatsapp} />
            </div>
            <div className="control-group">
                <Label>Correo Electrónico</Label>
                <Input type="email" defaultValue={store.email_contacto} />
            </div>
            <div className="control-group">
                <Label>Dirección</Label>
                <Input defaultValue={store.direccion} />
            </div>
            <SocialMediaControl store={store} />
        </div>
    )
}
