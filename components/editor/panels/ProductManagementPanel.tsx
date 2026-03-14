'use client'

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export default function ProductManagementPanel() {
    // TODO: Implement drawer logic
    const openProductDrawer = () => console.log("Opening Product Drawer...")
    const openInventoryDrawer = () => console.log("Opening Inventory Drawer...")
    const openFeriaDrawer = () => console.log("Opening Feria Drawer...")

    return (
        <div className="space-y-6">
            <Button className="w-full" onClick={openProductDrawer}>
                <i className="fas fa-plus mr-2"></i>
                Añadir Producto
            </Button>

            <div className="control-group">
                <Label>Preferencias</Label>
                <div className="flex gap-2 mt-2">
                    <Button variant="outline" onClick={openInventoryDrawer} title="Inventario">
                        <i className="fas fa-clipboard-list"></i>
                    </Button>
                    <Button variant="outline" onClick={openFeriaDrawer} title="Ubicación en Feria Virtual">
                        <i className="fas fa-map-marked-alt"></i>
                    </Button>
                </div>
            </div>
        </div>
    )
}
