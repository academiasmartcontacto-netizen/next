'use client'

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export default function SectionsPanel() {
    // TODO: Implement drawer logic
    const openHomeDrawer = () => console.log("Opening Home Drawer...")
    const openSectionsDrawer = () => console.log("Opening Sections Drawer...")

    return (
        <div className="control-group">
            <Label>Preferencias</Label>
            <div className="flex gap-2 mt-2">
                <Button variant="outline" onClick={openHomeDrawer} title="Inicio">
                    <i className="fas fa-home"></i>
                </Button>
                <Button variant="outline" onClick={openSectionsDrawer} title="Secciones">
                    <i className="fas fa-cog"></i>
                </Button>
            </div>
        </div>
    )
}
