import React, { useEffect, useState } from 'react';
import { Table, Button, Popconfirm } from 'antd';
import AdminHeader from '../components/Adminpage/AdminHeader';
import { useNavigate } from 'react-router-dom';
import { Hotel } from '../interfaces/Hotel';

export default function Hotels() {
    const navigate = useNavigate();

    const [hotels, setHotels] = useState<Hotel[]>([]);

    useEffect(() => {

        const fetchHotelsData = async () => {

            try {
                const response = await fetch('http://localhost:8080/api/hotels', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1")}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                if (response.status === 401) {
                    console.log('Unauthorized access. Redirecting to login page...');
                    window.location.href = '/login';
                }
                if (response.status === 403) {
                    console.log('Forbidden access. Redirecting to login page...');
                    window.location.href = '/login';
                }


                if (response.status === 200) {
                    console.log('Hotels data fetched successfully:', response);
                }

                const data = await response.json();
                console.log('Hotels data:', data);

                setHotels(data);

            } catch (error) {
                console.error('Error fetching hotels data:', error);
            }

        }

        fetchHotelsData();
    }, []);

    const handleDelete = async (hotelID: string) => {
        try {
            const response = await fetch(`http://localhost:8080/api/hotels/${hotelID}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1")}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete user');
            }

            console.log(`User with ID ${hotelID} deleted successfully`);

            // Remove the deleted user from the state
            setHotels((prevUsers) => prevUsers.filter((hotel) => hotel.id !== hotelID));
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const columns = [
        {
            title: 'id',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Hotel Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'City',
            dataIndex: 'city',
            key: 'city',
        },
        {
            title: 'State',
            dataIndex: 'state',
            key: 'state',
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Country',
            dataIndex: 'country',
            key: 'country',
        },
        {
            title: 'Zip Code',
            dataIndex: 'zipCode',
            key: 'zipCode',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: Hotel) => (
                <div onClick={(e) => e.stopPropagation() /* Prevent row click when interacting with Popconfirm */}>
                    <Popconfirm
                        title="Are you sure you want to delete this user?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button
                            type="primary"
                            danger
                        >
                            Delete
                        </Button>
                    </Popconfirm>
                </div>
            ),
        }

    ];

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            {/* Header */}
            <AdminHeader />
            {/* Title */}
            <header className="bg-blue-50 shadow-md rounded-lg p-5 float-end w-full flex justify-center gap-10 items-center">
                <h1 className="text-2xl font-bold">Hotels</h1>
                <Button type="primary" href="/admin/hotels/add">Add Hotel</Button>
            </header>

            {/* Content */}
            <main className="flex-grow p-5">
                <div className="bg-white shadow-md rounded-lg p-5">
                    <Table
                        columns={columns}
                        dataSource={hotels}
                        onRow={(record) => ({
                            onClick: () => navigate(`/admin/hotels/${record.id}`),
                        })}
                        rowClassName="cursor-pointer hover:bg-gray-100"
                    />
                </div>
            </main>
        </div>
    );
};
