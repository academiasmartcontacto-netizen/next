# Auditoría de la Estructura del Acordeón del Editor de Tiendas (Proyecto PHP)

Este documento detalla la estructura y el contenido de cada pestaña del acordeón principal en el editor de tiendas del proyecto original en PHP (`D:/FUNCIONAL/mi/tienda_editor.php`). Sirve como una guía técnica para la migración y reconstrucción de la interfaz en el proyecto Next.js.

---

## 1. Pestaña: "Identidad Visual"
**Icono:** `<i class="fas fa-store"></i>`

Esta sección agrupa todas las opciones relacionadas con el branding y la apariencia fundamental de la tienda.

### Contenido:
- **Nombre de la Tienda:**
  - **Control:** Campo de texto (`<input type="text" id="storeName">`).
  - **Propósito:** Define el nombre principal de la tienda.
  - **Opción Adicional:** Interruptor (`<input type="checkbox" id="mostrar_nombre_tienda">`) para mostrar u ocultar el nombre en la página de la tienda.

- **Logo:**
  - **Control:** Componente de carga de imágenes (`<div id="brand-logo-uploader">`).
  - **Propósito:** Permite al usuario subir o eliminar el logo principal de su tienda.
  - **Opción Adicional:** Interruptor (`<input type="checkbox" id="mostrar_logo_principal">`) para mostrar u ocultar el logo.

- **Color de Marca:**
  - **Control:** Selector de color desplegable (`<div id="colorDropdown">`).
  - **Propósito:** Permite elegir un color primario que se usará en varios elementos de la tienda para mantener una consistencia de marca.

- **Barra de Navegación:**
  - **Control:** Menú desplegable (`<div id="navbarStyleDropdown">`).
  - **Propósito:** Define el estilo de fondo de la barra de navegación.
  - **Opciones:** "Blanco", "Color de Marca".

- **Fondo de Página:**
  - **Control:** Menú desplegable (`<div id="bgDropdown">`).
  - **Propósito:** Establece el color de fondo general de la tienda.
  - **Opciones:** "Blanco", "Color de Marca", "Gris".

---

## 2. Pestaña: "Canales de Contacto"
**Icono:** `<i class="fas fa-address-card"></i>`

Esta sección centraliza toda la información de contacto que se mostrará en la tienda.

### Contenido:
- **WhatsApp:**
  - **Control:** Campo de texto (`<input type="text" id="inputWhatsapp">`).
  - **Propósito:** Ingresar el número de WhatsApp para contacto directo.

- **Correo Electrónico:**
  - **Control:** Campo de texto (`<input type="email" id="inputEmail">`).
  - **Propósito:** Ingresar el email de contacto.

- **Dirección:**
  - **Control:** Campo de texto (`<input type="text" id="inputDireccion">`).
  - **Propósito:** Ingresar la dirección física de la tienda.

- **Ubicación y Redes Sociales:**
  - **Control:** Una fila de botones con iconos para diferentes plataformas (`Google Maps`, `TikTok`, `Instagram`, `Facebook`, `YouTube`, `Telegram`).
  - **Propósito:** Permite a los usuarios añadir sus perfiles de redes sociales y su ubicación. Al hacer clic, probablemente se abre un modal para ingresar la URL correspondiente, la cual se almacena en `inputs` ocultos.

---

## 3. Pestaña: "Secciones"
**Icono:** `<i class="fas fa-th-large"></i>`

Esta sección se enfoca en la organización y estructura del contenido de la página de inicio de la tienda.

### Contenido:
- **Preferencias (Botones de Acción):**
  - **Botón "Inicio":**
    - **Control:** Botón con icono (`<i class="fas fa-home"></i>`).
    - **Acción:** Abre un panel lateral (`Drawer`) dedicado a la configuración de la página de inicio (`openHomeDrawer()`).
  - **Botón "Secciones":**
    - **Control:** Botón con icono (`<i class="fas fa-cog"></i>`).
    - **Acción:** Abre un panel lateral para crear, ver y eliminar las diferentes secciones o categorías de productos de la tienda (`openSectionsDrawer()`).

---

## 4. Pestaña: "Personalización"
**Icono:** `<i class="fas fa-paint-brush"></i>`

Esta es la sección más granular para el diseño visual de la tienda, controlando la apariencia de los componentes individuales.

### Contenido:
- **Bordes:**
  - **Control:** Menú desplegable (`<div id="borderDropdown">`).
  - **Propósito:** Define el radio de los bordes en botones y tarjetas.
  - **Opciones:** "Rectangular", "Redondeado", "Píldora".

- **Estilo de Tarjetas:**
  - **Control:** Menú desplegable (`<div id="cardDropdown">`).
  - **Propósito:** Define el estilo visual de las tarjetas de producto.
  - **Opciones:** "Flotante" (con sombra), "Con borde", "Sin borde".

- **Formato de Fotos:**
  - **Control:** Menú desplegable (`<div id="photoDropdown">`).
  - **Propósito:** Controla la relación de aspecto de las imágenes de producto.
  - **Opciones:** "Cuadrado", "Vertical", "Horizontal", "Sin recorte".

- **Columnas de Productos:**
  - **Control:** Menú desplegable (`<div id="gridDropdown">`).
  - **Propósito:** Define cuántos productos se muestran por fila en la cuadrícula.
  - **Opciones:** "Automático", "2 Columnas", "3 Columnas", "4 Columnas".

- **Tipografía:**
  - **Control:** Menú desplegable (`<div id="fontDropdown">`).
  - **Propósito:** Permite seleccionar la familia de fuentes para los textos de la tienda.
  - **Opciones:** "Predeterminado", "Inter", "Plus Jakarta", "Poppins", etc.

- **Tamaño de Texto:**
  - **Control:** Menú desplegable (`<div id="sizeDropdown">`).
  - **Propósito:** Ajusta el tamaño base de la fuente.
  - **Opciones:** "Pequeño", "Normal", "Grande".

---

## 5. Pestaña: "Gestión de Productos"
**Icono:** `<i class="fas fa-box-open"></i>`

Esta sección contiene los accesos directos para administrar el catálogo de productos.

### Contenido:
- **Acción Principal:**
  - **Control:** Botón grande y principal (`<button id="btnNewProductContext">`).
  - **Acción:** Abre el panel lateral para crear un nuevo producto (`openProductDrawer()`).

- **Preferencias (Botones de Acción):**
  - **Botón "Inventario":**
    - **Control:** Botón con icono (`<i class="fas fa-clipboard-list"></i>`).
    - **Acción:** Abre un panel lateral para ver, buscar y filtrar todos los productos existentes (`openInventoryDrawer()`).
  - **Botón "Feria Virtual":**
    - **Control:** Botón con icono (`<i class="fas fa-map-marked-alt"></i>`).
    - **Acción:** Abre un panel lateral para que la tienda elija su ubicación en el marketplace o "Feria Virtual" (`openFeriaDrawer()`).
