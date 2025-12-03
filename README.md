# 🚀 RRHH API
Bienvenido al repositorio de la API para recursos humanos. Este documento sirve como guía para configurar el entorno de desarrollo y entender nuestro flujo de trabajo para asegurar la calidad y consistencia del código.

### 📋 Requisitos Previos
Asegúrate de tener instalado lo siguiente antes de comenzar:
- Node.js (Versión LTS recomendada)
- NPM (viene con Node.js)
- Git

### 🛠️ Instalación y Configuración
1. Clonar el repositorio:\
`git clone https://github.com/SanderCorp6/API`\
`cd API`

2. Instalar dependencias:\
`npm install`

### 🏃‍♂️ Ejecutar la Aplicación
Para levantar el entorno de desarrollo local: `npm run dev`

La aplicación estará disponible usualmente en `http://localhost:3000/` (o el puerto que indique la consola).


## Workflow
Seguimos un flujo estricto para mantener nuestro historial de Git limpio y nuestro código libre de errores. Sigue estos pasos para cada tarea.

**1. Actualizar** ```main```
\
Antes de empezar cualquier tarea, asegúrate de que tu rama principal esté actualizada.
```bash
git checkout main
git pull origin main
```

**2. Crear una Rama**
\
Utilizamos una convención de nombres basada en tickets de JIRA.
 * **Para nuevas funcionalidades:**```feature/JIRA-ID```
 * **Para errores:** ```bug/JIRA-ID```
Ejemplo:
```bash
# Si el ticket es S3-23
git checkout -b feature/S3-23

# O si es un bug
git checkout -b bug/S3-23
```

**3. Desarrollo y Linting**\
Realiza tus cambios en el código. 
Antes de subir tus cambios al "stage", debes ejecutar el linter para corregir errores de estilo automáticamente.
```bash
# Paso obligatorio antes de hacer commit
npm run lint:fix
```

**4. Guardar Cambios (Commit)**\
Una vez que el linter ha pasado y corregido el código:
```bash
# Agregar archivos al stage
git add .

# Crear el commit
git commit -m "feat: descripción breve de lo que se hizo"
```

**5. Subir Cambios (Push)**\
Sube tu rama al repositorio remoto.
```bash
git push -u origin feature/S3-23
```

## 🔄 Mantener la Rama Actualizada (Rebase)
Si mientras trabajabas en tu rama, la rama main avanzó (otros desarrolladores fusionaron cambios), debes actualizar tu rama utilizando Rebase en lugar de Merge para mantener un historial lineal.

**Pasos para hacer Rebase:**
1. **Vuelve a main y actualízalo:**

   ```bash
   git checkout main
   git pull origin main
   ```
2. **Vuelve a tu rama:**

   ```bash
   git checkout feature/S3-23
   ```
3. **Ejecuta el Rebase:** *Esto "mueve" tus cambios para que se apliquen después de lo último que hay en main.*

   ```bash
   git rebase main
   ```
   Si hay conflictos: Git pausará el rebase.
   1. Resuelve los conflictos en tu editor.
   2. Agrega los archivos corregidos: `git add .` (No hagas commit).
   3. Continúa el rebase: `git rebase --continue`.
3. **Subir cambios después del Rebase:** *Como el rebase reescribe el historial, necesitarás forzar el push (ten cuidado de hacerlo solo en tu rama).*

   ```bash
   git push origin feature/S3-23 --force
   ```

## ✅ Finalizar una Tarea
Cuando hayas terminado tu trabajo y pusheado tu rama:
1. Ve aL repositorio de GitHub.
2. Crea un Pull Request (PR) apuntando a main.
3. Solicita revisión de código.
4. Una vez aprobado y mergeado, puedes eliminar tu rama local y volver a sincronizar:
```
git checkout main
git pull origin main
git branch -d feature/S3-24
```

## 📝 Comandos Útiles
| Acción                            |  Comando                    |
|:----------------------------------|:----------------------------|
| Ver estado de archivos            | `git status`                |
| Ver historial de commits          | `git log --oneline`         |
| Ver historial de commits          | `git checkout -- <archivo>` |
| Ver historial de commits          | `npm install <paquete>`     |