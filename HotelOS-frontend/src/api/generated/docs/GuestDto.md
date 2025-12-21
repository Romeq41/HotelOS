# GuestDto

Guest Data Transfer Object

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** |  | [optional] [default to undefined]
**firstName** | **string** |  | [default to undefined]
**lastName** | **string** |  | [default to undefined]
**email** | **string** |  | [optional] [default to undefined]
**phoneNumber** | **string** |  | [optional] [default to undefined]
**idDocumentType** | **string** |  | [optional] [default to undefined]
**idDocumentNumber** | **string** |  | [optional] [default to undefined]
**dateOfBirth** | **string** |  | [optional] [default to undefined]
**nationality** | **string** |  | [optional] [default to undefined]
**bookedById** | **number** |  | [optional] [default to undefined]
**isPrimaryGuest** | **boolean** |  | [optional] [default to undefined]
**specialRequirements** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { GuestDto } from './api';

const instance: GuestDto = {
    id,
    firstName,
    lastName,
    email,
    phoneNumber,
    idDocumentType,
    idDocumentNumber,
    dateOfBirth,
    nationality,
    bookedById,
    isPrimaryGuest,
    specialRequirements,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
