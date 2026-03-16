'use client'

import { useEditor } from "@/contexts/EditorContext"
import StoreNameControl from "../controls/StoreNameControl"
import LogoControl from "../controls/LogoControl"
import BrandColorControl from "../controls/BrandColorControl"
import NavbarStyleControl from "../controls/NavbarStyleControl"
import BackgroundStyleControl from "../controls/BackgroundStyleControl"
import NavbarColorControl from "../controls/NavbarColorControl"

export default function VisualIdentityPanel() {
    const { store } = useEditor()

    return (
        <div className="space-y-6">
            <StoreNameControl />
            <LogoControl />
            <BrandColorControl />
            <NavbarStyleControl />
            <NavbarColorControl />
            <BackgroundStyleControl />
        </div>
    )
}
