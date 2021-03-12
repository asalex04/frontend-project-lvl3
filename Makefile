install: 
	npm install
	
start:
	npm run build

develop:
	npx webpack-dev-server

build:
	rm -rf dist
	NODE_ENV=production npx webpack
	
lint:
	npx eslint .
	
.PHONY: test