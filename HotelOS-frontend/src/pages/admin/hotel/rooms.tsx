import { useEffect, useState } from 'react';
import { Table, Button, Input, message } from 'antd';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Popconfirm } from 'antd';
import { useLoading } from '../../../contexts/LoaderContext';
import { useTranslation } from 'react-i18next';
import { useUser } from '../../../contexts/UserContext';
import { UserType } from '../../../interfaces/User';
import { useApi } from '../../../api/useApi';
import { HotelDto, RoomDto, PageRoomDto } from '../../../api/generated/api';

export default function Admin_Hotel_Rooms() {
    const { hotelId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation();
    const { user: currentUser } = useUser();

    const [rooms, setRooms] = useState<RoomDto[]>([]);
    const [hotel, setHotel] = useState<HotelDto>();
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [inputValue, setInputValue] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const { showLoader, hideLoader } = useLoading();
    const { hotel: hotelApi, room: roomApi } = useApi();
    const PAGE_SIZE = 10;

    // Helper function to determine the correct base path for navigation
    const getBasePath = () => {
        const path = location.pathname;
        if (path.includes('/admin/')) {
            return `/admin/hotels/${hotelId}`;
        } else if (path.includes('/manager/')) {
            return `/manager/hotel/${hotelId}`;
        }
        // Default fallback based on user role
        return currentUser?.userType === UserType.Admin
            ? `/admin/hotels/${hotelId}`
            : `/manager/hotel/${hotelId}`;
    };

    useEffect(() => {
        const fetchHotelData = async () => {
            showLoader();
            try {
                if (hotelId) {
                    const response = await hotelApi.getHotelById(Number(hotelId));
                    const hotelData = response.data as HotelDto;
                    setHotel(hotelData);
                }
            } catch (error: any) {
                console.error('Error fetching hotel data:', error);

                if (error.response?.status === 401 || error.response?.status === 403) {
                    message.error(t('common.unauthorized', 'Unauthorized access'));
                    navigate('/login');
                    return;
                }

                message.error(t('admin.hotels.fetchError', 'Failed to load hotel data'));
            }
            hideLoader();
        };
        fetchHotelData();
    }, [hotelId]);

    useEffect(() => {
        const fetchRoomsData = async (searchValue: string, pageNumber: number) => {
            showLoader();

            try {
                if (hotelId) {
                    const response = await hotelApi.getRoomsByHotelId(
                        Number(hotelId),
                        pageNumber,
                        PAGE_SIZE,
                        searchValue ? Number(searchValue) : undefined
                    );

                    const data = response.data as PageRoomDto;

                    if (data.content) {
                        setRooms(data.content);
                        setTotalPages(data.totalPages || 0);
                        setPage(data.number || 0);
                    } else {
                        setRooms([]);
                        setTotalPages(0);
                        setPage(0);
                    }
                }
            } catch (error: any) {
                console.error('Error fetching rooms data:', error);

                if (error.response?.status === 401 || error.response?.status === 403) {
                    message.error(t('common.unauthorized', 'Unauthorized access'));
                    navigate('/login');
                    return;
                }

                message.error(t('admin.hotels.rooms.fetchError', 'Failed to load rooms data'));
            }
            hideLoader();
        };

        fetchRoomsData(searchQuery, page);
    }, [hotelId, searchQuery, page]);

    const handleSearch = () => {
        setPage(0);
        setSearchQuery(inputValue);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleDelete = async (roomId: number) => {
        showLoader();
        try {
            await roomApi.deleteRoom(roomId);
            setRooms((prevRooms) => prevRooms.filter((room) => room.roomId !== roomId));
            message.success(t('admin.hotels.rooms.deleteSuccess', 'Room deleted successfully'));
        } catch (error: any) {
            console.error('Error deleting room:', error);

            if (error.response?.status === 401 || error.response?.status === 403) {
                message.error(t('common.unauthorized', 'Unauthorized access'));
                navigate('/login');
                return;
            }

            message.error(t('admin.hotels.rooms.deleteError', 'Failed to delete room'));
        }
        hideLoader();
    };

    const columns = [
        {
            title: t('admin.hotels.rooms.columns.roomNumber', 'Room Number'),
            dataIndex: 'roomNumber',
            key: 'roomNumber',
        },
        {
            title: t('admin.hotels.rooms.columns.type', 'Type'),
            dataIndex: 'roomType',
            key: 'roomType',
            render: (roomType: any) => roomType?.name || t('common.notAvailable', 'N/A'),
        },
        {
            title: t('admin.hotels.rooms.columns.price', 'Price'),
            dataIndex: 'price',
            key: 'price',
            render: (price: number | null | undefined) =>
                price !== null && price !== undefined ? `$${price.toFixed(2)}` : t('common.notAvailable', 'N/A'),
        },
        {
            title: t('admin.hotels.rooms.columns.status', 'Status'),
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: t('admin.hotels.columns.actions', 'Actions'),
            key: 'actions',
            render: (_: any, record: RoomDto) => (
                <div onClick={(e) => e.stopPropagation()}>
                    <Popconfirm
                        title={t('admin.hotels.rooms.deleteConfirmation', 'Are you sure you want to delete this room?')}
                        onConfirm={() => handleDelete(record.roomId!)}
                        okText={t('common.yes', 'Yes')}
                        cancelText={t('common.no', 'No')}
                    >
                        <Button
                            type="primary"
                            danger
                        >
                            {t('common.delete', 'Delete')}
                        </Button>
                    </Popconfirm>
                </div>
            ),
        },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <div className="mt-20 rounded-lg pt-10 pb-5 float-end w-full flex justify-between gap-10 items-center px-5">
                <h1 className="text-2xl font-bold">
                    {hotel?.name} : {t('hotel.rooms', 'Rooms')}
                </h1>
                <div className="text-sm text-gray-500">{t('common.total', 'Total')}: {totalPages * PAGE_SIZE}</div>
            </div>

            {/* Content */}
            <main className="flex-grow p-5">
                <div className="bg-white shadow-md rounded-lg p-5">
                    {/* Search bar and Add Room button */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Input
                                placeholder={t('admin.hotels.rooms.searchPlaceholder', 'Search rooms')}
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={handleKeyPress}
                                style={{ width: 200 }}
                            />
                            <Button type="default" onClick={handleSearch}>
                                {t('common.search', 'Search')}
                            </Button>
                        </div>
                        <Button
                            type="primary"
                            onClick={() => navigate(`${getBasePath()}/rooms/add`)}
                        >
                            {t('admin.hotels.rooms.addRoom', 'Add Room')}
                        </Button>
                    </div>

                    <Table
                        columns={columns}
                        dataSource={rooms}
                        rowKey="roomId"
                        pagination={{
                            current: page + 1,
                            pageSize: PAGE_SIZE,
                            total: totalPages * PAGE_SIZE,
                            onChange: (page) => setPage(page - 1),
                        }}
                        bordered
                        size="middle"
                        onRow={(record) => ({
                            onClick: () => navigate(`${getBasePath()}/rooms/${record.roomId}`),
                        })}
                        rowClassName="cursor-pointer hover:bg-gray-100 hover:shadow-md transition-all"
                    />
                </div>
            </main>
        </div>
    );
}