# RoomTypeDto

Room Type Information

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** |  | [optional] [default to undefined]
**name** | **string** | Room type name | [default to undefined]
**priceFactor** | **number** | Price multiplier for this room type | [default to undefined]
**description** | **string** | Room type description | [optional] [default to undefined]
**hotelId** | **number** | ID of the hotel this room type belongs to, null for global types | [optional] [default to undefined]
**active** | **boolean** | Whether the room type is currently active | [optional] [default to undefined]
**createdAt** | **string** | Creation timestamp | [optional] [readonly] [default to undefined]
**updatedAt** | **string** | Last update timestamp | [optional] [readonly] [default to undefined]

## Example

```typescript
import { RoomTypeDto } from './api';

const instance: RoomTypeDto = {
    id,
    name,
    priceFactor,
    description,
    hotelId,
    active,
    createdAt,
    updatedAt,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
