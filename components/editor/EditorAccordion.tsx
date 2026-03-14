'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useEditor } from "@/contexts/EditorContext"

// Import panel components
import VisualIdentityPanel from "./panels/VisualIdentityPanel"
import ContactChannelsPanel from "./panels/ContactChannelsPanel"
import SectionsPanel from "./panels/SectionsPanel"
import PersonalizationPanel from "./panels/PersonalizationPanel"
import ProductManagementPanel from "./panels/ProductManagementPanel"

export default function EditorAccordion() {
    const { store } = useEditor();

    return (
        <Accordion type="single" collapsible defaultValue="item-1">
            <AccordionItem value="item-1">
                <AccordionTrigger>
                    <i className="fas fa-store mr-2"></i> Identidad Visual
                </AccordionTrigger>
                <AccordionContent>
                    <VisualIdentityPanel />
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
                <AccordionTrigger>
                     <i className="fas fa-address-card mr-2"></i> Canales de Contacto
                </AccordionTrigger>
                <AccordionContent>
                    <ContactChannelsPanel />
                </AccordionContent>
            </AccordionItem>
             <AccordionItem value="item-3">
                <AccordionTrigger>
                    <i className="fas fa-th-large mr-2"></i> Secciones
                </AccordionTrigger>
                <AccordionContent>
                    <SectionsPanel />
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
                <AccordionTrigger>
                    <i className="fas fa-paint-brush mr-2"></i> Personalización
                </AccordionTrigger>
                <AccordionContent>
                    <PersonalizationPanel />
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
                <AccordionTrigger>
                    <i className="fas fa-box-open mr-2"></i> Gestión de Productos
                </AccordionTrigger>
                <AccordionContent>
                    <ProductManagementPanel />
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}
