# Todo-List Front-End (React)

SPA creada con **React + Vite + TypeScript** y **TailwindCSS**.  
Permite registrarse, iniciar sesión y gestionar tareas con filtros, búsqueda y paginación.

---

## Requisitos

| Herramienta | Versión mínima |
|-------------|----------------|
| Node        | 20.x           |
| npm         | 9.x            |

---

## Instalación y arranque

```bash
git clone https://github.com/tu-user/todo-list-test-front.git
cd todo-list-test-front

cp .env.example .env                  # VITE_API_BASE_URL=http://localhost:4000/api
npm install
npm run dev                           # Vite en http://localhost:5173
```

## Variables de entorno:
| Clave                | Ejemplo                                      | Descripción                                      |
|----------------------|----------------------------------------------|--------------------------------------------------|
| VITE_API_BASE_URL    | http://localhost:4000/api                    | URL base de la API RESTful                       |

## Scripts disponibles
```bash
npm run dev           # Inicia el servidor de desarrollo
npm run build         # Build de producción (dist/)
npm run lint          # ESLint + Prettier
```

## Flujo de uso
	1.	Registro / Login — guarda token y user en localStorage.
	2.	/tasks
	•	Crear, editar, eliminar, completar tareas.
	•	Filtros por estado (All / Completed / Pending).
	•	Búsqueda insensible por título / descripción.
	•	Paginación (4 tareas por página).
	3.	Logout — limpia el almacenamiento y redirige a /login.

## Arquitectura basada en servicios o features
```plaintext
src/
 ├─ components/        # Button, FieldSet, etc.
 ├─ contexts/
 │   ├─ AuthContext.tsx
 │   └─ useAuth.ts
 ├─ features/
 │   ├─ auth/
 │   │   └─ pages/ LoginPage, RegisterPage
 │   └─ tasks/
 │       ├─ hooks.ts
 │       ├─ pages/ TasksPage
 │       └─ ui/ TaskCard, TaskForm, Filters
 ├─ services/          # api wrapper y servicios REST
 ├─ routes.tsx
 └─ index.css
```
	•	Tailwind con tema oscuro por defecto.
	•	clsx para componer clases condicionales.
	•	Contexto de autenticación con persistencia de sesión y estado loading para evitar redirecciones prematuras.

## Decisiones UI
	•	Modal para crear y editar tarea reutilizando el mismo formulario.
	•	Botón ✏️ editar y 🗑 eliminar en cada tarjeta.
	•	Paginador numérico que se actualiza dinámicamente (4 ítems por página).
	•	React-Hook-Form simplifica validaciones en Login, Register y TaskForm.