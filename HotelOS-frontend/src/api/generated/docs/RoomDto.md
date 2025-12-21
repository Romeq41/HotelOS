# RoomDto

Room Data Transfer Object

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**roomId** | **number** |  | [default to undefined]
**roomNumber** | **number** |  | [default to undefined]
**roomType** | [**RoomTypeDto**](RoomTypeDto.md) | Type of room with its pricing factor | [default to undefined]
**capacity** | **number** |  | [default to undefined]
**price** | **number** |  | [default to undefined]
**priceModifier** | **number** |  | [optional] [default to undefined]
**status** | **string** |  | [default to undefined]
**description** | **string** |  | [optional] [default to undefined]
**imagePath** | **string** |  | [optional] [default to undefined]
**hotel** | [**HotelDto**](HotelDto.md) |  | [default to undefined]

## Example

```typescript
import { RoomDto } from './api';

const instance: RoomDto = {
    roomId,
    roomNumber,
    roomType,
    capacity,
    price,
    priceModifier,
    status,
    description,
    imagePath,
    hotel,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
