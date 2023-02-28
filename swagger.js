import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
    definition:{
        openapi: "3.0.0",
        info: {title: "Gateway Manager", version: "1.0.0"},
        components: {
            "schemas": {
                "Gateway": {
                    "properties": {
                        "serialNumber": {
                            "type": "string",
                            "unique": true,
                            "example": "123456"
                        },
                        "name": {
                            "type": "string",
                            "example": "Gateway 1"
                        },
                        "ipAddress": {
                            "type": "string",
                            "format": "ipv4",
                            "description": "Must be an ip address",
                            "example": "192.168.1.0"
                        },
                        "devices": {
                            "type": "array",
                            "items": {
                                "$ref": "#/components/schemas/Device"
                            }
                        }
                    },
                    "required":['serialNumber', 'name', 'ipAddress']
                },

                "Device": {
                    "properties": {
                        "uid": {
                            "type": "integer",
                            "unique": true,
                            "example": 1
                        },
                        "vendor": {
                            "type": "string"
                        },
                        "dateCreated": {
                            "type": "string",
                            "format": "date",
                        },
                        "status": {
                            "type": "string",
                            "enum":['online', 'offline']
                        },
                    },
                    "required":['uid', 'vendor', 'status']
                },

            }
        }
    },
    apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsDoc(options);

const swaggerDocs = (app, port) => {
    app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

    console.log(`Version 1 Docs are available at http://localhost:${port}/api/docs`);
};

export default swaggerDocs;
