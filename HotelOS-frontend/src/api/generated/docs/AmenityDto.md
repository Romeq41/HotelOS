# AmenityDto

Amenity Data Transfer Object

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** |  | [optional] [default to undefined]
**hotel** | [**HotelDto**](HotelDto.md) |  | [default to undefined]
**name** | **string** |  | [default to undefined]
**description** | **string** |  | [optional] [default to undefined]
**type** | **string** |  | [optional] [default to undefined]
**distanceKm** | **number** |  | [optional] [default to undefined]
**imageUrl** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { AmenityDto } from './api';

const instance: AmenityDto = {
    id,
    hotel,
    name,
    description,
    type,
    distanceKm,
    imageUrl,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
