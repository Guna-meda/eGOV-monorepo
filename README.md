# Local Setup

## Clone the repository

```bash
git clone https://github.com/Guna-meda/eGOV-monorepo.git
cd eGOV-monorepo
git checkout copy-main
```

## Install dependencies

From the repository root:

```bash
npm install
```

Build the shared package:

```bash
cd packages/shared
npm run build
```

## Setup env variables
Just follow .env.example and copy it to .env under /frontend, /gis-service, 
and /complaint-service

Return to the repository root and start the application:

```bash
docker compose up
```

The application will be available at:

```
http://localhost:5173
```

---

# Known Issues

- You may see ESLint errors related to `tsconfigRootDir`. These do not affect the application's functionality.

---

# Upload Ward Boundaries

The map will not display ward boundaries until they are uploaded.

**Endpoint**

```
POST http://localhost:3000/api/v1/gis/boundary-layers
```

**Content-Type**

```
multipart/form-data
```

**Form Data(example)**

| Key | Value |
|------|-------|
| boundaryData | GeoJSON file containing ward polygons |
| city | Bengaluru |
| layerType | ward |
| level | 2 |

Reference GeoJSON (originally sourced from OpenCity as a KML file and converted to GeoJSON):

https://drive.google.com/file/d/1HZtgXwjjW3y541B27lMTADAbLk77LpXa/view?usp=sharing

---

# Development Notes

This project is configured for development using **bind-mounted volumes**. The Docker containers use the source code directly from your host machine, so changes to application source files are reflected immediately without rebuilding the Docker images.

## If you modify `packages/shared`

```bash
cd packages/shared
npm run build
```

## If you modify the root `package.json`

```bash
docker compose down
npm install
docker compose up
```

## If you modify `docker-compose.yml`

```bash
docker compose down
docker compose up
```