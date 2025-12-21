# HotelManagementApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**addHotel**](#addhotel) | **POST** /api/hotels | Add new hotel|
|[**deleteHotel**](#deletehotel) | **DELETE** /api/hotels/{id} | Delete hotel|
|[**deleteHotelImage**](#deletehotelimage) | **DELETE** /api/hotels/{hotelId}/images/{imageId} | Delete hotel image|
|[**getAllHotelImages**](#getallhotelimages) | **GET** /api/hotels/{id}/images | Get all hotel images|
|[**getAllHotels**](#getallhotels) | **GET** /api/hotels | Get all hotels|
|[**getCheapestRoomByHotelId**](#getcheapestroombyhotelid) | **GET** /api/hotels/{id}/rooms/cheapest | Get cheapest room by hotel ID|
|[**getHotelById**](#gethotelbyid) | **GET** /api/hotels/{id} | Get hotel by ID|
|[**getHotelImage**](#gethotelimage) | **GET** /api/hotels/{id}/image | Get hotel primary image|
|[**getHotelStatistics**](#gethotelstatistics) | **GET** /api/hotels/{id}/statistics | Get hotel statistics|
|[**getHotelWithOffers**](#gethotelwithoffers) | **GET** /api/hotels/{id}/offer | Get specific hotel offer|
|[**getHotelsWithOffers**](#gethotelswithoffers) | **GET** /api/hotels/offers | Get hotel offers|
|[**getRoomsByHotelId**](#getroomsbyhotelid) | **GET** /api/hotels/{id}/rooms | Get rooms by hotel ID|
|[**getUsersByHotelId**](#getusersbyhotelid) | **GET** /api/hotels/{id}/users | Get users by hotel ID|
|[**setPrimaryHotelImage**](#setprimaryhotelimage) | **PUT** /api/hotels/{hotelId}/images/{imageId}/set-primary | Set primary hotel image|
|[**updateHotelById**](#updatehotelbyid) | **PUT** /api/hotels/{id} | Update hotel|
|[**uploadHotelImage**](#uploadhotelimage) | **POST** /api/hotels/{id}/image_upload | Upload additional hotel image|
|[**uploadMultipleHotelImages**](#uploadmultiplehotelimages) | **POST** /api/hotels/{id}/images | Upload multiple hotel images|
|[**uploadPrimaryHotelImage**](#uploadprimaryhotelimage) | **POST** /api/hotels/{id}/primary-image | Upload primary hotel image|

# **addHotel**
> HotelDto addHotel(hotelDto)

Creates a new hotel with the provided details

### Example

```typescript
import {
    HotelManagementApi,
    Configuration,
    HotelDto
} from './api';

const configuration = new Configuration();
const apiInstance = new HotelManagementApi(configuration);

let hotelDto: HotelDto; //

const { status, data } = await apiInstance.addHotel(
    hotelDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **hotelDto** | **HotelDto**|  | |


### Return type

**HotelDto**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/hal+json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Hotel created successfully |  -  |
|**400** | Invalid input data |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteHotel**
> deleteHotel()

Deletes a hotel and updates related entities

### Example

```typescript
import {
    HotelManagementApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new HotelManagementApi(configuration);

let id: number; //Hotel ID (default to undefined)

const { status, data } = await apiInstance.deleteHotel(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] | Hotel ID | defaults to undefined|


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
|**204** | Hotel deleted successfully |  -  |
|**404** | Hotel not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteHotelImage**
> object deleteHotelImage()

Deletes a specific image for a hotel

### Example

```typescript
import {
    HotelManagementApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new HotelManagementApi(configuration);

let hotelId: number; //Hotel ID (default to undefined)
let imageId: number; //Image ID (default to undefined)

const { status, data } = await apiInstance.deleteHotelImage(
    hotelId,
    imageId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **hotelId** | [**number**] | Hotel ID | defaults to undefined|
| **imageId** | [**number**] | Image ID | defaults to undefined|


### Return type

**object**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/hal+json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Image deleted successfully |  -  |
|**404** | Hotel or image not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getAllHotelImages**
> object getAllHotelImages()

Retrieves all images for a specific hotel

### Example

```typescript
import {
    HotelManagementApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new HotelManagementApi(configuration);

let id: number; //Hotel ID (default to undefined)

const { status, data } = await apiInstance.getAllHotelImages(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] | Hotel ID | defaults to undefined|


### Return type

**object**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/hal+json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Images retrieved successfully |  -  |
|**404** | Hotel not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getAllHotels**
> PageHotelDto getAllHotels()

Returns a paginated list of hotels with optional filtering

### Example

```typescript
import {
    HotelManagementApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new HotelManagementApi(configuration);

let page: number; //Page number (zero-based) (optional) (default to 0)
let size: number; //Page size (optional) (default to 10)
let hotelName: string; //Filter by hotel name (optional) (default to undefined)
let country: string; //Filter by country (optional) (default to undefined)
let city: string; //Filter by city (optional) (default to undefined)

const { status, data } = await apiInstance.getAllHotels(
    page,
    size,
    hotelName,
    country,
    city
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **page** | [**number**] | Page number (zero-based) | (optional) defaults to 0|
| **size** | [**number**] | Page size | (optional) defaults to 10|
| **hotelName** | [**string**] | Filter by hotel name | (optional) defaults to undefined|
| **country** | [**string**] | Filter by country | (optional) defaults to undefined|
| **city** | [**string**] | Filter by city | (optional) defaults to undefined|


### Return type

**PageHotelDto**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/hal+json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Hotels retrieved successfully |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getCheapestRoomByHotelId**
> RoomDto getCheapestRoomByHotelId()

Returns the lowest priced room for a hotel

### Example

```typescript
import {
    HotelManagementApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new HotelManagementApi(configuration);

let id: number; //Hotel ID (default to undefined)

const { status, data } = await apiInstance.getCheapestRoomByHotelId(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] | Hotel ID | defaults to undefined|


### Return type

**RoomDto**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/hal+json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Cheapest room found |  -  |
|**404** | Hotel not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getHotelById**
> Hotel getHotelById()

Returns details for a specific hotel

### Example

```typescript
import {
    HotelManagementApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new HotelManagementApi(configuration);

let id: number; //Hotel ID (default to undefined)

const { status, data } = await apiInstance.getHotelById(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] | Hotel ID | defaults to undefined|


### Return type

**Hotel**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/hal+json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Hotel found |  -  |
|**404** | Hotel not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getHotelImage**
> object getHotelImage()

Retrieves the primary image URL for a specific hotel

### Example

```typescript
import {
    HotelManagementApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new HotelManagementApi(configuration);

let id: number; //Hotel ID (default to undefined)

const { status, data } = await apiInstance.getHotelImage(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] | Hotel ID | defaults to undefined|


### Return type

**object**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/hal+json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Image URL retrieved successfully |  -  |
|**404** | Hotel or image not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getHotelStatistics**
> HotelStatisticsDto getHotelStatistics()

Returns statistical data for a specific hotel

### Example

```typescript
import {
    HotelManagementApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new HotelManagementApi(configuration);

let id: number; //Hotel ID (default to undefined)

const { status, data } = await apiInstance.getHotelStatistics(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] | Hotel ID | defaults to undefined|


### Return type

**HotelStatisticsDto**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/hal+json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Statistics retrieved successfully |  -  |
|**404** | Hotel not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getHotelWithOffers**
> HotelOfferDto getHotelWithOffers()

Returns offer details for a specific hotel with optional date range

### Example

```typescript
import {
    HotelManagementApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new HotelManagementApi(configuration);

let id: number; //Hotel ID (default to undefined)
let checkIn: string; //Check-in date (optional) (default to undefined)
let checkOut: string; //Check-out date (optional) (default to undefined)

const { status, data } = await apiInstance.getHotelWithOffers(
    id,
    checkIn,
    checkOut
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] | Hotel ID | defaults to undefined|
| **checkIn** | [**string**] | Check-in date | (optional) defaults to undefined|
| **checkOut** | [**string**] | Check-out date | (optional) defaults to undefined|


### Return type

**HotelOfferDto**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/hal+json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Hotel offer retrieved successfully |  -  |
|**404** | Hotel not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getHotelsWithOffers**
> PageHotelOfferDto getHotelsWithOffers()

Returns a paginated list of hotel offers with optional filtering

### Example

```typescript
import {
    HotelManagementApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new HotelManagementApi(configuration);

let page: number; //Page number (zero-based) (optional) (default to 0)
let size: number; //Page size (optional) (default to 10)
let hotelName: string; //Filter by hotel name (optional) (default to undefined)
let country: string; //Filter by country (optional) (default to undefined)
let city: string; //Filter by city (optional) (default to undefined)
let sortBy: string; //Sort results by this field (optional) (default to undefined)

const { status, data } = await apiInstance.getHotelsWithOffers(
    page,
    size,
    hotelName,
    country,
    city,
    sortBy
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **page** | [**number**] | Page number (zero-based) | (optional) defaults to 0|
| **size** | [**number**] | Page size | (optional) defaults to 10|
| **hotelName** | [**string**] | Filter by hotel name | (optional) defaults to undefined|
| **country** | [**string**] | Filter by country | (optional) defaults to undefined|
| **city** | [**string**] | Filter by city | (optional) defaults to undefined|
| **sortBy** | [**string**] | Sort results by this field | (optional) defaults to undefined|


### Return type

**PageHotelOfferDto**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/hal+json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Hotel offers retrieved successfully |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getRoomsByHotelId**
> PageRoomDto getRoomsByHotelId()

Returns rooms associated with a specific hotel

### Example

```typescript
import {
    HotelManagementApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new HotelManagementApi(configuration);

let id: number; //Hotel ID (default to undefined)
let page: number; //Page number (optional) (default to 0)
let size: number; //Page size (optional) (default to 10)
let roomNumber: number; //Filter by room number (optional) (default to undefined)

const { status, data } = await apiInstance.getRoomsByHotelId(
    id,
    page,
    size,
    roomNumber
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] | Hotel ID | defaults to undefined|
| **page** | [**number**] | Page number | (optional) defaults to 0|
| **size** | [**number**] | Page size | (optional) defaults to 10|
| **roomNumber** | [**number**] | Filter by room number | (optional) defaults to undefined|


### Return type

**PageRoomDto**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/hal+json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Rooms retrieved successfully |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getUsersByHotelId**
> PageUserDto getUsersByHotelId()

Returns users associated with a specific hotel

### Example

```typescript
import {
    HotelManagementApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new HotelManagementApi(configuration);

let id: number; //Hotel ID (default to undefined)
let page: number; //Page number (optional) (default to 0)
let size: number; //Page size (optional) (default to 10)
let email: string; //Filter by email (optional) (default to undefined)

const { status, data } = await apiInstance.getUsersByHotelId(
    id,
    page,
    size,
    email
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] | Hotel ID | defaults to undefined|
| **page** | [**number**] | Page number | (optional) defaults to 0|
| **size** | [**number**] | Page size | (optional) defaults to 10|
| **email** | [**string**] | Filter by email | (optional) defaults to undefined|


### Return type

**PageUserDto**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/hal+json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Users retrieved successfully |  -  |
|**404** | Hotel not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **setPrimaryHotelImage**
> object setPrimaryHotelImage()

Sets a specific image as the primary image for a hotel

### Example

```typescript
import {
    HotelManagementApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new HotelManagementApi(configuration);

let hotelId: number; //Hotel ID (default to undefined)
let imageId: number; //Image ID (default to undefined)

const { status, data } = await apiInstance.setPrimaryHotelImage(
    hotelId,
    imageId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **hotelId** | [**number**] | Hotel ID | defaults to undefined|
| **imageId** | [**number**] | Image ID | defaults to undefined|


### Return type

**object**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/hal+json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Primary image set successfully |  -  |
|**404** | Hotel or image not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateHotelById**
> HotelDto updateHotelById(hotelDto)

Updates a hotel\'s information

### Example

```typescript
import {
    HotelManagementApi,
    Configuration,
    HotelDto
} from './api';

const configuration = new Configuration();
const apiInstance = new HotelManagementApi(configuration);

let id: number; //Hotel ID (default to undefined)
let hotelDto: HotelDto; //

const { status, data } = await apiInstance.updateHotelById(
    id,
    hotelDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **hotelDto** | **HotelDto**|  | |
| **id** | [**number**] | Hotel ID | defaults to undefined|


### Return type

**HotelDto**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/hal+json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Hotel updated successfully |  -  |
|**400** | Invalid input data |  -  |
|**404** | Hotel not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **uploadHotelImage**
> { [key: string]: any; } uploadHotelImage()

Uploads an additional non-primary image for a specific hotel

### Example

```typescript
import {
    HotelManagementApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new HotelManagementApi(configuration);

let id: number; //Hotel ID (default to undefined)
let file: File; //Image file to upload (default to undefined)

const { status, data } = await apiInstance.uploadHotelImage(
    id,
    file
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] | Hotel ID | defaults to undefined|
| **file** | [**File**] | Image file to upload | defaults to undefined|


### Return type

**{ [key: string]: any; }**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: multipart/form-data
 - **Accept**: application/hal+json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Image uploaded successfully |  -  |
|**400** | Invalid file or request |  -  |
|**404** | Hotel not found |  -  |
|**500** | Server error during upload |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **uploadMultipleHotelImages**
> object uploadMultipleHotelImages()

Uploads multiple additional non-primary images for a specific hotel

### Example

```typescript
import {
    HotelManagementApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new HotelManagementApi(configuration);

let id: number; //Hotel ID (default to undefined)
let files: Array<File>; //Image files to upload (default to undefined)

const { status, data } = await apiInstance.uploadMultipleHotelImages(
    id,
    files
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] | Hotel ID | defaults to undefined|
| **files** | **Array&lt;File&gt;** | Image files to upload | defaults to undefined|


### Return type

**object**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: multipart/form-data
 - **Accept**: application/hal+json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Images uploaded successfully |  -  |
|**400** | Invalid files or request |  -  |
|**404** | Hotel not found |  -  |
|**500** | Server error during upload |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **uploadPrimaryHotelImage**
> { [key: string]: any; } uploadPrimaryHotelImage()

Sets the main image for a hotel (will replace existing primary image)

### Example

```typescript
import {
    HotelManagementApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new HotelManagementApi(configuration);

let id: number; //Hotel ID (default to undefined)
let file: File; //Image file to upload (default to undefined)

const { status, data } = await apiInstance.uploadPrimaryHotelImage(
    id,
    file
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] | Hotel ID | defaults to undefined|
| **file** | [**File**] | Image file to upload | defaults to undefined|


### Return type

**{ [key: string]: any; }**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: multipart/form-data
 - **Accept**: application/hal+json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Primary image uploaded successfully |  -  |
|**400** | Invalid file or request |  -  |
|**404** | Hotel not found |  -  |
|**500** | Server error during upload |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

