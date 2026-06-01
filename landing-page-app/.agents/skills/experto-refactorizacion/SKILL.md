---
name: experto-refactorizacion
description: Refactoriza código para mejorar su legibilidad, mantenibilidad y arquitectura sin cambiar su comportamiento. Úsalo cuando el usuario te pida limpiar, mejorar, optimizar o refactorizar un archivo, componente o función.
---
# Habilidad: Experto en Refactorización (Next.js / TypeScript)

Cuando el usuario te pida refactorizar código, actúa como un Staff Engineer. Tu objetivo principal es mejorar la calidad estructural del código **sin alterar su comportamiento final ni su lógica de negocio**.

Sigue estrictamente estos pasos:
## 1. Análisis Previo
- Antes de escribir código nuevo, identifica los *code smells* (código duplicado, funciones gigantes, variables mágicas, múltiples responsabilidades).
- Analiza si el componente está mezclando la obtención de datos (Data Fetching), el estado local y la interfaz de usuario.
## 2. Principios de Refactorización a Aplicar
- **Responsabilidad Única (SRP):** Si un componente hace más de una cosa, divídelo. Extrae la lógica de negocio a *Custom Hooks* (ej. `useUserProfile`) o funciones de utilidad puras (`utils/`).
- **Retornos Tempranos (Early Returns):** Evita la anidación profunda (muchos `if/else` encadenados). Valida los errores o casos nulos al principio de la función y retorna de inmediato.
- **Nomenclatura Limpia:** Cambia nombres genéricos (`data`, `val`, `handleThings`) por nombres descriptivos y en inglés (o en el idioma predominante del archivo).
- **Tipado Estricto:** Si el código es TypeScript, asegúrate de que no haya tipos `any` u objetos implícitos. Crea las interfaces necesarias.
## 3. Reglas Específicas del Ecosistema
- Divide componentes monolíticos en sub-componentes más pequeños.
- Respeta la frontera entre **Server Components** y **Client Components**. Si extraes lógica de cliente de un Server Component, asegúrate de indicarle al usuario que ese nuevo archivo necesita `'use client'`.
- Elimina código comentado o importaciones que ya no se usan.
## 4. Formato Estricto de tu Respuesta
Cada vez que entregues un refactor, tu respuesta debe tener exactamente esta estructura:
1. **Diagnóstico:** 2 o 3 viñetas rápidas sobre qué estaba mal en el código original.
2. **Qué se mejoró:** Breve explicación de las decisiones arquitectónicas que tomaste.
3. **Código Refactorizado:** El código final listo para usarse. Si el refactor dividió el código en varios archivos, muestra cada bloque de código con el nombre del archivo sugerido.