# AmenityControllerApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**addAmenity**](#addamenity) | **POST** /api/amenities | |
|[**deleteAmenity**](#deleteamenity) | **DELETE** /api/amenities/{id} | |
|[**getAllAmenities**](#getallamenities) | **GET** /api/amenities | |
|[**getAmenitiesByHotelId**](#getamenitiesbyhotelid) | **GET** /api/amenities/hotel/{hotelId} | |
|[**getAmenityById**](#getamenitybyid) | **GET** /api/amenities/{id} | |
|[**updateAmenity**](#updateamenity) | **PUT** /api/amenities/{id} | |

# **addAmenity**
> AmenityDto addAmenity(amenityDto)


### Example

```typescript
import {
    AmenityControllerApi,
    Configuration,
    AmenityDto
} from './api';

const configuration = new Configuration();
const apiInstance = new AmenityControllerApi(configuration);

let amenityDto: AmenityDto; //

const { status, data } = await apiInstance.addAmenity(
    amenityDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **amenityDto** | **AmenityDto**|  | |


### Return type

**AmenityDto**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/hal+json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteAmenity**
> deleteAmenity()


### Example

```typescript
import {
    AmenityControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AmenityControllerApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.deleteAmenity(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getAllAmenities**
> PageAmenityDto getAllAmenities()


### Example

```typescript
import {
    AmenityControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AmenityControllerApi(configuration);

let page: number; // (optional) (default to 0)
let size: number; // (optional) (default to 10)
let hotelId: number; // (optional) (default to undefined)

const { status, data } = await apiInstance.getAllAmenities(
    page,
    size,
    hotelId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **page** | [**number**] |  | (optional) defaults to 0|
| **size** | [**number**] |  | (optional) defaults to 10|
| **hotelId** | [**number**] |  | (optional) defaults to undefined|


### Return type

**PageAmenityDto**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/hal+json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getAmenitiesByHotelId**
> PageAmenityDto getAmenitiesByHotelId()


### Example

```typescript
import {
    AmenityControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AmenityControllerApi(configuration);

let hotelId: number; // (default to undefined)
let page: number; // (optional) (default to 0)
let size: number; // (optional) (default to 10)

const { status, data } = await apiInstance.getAmenitiesByHotelId(
    hotelId,
    page,
    size
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **hotelId** | [**number**] |  | defaults to undefined|
| **page** | [**number**] |  | (optional) defaults to 0|
| **size** | [**number**] |  | (optional) defaults to 10|


### Return type

**PageAmenityDto**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/hal+json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getAmenityById**
> AmenityDto getAmenityById()


### Example

```typescript
import {
    AmenityControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AmenityControllerApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.getAmenityById(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**AmenityDto**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/hal+json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateAmenity**
> AmenityDto updateAmenity(amenityDto)


### Example

```typescript
import {
    AmenityControllerApi,
    Configuration,
    AmenityDto
} from './api';

const configuration = new Configuration();
const apiInstance = new AmenityControllerApi(configuration);

let id: number; // (default to undefined)
let amenityDto: AmenityDto; //

const { status, data } = await apiInstance.updateAmenity(
    id,
    amenityDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **amenityDto** | **AmenityDto**|  | |
| **id** | [**number**] |  | defaults to undefined|


### Return type

**AmenityDto**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/hal+json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

