# HotelDto

Hotel Data Transfer Object

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** |  | [optional] [default to undefined]
**name** | **string** |  | [default to undefined]
**addressInformation** | [**AddressInformationDto**](AddressInformationDto.md) |  | [default to undefined]
**contactInformation** | [**ContactInformationDto**](ContactInformationDto.md) |  | [default to undefined]
**basePrice** | **number** |  | [default to undefined]
**description** | **string** |  | [optional] [default to undefined]
**imagePath** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { HotelDto } from './api';

const instance: HotelDto = {
    id,
    name,
    addressInformation,
    contactInformation,
    basePrice,
    description,
    imagePath,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
