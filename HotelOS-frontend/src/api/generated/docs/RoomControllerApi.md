# RoomControllerApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**addRoom**](#addroom) | **POST** /api/rooms | |
|[**deleteRoom**](#deleteroom) | **DELETE** /api/rooms/{id} | |
|[**deleteRoomImage**](#deleteroomimage) | **DELETE** /api/rooms/{roomId}/images/{imageId} | Delete room image|
|[**getAllRooms**](#getallrooms) | **GET** /api/rooms | |
|[**getRoomById**](#getroombyid) | **GET** /api/rooms/{id} | |
|[**getRoomImages**](#getroomimages) | **GET** /api/rooms/{roomId}/images | Get room images|
|[**getRoomPrimaryImage**](#getroomprimaryimage) | **GET** /api/rooms/{roomId}/image | Get primary room image|
|[**setPrimaryRoomImage**](#setprimaryroomimage) | **PUT** /api/rooms/{roomId}/images/{imageId}/set-primary | Set primary room image|
|[**updateRoom**](#updateroom) | **PUT** /api/rooms/{id} | |
|[**uploadMultipleRoomImages**](#uploadmultipleroomimages) | **POST** /api/rooms/{roomId}/images | Upload multiple room images|
|[**uploadRoomImage**](#uploadroomimage) | **POST** /api/rooms/{roomId}/image | Upload room image|

# **addRoom**
> RoomDto addRoom(roomDto)


### Example

```typescript
import {
    RoomControllerApi,
    Configuration,
    RoomDto
} from './api';

const configuration = new Configuration();
const apiInstance = new RoomControllerApi(configuration);

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
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteRoom**
> deleteRoom()


### Example

```typescript
import {
    RoomControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RoomControllerApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.deleteRoom(
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

# **deleteRoomImage**
> object deleteRoomImage()

Deletes a specific room image

### Example

```typescript
import {
    RoomControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RoomControllerApi(configuration);

let roomId: number; // (default to undefined)
let imageId: number; // (default to undefined)

const { status, data } = await apiInstance.deleteRoomImage(
    roomId,
    imageId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **roomId** | [**number**] |  | defaults to undefined|
| **imageId** | [**number**] |  | defaults to undefined|


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
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getAllRooms**
> PageRoomDto getAllRooms()


### Example

```typescript
import {
    RoomControllerApi,
    Configuration,
    Pageable
} from './api';

const configuration = new Configuration();
const apiInstance = new RoomControllerApi(configuration);

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


### Example

```typescript
import {
    RoomControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RoomControllerApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.getRoomById(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


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

# **getRoomImages**
> object getRoomImages()

Gets all images for a specific room

### Example

```typescript
import {
    RoomControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RoomControllerApi(configuration);

let roomId: number; // (default to undefined)

const { status, data } = await apiInstance.getRoomImages(
    roomId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **roomId** | [**number**] |  | defaults to undefined|


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
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getRoomPrimaryImage**
> object getRoomPrimaryImage()

Gets the primary image for a specific room

### Example

```typescript
import {
    RoomControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RoomControllerApi(configuration);

let roomId: number; // (default to undefined)

const { status, data } = await apiInstance.getRoomPrimaryImage(
    roomId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **roomId** | [**number**] |  | defaults to undefined|


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
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **setPrimaryRoomImage**
> object setPrimaryRoomImage()

Sets a specific image as the primary image for a room

### Example

```typescript
import {
    RoomControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new RoomControllerApi(configuration);

let roomId: number; // (default to undefined)
let imageId: number; // (default to undefined)

const { status, data } = await apiInstance.setPrimaryRoomImage(
    roomId,
    imageId
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **roomId** | [**number**] |  | defaults to undefined|
| **imageId** | [**number**] |  | defaults to undefined|


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
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateRoom**
> RoomDto updateRoom(roomDto)


### Example

```typescript
import {
    RoomControllerApi,
    Configuration,
    RoomDto
} from './api';

const configuration = new Configuration();
const apiInstance = new RoomControllerApi(configuration);

let id: number; // (default to undefined)
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
| **id** | [**number**] |  | defaults to undefined|


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
> { [key: string]: any; } uploadMultipleRoomImages()

Uploads multiple images for a specific room

### Example

```typescript
import {
    RoomControllerApi,
    Configuration,
    UploadMultipleRoomImagesRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new RoomControllerApi(configuration);

let roomId: number; // (default to undefined)
let uploadMultipleRoomImagesRequest: UploadMultipleRoomImagesRequest; // (optional)

const { status, data } = await apiInstance.uploadMultipleRoomImages(
    roomId,
    uploadMultipleRoomImagesRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **uploadMultipleRoomImagesRequest** | **UploadMultipleRoomImagesRequest**|  | |
| **roomId** | [**number**] |  | defaults to undefined|


### Return type

**{ [key: string]: any; }**

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

# **uploadRoomImage**
> { [key: string]: any; } uploadRoomImage()

Uploads an image for a specific room

### Example

```typescript
import {
    RoomControllerApi,
    Configuration,
    UploadUserImageRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new RoomControllerApi(configuration);

let roomId: number; // (default to undefined)
let uploadUserImageRequest: UploadUserImageRequest; // (optional)

const { status, data } = await apiInstance.uploadRoomImage(
    roomId,
    uploadUserImageRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **uploadUserImageRequest** | **UploadUserImageRequest**|  | |
| **roomId** | [**number**] |  | defaults to undefined|


### Return type

**{ [key: string]: any; }**

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

