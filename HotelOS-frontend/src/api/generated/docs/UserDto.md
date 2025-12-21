# UserDto

User Data Transfer Object

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**userId** | **number** |  | [optional] [default to undefined]
**firstName** | **string** |  | [default to undefined]
**lastName** | **string** |  | [default to undefined]
**email** | **string** |  | [default to undefined]
**password** | **string** |  | [optional] [default to undefined]
**addressInformation** | [**AddressInformationDto**](AddressInformationDto.md) |  | [default to undefined]
**contactInformation** | [**ContactInformationDto**](ContactInformationDto.md) |  | [default to undefined]
**userType** | **string** |  | [default to undefined]
**position** | **string** |  | [optional] [default to undefined]
**imagePath** | **string** |  | [optional] [default to undefined]
**hotel** | [**HotelDto**](HotelDto.md) |  | [optional] [default to undefined]

## Example

```typescript
import { UserDto } from './api';

const instance: UserDto = {
    userId,
    firstName,
    lastName,
    email,
    password,
    addressInformation,
    contactInformation,
    userType,
    position,
    imagePath,
    hotel,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
