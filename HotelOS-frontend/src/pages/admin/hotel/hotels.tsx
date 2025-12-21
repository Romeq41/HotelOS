import { useEffect, useState } from 'react';
import { Table, Button, Popconfirm, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useLoading } from '../../../contexts/LoaderContext';
import { useTranslation } from 'react-i18next';
import { useApi } from '../../../api/useApi';
import { HotelDto, PageHotelDto } from '../../../api/generated/api';

export default function Hotels() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { hotel: hotelApi } = useApi();

    const [hotels, setHotels] = useState<any[]>([]);
    const [page, setPage] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [inputValue, setInputValue] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const { showLoader, hideLoader } = useLoading();
    const PAGE_SIZE = 10;

    useEffect(() => {
        const fetchHotelsData = async (searchValue: string, pageNumber: number) => {
            showLoader();

            try {
                // Use the generated API to fetch hotels
                const response = await hotelApi.getAllHotels(
                    pageNumber,
                    PAGE_SIZE,
                    searchValue || undefined // Only pass hotelName if searchValue exists
                );

                const data = response.data as PageHotelDto;

                if (data.content) {
                    // Transform HotelDto to display format and add keys for table
                    const hotelsWithKeys = data.content.map((hotel: HotelDto) => ({
                        ...hotel,
                        key: hotel.id,
                        // Flatten address and contact information for table display
                        city: hotel.addressInformation?.city,
                        state: hotel.addressInformation?.state,
                        address: hotel.addressInformation?.address,
                        country: hotel.addressInformation?.country,
                        zipCode: hotel.addressInformation?.zipCode,
                        email: hotel.contactInformation?.email,
                        phoneNumber: hotel.contactInformation?.phoneNumber,
                    }));

                    setHotels(hotelsWithKeys);
                    setTotalElements(data.totalElements || 0);
                    setPage(data.number || 0);
                } else {
                    setHotels([]);
                    setTotalElements(0);
                    setPage(0);
                }
            } catch (error: any) {
                console.error('Error fetching hotels data:', error);

                // Handle authentication errors
                if (error.response?.status === 401 || error.response?.status === 403) {
                    message.error(t("common.unauthorized", "Unauthorized access"));
                    navigate("/login");
                    return;
                }

                message.error(t("admin.hotels.fetchError", "Failed to load hotels data"));
            } finally {
                hideLoader();
            }
        };

        fetchHotelsData(searchQuery, page);
    }, [searchQuery, page, hotelApi]);

    const handleSearch = () => {
        setPage(0);
        setSearchQuery(inputValue);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleDelete = async (hotelID: number) => {
        showLoader();
        try {
            // Use the generated API to delete hotel
            await hotelApi.deleteHotel(hotelID);

            message.success(t("admin.hotels.deleteSuccess", `Hotel with ID ${hotelID} deleted successfully`));

            // Remove the deleted hotel from local state
            setHotels((prevHotels) => prevHotels.filter((hotel) => hotel.id !== hotelID));
        } catch (error: any) {
            console.error('Error deleting hotel:', error);

            // Handle authentication errors
            if (error.response?.status === 401 || error.response?.status === 403) {
                message.error(t("common.unauthorized", "Unauthorized access"));
                navigate("/login");
                return;
            }

            message.error(t("admin.hotels.deleteError", "Failed to delete hotel"));
        } finally {
            hideLoader();
        }
    };

    const columns = [
        {
            title: t('admin.hotels.columns.id', 'ID'),
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: t('admin.hotels.columns.name', 'Hotel Name'),
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: t('admin.hotels.columns.city', 'City'),
            dataIndex: 'city',
            key: 'city',
        },
        {
            title: t('admin.hotels.columns.state', 'State'),
            dataIndex: 'state',
            key: 'state',
        },
        {
            title: t('admin.hotels.columns.address', 'Address'),
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: t('admin.hotels.columns.country', 'Country'),
            dataIndex: 'country',
            key: 'country',
        },
        {
            title: t('admin.hotels.columns.zipCode', 'Zip Code'),
            dataIndex: 'zipCode',
            key: 'zipCode',
        },
        {
            title: t('admin.hotels.columns.actions', 'Actions'),
            key: 'actions',
            render: (_: any, record: any) => (
                <div onClick={(e) => e.stopPropagation()}>
                    <Popconfirm
                        title={t('admin.hotels.deleteConfirmation', 'Are you sure you want to delete this hotel?')}
                        onConfirm={() => handleDelete(record.id)}
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
        }
    ];

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <div className="mt-20 rounded-lg pt-10 pb-5 float-end w-full flex justify-between gap-10 items-center px-5">
                <h1 className="text-2xl font-bold">{t('admin.hotels.title', 'Hotels')}</h1>
                <div className="text-sm text-gray-500">{t('common.total', 'Total')}: {totalElements}</div>
            </div>

            <main className="flex-grow p-5">
                <div className="bg-white shadow-md rounded-lg p-5">
                    {/* Search (left) & Add Hotel (right) */}
                    <div className="flex items-center justify-between mb-4">
                        {/* Left side: Input + Search button */}
                        <div className="flex items-center gap-2">
                            <Input
                                placeholder={t('admin.hotels.searchPlaceholder', 'Search hotels')}
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
                            onClick={() => navigate('/admin/hotels/add')}
                        >
                            {t('admin.hotels.addHotel', 'Add Hotel')}
                        </Button>
                    </div>
                    <Table
                        columns={columns}
                        dataSource={hotels}
                        pagination={{
                            current: page + 1,
                            pageSize: PAGE_SIZE,
                            total: totalElements,
                            onChange: (page) => setPage(page - 1),
                        }}
                        bordered
                        size="middle"
                        onRow={(record) => ({
                            onClick: () => navigate(`/admin/hotels/${record.id}`),
                        })}
                        rowClassName="cursor-pointer hover:bg-gray-100 hover:shadow-md transition-all"
                    />
                </div>
            </main>
        </div>
    );
}