# Personal Library Application Walkthrough

I have successfully created the **Personal Library Application** with a Spring Boot backend and a React frontend.

## System Components

1.  **Backend**: Spring Boot 3.4.0 (Java 25 compatible).
    -   API running at `http://localhost:8080/api/items`
    -   Endpoints:
        -   `GET /api/items?page=0&size=10&query=title` (Paged Search)
        -   `POST /api/items` (Create)
        -   `PUT /api/items/{id}` (Update)
        -   `DELETE /api/items/{id}` (Delete)
2.  **Frontend**: React + Vite + Vanilla CSS.
    -   Running at `http://localhost:5173`
    -   **New Features**:
        -   **Table View**: Items displayed in a responsive table.
        -   **Pagination**: User-friendly navigation for large collections.
        -   **Search**: Real-time filtering by title.
        -   **Modal CRUD**: Add and edit items in a sleek modal overlay.
3.  **Database**: PostgreSQL (Docker).
    -   Port: 5432

## How to Run

### 1. Database
Ensure Docker is running:
```bash
docker-compose up -d
```

### 2. Backend
Open a terminal in the `backend` directory:
```bash
./mvnw clean spring-boot:run
```

### 3. Frontend
Open a terminal in the `frontend` directory:
```bash
npm run dev
```

## Verification
-   **Backend**: Verified API supports pagination and search.
-   **Frontend**: Verified build and manual flow for Create, Read, Update, Delete.
-   **UI**: Validated dark theme, modal interactions, and table layout.

## Usage
1.  Open [http://localhost:5173](http://localhost:5173).
2.  **Add Item**: Click "+ Add New Item", fill the modal form, and save.
3.  **Search**: Type in the search bar to filter items by title.
4.  **Edit**: Click "Edit" in the table row to modify an item.
5.  **Delete**: Click "Delete" to remove an item.

## SpringDoc OpenAPI (Swagger) Integration
I have successfully added Swagger/OpenAPI documentation to the Spring Boot backend using springdoc-openapi.

Changes
1. Added Dependency
Updated 
backend/pom.xml
 to include springdoc-openapi-starter-webmvc-ui.


```xml
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.8.5</version>
</dependency>
```
How to Access Documentation
Start the Backend: Run the application as usual:

./mvnw spring-boot:run
View Swagger UI: Open your browser to: http://localhost:8080/swagger-ui/index.html

View OpenAPI Spec (JSON): http://localhost:8080/v3/api-docs

## Secure API Controller with API Key
I have implemented a new secure controller endpoint that requires an API key for access.

### 1. Make Authenticated Requests
To access the secure endpoints, you **must** include the header:

```bash
curl -H "X-API-KEY: secret-api-key-12345" http://localhost:8080/api/v1/secure/items
```

### 2. Verify Security
Try accessing without the key to confirm it is blocked (should return 401 Unauthorized):
```bash
curl -v http://localhost:8080/api/v1/secure/items
```

Enjoy your new personal library!
