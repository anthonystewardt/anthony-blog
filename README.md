<div align="center">
<img alt="Portfolio" src="https://github.com/dillionverma/portfolio/assets/16860528/57ffca81-3f0a-4425-b31d-094f61725455" width="90%">
</div>

# Anthony Blog & Academy

Plataforma de portafolio, blog educativo y clases construida con Next.js, Prisma, PostgreSQL, [shadcn/ui](https://ui.shadcn.com/) y [Magic UI](https://magicui.design/).

# Features

- Setup only takes a few minutes by editing the [single config file](./src/data/resume.tsx)
- Built using Next.js 14, React, Typescript, Shadcn/UI, TailwindCSS, Framer Motion, Magic UI
- Includes a blog
- Educational CMS for articles, video classes, tutorials and notes
- Categories, tags, SEO metadata and Markdown code examples
- Protected administration dashboard
- Ordered course series with lesson index and previous/next navigation
- Responsive for different devices
- Optimized for Next.js and Vercel

# Getting Started Locally

1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/dillionverma/portfolio
   ```

2. Move to the cloned directory

   ```bash
   cd portfolio
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the local Server:

   ```bash
   npm run dev
   ```

5. Open the [Config file](./src/data/resume.tsx) and make changes

## Base de datos y migraciones seguras

Next.js no ejecuta las migraciones. Prisma modifica directamente PostgreSQL, por lo que las migraciones deben ejecutarse como un paso controlado antes de desplegar la aplicación.

### Regla principal

Nunca ejecutar una migración en producción sin:

1. Confirmar la base de datos indicada en `DATABASE_URL`.
2. Crear un respaldo verificable.
3. Revisar el SQL generado.
4. Probarlo sobre staging o una restauración de producción.
5. Comparar los conteos de usuarios y contenido antes y después.

### Crear una migración en desarrollo

Generar el archivo sin aplicarlo inmediatamente:

```bash
npx prisma migrate dev --name nombre_del_cambio --create-only
```

Revisar el archivo `prisma/migrations/*/migration.sql`. Prestar especial atención a:

```text
DROP TABLE
DROP COLUMN
TRUNCATE
DELETE FROM
ALTER COLUMN ... NOT NULL
```

Después de revisar el SQL, aplicarlo únicamente en desarrollo:

```bash
npx prisma migrate dev
npx prisma generate
```

### Respaldo antes de producción

```bash
pg_dump "$DATABASE_URL" \
  --format=custom \
  --file="backup-before-migration.dump"
```

Validar que el respaldo pueda leerse:

```bash
pg_restore --list backup-before-migration.dump
```

La práctica recomendada es restaurar el respaldo en una base temporal y probar ahí la migración y el inicio de sesión.

### Aplicar en staging o producción

```bash
npx prisma migrate status
npx prisma migrate deploy
```

Después de aplicar la migración, verificar como mínimo:

```sql
SELECT COUNT(*) FROM "User";
SELECT COUNT(*) FROM "Post";
SELECT COUNT(*) FROM "Subscriber";
```

El despliegue debe seguir este orden:

```text
Backup → restauración de prueba → migrate deploy → validación → despliegue de Next.js
```

### Comandos prohibidos en producción

```bash
npx prisma migrate reset
npx prisma db push --force-reset
npx prisma migrate dev
```

`migrate reset` y `db push --force-reset` pueden eliminar datos. `migrate dev` está diseñado exclusivamente para desarrollo.

Para renombrar o eliminar campos con datos se debe usar una migración gradual: añadir el campo nuevo, copiar los datos, desplegar el código compatible y eliminar el campo anterior en una migración posterior.

## Usuarios y acceso administrativo

Los usuarios de la tabla `User` se utilizan actualmente para autenticar el panel administrativo y para identificar al autor de cada publicación.

### Estado actual

- No existe una página ni una API pública de registro.
- `/login` inicia una sesión con NextAuth.
- `/dashboard/*` exige una sesión activa con rol `ADMIN`.
- Las APIs de escritura validan nuevamente el rol `ADMIN` en el servidor.
- Las APIs públicas solo devuelven contenido publicado.

### Flujo recomendado para producción

1. Crear el primer administrador mediante el comando local controlado `npm run admin:create`.
2. Guardar la contraseña únicamente como hash de bcrypt.
3. Exigir `role === "ADMIN"` en middleware y APIs administrativas.
4. Mantener deshabilitado el registro público.
5. Permitir que solamente un administrador invite o cree otros usuarios.
6. Registrar auditoría de creación, edición y publicación de contenido.

Nunca insertar contraseñas sin cifrar directamente en PostgreSQL. El servidor debe asignar y validar los roles.

### Crear o promover un administrador

Con PostgreSQL activo y `DATABASE_URL` configurada, ejecutar desde la raíz del proyecto:

```bash
npm run admin:create
```

El comando solicita nombre, email y una contraseña de al menos 12 caracteres. La contraseña no se muestra mientras se escribe y se almacena únicamente como hash bcrypt. Si el email ya existe, esa cuenta se actualiza y se promueve a `ADMIN`.

Después se inicia sesión en:

```text
http://localhost:3000/login
```

No ejecutar el comando desde una función web ni exponerlo como endpoint. Debe usarse solamente desde una terminal con acceso autorizado a la base de datos correspondiente.

## Series, cursos y contenidos por partes

Un tema amplio se organiza mediante una `Series`. Cada artículo, clase o tutorial puede asignarse a una serie y recibir un número de parte.

Flujo desde el administrador:

1. Abrir `Dashboard → Series y cursos`.
2. Crear la serie, por ejemplo “Linux desde cero”.
3. Crear o editar cada contenido.
4. Seleccionar la serie en el editor.
5. Asignar `Parte 1`, `Parte 2`, etc.
6. Publicar las lecciones y la serie.

La página pública ordena las lecciones por número de parte y muestra:

- Parte actual y total de partes.
- Programa completo del curso.
- Estado visual de la lección activa.
- Botones Anterior y Siguiente.
- Mensaje de finalización al completar la última parte.

## Perfil, configuración y newsletter

El panel incluye dos áreas administrativas nuevas:

- `Dashboard → Mi perfil`: nombre público, especialidad, biografía, avatar y enlaces profesionales. Estos datos aparecen en la ficha del instructor de cada publicación.
- `Dashboard → Configuración`: identidad de la academia, URL pública, remitente del correo y control para activar o pausar las notificaciones automáticas.

### Suscripción segura

La suscripción usa doble confirmación (`double opt-in`):

1. La persona escribe su correo y acepta expresamente recibir novedades.
2. Se guarda como pendiente, no como suscriptor activo.
3. Recibe un enlace único de confirmación.
4. Solo después de abrirlo queda habilitada para recibir publicaciones.
5. Al confirmar recibe un correo de bienvenida.
6. Cada mensaje incluye un enlace personal para cancelar la suscripción.

La cancelación no se ejecuta al abrir el enlace: primero muestra un modal de confirmación y requiere una acción explícita. Esto evita bajas accidentales provocadas por escáneres de enlaces. Tras confirmar, el miembro queda inactivo inmediatamente y recibe una constancia indicando que no recibirá más actualizaciones.

Si el correo ya está confirmado, el formulario informa que ya pertenece a la comunidad y no crea otro registro. Si está pendiente, reutiliza el registro existente y reenvía su confirmación. Si Resend rechaza el mensaje, el modal conserva el formulario y muestra el fallo; nunca presenta una entrega fallida como exitosa.

Al crear contenido directamente como publicado, o al cambiarlo de borrador a publicado, el sistema envía una notificación una sola vez. Editar posteriormente el artículo no vuelve a enviar el correo. Un error del proveedor de correo no impide publicar el contenido.

Variables necesarias:

```env
RESEND_API_KEY="re_..."
RESEND_EMAIL_OWNER="tu-correo@dominio.com"
RESEND_FROM_EMAIL="newsletter@tu-dominio.com"
```

Además, en `Dashboard → Configuración` se debe indicar:

- La URL pública real de la plataforma; se usa para construir enlaces de confirmación, lectura y cancelación.
- Un correo remitente cuyo dominio esté verificado en Resend.
- Opcionalmente, un correo de respuesta.

`onboarding@resend.dev` sirve para pruebas limitadas. En producción se debe verificar un dominio propio antes de activar “Notificar al publicar”. Las claves del proveedor nunca deben incluirse en el repositorio.

`RESEND_EMAIL_OWNER` recibe los mensajes del formulario de contacto. `RESEND_FROM_EMAIL` establece el remitente verificado para contacto, confirmaciones, nuevas publicaciones y campañas. El nombre anterior `RESENT_EMAIL_OWNER` se acepta temporalmente por compatibilidad, pero debe migrarse al nombre correcto.

La migración `20260830043000_profiles_settings_newsletter` es aditiva: crea configuración y perfiles, y conserva los suscriptores existentes. Por seguridad, los registros antiguos quedan pendientes de una nueva confirmación; no se eliminan.

### Próximas ampliaciones recomendadas

- Programar publicaciones y campañas para una fecha concreta.
- Panel de métricas: aperturas, clics, crecimiento y contenidos más leídos.
- Progreso por estudiante, marcadores y “continuar aprendiendo”.
- Orden visual de módulos y lecciones mediante arrastrar y soltar.
- Evaluaciones, tareas, certificados y recursos descargables.
- Biblioteca multimedia centralizada y reutilizable.
- Preguntas y respuestas moderadas debajo de cada clase.
- Búsqueda global por contenido, categoría, etiqueta y transcripción.
- Historial de auditoría de cambios administrativos.
- Exportación de suscriptores, respaldos automáticos y recuperación probada.

## Comunidad y campañas

`Dashboard → Comunidad` reúne los suscriptores del newsletter sin mezclarlos con los usuarios administrativos. Incluye:

- Estados activo, pendiente y cancelado.
- Buscador y exportación CSV.
- Conteos de audiencia en tiempo real.
- Compositor de asunto, vista previa, mensaje y botón opcional.
- Confirmación antes del envío.
- Historial de campañas, destinatarios, fecha y estado.

Las campañas solo se envían a registros con `active = true` y `confirmedAt` definido. Cada destinatario recibe un mensaje individual con su enlace de cancelación; nunca se exponen las direcciones de otros miembros. Se requiere `RESEND_API_KEY` y un dominio remitente verificado.

# License

Licensed under the [MIT license](https://github.com/dillionverma/portfolio/blob/main/LICENSE.md).
