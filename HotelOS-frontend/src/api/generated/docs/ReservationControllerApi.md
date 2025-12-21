# ReservationControllerApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**addReservation**](#addreservation) | **POST** /api/reservations | |
|[**deleteReservation**](#deletereservation) | **DELETE** /api/reservations/{id} | |
|[**getAllReservationsByHotelId**](#getallreservationsbyhotelid) | **GET** /api/reservations/hotel/{hotelId} | |
|[**getReservationById**](#getreservationbyid) | **GET** /api/reservations/{id} | |
|[**updateReservation**](#updatereservation) | **PUT** /api/reservations/{id} | |

# **addReservation**
> ReservationDto addReservation(reservationDto)


### Example

```typescript
import {
    ReservationControllerApi,
    Configuration,
    ReservationDto
} from './api';

const configuration = new Configuration();
const apiInstance = new ReservationControllerApi(configuration);

let reservationDto: ReservationDto; //

const { status, data } = await apiInstance.addReservation(
    reservationDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **reservationDto** | **ReservationDto**|  | |


### Return type

**ReservationDto**

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

# **deleteReservation**
> deleteReservation()


### Example

```typescript
import {
    ReservationControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ReservationControllerApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.deleteReservation(
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

# **getAllReservationsByHotelId**
> PageReservationDto getAllReservationsByHotelId()


### Example

```typescript
import {
    ReservationControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ReservationControllerApi(configuration);

let hotelId: number; // (default to undefined)
let page: number; // (optional) (default to 0)
let size: number; // (optional) (default to 10)
let reservationName: string; // (optional) (default to undefined)

const { status, data } = await apiInstance.getAllReservationsByHotelId(
    hotelId,
    page,
    size,
    reservationName
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **hotelId** | [**number**] |  | defaults to undefined|
| **page** | [**number**] |  | (optional) defaults to 0|
| **size** | [**number**] |  | (optional) defaults to 10|
| **reservationName** | [**string**] |  | (optional) defaults to undefined|


### Return type

**PageReservationDto**

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

# **getReservationById**
> ReservationDto getReservationById()


### Example

```typescript
import {
    ReservationControllerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ReservationControllerApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.getReservationById(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**ReservationDto**

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

# **updateReservation**
> ReservationDto updateReservation(reservationDto)


### Example

```typescript
import {
    ReservationControllerApi,
    Configuration,
    ReservationDto
} from './api';

const configuration = new Configuration();
const apiInstance = new ReservationControllerApi(configuration);

let id: number; // (default to undefined)
let reservationDto: ReservationDto; //

const { status, data } = await apiInstance.updateReservation(
    id,
    reservationDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **reservationDto** | **ReservationDto**|  | |
| **id** | [**number**] |  | defaults to undefined|


### Return type

**ReservationDto**

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

