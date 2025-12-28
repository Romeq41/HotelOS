package com.hotelos.hotelosbackend.implementation;

import com.hotelos.hotelosbackend.dto.*;
import com.hotelos.hotelosbackend.mapper.AmenityMapper;
import com.hotelos.hotelosbackend.mapper.HotelMapper;
import com.hotelos.hotelosbackend.mapper.RoomMapper;
import com.hotelos.hotelosbackend.models.*;
import com.hotelos.hotelosbackend.repository.*;
import com.hotelos.hotelosbackend.services.*;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class IHotelServices implements HotelServices {
    private final HotelRepository hotelRepository;

    private final FileStorageService fileStorageService;

    private final UserRepository userRepository;

    private final RoomRepository roomRepository;

    private final RoomServices roomServices;

    private final ReservationRepository reservationRepository;

    private final AmenityRepository amenityRepository;

    private final HotelMapper hotelMapper;

    private final RoomMapper roomMapper;

    private final PriceCalculationService priceCalculationService;

    private final AmenityMapper amenityMapper;

    private final RoomTypeServices roomTypeServices;

    public IHotelServices(HotelRepository hotelRepository, FileStorageService fileStorageService,
            UserRepository userRepository, RoomRepository roomRepository, RoomServices roomServices,
            ReservationRepository reservationRepository, AmenityRepository amenityRepository, HotelMapper hotelMapper,
            RoomMapper roomMapper, PriceCalculationService priceCalculationService, AmenityMapper amenityMapper,
            RoomTypeServices roomTypeServices) {
        this.hotelRepository = hotelRepository;
        this.fileStorageService = fileStorageService;
        this.userRepository = userRepository;
        this.roomRepository = roomRepository;
        this.roomServices = roomServices;
        this.reservationRepository = reservationRepository;
        this.amenityRepository = amenityRepository;
        this.hotelMapper = hotelMapper;
        this.roomMapper = roomMapper;
        this.priceCalculationService = priceCalculationService;
        this.amenityMapper = amenityMapper;
        this.roomTypeServices = roomTypeServices;
    }

    @Override
    public Hotel saveHotel(Hotel hotel) {
        return hotelRepository.save(hotel);
    }

    @Override
    public String storeFile(MultipartFile file) throws IOException {
        String imagePath = fileStorageService.storeFile(file, "hotels");

        if (imagePath == null || imagePath.isEmpty()) {
            throw new IOException("Failed to store file: " + file.getOriginalFilename());
        }
        return imagePath;
    }

    @Override
    public HotelStatisticsDto getHotelStatistics(Hotel hotel) {
        HotelStatisticsDto hotelStatisticsDto = new HotelStatisticsDto();
        hotelStatisticsDto.setHotelId(hotel.getId());
        hotelStatisticsDto.setManagerCount(userRepository.countUsersByUserTypeEquals(UserType.MANAGER));
        hotelStatisticsDto.setStaffCount(userRepository.countUsersByUserTypeEquals(UserType.STAFF));
        hotelStatisticsDto.setTotalUserCount(userRepository.count());
        hotelStatisticsDto.setReservationsCount(reservationRepository.count());
        hotelStatisticsDto.setTotalRoomCount(roomRepository.count());
        hotelStatisticsDto
                .setCurrentlyAvailableCount(roomRepository.countByHotelAndStatusEquals(hotel, RoomStatus.AVAILABLE));
        hotelStatisticsDto
                .setCurrentlyOccupiedCount(roomRepository.countByHotelAndStatusEquals(hotel, RoomStatus.OCCUPIED));
        return hotelStatisticsDto;
    }

    @Override
    public byte[] getFile(String filePath) throws IOException {
        return fileStorageService.getFile(filePath);
    }

    // @Override
    // public Page<User> getAllUsers(Pageable pageable) {
    // return userRepository.findAll(pageable);
    // }
    //
    // @Override
    // public Page<User> getUsersByEmail(Pageable pageable, String email) {
    // return userRepository.findByEmailContainingIgnoreCase(email, pageable);
    // }
    // @Override
    // public Page<User> getUsersWithFilters(String email, Pageable pageable) {
    // Optional<String> emailOpt = Optional.ofNullable(email).filter(e ->
    // !e.isBlank());
    //
    // if (emailOpt.isPresent()) {
    // return getUsersByEmail(pageable, emailOpt.get());
    // } else {
    // return getAllUsers(pageable);
    // }
    // }
    @Override
    public Page<Hotel> getAllHotels(Pageable pageable) {
        return hotelRepository.findAll(pageable);
    }

    @Override
    public Page<Hotel> getHotelsByName(Pageable pageable, String hotel_name) {
        return hotelRepository.findByNameContainingIgnoreCase(hotel_name, pageable);
    }

    @Override
    public List<Hotel> getHotelsWithFilters(String hotelName, String country, String city) {
        // If all parameters are null or blank, return all hotels
        if ((hotelName == null || hotelName.isBlank()) &&
                (country == null || country.isBlank()) &&
                (city == null || city.isBlank())) {
            return hotelRepository.findAll();
        }

        // Create Specification for dynamic querying
        return hotelRepository.findAll(
                (root, query, criteriaBuilder) -> {
                    List<Predicate> predicates = new ArrayList<>();

                    if (hotelName != null && !hotelName.isBlank()) {
                        predicates.add(criteriaBuilder.like(
                                criteriaBuilder.lower(root.get("name")),
                                "%" + hotelName.toLowerCase() + "%"));
                    }

                    if (country != null && !country.isBlank()) {
                        // Join to addressInformation first, then access country
                        predicates.add(criteriaBuilder.like(
                                criteriaBuilder.lower(root.get("addressInformation").get("country")),
                                "%" + country.toLowerCase() + "%"));
                    }

                    if (city != null && !city.isBlank()) {
                        // Join to addressInformation first, then access city
                        predicates.add(criteriaBuilder.like(
                                criteriaBuilder.lower(root.get("addressInformation").get("city")),
                                "%" + city.toLowerCase() + "%"));
                    }

                    return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
                });
    }

    @Override
    public Page<Hotel> getHotelsWithFiltersPaginated(String hotelName, String country, String city, Pageable pageable) {
        // If all parameters are null or blank, return all hotels
        if ((hotelName == null || hotelName.isBlank()) &&
                (country == null || country.isBlank()) &&
                (city == null || city.isBlank())) {
            return getAllHotels(pageable);
        }

        // Create Specification for dynamic querying
        Page<Hotel> smth = hotelRepository.findAll(
                (root, query, criteriaBuilder) -> {
                    List<Predicate> predicates = new ArrayList<>();

                    if (hotelName != null && !hotelName.isBlank()) {
                        predicates.add(criteriaBuilder.like(
                                criteriaBuilder.lower(root.get("name")),
                                "%" + hotelName.toLowerCase() + "%"));
                    }

                    if (country != null && !country.isBlank()) {
                        // Join to addressInformation first, then access country
                        predicates.add(criteriaBuilder.like(
                                criteriaBuilder.lower(root.get("addressInformation").get("country")),
                                "%" + country.toLowerCase() + "%"));
                    }

                    if (city != null && !city.isBlank()) {
                        // Join to addressInformation first, then access city
                        predicates.add(criteriaBuilder.like(
                                criteriaBuilder.lower(root.get("addressInformation").get("city")),
                                "%" + city.toLowerCase() + "%"));
                    }

                    return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
                },
                pageable);
        System.out.println("Hotels with filters: " + smth.getContent());
        return smth;
    }

    // todo FIX ALL THE OTHER UPDATING AND FORMS XDD....
    @Override
    public Page<HotelOfferDto> getHotelsOffersWithFilters(String hotel_name, String country, String city, String sortBy,
            Pageable pageable) {
        List<HotelOfferDto> hotels = getHotelsWithFilters(hotel_name, country, city).stream()
                .map(hotelMapper::toOfferDto)
                .collect(Collectors.toList());

        // Assign cheapest rooms for hotels
        hotels.forEach(hotelOfferDto -> {
            List<RoomDto> roomDtos = roomRepository.findAllByHotelId(hotelOfferDto.getId()).stream()
                    .map(room -> roomMapper.toDto(room, null, null))
                    .toList();

            // Find cheapest room overall
            RoomDto cheapestRoom = roomDtos.stream()
                    .filter(room -> room.getStatus() == RoomStatus.AVAILABLE)
                    .min(Comparator.comparing(RoomDto::getPrice))
                    .orElse(null);
            hotelOfferDto.setCheapestRoom(cheapestRoom);
        });

        // Assign amenities
        hotels.forEach(hotelOfferDto -> {
            List<AmenityDto> amenities = amenityRepository.findAllByHotel_Id(hotelOfferDto.getId()).stream()
                    .map(amenityMapper::toDto).toList();
            hotelOfferDto.setAmenities(amenities);
        });

        // Apply sorting
        if (sortBy != null && !sortBy.isBlank()) {
            // Convert list to mutable list for sorting
            List<HotelOfferDto> mutableHotels = new ArrayList<>(hotels);

            // Parse sort parameters
            String field = sortBy;
            boolean isAscending;

            if (sortBy.contains("-")) {
                String[] sortParams = sortBy.split("-");
                field = sortParams[0];
                isAscending = sortParams.length > 1 && !sortParams[1].equalsIgnoreCase("desc");
            } else {
                isAscending = true;
            }

            // todo check if works well :)
            // Create comparator based on sort field
            Comparator<HotelOfferDto> comparator;
            if (field.equalsIgnoreCase("price")) {
                comparator = Comparator.comparing(
                        hotel -> {
                            if (hotel.getCheapestRoom() == null || hotel.getCheapestRoom().getPrice() == null) {
                                return isAscending ? BigDecimal.valueOf(Double.MAX_VALUE) : BigDecimal.ZERO;
                            }
                            return hotel.getCheapestRoom().getPrice();
                        });
            } else {
                comparator = Comparator.comparing(
                        hotel -> hotel.getName() != null ? hotel.getName().toLowerCase() : "");
            }

            // Apply direction
            if (!isAscending) {
                comparator = comparator.reversed();
            }

            // Sort the list
            mutableHotels.sort(comparator);

            // Replace original list with sorted list
            hotels = mutableHotels;
        }

        // Simplified pagination
        int pageSize = pageable.getPageSize();
        int currentPage = pageable.getPageNumber();
        int startItem = currentPage * pageSize;

        List<HotelOfferDto> paginatedList;

        if (hotels.size() < startItem) {
            paginatedList = Collections.emptyList();
        } else {
            int toIndex = Math.min(startItem + pageSize, hotels.size());
            paginatedList = hotels.subList(startItem, toIndex);
        }

        return new PageImpl<>(paginatedList, pageable, hotels.size());
    }

    @Override
    public HotelOfferDto getHotelOfferById(Long id, LocalDate checkIn, LocalDate checkOut) {
        HotelOfferDto hotelOffer = hotelRepository.findById(id)
                .map(hotelMapper::toOfferDto)
                .orElseThrow(() -> new NoSuchElementException("Hotel with id " + id + " not found"));

        List<RoomDto> roomDtos = Optional.ofNullable(checkIn)
                .flatMap(in -> Optional.ofNullable(checkOut)
                        .map(out -> roomRepository.findAvailableRoomsByHotelAndDates(id, in, out)))
                .orElseGet(() -> roomRepository.findAllByHotelId(id))
                .stream()
                .map(room -> roomMapper.toDto(room, checkIn, checkOut))
                .toList();
        // Find cheapest room overall
        RoomDto cheapestRoom = roomDtos.stream()
                .filter(room -> room.getStatus() == RoomStatus.AVAILABLE)
                .min(Comparator.comparing(RoomDto::getPrice))
                .orElse(null);
        hotelOffer.setCheapestRoom(cheapestRoom);

        // Build list of cheapest rooms by room type
        Map<Long, RoomDto> cheapestByType = roomDtos.stream()
                .filter(room -> room.getStatus() == RoomStatus.AVAILABLE
                        && room.getRoomType() != null
                        && room.getRoomType().getId() != null
                        && room.getPrice() != null)
                .collect(Collectors.toMap(
                        room -> room.getRoomType().getId(),
                        Function.identity(),
                        (room1, room2) -> room1.getPrice().compareTo(room2.getPrice()) <= 0 ? room1 : room2));

        List<CheapestRoomByTypeDto> cheapestRoomByTypeList = cheapestByType.values().stream()
                .map(room -> CheapestRoomByTypeDto.builder()
                        .roomType(room.getRoomType())
                        .room(room)
                        .build())
                .toList();

        hotelOffer.setCheapestRoomByTypeList(cheapestRoomByTypeList);

        List<AmenityDto> amenities = amenityRepository.findAllByHotel_Id(id).stream().map(amenityMapper::toDto)
                .toList();
        hotelOffer.setAmenities(amenities);

        // Build room type availability list
        Map<Long, Long> countsByTypeId = roomDtos.stream()
                .filter(room -> room.getStatus() == RoomStatus.AVAILABLE
                        && room.getRoomType() != null
                        && room.getRoomType().getId() != null)
                .collect(Collectors.groupingBy(room -> room.getRoomType().getId(), Collectors.counting()));

        Map<Long, RoomTypeDto> typeById = roomDtos.stream()
                .map(RoomDto::getRoomType)
                .filter(Objects::nonNull)
                .filter(rt -> rt.getId() != null)
                .collect(Collectors.toMap(RoomTypeDto::getId, Function.identity(), (a, b) -> a));

        List<RoomTypeCountDto> roomTypeCountList = countsByTypeId.entrySet().stream()
                .map(e -> RoomTypeCountDto.builder()
                        .roomType(typeById.get(e.getKey()))
                        .count(e.getValue())
                        .build())
                .toList();

        hotelOffer.setRoomTypeCountAvailableList(roomTypeCountList);

        return hotelOffer;
    }

    @Override
    public Optional<Hotel> getHotelById(Long id) {
        return hotelRepository.findById(id);
    }

    @Override
    public void deleteHotel(Long id) {
        hotelRepository.deleteById(id);
    }

}