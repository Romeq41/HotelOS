import { useEffect, useState } from 'react';
import { Table, Button, Input, Popconfirm, message, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
// import { User, UserType } from '../../../interfaces/User';
import { useLoading } from '../../../contexts/LoaderContext';
import { useTranslation } from 'react-i18next';
import { useApi } from '../../../api/useApi';
import { PageUserDto } from '../../../api/generated/api';

export default function Users() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { user: userApi } = useApi();

    const [users, setUsers] = useState<any[]>([]);
    const [page, setPage] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [inputValue, setInputValue] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const { showLoader, hideLoader } = useLoading();
    const PAGE_SIZE = 10;

    useEffect(() => {
        const fetchUsersData = async (searchValue: string, pageNumber: number) => {
            showLoader();
            try {
                const response = await userApi.getAllUsers(
                    pageNumber,
                    PAGE_SIZE,
                    searchValue || undefined
                );
                const data = response.data as PageUserDto;

                if (data?.content) {
                    const mapped = data.content
                        .filter((u: any) => (u.userType || u.userDto?.userType) !== 'ADMIN')
                        .map((u: any) => {
                            const id = (u.id ?? u.userId) as number | string;
                            const addressInfo = u.addressInformation || u.address || {};
                            const address = [
                                addressInfo.address,
                                addressInfo.city,
                                addressInfo.state,
                                addressInfo.zipCode,
                                addressInfo.country
                            ].filter(Boolean).join(', ');
                            return {
                                ...u,
                                key: id,
                                id,
                                userId: u.userId ?? id,
                                hotelName: u.hotel?.name,
                                position: u.position,
                                address,
                            };
                        });

                    setUsers(mapped as any[]);
                    setTotalElements(data.totalElements || (mapped?.length ?? 0));
                    setPage(data.number || 0);
                } else {
                    setUsers([]);
                    setTotalElements(0);
                    setPage(0);
                }
            } catch (error: any) {
                console.error('Error fetching users data:', error);
                if (error.response?.status === 401 || error.response?.status === 403) {
                    message.error(t('common.unauthorized', 'Unauthorized access'));
                    navigate('/login');
                    return;
                }
                message.error(t('admin.users.fetchError', 'Failed to load users data'));
            } finally {
                hideLoader();
            }
        };


        fetchUsersData(searchQuery, page);
    }, [searchQuery, page, userApi, navigate, t]);

    const handleSearch = () => {
        setPage(0);
        setSearchQuery(inputValue);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleDelete = async (userId: string | number) => {
        showLoader();
        try {
            await userApi.deleteUser(Number(userId));
            message.success(t('admin.users.deleteSuccess', `User with ID ${userId} deleted successfully`));
            setUsers((prevUsers) => prevUsers.filter((user: any) => (user.id ?? user.userId) !== userId));
        } catch (error: any) {
            console.error('Error deleting user:', error);
            if (error.response?.status === 401 || error.response?.status === 403) {
                message.error(t('common.unauthorized', 'Unauthorized access'));
                navigate('/login');
                return;
            }
            message.error(t('admin.users.deleteError', 'Failed to delete user'));
        }
        hideLoader();
    };


    const columns = [
        {
            title: t('admin.users.columns.email', 'Email'),
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: t('admin.users.columns.firstName', 'First Name'),
            dataIndex: 'firstName',
            key: 'firstName',
        },
        {
            title: t('admin.users.columns.lastName', 'Last Name'),
            dataIndex: 'lastName',
            key: 'lastName',
        },
        {
            title: t('admin.users.columns.hotelName', 'Hotel Name'),
            key: 'name',
            render: (_: any, record: any) => record.hotelName || record.hotel?.name || t('admin.users.noHotelAssigned', 'No Hotel Assigned'),
        },
        {
            title: t('admin.users.columns.position', 'Position'),
            dataIndex: 'position',
            key: 'position',
        },
        {
            title: t('admin.users.columns.address', 'Address'),
            key: 'address',
            render: (_: any, record: any) => record.address || record.addressInformation?.address || '-',
        },
        {
            title: t('admin.users.columns.role', 'Role'),
            dataIndex: 'userType',
            key: 'userType',
            render: (val: string) => {
                const role = (val || '').toUpperCase();
                const color = role === 'MANAGER' ? 'gold' : role === 'STAFF' ? 'blue' : role === 'GUEST' ? 'green' : 'default';
                return <Tag color={color}>{role || 'N/A'}</Tag>;
            }
        },
        {
            title: t('admin.users.columns.actions', 'Actions'),
            key: 'actions',
            render: (_: any, record: any) => (
                <div onClick={(e) => e.stopPropagation()}>
                    <Popconfirm
                        title={t('admin.users.deleteConfirmation', 'Are you sure you want to delete this user?')}
                        onConfirm={() => handleDelete(record.id ?? record.userId)}
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
            {/* Title & Add User */}
            <div className="mt-20 rounded-lg pt-10 pb-5 float-end w-full flex justify-between gap-10 items-center px-5">
                <h1 className="text-2xl font-bold">{t('admin.hotels.title_users', 'Hotel Users')}</h1>
                <div className="text-sm text-gray-500">{t('common.total', 'Total')}: {totalElements}</div>
            </div>

            {/* Content */}
            <main className="flex-grow p-5">
                <div className="bg-white shadow-md rounded-lg p-5">
                    {/* Search bar */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Input
                                placeholder={t('admin.users.searchPlaceholder', 'Search users')}
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
                            onClick={() => navigate(`/admin/users/add`)}
                        >
                            {t('admin.users.addUser', 'Add User')}
                        </Button>
                    </div>

                    <Table
                        columns={columns}
                        dataSource={users}
                        pagination={{
                            current: page + 1,
                            pageSize: PAGE_SIZE,
                            total: totalElements,
                            onChange: (p) => setPage(p - 1),
                        }}
                        bordered
                        size="middle"
                        onRow={(record: any) => ({
                            onClick: () => navigate(`/admin/users/${record.id ?? record.userId}`),
                        })}
                        rowClassName="cursor-pointer hover:bg-gray-100 hover:shadow-md transition-all"
                    />
                </div>
            </main>
        </div>
    );
}