# ILMS Material Master & Packaging Hierarchy

This is a full-stack production starter consisting of:

- Backend: Spring Boot 3, Spring Web, Spring Data JPA, Validation, SQLite
- Frontend: React (CRA), React Router, MUI v5, Axios
- File storage: Local filesystem under `./uploads`

## Prerequisites

- Java 17+
- Maven 3.9+
- Node.js 18+

## Run Backend

```
cd ilms-backend
mvn clean package
mvn spring-boot:run
```

The API will be at http://localhost:8080.

SQLite DB file `ilms.db` will be created in the backend folder. Schema and seed data are applied via `schema.sql` and `data.sql` on first run.

Static files uploaded will be served from `http://localhost:8080/uploads/...`.

## Run Frontend

```
cd ilms-frontend
npm install
npm start
```

The app will start at http://localhost:3000 and is CORS-enabled against the backend.

## Sample cURL

Upload a material image (replace file path):

```
curl -F "file=@./sample.jpg" -F "type=material" http://localhost:8080/api/materials/MAT-2024-0001/images
```

Create packaging hierarchy:

```
curl -X POST http://localhost:8080/api/packaging-hierarchy \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Standard Shampoo 100ml",
    "gtinAssignmentFormat":"GTIN-14",
    "packagingCapacityConstraints":false,
    "levels":[
      {"levelIndex":1,"levelCode":"L1","levelName":"ITEM","containedQuantity":1,"idTech":"BARCODE","barcodeType":"EAN-13"},
      {"levelIndex":2,"levelCode":"L2","levelName":"CARTON","containedQuantity":12,"idTech":"BARCODE","barcodeType":"EAN-128"},
      {"levelIndex":3,"levelCode":"L3","levelName":"BOX","containedQuantity":4,"idTech":"BARCODE","barcodeType":"EAN-128"},
      {"levelIndex":4,"levelCode":"L4","levelName":"PALLET","containedQuantity":50,"idTech":"RFID","rfidTagType":"UHF"},
      {"levelIndex":5,"levelCode":"L5","levelName":"CONTAINER","containedQuantity":20,"idTech":"RFID","rfidTagType":"UHF"}
    ]
  }'
```

Preview totals (example response below):

```
curl http://localhost:8080/api/packaging-hierarchy/1/preview
```

Sample response:

```json
{
  "hierarchyId": 1,
  "name": "Standard Shampoo 100ml",
  "levels": [
    {"levelIndex":1,"levelName":"ITEM","containedQuantity":1,"totalBaseItems":1,"idTech":"BARCODE"},
    {"levelIndex":2,"levelName":"CARTON","containedQuantity":12,"totalBaseItems":12,"idTech":"BARCODE"},
    {"levelIndex":3,"levelName":"BOX","containedQuantity":4,"totalBaseItems":48,"idTech":"BARCODE"},
    {"levelIndex":4,"levelName":"PALLET","containedQuantity":50,"totalBaseItems":2400,"idTech":"RFID"},
    {"levelIndex":5,"levelName":"CONTAINER","containedQuantity":20,"totalBaseItems":48000,"idTech":"RFID"}
  ],
  "summary": [
    "1 CONTAINER - 20 PALLET = 48000 ITEMS",
    "1 PALLET - 50 BOX = 2400 ITEMS",
    "1 BOX - 4 CARTON = 48 ITEMS",
    "1 CARTON - 12 ITEM = 12 ITEMS"
  ]
}
```

## UI Overview

- Material Master screen matches the provided layout: left image card with dotted border and gallery; right details table inside a Paper; tabs: Material Details | Bill Of Material | Storage Location | Supplier Details.
- Packaging Hierarchy screen shows nested box-in-box visualization with Save Hierarchy | Preview | Cancel controls.

## Extending

- Add fields to `MaterialMaster` and `HandlingParameter` entities and mirror in DTOs and frontend forms.
- Add more validation using `jakarta.validation` annotations.
