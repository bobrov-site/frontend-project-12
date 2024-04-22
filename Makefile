build:
	npm run build
start:
	make start-backend
start-backend:
	npm run start
start-frontend:
	cd frontend && npm start
develop:
	make start-backend & make start-frontend
lint:
	cd frontend && npx eslint .
fix:
	cd frontend && npx eslint --fix .