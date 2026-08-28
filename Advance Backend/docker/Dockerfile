FROM Node

WORKDIR /app

COPY index.js index.js
COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install

CMD [ "node", "index.js" ] 

# optimization way

FROM Node

WORKDIR /app

COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm install

COPY index.js index.js

CMD [ "node", "index.js" ] 