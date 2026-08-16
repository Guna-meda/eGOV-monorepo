FROM node:22

WORKDIR /workspace

COPY package.json package-lock.json ./
COPY packages/shared/package.json packages/shared/package.json
COPY complaint-service/package.json complaint-service/package.json
COPY gis-service/package.json gis-service/package.json
COPY frontend/package.json frontend/package.json

RUN npm install

WORKDIR /workspace/complaint-service

EXPOSE 5001

CMD ["npm", "run", "dev"]