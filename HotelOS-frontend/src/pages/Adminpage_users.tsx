import React from 'react';
import { Table, Button } from 'antd';
import AdminHeader from '../components/Adminpage/AdminHeader';
import { useNavigate } from 'react-router-dom';


const Users: React.FC = () => {
    const navigate = useNavigate();
    const columns = [
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Hotel Name',
            dataIndex: 'hotel_name',
            key: 'hotel_name',
        },
        {
            title: 'Position',
            dataIndex: 'position',
            key: 'position',
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
        },
    ];

    const data = [
        {
            user_id: '1',
            email: 'user@email.com',
            hotel_name: 'Los Angeles Hotel',
            name: "John Doe",
            position: "Manager",
            address: "123 Main Street, Los Angeles, CA",
        },
        {
            user_id: '2',
            email: 'user2@email.com',
            hotel_name: 'The Grand Budapest',
            name: "John Doe",
            position: "Staff",
            address: "123 Main Street, Los Angeles, CA",
        },
        {
            user_id: '3',
            email: 'user3@email.com',
            hotel_name: 'The Grand Budapest',
            name: "John Doe the second",
            position: "Manager",
            address: "123 Main Street, Budapest, Hungary",
        }
    ];

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            {/* Header */}
            <AdminHeader />

            {/* Title */}
            <header className="bg-blue-50 shadow-md rounded-lg p-5 float-end w-full flex justify-center gap-10 items-center">
                <h1 className="text-2xl font-bold">Users</h1>
                <Button type="primary" href="/admin/users/add">Add User</Button>
            </header>
            {/* Content */}
            <main className="flex-grow p-5">
                <div className="bg-white shadow-md rounded-lg p-5">
                    <Table
                        columns={columns}
                        dataSource={data}
                        onRow={(record) => ({
                            onClick: () => navigate(`/admin/hotel/${record.user_id}`),
                        })}
                        rowClassName="cursor-pointer hover:bg-gray-100"
                    />
                </div>
            </main>
        </div>
    );
};

export default Users;