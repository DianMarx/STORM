FROM google/nodejs-runtime
WORKDIR /app
ADD package.json /app/
RUN npm --unsafe-perm install
ADD . /app
CMD []
ENTRYPOINT ["npm", "start"]
