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

# optimization for all files

FROM Node

WORKDIR /app

COPY package*.json .
RUN npm install

COPY . .

CMD [ "node", "index.js" ]

# avoid unnecessary

# make .dockerignore file and add the name of those file u not to push 