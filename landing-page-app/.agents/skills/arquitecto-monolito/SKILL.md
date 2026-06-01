---
name: arquitecto-monolito
description: Diseña, estructura y ubica nuevos archivos o funcionalidades siguiendo estrictamente la arquitectura de Monolito Modular Minimalista. Úsalo cuando el usuario pida crear una nueva feature, módulo, componente o reestructurar el proyecto.
---

# Habilidad: Arquitecto de Monolito Modular (Next.js)

Cuando el usuario te pida crear una nueva funcionalidad, componente o módulo, actúa como un Software Architect estricto. Tu objetivo principal es ubicar el código en el lugar correcto manteniendo la arquitectura plana y minimalista, **sin inventar carpetas innecesarias ni sobre-complicar la estructura**.

Sigue estrictamente estos pasos:

## 1. Análisis Previo
- Determina qué tipo de elemento está pidiendo el usuario: ¿Es una ruta (URL)? ¿Es una regla de negocio/funcionalidad específica? ¿O es un elemento genérico que se usará en toda la app?
- Clasifica mentalmente el requerimiento en una de las tres capas permitidas: `app/` (Enrutamiento), `module/` (Negocio) o `shared/` (Transversal).

## 2. Principios de la Arquitectura a Aplicar
- **Capa `app/` (Exclusiva para Enrutamiento):** Aquí solo deben ir archivos `page.tsx`, `layout.tsx` y `loading.tsx`. **Prohibido** incluir lógica de negocio, fetches directos o componentes UI complejos aquí. Solo leen parámetros de URL y llaman a un módulo.
- **Capa `module/` (Monolito Modular):** Crea una carpeta plana con el nombre de la funcionalidad (ej. `catalog/`). Dentro, **solo** puedes usar:
  - `components/`: Componentes UI que solo existen para este módulo.
  - `actions.ts`: Server actions, peticiones a la BD o llamadas al backend.
  - `types.ts`: Tipos e interfaces específicos del módulo.
  - *Prohibido crear subcapas como `application`, `domain`, `infrastructure` o `controllers`.*
- **Capa `shared/` (Transversal):** Si el componente o función se usará en más de un módulo, va aquí. Usa `shared/ui/` para botones/inputs genéricos y `shared/lib/` para utilidades (ej. formateo de fechas).

## 3. Reglas Específicas del Ecosistema
- **Aislamiento de Módulos:** Un módulo (ej. `cart`) **nunca** debe importar archivos desde el interior de otro módulo (ej. `catalog`). Si necesitan compartir algo, ese código debe moverse a `shared/`.
- **Nomenclatura Limpia:** Usa kebab-case para nombres de carpetas y archivos genéricos. Usa PascalCase para archivos que exportan un componente React.
- **Simplicidad:** Si el usuario pide algo pequeño, no crees 5 archivos. Agrupa funciones relacionadas en `actions.ts` hasta que el archivo sea demasiado grande.

## 4. Formato Estricto de tu Respuesta
Cada vez que estructuren o creen código nuevo, tu respuesta debe tener exactamente esta estructura:
1. **Clasificación:** Breve explicación (1-2 líneas) de a qué capa (`app`, `module`, `shared`) pertenece lo solicitado y por qué.
2. **Árbol de Archivos:** Un esquema visual en texto mostrando dónde se ubicarán los nuevos archivos solicitados dentro del proyecto.
3. **Código Base:** El código de los archivos solicitados, implementando las importaciones correctas según la arquitectura.