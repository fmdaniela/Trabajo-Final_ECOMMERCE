# 📌 Mini Flujo de Trabajo Git para Proyecto Solo

Este flujo está pensado para trabajar sola en un proyecto React + Node.js + Express + Sequelize + MySQL + TailwindCSS.

---

## 1️⃣ Verificar en qué rama estás
```bash
git branch
```
- Debe aparecer `* main`.
- Todo lo que hagas irá a la rama principal (`main`).

---

## 2️⃣ Ver cambios pendientes antes de agregarlos
```bash
git status
```
- Muestra archivos modificados o nuevos (`untracked`).

```bash
git diff
```
- Muestra línea por línea los cambios **no agregados aún**.

---

## 3️⃣ Agregar cambios al commit
- Todos los archivos:
```bash
git add .
```
- Solo un archivo específico:
```bash
git add ruta/del/archivo
```

---

## 4️⃣ Revisar cambios listos para commit (opcional)
```bash
git diff --staged
```
- Así podés asegurarte de que solo subís lo que querés.

---

## 5️⃣ Crear commit con mensaje claro
```bash
git commit -m "Descripción de los cambios"
```
- Ejemplos:
  - "Agrego rutas y controlador de productos en backend"
  - "Actualizo estilos y componentes en fronttiendaPro"
  - "Corrijo errores en formulario de login"

---

## 6️⃣ Subir los cambios a GitHub
```bash
git push
```
- Esto envía los commits de tu rama `main` al repo remoto.

---

## 7️⃣ Repetir el flujo cada vez que hagas cambios importantes
- Trabajás → `git status` → `git add` → `git commit` → `git push`.

---

### 💡 Tips extras
- Hacé commits **pequeños y frecuentes**, no esperar hasta tener todo terminado.
- Siempre revisá con `git status` antes de subir.
- El `.gitignore` evita que subas `node_modules`, `.env` o builds de React por accidente.
---