# API Authentication

All requests to our API endpoints require an API key. The API key serves as a unique identifier for your account and ensures that only authorized users can access the system.

### How to Include Your API Key

For each API request, you need to add your API key in the headers under the custom header:

```http
x-sonio-api-key: {yourApiKey}
```

### Endpoint requiring authentication

Below are the main endpoints you can interact with that requires authentication:

```
- GET /session/:{sessionId}/result
- GET /session/:{sessionId}/status
```
