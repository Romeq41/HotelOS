# ReservationDto

Reservation Data Transfer Object

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**reservationId** | **number** |  | [optional] [default to undefined]
**reservationName** | **string** |  | [optional] [default to undefined]
**checkInDate** | **string** |  | [default to undefined]
**checkOutDate** | **string** |  | [default to undefined]
**totalAmount** | **number** |  | [default to undefined]
**status** | **string** |  | [default to undefined]
**numberOfAdults** | **number** |  | [optional] [default to undefined]
**numberOfChildren** | **number** |  | [optional] [default to undefined]
**specialRequests** | **string** |  | [optional] [default to undefined]
**user** | [**UserDto**](UserDto.md) |  | [optional] [default to undefined]
**room** | [**RoomDto**](RoomDto.md) |  | [default to undefined]
**guests** | [**Set&lt;GuestDto&gt;**](GuestDto.md) |  | [optional] [default to undefined]
**primaryGuestName** | **string** |  | [optional] [default to undefined]
**primaryGuestEmail** | **string** |  | [optional] [default to undefined]
**primaryGuestPhone** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { ReservationDto } from './api';

const instance: ReservationDto = {
    reservationId,
    reservationName,
    checkInDate,
    checkOutDate,
    totalAmount,
    status,
    numberOfAdults,
    numberOfChildren,
    specialRequests,
    user,
    room,
    guests,
    primaryGuestName,
    primaryGuestEmail,
    primaryGuestPhone,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
