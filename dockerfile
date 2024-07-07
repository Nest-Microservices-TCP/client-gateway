# Este archivo es el que define las especificacion de construccion
# de la imagen del servicio

# Esta es la imagen sobre la que se basa, la cual es la mas comun
# y ligera para node en produccion. Es como un linux que tiene
# preinstalado node, el 21 indica la version que tiene
FROM node:21-alpine3.19

# Definimos donde se va a construir esta imagen, esta ruta es
# dentro de la distro de Linux en el container
WORKDIR /usr/src/app

# Definimos que se va a copiar dentro del container, en este
# caso queremos copiar todos los archivos package.json,
# incluyendo el lock.json, eso se logra con el * indicando
# que sean todos los archivos que empiecen con package y
# terminen con .json
COPY package*.json ./

# Definimos el comando que se ejecuta una vez ha
# ha sido construida la imagen
RUN npm install

# Podemos definir mas COPY en el archivo, en este caso copiamos
# lo que no este excluido en el dockerignore dentro del
# contenedor
COPY . .

# Finalmente definimos el puerto que sera expuesto para
# acceder al container construido
EXPOSE 3000