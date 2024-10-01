# Changelog

## Introduction of Authentication via API Key

#### Effective Date: (To Be Updated)

NOTE: The effective date will be updated after the successful communication with all clients.

### Overview

We have introduced a new security measure for our API endpoints to ensure secure access and data protection. Going forward, all API requests must include an API key in the headers. Without this, requests will be denied.

#### New API Authentication Requirements

To access the following endpoints, you will now be required to include an API key in the request headers. The API key must be passed using the custom header `x-sonio-api-key`:

```http
x-sonio-api-key: {apiKey}
```

#### Affected Endpoints

```
- GET /session/:{sessionId}/result
- GET /session/:{sessionId}/status
```

NOTE: Contact our team if you are using any other privately available endpoint to ensure the correct future usability.

For endpoints returning image URLs (/result), the imageUrl will now be signed and will include an expiration date of **12 hours**.

The URL will contain the following query parameters:

```
imageUrl?signature={signature}&expires={expirationTimestamp}
```

#### Conclusion

We are committed to enhancing the security of our API services. With the introduction of API key authentication, access control is more robust, ensuring that only authorized users can interact with our endpoints and resources.

For assistance with generating or retrieving your API key, please contact our support team.
