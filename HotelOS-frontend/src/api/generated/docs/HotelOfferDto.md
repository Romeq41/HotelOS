# HotelOfferDto

Hotel Offer Data Transfer Object

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** |  | [optional] [default to undefined]
**name** | **string** |  | [default to undefined]
**basePrice** | **number** |  | [default to undefined]
**description** | **string** |  | [optional] [default to undefined]
**addressInformation** | [**AddressInformation**](AddressInformation.md) |  | [default to undefined]
**contactInformation** | [**ContactInformation**](ContactInformation.md) |  | [default to undefined]
**cheapestRoom** | [**RoomDto**](RoomDto.md) |  | [optional] [default to undefined]
**roomTypeCountAvailableList** | [**Array&lt;RoomTypeCountDto&gt;**](RoomTypeCountDto.md) |  | [optional] [default to undefined]
**cheapestRoomByTypeList** | [**Array&lt;CheapestRoomByTypeDto&gt;**](CheapestRoomByTypeDto.md) |  | [optional] [default to undefined]
**amenities** | [**Array&lt;AmenityDto&gt;**](AmenityDto.md) |  | [optional] [default to undefined]

## Example

```typescript
import { HotelOfferDto } from './api';

const instance: HotelOfferDto = {
    id,
    name,
    basePrice,
    description,
    addressInformation,
    contactInformation,
    cheapestRoom,
    roomTypeCountAvailableList,
    cheapestRoomByTypeList,
    amenities,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
