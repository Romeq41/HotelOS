import React from 'react';
import { Table, Button } from 'antd';
import AdminHeader from '../components/Adminpage/AdminHeader';
import { useNavigate } from 'react-router-dom';

const Hotels: React.FC = () => {
    const navigate = useNavigate();

    const columns = [
        {
            title: 'Hotel Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Location',
            dataIndex: 'location',
            key: 'location',
        },
        {
            title: 'Rooms',
            dataIndex: 'rooms',
            key: 'rooms',
        },
        {
            title: 'Rating',
            dataIndex: 'rating',
            key: 'rating',
        },
        // {
        //     title: 'Properties',
        //     key: 'properties',
        //     render: (_: any, record: any) => (
        //         <div className="flex gap-4">
        //             <Button type="primary" onClick={() => handlePropertiesClick(record)}>
        //                 View Properties
        //             </Button>
        //             <Button
        //                 type="primary"
        //                 style={{ backgroundColor: '#facc15', borderColor: '#facc15' }} // Yellow for Edit
        //                 onClick={() => handleEditClick(record)}
        //             >
        //                 Edit
        //             </Button>
        //             <Button
        //                 type="primary"
        //                 style={{ backgroundColor: '#ef4444', borderColor: '#ef4444' }} // Red for Delete
        //                 onClick={() => handleDeleteClick(record)}
        //             >
        //                 Delete
        //             </Button>
        //         </div>
        //     ),
        // },
    ];

    const data = [
        {
            hotel_id: '1',
            name: 'Hotel California',
            location: 'Los Angeles, CA',
            rooms: 120,
            rating: 4.5,
        },
        {
            hotel_id: '2',
            name: 'The Grand Budapest',
            location: 'Zubrowka',
            rooms: 200,
            rating: 5.0,
        },
        {
            hotel_id: '3',
            name: 'The Grand Budapest',
            location: 'Zubrowka',
            rooms: 200,
            rating: 5.0,
        },
        {
            hotel_id: '4',
            name: 'The Grand Budapest',
            location: 'Zubrowka',
            rooms: 200,
            rating: 5.0,
        },
        {
            hotel_id: '5',
            name: 'The Grand Budapest',
            location: 'Zubrowka',
            rooms: 200,
            rating: 5.0,
        },
        {
            hotel_id: '6',
            name: 'The Grand Budapest',
            location: 'Zubrowka',
            rooms: 200,
            rating: 5.0,
        },
    ];

    const handleEditClick = (record: any) => {
        console.log('Edit clicked for:', record);
    };

    const handlePropertiesClick = (record: any) => {
        console.log('Properties clicked for:', record);
    };

    const handleDeleteClick = (record: any) => {
        console.log('Delete clicked for:', record);
    };

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
                        dataSource={data}
                        onRow={(record) => ({
                            onClick: () => navigate(`/admin/hotel/${record.hotel_id}`),
                        })}
                        rowClassName="cursor-pointer hover:bg-gray-100"
                    />
                </div>
            </main>
        </div>
    );
};

export default Hotels;