#FROM nginx:1.15
#COPY ./dist/ /usr/share/nginx/html
#COPY ./nginx.conf /etc/nginx/nginx.conf

# base image
FROM node:11.15.0

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json package-lock.json /app/
RUN npm install

# add app
COPY . /app

# start app
CMD ng serve --host 0.0.0.0
