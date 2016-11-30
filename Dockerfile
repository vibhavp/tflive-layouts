FROM nodecg/nodecg

WORKDIR /usr/src/app/bundles/tflive-layouts
RUN apt-get update

RUN apt-get install -y \
	mumble \
	build-essential

COPY . ./

RUN npm install --production
RUN bower install --allow-root
EXPOSE 9090
CMD ["node", "../../index.js"]
