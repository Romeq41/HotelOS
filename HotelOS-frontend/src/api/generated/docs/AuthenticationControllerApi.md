# AuthenticationControllerApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**authenticate**](#authenticate) | **POST** /api/auth/authenticate | |
|[**changePassword**](#changepassword) | **PUT** /api/auth/change-password | |
|[**confirmReset**](#confirmreset) | **POST** /api/auth/reset-password/confirm | |
|[**login**](#login) | **POST** /api/auth/login | |
|[**register**](#register) | **POST** /api/auth/register | |
|[**requestReset**](#requestreset) | **POST** /api/auth/reset-password/request | |

# **authenticate**
> AuthenticationResponse authenticate(authenticationRequest)


### Example

```typescript
import {
    AuthenticationControllerApi,
    Configuration,
    AuthenticationRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthenticationControllerApi(configuration);

let authenticationRequest: AuthenticationRequest; //

const { status, data } = await apiInstance.authenticate(
    authenticationRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **authenticationRequest** | **AuthenticationRequest**|  | |


### Return type

**AuthenticationResponse**

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

# **changePassword**
> string changePassword(passwordChangeRequest)


### Example

```typescript
import {
    AuthenticationControllerApi,
    Configuration,
    PasswordChangeRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthenticationControllerApi(configuration);

let passwordChangeRequest: PasswordChangeRequest; //

const { status, data } = await apiInstance.changePassword(
    passwordChangeRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **passwordChangeRequest** | **PasswordChangeRequest**|  | |


### Return type

**string**

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

# **confirmReset**
> string confirmReset(passwordResetConfirmRequest)


### Example

```typescript
import {
    AuthenticationControllerApi,
    Configuration,
    PasswordResetConfirmRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthenticationControllerApi(configuration);

let passwordResetConfirmRequest: PasswordResetConfirmRequest; //

const { status, data } = await apiInstance.confirmReset(
    passwordResetConfirmRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **passwordResetConfirmRequest** | **PasswordResetConfirmRequest**|  | |


### Return type

**string**

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

# **login**
> AuthenticationResponse login(loginRequest)


### Example

```typescript
import {
    AuthenticationControllerApi,
    Configuration,
    LoginRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthenticationControllerApi(configuration);

let loginRequest: LoginRequest; //

const { status, data } = await apiInstance.login(
    loginRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **loginRequest** | **LoginRequest**|  | |


### Return type

**AuthenticationResponse**

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

# **register**
> AuthenticationResponse register(registerRequest)


### Example

```typescript
import {
    AuthenticationControllerApi,
    Configuration,
    RegisterRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthenticationControllerApi(configuration);

let registerRequest: RegisterRequest; //

const { status, data } = await apiInstance.register(
    registerRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **registerRequest** | **RegisterRequest**|  | |


### Return type

**AuthenticationResponse**

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

# **requestReset**
> string requestReset(passwordResetInitiateRequest)


### Example

```typescript
import {
    AuthenticationControllerApi,
    Configuration,
    PasswordResetInitiateRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthenticationControllerApi(configuration);

let passwordResetInitiateRequest: PasswordResetInitiateRequest; //

const { status, data } = await apiInstance.requestReset(
    passwordResetInitiateRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **passwordResetInitiateRequest** | **PasswordResetInitiateRequest**|  | |


### Return type

**string**

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

