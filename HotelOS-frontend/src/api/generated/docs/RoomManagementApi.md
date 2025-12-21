# RoomManagementApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**addRoom**](#addroom) | **POST** /api/rooms | Add new room|
|[**deleteRoom**](#deleteroom) | **DELETE** /api/rooms/{id} | Delete room|
|[**deleteRoomImage**](#deleteroomimage) | **DELETE** /api/rooms/{roomId}/images/{imageId} | Delete room image|
|[**getAllRoomImages**](#getallroomimages) | **GET** /api/rooms/{id}/images | Get all room images|
|[**getAllRooms**](#getallrooms) | **GET** /api/rooms | Get all rooms|
|[**getRoomById**](#getroombyid) | **GET** /api/rooms/{id} | Get room by ID|
|[**getRoomImage1**](#getroomimage1) | **GET** /api/rooms/{id}/image | Get room primary image|
|[**setPrimaryRoomImage**](#setprimaryroomimage) | **PUT** /api/rooms/{roomId}/images/{imageId}/set-primary | Set primary room image|
|[**updateRoom**](#updateroom) | **PUT** /api/rooms/{id} | Update room|
|[**uploadMultipleRoomImages**](#uploadmultipleroomimages) | **POST** /api/rooms/{id}/images | Upload multiple room images|
|[**uploadPrimaryRoomImage**](#uploadprimaryroomimage) | **POST** /api/rooms/{id}/primary-image | Upload primary room image|
|[**uploadRoomImage**](#uploadroomimage) | **POST** /api/rooms/{id}/image_upload | Upload additional room image|

# **addRoom**
> RoomDto addRoom(roomDto)

Creates a new room with the provided details

### Example

```typescript
import {
    RoomManagementApi,
    Configuration,
    RoomDto
} from './api';

const configuration = new Configuration();
const apiInstance = new RoomManagementApi(configuration);

let roomDto: RoomDto; //

const { status, data } = await apiInstance.addRoom(
    roomDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **roomDto** | **RoomDto**|  | |


### Return type

**RoomDto**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/hal+json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Room created successfully |  -  |
|**400** | Invalid input data |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteRoom**
> deleteRoom()

Deletes a room and its associated data

### Example

```typescript
import {
    RoomManagementApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RoomManagementApi(configuration);

let id: number; //Room ID (default to undefined)

const { status, data } = await apiInstance.deleteRoom(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] | Room ID | defaults to undefined|


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

# **deleteRoomImage**
> object deleteRoomImage()

Deletes a specific image for a room

### Example

```typescript
import {
    RoomManagementApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RoomManagementApi(configuration);

let roomId: number; //Room ID (default to undefined)
let imageId: number; //Image ID (default to undefined)

const { status, data } = await apiInstance.deleteRoomImage(
    roomId,
    imageId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **roomId** | [**number**] | Room ID | defaults to undefined|
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
|**404** | Room or image not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getAllRoomImages**
> object getAllRoomImages()

Retrieves all images for a specific room

### Example

```typescript
import {
    RoomManagementApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RoomManagementApi(configuration);

let id: number; //Room ID (default to undefined)

const { status, data } = await apiInstance.getAllRoomImages(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] | Room ID | defaults to undefined|


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
|**404** | Room not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getAllRooms**
> PageRoomDto getAllRooms()

Returns a paginated list of rooms

### Example

```typescript
import {
    RoomManagementApi,
    Configuration,
    Pageable
} from './api';

const configuration = new Configuration();
const apiInstance = new RoomManagementApi(configuration);

let pageable: Pageable; // (default to undefined)

const { status, data } = await apiInstance.getAllRooms(
    pageable
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **pageable** | **Pageable** |  | defaults to undefined|


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
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getRoomById**
> RoomDto getRoomById()

Returns details for a specific room

### Example

```typescript
import {
    RoomManagementApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RoomManagementApi(configuration);

let id: number; //Room ID (default to undefined)

const { status, data } = await apiInstance.getRoomById(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] | Room ID | defaults to undefined|


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
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getRoomImage1**
> object getRoomImage1()

Retrieves the primary image URL for a specific room

### Example

```typescript
import {
    RoomManagementApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RoomManagementApi(configuration);

let id: number; //Room ID (default to undefined)

const { status, data } = await apiInstance.getRoomImage1(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] | Room ID | defaults to undefined|


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
|**404** | Room or image not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **setPrimaryRoomImage**
> object setPrimaryRoomImage()

Sets a specific image as the primary image for a room

### Example

```typescript
import {
    RoomManagementApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RoomManagementApi(configuration);

let roomId: number; //Room ID (default to undefined)
let imageId: number; //Image ID (default to undefined)

const { status, data } = await apiInstance.setPrimaryRoomImage(
    roomId,
    imageId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **roomId** | [**number**] | Room ID | defaults to undefined|
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
|**404** | Room or image not found |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateRoom**
> RoomDto updateRoom(roomDto)

Updates a room\'s information

### Example

```typescript
import {
    RoomManagementApi,
    Configuration,
    RoomDto
} from './api';

const configuration = new Configuration();
const apiInstance = new RoomManagementApi(configuration);

let id: number; //Room ID (default to undefined)
let roomDto: RoomDto; //

const { status, data } = await apiInstance.updateRoom(
    id,
    roomDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **roomDto** | **RoomDto**|  | |
| **id** | [**number**] | Room ID | defaults to undefined|


### Return type

**RoomDto**

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

# **uploadMultipleRoomImages**
> object uploadMultipleRoomImages()

Uploads multiple additional non-primary images for a specific room

### Example

```typescript
import {
    RoomManagementApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RoomManagementApi(configuration);

let id: number; //Room ID (default to undefined)
let files: Array<File>; //Image files to upload (default to undefined)

const { status, data } = await apiInstance.uploadMultipleRoomImages(
    id,
    files
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] | Room ID | defaults to undefined|
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
|**404** | Room not found |  -  |
|**500** | Server error during upload |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **uploadPrimaryRoomImage**
> { [key: string]: any; } uploadPrimaryRoomImage()

Sets the main image for a room (will replace existing primary image)

### Example

```typescript
import {
    RoomManagementApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RoomManagementApi(configuration);

let id: number; //Room ID (default to undefined)
let file: File; //Image file to upload (default to undefined)

const { status, data } = await apiInstance.uploadPrimaryRoomImage(
    id,
    file
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] | Room ID | defaults to undefined|
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
|**404** | Room not found |  -  |
|**500** | Server error during upload |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **uploadRoomImage**
> { [key: string]: any; } uploadRoomImage()

Uploads an additional non-primary image for a specific room

### Example

```typescript
import {
    RoomManagementApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RoomManagementApi(configuration);

let id: number; //Room ID (default to undefined)
let file: File; //Image file to upload (default to undefined)

const { status, data } = await apiInstance.uploadRoomImage(
    id,
    file
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] | Room ID | defaults to undefined|
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
|**404** | Room not found |  -  |
|**500** | Server error during upload |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

