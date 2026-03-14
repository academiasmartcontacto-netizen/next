'use client'

import BorderControl from "../controls/BorderControl";
import CardStyleControl from "../controls/CardStyleControl";
import PhotoFormatControl from "../controls/PhotoFormatControl";
import GridDensityControl from "../controls/GridDensityControl";
import FontControl from "../controls/FontControl";
import TextSizeControl from "../controls/TextSizeControl";

interface PersonalizationPanelProps {
    store: any; // TODO: Type this
}

export default function PersonalizationPanel({ store }: PersonalizationPanelProps) {
    return (
        <div className="space-y-6">
            <BorderControl style={store.estilo_bordes} />
            <CardStyleControl style={store.estilo_tarjetas} />
            <PhotoFormatControl style={store.estilo_fotos} />
            <GridDensityControl density={store.grid_density} />
            <FontControl font={store.tipografia} />
            <TextSizeControl size={store.tamano_texto} />
        </div>
    )
}
