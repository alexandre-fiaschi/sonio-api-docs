<!-- ![Logo](./.compiiile/public/sonio_light.jpg) -->
<img id="logo" src="sonio_light.jpg" alt="Logo" style="width: auto; height: auto; padding-bottom: 40px;" />

<script>
  document.addEventListener('DOMContentLoaded', () => {
    const logo = document.getElementById('logo'); // Assuming the logo has an ID 'logo'

    const setLogo = () => {
      const htmlElement = document.documentElement; // Select the <html> element

      if (htmlElement.classList.contains('theme--dark')) {
        logo.src = './sonio_dark.png'; // Switch to dark mode logo
      } else {
        logo.src = './sonio_light.png'; // Switch to light mode logo
      }
    };

    // Call the function initially to set the logo on page load
    setLogo();

    // Optionally, if theme can change dynamically, listen for class changes (MutationObserver)
    const observer = new MutationObserver(() => {
      setLogo();
    });

    // Start observing the <html> element for attribute/class changes
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  });
</script>
<!-- <script src="/theme-logo-switch.js"></script> -->

# API Reference

If you have any support request or feedback, please reach out to us at alexandre.fiaschi@sonio-group.com

## Documentation

[Swagger Docs](https://staging.id.sonio-group.com/api/v4/swagger/index.html)

## Reference V4

### Environments

- Staging Base URL: https://staging.id.sonio-group.com/api/v4/

### **Create a session (IDV, PoA)**

```http
  POST api/v4/session
```

**Request** payload (JSON)

| Parameter     | Type     | Description                                                                    |
| :------------ | :------- | :----------------------------------------------------------------------------- |
| `customerId`  | `string` | **Required**. Your client ID supplied by Sonio                                 |
| `flowId`      | `string` | **Required**. id of a flow defined in our database                             |
| `redirectUrl` | `string` | **Required**. Redirect to this url after identification complete               |
| `countryCode` | `string` | (optional, ISO 3166 country code)                                              |
| `language`    | `string` | (optional, ISO 639-1 default “en”, supported: en, de, tr)                      |
| `referenceId` | `string` | (optional, external reference used to identify a user coming from your system) |

<u>**Required only for the data matching**:</u>

**Person**

| Parameter    | Type     | Description |
| :----------- | :------- | :---------- |
| `title`      | `string` |             |
| `firstname`  | `string` |             |
| `lastname`   | `string` |             |
| `middleName` | `string` |             |
| `maidenname` | `string` |             |
| `otherName`  | `string` |             |
| `gender`     | `string` |             |
| `birthdate`  | `string` |             |

**Address**

| Parameter      | Type     | Description |
| :------------- | :------- | :---------- |
| `addressLine1` | `string` |             |
| `postcode`     | `string` |             |
| `city`         | `string` |             |
| `country`      | `string` |             |
| `label`        | `string` |             |

_Example_

```
[POST] api/v4/session

{
   "customerId":"CUSTOMERID",
   "countryCode":"AT",
   "language":"en",
   "flowId":"FLOWID",
   "redirectURL":"https://.com.url",
   "person":{
      "title":"",
      "firstname":"MAX",
      "lastname":"MUSTERMANN",
      "maidenname":"JOHN",
      "gender":"M",
      "birthdate":"1990-01-01"
   },
   "address":{
      "addressLine1":"LANGEGASSE 1",
      "postcode":"1010",
      "city":"VIENNA",
      "country":"AUT",
      "label":""
   }
}
```

**Response** (JSON)

Contains information (id, date created, expire, start url for starting the identification) OR error message.

```
{
   "sessionId":"65841980bxxxxxa76e954c8a",
   "startURL":"https://staging.id.sonio-group.com/start/en/64d1xxxxx9249f9fe9ff/?session=65841980bb9616xxxxxx4c8a&flowid=6526 590a8abxxxxxb5b44e39",
   "createdDate":"2023-12-21T11:54:56+01:00",
   "referenceId": "externalUserID1234556",
   "updatedDate":"2023-12-21T11:54:56+01:00",
   "expireDate":"2024-01-05T11:54:56+01:00"
}
```

### **Create a session (Open banking)**

```http
  POST api/v4/session
```

To create a session via Open Banking, use the same payload as for IDV, with the addition of the person’s first and last name, which are required for accurate data matching.

_Example_

```
[POST] api/v4/session

{
  "customerId": "CUSTOMERID",
  "language": "en",
  "flowId": "FLOWID",
  "redirectURL": "https://google.com",
  "referenceId": "000000",
  "person": {
    "firstname": "name",
    "lastname": "surname"
  }
}
```

**Response** (JSON)

Contains information (id, date created, expire, start url for starting the identification) OR error message.

```
{
   "sessionId":"65841980bxxxxxa76e954c8a",
   "startURL":"https://staging.id.sonio-group.com/start/en/64d1xxxxx9249f9fe9ff/?session=65841980bb9616xxxxxx4c8a&flowid=6526 590a8abxxxxxb5b44e39",
   "createdDate":"2023-12-21T11:54:56+01:00",
   "referenceId": "externalUserID1234556",
   "updatedDate":"2023-12-21T11:54:56+01:00",
   "expireDate":"2024-01-05T11:54:56+01:00"
}
```

### Get results

```http
  GET api/v4/session/:{sessionId}/result
```

The response has a JSON structure. Calling the endpoint results in receiving all checks defined by the flowId in the same order, an overall status (flowStatus) and uploaded documents.

**Response**

| Data Field    | Type     | Description                                                      |
| :------------ | :------- | :--------------------------------------------------------------- |
| `sessionId`   | `string` | Uniquely generated session id                                    |
| `flowId`      | `string` | id of a flow defined in our database                             |
| `checks`      | `object` | Data collected from verification: PoI, PoA, Watchlist (optional) |
| `flowStatus`  | `object` | Status of the verification process                               |
| `matchedData` | `object` | sources of matched data and similarity scores                    |

_Example_

```
{
  "sessionId": "65841980bxxxxxa76e954c8a",
  "flowId": "FLOWID",
  "referenceId": "externalUserID1234556",
  "checks": {...},
  "flowStatus": {...},
  "matchedData": {...}
}
```

**Checks**

| Data Field  | Type     | Description                                                                                         |
| :---------- | :------- | :-------------------------------------------------------------------------------------------------- |
| `poi`       | `array`  | CHECK_DATA: Data collected in proof of identity step                                                |
| `poa`       | `array`  | CHECK_DATA: Data collected in proof of address step, where the data structure differs per provider. |
| `ais`       | `object` | CHECK_DATA: (Open Banking) Data collected in bank account verification step                         |
| `watchlist` | `object` | CHECK_DATA: Data collected from AML, PEP, AM data bases                                             |

CHECK_DATA

| Data Field      | Type     | Description                                                                                                  |
| :-------------- | :------- | :----------------------------------------------------------------------------------------------------------- |
| `provider`      | `string` | Data provider name                                                                                           |
| `status`        | `string` | The flow Status of the check. PENDING, STARTED COMPLETED, PART (some checks have several steps to complete.) |
| `validation`    | `string` | The result of the check. PENDING, PASS, FAIL, NEEDS_REVIEW, SKIP                                             |
| `reason`        | `string` | The fail or needs review reason message                                                                      |
| `reasonDetails` | `string` | Details of the validation fail or need review                                                                |
| `data`          | `string` | Raw provider data. We supply examples for each provider.                                                     |
| `processedData` | `string` | Depending on check type or provider we can send different kind of data                                       |

_Example_

```
"checks": {
    "poa": [
      {
        "provider": "schufa",
        "status": "COMPLETED",
        "validation": "FAIL",
        "score": "0.0",
        "reason": "Person not found",
        "reasonDetails": null,
        "externalIds": {...},
        "data": {...},
        "processedData": {...}
      },
    ],
    "poi": [
      {
        "provider": "incode",
        "status": "COMPLETED",
        "validation": "PASS",
        "score": "91.50",
        "reason": "",
        "reasonDetails": "",
        "externalIds": {
          "interviewId": "66e18312XXXXXXXXXXXX60a4"
        },
        "data": {...},
        "processedData": {...}
      }
    ]
  },
```

PoA with Schufa response structure

```
"poa":[
   {
      "provider":"schufa",
      "status":"COMPLETED",
      "validation":"PASS",
      "score":"100.0",
      "reason":null,
      "reasonDetails":null,
      "data":{
         "person":{
            "title":"Prof. Dr.",
            "firstname":"Ralph",
            "lastname":"SIMLZWEI-IDC-Abnahme",
            "gender":"M",
            "birthdate":"1968-04-26"
         },
         "address":{
            "addressLine1":"Christian-Ritter-von-Langheinrich-Straße 10",
            "postcode":"95448",
            "city":"Bayreuth",
            "country":"DEU"
         },
         "scores":{
            "totalScore":"100.0",
            "scores":{
               "firstNameScore":"100.0",
               "lastNameScore":"100.0",
               "birthDateScore":"100.0",
               "addressLine1Score":"100.0",
               "postcodeScore":"100.0",
               "cityScore":"100.0"
            },
            "documentVerified":true
         }
      },
      "processedData":null
   }
]
```

<u>**Processed Data**</u>

Person - For POI or POA or any check that returns personal details

| Data Field   | Type             | Description        |
| :----------- | :--------------- | :----------------- |
| `title`      | `string or null` |                    |
| `firstname`  | `string or null` |                    |
| `lastname`   | `string or null` |                    |
| `middleName` | `string or null` |                    |
| `maidenName` | `string or null` |                    |
| `otherName`  | `string or null` |                    |
| `gender`     | `string or null` | [M, m, W, w, U, u] |
| `birthdate`  | `string or null` | 2016-12-31         |

Address – for POI or POA or any check that returns address

| Data Field     | Type             | Description |
| :------------- | :--------------- | :---------- |
| `addressLine1` | `string or null` |             |
| `addressLine2` | `string or null` |             |
| `postcode`     | `string or null` |             |
| `city`         | `string or null` |             |
| `county`       | `string or null` |             |
| `region`       | `string or null` |             |
| `label`        | `string or null` |             |

Scores – For Schufa check, 0-100 score assigned to data from Person, and Address section

| Data Field          | Type             | Description |
| :------------------ | :--------------- | :---------- |
| `totalScore`        | `string or null` |             |
| `firstNameScore`    | `string or null` |             |
| `lastNameScore`     | `string or null` |             |
| `birthDateScore`    | `string or null` |             |
| `addressLine1Score` | `string or null` |             |
| `postcodeScore`     | `string or null` |             |
| `cityScore`         | `string or null` |             |

Document – document related data. Only PoI.

| Data Field             | Type             | Description |
| :--------------------- | :--------------- | :---------- |
| `typeOfId`             | `string or null` |             |
| `documentFrontSubtype` | `string or null` |             |
| `expireAt`             | `string or null` |             |
| `documentNumber`       | `string or null` |             |
| `issuingCountry`       | `string or null` |             |

Flow Status

| Data Field   | Type             | Description                                   |
| :----------- | :--------------- | :-------------------------------------------- |
| `status`     | `string`         | PENDING, STARTED, COMPLETED                   |
| `reason`     | `string`         | Reason for failing or requiring manual review |
| `validation` | `string or null` | PENDING, PASS, NEEDS REVIEW, FAIL             |

_Example_

```
"flowStatus":{
      "status":"COMPLETED",
      "reason":"Person not found",
      "validation":"NEEDS_REVIEW",
      "score":"0"
   },
```

Data matching (Matched Data) – sources of matched data and similarity scores.

- Field_name (name, firstname, lastname, birthdate,address, ...)

| Data Field   | Type             | Description                                         |
| :----------- | :--------------- | :-------------------------------------------------- |
| `poiValue`   | `string`         | name passed through the API                         |
| `poaValue`   | `string`         | rname extracted from proof of address document      |
| `apiValue`   | `string`         | name extracted from proof of identity document      |
| `similarity` | `string`         | string similarity of poiValue & poaValue & apiValue |
| `apiValue`   | `string or null` | name extracted from proof of identity document      |

- Similarity

| Data Field          | Type      | Description                                  |
| :------------------ | :-------- | :------------------------------------------- |
| `overallSimilarity` | `integer` | average of similarities from all data points |

_Example_

```
"matchedData":{
      "name":{
         "poiValue":"Wolfgang Amadeus Mozart",
         "apiValue":"Amadeus Mozart",
         "similarity":90
      },
      "firstname":{
         "apiValue":"Amadeus",
         "similarity":-1
      },
      "lastname":{
         "apiValue":"Mozart",
         "similarity":-1
      },
      "birthdate":{
         "poiValue":"1756-01-27",
         "apiValue":"1756-01-27",
         "similarity":100
      },
      "address":{
         "apiValue":"Getreidegasse 9, Salzburg, AUT",
         "similarity":-1
      },
      "overallSimilarity":90
   }
```

#### Example Get Results Responses

##### Full Get Result Response

```
[GET] api/v4/session/66e18XXXXXXXXXXXXXXc558/result

{
  "sessionId": "66e18XXXXXXXXXXXXXXc558",
  "flowId": "66e82XXXXXXXXXXXXXXXe038",
  "referenceId": "1",
  "checks": {
    "poa": [
      {
        "provider": "schufa",
        "status": "COMPLETED",
        "validation": "FAIL",
        "score": "0.0",
        "reason": "Person not found",
        "reasonDetails": null,
        "externalIds": {},
        "data": {
          "person": {
            "title": "",
            "firstname": "Rim",
            "lastname": "Saltaji",
            "gender": "F",
            "birthdate": "1996-06-31"
          },
          "address": {
            "addressLine1": "Rathausplatz",
            "postcode": "1010",
            "city": "Wien",
            "country": "AUT"
          },
          "scores": {
            "totalScore": "0.0",
            "scores": {
              "firstNameScore": "0.0",
              "lastNameScore": "0.0",
              "birthDateScore": "0.0",
              "addressLine1Score": "0.0",
              "postcodeScore": "0.0",
              "cityScore": "0.0"
            }
          }
        },
        "processedData": {
          "person": {
            "title": "",
            "firstname": "Rim",
            "lastname": "Saltaji",
            "gender": "F",
            "birthdate": "1996-06-31"
          },
          "document": null,
          "documents": null,
          "address": {
            "addressLine1": "Rathausplatz",
            "postcode": "1010",
            "city": "Vienna",
            "country": "AUT"
          },
          "imagesUrl": {
            "frontId": null,
            "backId": null,
            "faceId": null,
            "croppedFrontId": null,
            "croppedBackId": null,
            "croppedFaceId": null,
            "document": null
          }
        }
      },
      {
        "provider": "staple",
        "status": "COMPLETED",
        "validation": "NEEDS_REVIEW",
        "score": "0",
        "reason": "Date validation failed: Date score low 0",
        "reasonDetails": null,
        "externalIds": {
          "documentId": "4625177",
          "incodeToken": "eyJhbXXXXXXXXXXXXXXXXXXXXXXXiorBDjTd5ACEQaP7fZHzdr5I57",
          "interviewId": "66e18XXXXXXXXXXXXXXXXX60a4"
        },
        "data": {
          "getDocumentJSONDataAndImage": {
            "json": {
              "Type": "invoice",
              "num_pages": 1,
              "language": "",
              "docType": "",
              "BillingAddress": {
                "matches": [
                  {
                    "page": 0,
                    "match": "Rathausplatz",
                    "score": 0,
                    "matchmulti": "Rathausplatz",
                    "transformed": "",
                    "isTransformed": false
                  }
                ],
                "isDocscanner": false
              },
              "CompanyName": {
                "matches": [
                  {
                    "page": 0,
                    "match": "GmbH",
                    "score": 0,
                    "matchmulti": "GmbH",
                    "transformed": "",
                    "isTransformed": false
                  }
                ],
                "isDocscanner": false
              },
              "InvoiceDate": {
                "matches": [
                  {
                    "page": 0,
                    "match": "2024-06-29",
                    "score": 0,
                    "matchmulti": "2024-06-29",
                    "transformed": "",
                    "isTransformed": false
                  }
                ],
                "isDocscanner": false
              },
              "CustomerName": {
                "matches": [
                  {
                    "page": 0,
                    "match": "Rim Saltaji ",
                    "score": 99,
                    "matchmulti": "Rim Saltaji ",
                    "transformed": "",
                    "isTransformed": false
                  }
                ],
                "isDocscanner": true
              }
            },
            "fileName": "scanned-bill-66e18301e79310072fedc558-1726055315.png",
            "status": "RECEIVED",
            "language": "EN",
            "docType": "INVOICE"
          },
          "errors": null
        },
        "processedData": {
          "person": {
            "name": "Rim Saltaji "
          },
          "document": {
            "typeOfId": "",
            "documentFrontSubtype": "",
            "expireAt": "",
            "documentNumber": "",
            "issuingCountry": ""
          },
          "documents": null,
          "address": {
            "addressLine1": "Rathausplatz",
            "postcode": "1010",
            "city": "Wien",
            "label": "Rathausplatz, 1010 Wien, Österreich"
          },
          "imagesUrl": {
            "frontId": null,
            "backId": null,
            "faceId": null,
            "croppedFrontId": null,
            "croppedBackId": null,
            "croppedFaceId": null,
            "document": "https://api.sonio-group.com/media/XXXXXXXXXXXXXXXXX.jpg"
          }
        }
      }
    ],
    "poi": [
      {
        "provider": "incode",
        "status": "COMPLETED",
        "validation": "PASS",
        "score": "91.50",
        "reason": "",
        "reasonDetails": "",
        "externalIds": {
          "interviewId": "66e18XXXXXXXXXXX2b60a4"
        },
        "data": {
          "scores": {
            "idValidation": {
              "photoSecurityAndQuality": [
                {
                  "key": "tamperCheck",
                  "value": "PASSED",
                  "status": "OK"
                },
                {
                  "key": "alignment",
                  "value": "PASSED",
                  "status": "OK"
                },
                {
                  "key": "screenIdLiveness",
                  "value": "OK",
                  "status": "OK"
                },
                {
                  "key": "balancedLightFront",
                  "value": "90",
                  "status": "OK"
                },
                {
                  "key": "sharpnessFront",
                  "value": "92",
                  "status": "OK"
                },
                {
                  "key": "fakeBrowserCheck",
                  "value": "PASSED",
                  "status": "OK"
                },
                {
                  "key": "visibleIdCharacteristicsFront",
                  "value": "PASSED",
                  "status": "OK"
                }
              ],
              "idSpecific": [
                {
                  "key": "visiblePhotoFeatures",
                  "value": "100",
                  "status": "OK"
                },
                {
                  "key": "expirationDateValidity",
                  "value": "100",
                  "status": "OK"
                },
                {
                  "key": "sexCrosscheck",
                  "value": "100",
                  "status": "OK"
                },
                {
                  "key": "mrzLineFormatCheck",
                  "value": "0",
                  "status": "FAIL"
                },
                {
                  "key": "documentNumberCheckDigit",
                  "value": "100",
                  "status": "OK"
                },
                {
                  "key": "documentNumberCrosscheck",
                  "value": "100",
                  "status": "OK"
                },
                {
                  "key": "issueDateValidity",
                  "value": "100",
                  "status": "OK"
                },
                {
                  "key": "birthDateCrosscheck",
                  "value": "100",
                  "status": "OK"
                },
                {
                  "key": "underageCheck",
                  "value": "100",
                  "status": "OK"
                },
                {
                  "key": "birthDateCheckDigit",
                  "value": "100",
                  "status": "OK"
                },
                {
                  "key": "mrzParsableCheck",
                  "value": "100",
                  "status": "OK"
                },
                {
                  "key": "documentClassification",
                  "value": "100",
                  "status": "OK"
                },
                {
                  "key": "expirationDateCrosscheck",
                  "value": "100",
                  "status": "OK"
                },
                {
                  "key": "documentSeriesExpired",
                  "value": "100",
                  "status": "OK"
                },
                {
                  "key": "birthDateValidity",
                  "value": "100",
                  "status": "OK"
                },
                {
                  "key": "fullNameCrosscheck",
                  "value": "100",
                  "status": "OK"
                },
                {
                  "key": "compositeCheckDigit",
                  "value": "100",
                  "status": "OK"
                },
                {
                  "key": "expirationDateCheckDigit",
                  "value": "100",
                  "status": "OK"
                },
                {
                  "key": "documentExpired",
                  "value": "100",
                  "status": "OK"
                }
              ],
              "customFields": null,
              "overall": {
                "value": "100.0",
                "status": "OK"
              }
            },
            "liveness": {
              "livenessScore": {
                "value": "99.9",
                "status": "OK"
              },
              "photoQuality": {
                "value": ""
              },
              "overall": {
                "value": "99.9",
                "status": "OK"
              }
            },
            "faceRecognition": {
              "existingUser": true,
              "maskCheck": {
                "value": "0",
                "status": "OK"
              },
              "lensesCheck": {
                "status": "OK"
              },
              "faceBrightness": {
                "value": "",
                "status": "OK"
              },
              "nameMatch": {
                "status": "FAIL"
              },
              "appliedRule": {
                "name": "",
                "expression": "",
                "ruleType": "",
                "status": ""
              },
              "overall": {
                "value": "74.7",
                "status": "OK"
              }
            },
            "governmentValidation": null,
            "externalVerification": null,
            "idOcrConfidence": {
              "overallConfidence": {
                "value": "95.6",
                "status": "OK"
              }
            },
            "appliedRule": null,
            "needsReviewReason": "",
            "incodeWatchlistScore": null,
            "overall": {
              "value": null,
              "status": ""
            },
            "reasonMsg": "This session passed because it passed all of Incode's tests: ID Verification, Face Recognition, Liveness Detection"
          },
          "ocrData": {
            "name": {
              "fullName": "RIM SALTAJI V",
              "machineReadableFullName": "RIM SALTAJI",
              "firstName": "RIM",
              "givenName": "RIM",
              "givenNameMrz": "RIM",
              "paternalLastName": "SALTAJI V",
              "lastNameMrz": "SALTAJI"
            },
            "typeOfId": "Passport",
            "documentFrontSubtype": "NATIONAL_PASSPORT",
            "birthDate": 886204800000,
            "gender": "F",
            "documentNumber": "XXXXXXXXX",
            "issuedAt": "1626220800000",
            "expireAt": "1941667200000",
            "issueDate": 2021,
            "expirationDate": 2031,
            "issuingCountry": "AUT",
            "issuingAuthority": "MAGISTRAT WIEN MBA 9/17",
            "birthPlace": "WIEN B",
            "nationality": "ÖSTERREICH",
            "nationalityMrz": "AUT",
            "mrz1": "P\u003CAUTSALTAJI\u003C\u003CRIM\u003C\u003C\u003C\u003C\u003C\u003C\u003C",
            "mrz2": "XXXXXXX12\u003C9AUTXXXXXXXXX07139\u003C\u003C\u003C\u003C\u003C\u003C\u003C\u003C\u003C\u003C\u003C\u003C\u003C\u003C\u003C4",
            "fullNameMrz": "RIM SALTAJI",
            "documentNumberCheckDigit": "9",
            "dateOfBirthCheckDigit": "4",
            "expirationDateCheckDigit": "9",
            "addressFields": null,
            "checkedAddressBean": {
              "street": null,
              "colony": null,
              "postalCode": null,
              "city": null,
              "state": null,
              "label": null
            },
            "ocrDataConfidence": {
              "birthDateConfidence": 0.9564505,
              "nameConfidence": null,
              "fullNameMrzConfidence": null,
              "genderConfidence": 0.9564505,
              "expirationDateConfidence": 0.9564505,
              "issuedAtConfidence": 0.99,
              "expireAtConfidence": 0.9564505,
              "documentNumberConfidence": 0.9564505,
              "birthPlaceConfidence": 0.979115,
              "nationalityConfidence": 0.9242569,
              "addressConfidence": null,
              "streetConfidence": null,
              "colonyConfidence": null,
              "postalCodeConfidence": null,
              "cityConfidence": null,
              "stateConfidence": null
            }
          }
        },
        "processedData": {
          "person": {
            "title": "",
            "name": "RIM SALTAJI V",
            "firstname": "RIM",
            "lastname": "SALTAJI V",
            "gender": "F",
            "birthdate": "1996-06-31"
          },
          "document": {
            "typeOfId": "Passport",
            "documentFrontSubtype": "NATIONAL_PASSPORT",
            "expireAt": "1941667200000",
            "issuedAt": "1626220800000",
            "documentNumber": "XXXXXXXX",
            "issuingCountry": "AUT",
            "birthPlace": "WIEN B",
            "nationality": "ÖSTERREICH"
          },
          "documents": null,
          "address": {
            "addressLine2": "",
            "county": "",
            "country": "AUT",
            "label": "",
            "street": "",
            "postalCode": "",
            "colony": ""
          },
          "imagesUrl": {
            "frontId": "https://api.sonio-group.com/media/XXXXXXXXXXXXXXX.jpg",
            "backId": null,
            "faceId": "https://api.sonio-group.com/media/XXXXXXXXXXXXXXX.jpg",
            "croppedFrontId": "https://api.sonio-group.com/media/XXXXXXXXXXXXXXX.jpg",
            "croppedBackId": null,
            "croppedFaceId": "https://api.sonio-group.com/media/XXXXXXXXXXXXXXX.jpg",
            "document": null
          }
        }
      }
    ]
  },
  "flowStatus": {
    "status": "COMPLETED",
    "reason": "Person not found",
    "validation": "NEEDS_REVIEW",
    "score": "0"
  },
  "matchedData": {
    "name": {
      "poiValue": "RIM SALTAJI V",
      "apiValue": "Rim Saltaji",
      "similarity": 90
    },
    "firstname": {
      "apiValue": "Rim",
      "similarity": -1
    },
    "lastname": {
      "apiValue": "Saltaji",
      "similarity": -1
    },
    "birthdate": {
      "poiValue": "1996-06-31",
      "apiValue": "1996-06-31",
      "similarity": 100
    },
    "address": {
      "apiValue": "Rathausplatz",
      "similarity": -1
    },
    "overallSimilarity": 90
  }
}
```

##### Open Banking – Bank Indent (PoI)

The data object contains all values returned from Tink’s verification process. The xs2a_name_check object holds the results of the name check performed by Tink.

The check result can either be Pass or Fail, with a similarity threshold of 70% or higher required for a pass.

_Example_

```
{
    "sessionId": "640fXXXXXXXXXXXXXXXda094",
    "flowId": "6697XXXXXXXXXXXXXXXXX865",
    "referenceId": null,
    "checks": {
        "poi": [
            {
                "provider": "tink",
                "status": "COMPLETED",
                "validation": "PASS",
                "score": "0",
                "reason": "",
                "reasonDetails": "",
                "externalIds": {
                    "tinkTransaction": "13XX0-XX-XXXXX-IXX3",
                    "wizzardSessionKey": "CNWw5HO6XXXXXXXXXXXXXXXXXXXXXXX5B7EKVA"
                },
                "data": {
                    "id": "xr_JwXXXXXXXXp9lVK3",
                    "transaction": "13XX0-XX-XXXXX-IXX3",
                    "account_holder": "MUSTERMANN, HARTMUT",
                    "iban": "DEXX888888880012XXXXXX",
                    "bic": "TESTDE88XXX",
                    "bank_name": "Testbank",
                    "country_id": "DE",
                    "testmode": "1",
                    "created_at": "2024-09-25 10:00:54",
                    "metadata": {
                        "my_policy": "on"
                    },
                    "merchant_id": "",
                    "object": "xs2a_risk",
                    "xs2a_name_check": {
                        "name": "MUSTERMANN",
                        "firstname": "HARTMUT",
                        "match": "1",
                        "similarity": 100,
                        "created_at": "2024-09-25 10:00:54",
                        "object": "xs2a_name_check"
                    }
                },
                "processedData": null
            }
        ]
    },
    "flowStatus": {
        "status": "COMPLETED",
        "reason": "",
        "validation": "PASS",
        "score": "0"
    },
    "matchedData": {
        "name": {
            "apiValue": "HARTMUT MUSTERMANN",
            "similarity": -1
        },
        "firstname": {
            "apiValue": "HARTMUT",
            "similarity": -1
        },
        "lastname": {
            "apiValue": "MUSTERMANN",
            "similarity": -1
        },
        "birthdate": {
            "similarity": -1
        },
        "address": {
            "similarity": -1
        },
        "overallSimilarity": -1
    }
}
```

##### Open Banking – Affordability

##### Open Banking – Verify

##### Open Banking – Verify & Deposit

## Webhooks

You can also choose to be notified via webhooks. Notifications will be sent to the customer- defined endpoint E.g.: [POST] api.customer.com/identity/reactive
Your endpoint will have to respond with an HTTP status code 200.

Notification structure:

| Data Field    | Type     | Description                                                                           |
| :------------ | :------- | :------------------------------------------------------------------------------------ |
| `status`      | `string` | Notification event                                                                    |
| `customerID`  | `string` | Your customer ID                                                                      |
| `sessionID`   | `string` | Your session ID                                                                       |
| `created`     | `string` | Date session created for event SESSION_CREATED. Null for others                       |
| `started`     | `string` | Date identification/session started for event IDENTIFICATION_STARTED. Null for others |
| `reinitiated` | `string` | Date for event SESSION_REINITIATED. Null for others.                                  |
| `result`      | `object` | contains the session result object                                                    |
| `error`       | `string` | error message for event WEBHOOK_ERROR                                                 |

EVENTS

**SESSION_CREATED**: session is created

**IDENTIFICATION_STARTED**: user accessed the startUrl and started identification

**SESSION_CANCELED**: User canceled the identification. All sessions are automatically canceled after they expire. Expiration date is configurable

**RESULT**: User finished one step of entire identification process: poi, poa, ...

**SESSION_COMPLETED**: User completed the entire identification, session is completed

**WEBHOOK_ERROR**: if the response status code is 4xx we send a WEBHOOK_ERROR. If the response is 500 we resend the notification after 30 seconds, 5, 15, 60 minute

_Example_

```
{
  "status": "SESSION_COMPLETED",
  "customerId": "640fXXXXXXXXXXXXXXXda094",
  "sessionId": "66e82XXXXXXXXXXXXXXXe038",
  "created": null,
  "started": null,
  "reinitiated": null,
  "referenceId": null,
  "result": {
    "sessionId": "66e82XXXXXXXXXXXXXXXe038",
    "flowId": "6697XXXXXXXXXXXXXXXXX865",
    "referenceId": null,
    "checks": {
      "poi": [...]
    },
    "flowStatus": {
      "status": "COMPLETED",
      "reason": "",
      "validation": "PASS",
      "score": "0"
    },
    "matchedData": {
      "name": { "poiValue": "RIM SALTAJI", "similarity": -1 },
      "firstname": { "similarity": -1 },
      "lastname": { "similarity": -1 },
      "birthdate": { "poiValue": "1996-01-31", "similarity": -1 },
      "address": { "similarity": -1 },
      "overallSimilarity": -1
    }
  },
  "error": null
}

```

## Data Matching

Our advanced data-matching algorithm leverages the Levenshtein distance metric to provide precise similarity measurements between data points. Employing efficient computational techniques, it excels in accurate matching, whether for fuzzy matching, approximate matching, or absolute matching.

**Similarity calculation & status**:

- **FAIL**: **0** = data not matched at all

- **FAIL**: **0 - 50** = data similarity is too low

- **NEEDS REVIEW**: **51 - 75** = data similarity is not significant and needs a manual review

- **PASS**: **76 - 99** = data matched almost exactly

- **PASS**: **100** = data matched exactly

**Data matching sources**:

- PoI (poiValue)
- PoA (poaValue)
- API (apiValue)

**Data points**:

- name
- surname
- firstname
- lastname
- birthdate
- address

_Example_

```
"matchedData":{
      "name":{
         "poiValue":"Wolfgang Amadeus Mozart",
         "apiValue":"Amadeus Mozart",
         "similarity":90
      },
      "firstname":{
         "apiValue":"Amadeus",
         "similarity":-1
      },
      "lastname":{
         "apiValue":"Mozart",
         "similarity":-1
      },
      "birthdate":{
         "poiValue":"1756-01-27",
         "apiValue":"1756-01-27",
         "similarity":100
      },
      "address":{
         "apiValue":"Getreidegasse 9, Salzburg, AUT",
         "similarity":-1
      },
      "overallSimilarity":90
   }
```

## Integration in an iFrame

There is a possibility of integration of the Sonio web app using an iFrame (inline frame) embedding technique. An iFrame is a powerful HTML element that allows us to seamlessly integrate external web content within our application, creating a unified user experience. In this integration, the Sonio web app is loaded within an iFrame on your platform/app, providing your users with direct access to its functionalities without the need for navigating to a separate page.
To ensure real-time interaction and synchronization between our platform and the embedded Sonio app, we have implemented a mechanism that utilizes post messages. These post messages are triggered by various user interactions within the Sonio app and are received and processed by the iFrame, enabling dynamic and responsive communication between the two components. This integration approach enhances the user experience, streamlines workflows, and facilitates data sharing while maintaining the security and integrity of both applications.

| User Interactions                                                                                               | Post Message             |
| :-------------------------------------------------------------------------------------------------------------- | :----------------------- |
| when click on abort Session in abort verification page                                                          | the process has ended    |
| when click on the X button on the top bar                                                                       | the process has ended    |
| when client has enabled auto redirect after faceMatch and the faces are matched                                 | the process has ended    |
| when a client has enabled Schufa check and schufa score is between 100 and 90                                   | the process has ended    |
| when client has enabled schufa check and schufa score has failed and it will redirect to address-input          | the process has ended    |
| when the whole flow has ended either redirect to all done page on mobile or redirect to Redirect URL on Desktop | the process has ended    |
| when client has enabled closing the session on retry age and clicking the retry button                          | the process has ended    |
| when scanning the front Id or passport                                                                          | beginning of the process |
| when the session is complete calling the api complete                                                           | the process has ended    |
| when completing the session with status like 'EXPIRED' or 'UNSUPPORTED'                                         | the process has ended    |

## Statuses

The status field can have one of the following values:

<!-- - **RESULT_CHANGED** –results changed -->

- **SESSION_CREATED** - a new session was created
- **IDENTIFICATION_STARTED** - an identification was started
- **COMPLETED** – a session was completed
- **SESSION_CANCELED** – session canceled
- **RESULT** – payload with the result
- **WEBHOOK_ERROR** – an error 4xx was received from a webhook

## Errors

Status codes:

- 200 OK
- 400 Bad input
- 404 Not found
- 500 Server error

General error message:

- status (optional)
- message

## Incode scoring logic

When scoring the overall validation of an ID the Incode-proprietary algorithm considers the results of the different tests, both the Machine Learning (ML) model tests, as well as the other individual ID tests (e.g. document crosscheck, expiration date validity, etc.) The results of the tests impact the score using a set of Incode-proprietary weight and multipliers for each test that translate to the overall ID validation score. These weights and multipliers are adjusted to reflect the impact in the score according to the severity level for: Conservative, Medium, Relaxed or Soft.

Threshold can be configured as low, medium or high. Impact the overall score, which based on the severity setting will mark a session as pass, fail or warn:

- Tamper Check: Confirms if the front of document was physically tampered
- Screen ID Liveness: Confirms if the document was captured from a screen meaning that the plastic document was not used
- Paper ID Liveness: Confirms if the document was captured from a printed paper meaning that the plastic
- The document was not used

**Score Impacting Other Tests**

The following tests contribute to the overall score of pass, fail or warn:

- Alignment: The picture is badly aligned and the correcting algorithm for alignment and cropping could not correct it for processing, and when cropped captured image of ID is near the edges
- Readability check: Determines the correlation between the results of different OCR (Optical Character Recognition) algorithms
- Barcode 2D Detected: A barcode was detected on the back of the ID (applicable only to US and Canadian IDs)
- 2D Barcode Content: The barcode content was read successfully
- Birth Date Crosscheck: Matches date from MRZ or barcode with birth date from OCR field
- Birth Date Check Digit: Control number from MRZ for birthdate matches the OCR field
- Birth Date Validity: Confirms that the date of birth is valid
- Composite Check Digit: Validates the visible composite check digit by comparing it with a calculated check digit from the document number, birth date and expiration date elements

- Document Classification: Confirms that the document type is supported and that it can be fully authenticated
- Document Expired: Confirms that the document has not expired
- Document Number Check Digit: Control number from MRZ for document number matches the OCR field
- Document Number Crosscheck: Match document number OCR field with document number from MRZ or barcode
- Document Type Side Crosscheck: Check front/back id of document (if somebody put both front ID side during upload)
- Emission Number Crosscheck: Confirms that the emission number on the front of the document is the same as the emission number from MRZ or barcode
- Expiration Date Check Digit: Control number from MRZ for expiration date matches the OCR field
- Expiration Date Crosscheck: Compares the expiration date from the MRZ or barcode with the expiration date from OCR field
- Expiration Date Validity: Confirms that the expiration date is valid
- Fake Check: Confirms if the document is fake (for US IDs only based on PDF validation)
- Full Name Crosscheck: Compares the full name from the MRZ or barcode with the full name from the OCR field
- Personal Number Crosscheck: Compares the personal number from the MRZ or barcode with the full name from the OCR field
- QR Scan: Confirms that check digit extracted from QR in the back of the document is the same as one extracted from the (MRZ), URL of the QR code points to the correct address
- Sex Crosscheck: Compares gender from MRZ or barcode with gender from OCR field
- Underage Check: The ID was of a person under 18 on the date of check
- Visible Photo Features: Verifies the visible photo characteristics

**Non-Score Impacting Other Tests**

The following tests are for informational purposes and do not contribute to the overall score of pass, fail or warn:

- Balanced light (front side): Determines if there are proper lightning conditions to take the photo of the front of the document
- Balanced light (back side): Determines if there are proper lightning conditions to take the photo of the back of the document
- Sharpness (front side): Determines if the photo of the front side of the document is sharp enough
- Sharpness (back side): Determines if the photo of the back side of the document is sharp enough
- Issue Date Check: Confirms that the document issue date is valid and in expected format, does not occur in the future, does not occur before the date of birth, and does not occur after the expiration date
- Issue Date Validity: Confirms that the date when the document was issued is valid
- Issuing State Validity: Confirms that the state where the document was issued is valid

## Images, Payload Size, Policies

Please note the empty value is delivered as NULL.

Response Payload size depends mostly on a number of documents uploaded and the quality of images.

Size of images in response is 1024px and around 50 – 200 KB.

Estimated payload size : 1M to 10MB.

**Retry Policy**

Can be set up based on the preferences.

## Feedback

If you have any feedback, please reach out to us at alexandre.fiaschi@sonio-group.com
