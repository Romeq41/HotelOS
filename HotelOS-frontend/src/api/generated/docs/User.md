# User


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**userId** | **number** |  | [optional] [default to undefined]
**firstName** | **string** |  | [optional] [default to undefined]
**lastName** | **string** |  | [optional] [default to undefined]
**password** | **string** |  | [optional] [default to undefined]
**email** | **string** |  | [optional] [default to undefined]
**addressInformation** | [**AddressInformation**](AddressInformation.md) |  | [optional] [default to undefined]
**contactInformation** | [**ContactInformation**](ContactInformation.md) |  | [optional] [default to undefined]
**userType** | **string** |  | [optional] [default to undefined]
**position** | **string** |  | [optional] [default to undefined]
**hotel** | [**Hotel**](Hotel.md) |  | [optional] [default to undefined]
**imagePath** | **string** |  | [optional] [default to undefined]
**createdAt** | **string** |  | [optional] [default to undefined]
**updatedAt** | **string** |  | [optional] [default to undefined]
**enabled** | **boolean** |  | [optional] [default to undefined]
**username** | **string** |  | [optional] [default to undefined]
**authorities** | [**Array&lt;GrantedAuthority&gt;**](GrantedAuthority.md) |  | [optional] [default to undefined]
**accountNonExpired** | **boolean** |  | [optional] [default to undefined]
**credentialsNonExpired** | **boolean** |  | [optional] [default to undefined]
**accountNonLocked** | **boolean** |  | [optional] [default to undefined]

## Example

```typescript
import { User } from './api';

const instance: User = {
    userId,
    firstName,
    lastName,
    password,
    email,
    addressInformation,
    contactInformation,
    userType,
    position,
    hotel,
    imagePath,
    createdAt,
    updatedAt,
    enabled,
    username,
    authorities,
    accountNonExpired,
    credentialsNonExpired,
    accountNonLocked,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
