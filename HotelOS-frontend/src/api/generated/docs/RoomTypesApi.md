# RoomTypesApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**activateRoomType**](#activateroomtype) | **PATCH** /api/room-types/{id}/activate | Activate room type|
|[**createRoomType**](#createroomtype) | **POST** /api/room-types | Create new room type|
|[**deactivateRoomType**](#deactivateroomtype) | **PATCH** /api/room-types/{id}/deactivate | Deactivate room type|
|[**deleteRoomType**](#deleteroomtype) | **DELETE** /api/room-types/{id} | Delete room type|
|[**getAllRoomTypes**](#getallroomtypes) | **GET** /api/room-types | Get all active room types|
|[**getRoomTypeById**](#getroomtypebyid) | **GET** /api/room-types/{id} | Get room type by ID|
|[**getRoomTypesByHotelId**](#getroomtypesbyhotelid) | **GET** /api/room-types/hotel/{hotelId} | Get room types by hotel ID|
|[**updateRoomType**](#updateroomtype) | **PUT** /api/room-types/{id} | Update room type|

# **activateRoomType**
> RoomTypeDto activateRoomType()

Activates a room type

### Example

```typescript
import {
    RoomTypesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RoomTypesApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.activateRoomType(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**RoomTypeDto**

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

# **createRoomType**
> RoomTypeDto createRoomType(roomTypeDto)

Creates a new room type

### Example

```typescript
import {
    RoomTypesApi,
    Configuration,
    RoomTypeDto
} from './api';

const configuration = new Configuration();
const apiInstance = new RoomTypesApi(configuration);

let roomTypeDto: RoomTypeDto; //

const { status, data } = await apiInstance.createRoomType(
    roomTypeDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **roomTypeDto** | **RoomTypeDto**|  | |


### Return type

**RoomTypeDto**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/hal+json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Room type created successfully |  -  |
|**400** | Invalid input |  -  |
|**401** | Unauthorized |  -  |
|**403** | Forbidden |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deactivateRoomType**
> RoomTypeDto deactivateRoomType()

Deactivates a room type

### Example

```typescript
import {
    RoomTypesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RoomTypesApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.deactivateRoomType(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**RoomTypeDto**

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

# **deleteRoomType**
> deleteRoomType()

Deletes a room type permanently

### Example

```typescript
import {
    RoomTypesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RoomTypesApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.deleteRoomType(
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
|**204** | Room type deleted successfully |  -  |
|**404** | Room type not found |  -  |
|**401** | Unauthorized |  -  |
|**403** | Forbidden |  -  |
|**409** | Room type is in use |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getAllRoomTypes**
> RoomTypeDto getAllRoomTypes()

Returns all active room types

### Example

```typescript
import {
    RoomTypesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RoomTypesApi(configuration);

let includeInactive: boolean; //Include inactive room types (optional) (default to false)

const { status, data } = await apiInstance.getAllRoomTypes(
    includeInactive
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **includeInactive** | [**boolean**] | Include inactive room types | (optional) defaults to false|


### Return type

**RoomTypeDto**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/hal+json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successfully retrieved room types |  -  |
|**401** | Unauthorized |  -  |
|**403** | Forbidden |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getRoomTypeById**
> RoomTypeDto getRoomTypeById()

Returns room type by ID

### Example

```typescript
import {
    RoomTypesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RoomTypesApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.getRoomTypeById(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**RoomTypeDto**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/hal+json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Successfully retrieved room type |  -  |
|**404** | Room type not found |  -  |
|**401** | Unauthorized |  -  |
|**403** | Forbidden |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getRoomTypesByHotelId**
> Array<RoomTypeDto> getRoomTypesByHotelId()

Returns all room types available for a specific hotel

### Example

```typescript
import {
    RoomTypesApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RoomTypesApi(configuration);

let hotelId: number; // (default to undefined)
let includeInactive: boolean; // (optional) (default to false)

const { status, data } = await apiInstance.getRoomTypesByHotelId(
    hotelId,
    includeInactive
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **hotelId** | [**number**] |  | defaults to undefined|
| **includeInactive** | [**boolean**] |  | (optional) defaults to false|


### Return type

**Array<RoomTypeDto>**

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

# **updateRoomType**
> RoomTypeDto updateRoomType(roomTypeDto)

Updates an existing room type

### Example

```typescript
import {
    RoomTypesApi,
    Configuration,
    RoomTypeDto
} from './api';

const configuration = new Configuration();
const apiInstance = new RoomTypesApi(configuration);

let id: number; // (default to undefined)
let roomTypeDto: RoomTypeDto; //

const { status, data } = await apiInstance.updateRoomType(
    id,
    roomTypeDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **roomTypeDto** | **RoomTypeDto**|  | |
| **id** | [**number**] |  | defaults to undefined|


### Return type

**RoomTypeDto**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/hal+json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Room type updated successfully |  -  |
|**400** | Invalid input |  -  |
|**404** | Room type not found |  -  |
|**401** | Unauthorized |  -  |
|**403** | Forbidden |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

