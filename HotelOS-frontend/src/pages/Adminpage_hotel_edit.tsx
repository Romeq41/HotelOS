import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Input, Form, message } from 'antd';
import AdminHeader from '../components/Adminpage/AdminHeader';

export default function Adminpage_hotel_edit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchHotelData = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/hotels/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1")}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch hotel data');
                }

                const data = await response.json();
                form.setFieldsValue(data);
            } catch (error) {
                console.error('Error fetching hotel data:', error);
                message.error('Failed to load hotel data');
            }
        };

        if (id) {
            fetchHotelData();
        }
    }, [id, form]);

    const handleSubmit = async (values: any) => {
        setLoading(true);

        values = {
            ...values,
            id: id,
        }
        console.log('Form values:', values);
        console.log(`Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1")}`);
        try {
            const response = await fetch(`http://localhost:8080/api/hotels/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1")}`,
                },
                body: JSON.stringify(values),
            });

            console.log('Response:', response);
            console.log('Response status:', response.status);

            if (!response.ok) {
                throw new Error('Failed to update hotel');
            }

            message.success('Hotel updated successfully');
            navigate('/admin/hotels');
        } catch (error) {
            console.error('Error updating hotel:', error);
            message.error('Failed to update hotel');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            {/* Header */}
            <AdminHeader />

            {/* Title */}
            <header className="bg-blue-50 shadow-md rounded-lg p-5 w-full flex justify-center items-center">
                <h1 className="text-2xl font-bold">Edit Hotel</h1>
            </header>

            {/* Content */}
            <main className="flex-grow p-5">
                <div className="bg-white shadow-md rounded-lg p-5">
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                    >
                        <Form.Item
                            label="Hotel Name"
                            name="name"
                            rules={[{ required: true, message: 'Please enter the hotel name' }]}
                        >
                            <Input placeholder="Enter hotel name" />
                        </Form.Item>

                        <Form.Item
                            label="Address"
                            name="address"
                            rules={[{ required: true, message: 'Please enter the address' }]}
                        >
                            <Input placeholder="Enter address" />
                        </Form.Item>

                        <Form.Item
                            label="City"
                            name="city"
                            rules={[{ required: true, message: 'Please enter the city' }]}
                        >
                            <Input placeholder="Enter city" />
                        </Form.Item>

                        <Form.Item
                            label="State"
                            name="state"
                            rules={[{ required: true, message: 'Please enter the state' }]}
                        >
                            <Input placeholder="Enter state" />
                        </Form.Item>

                        <Form.Item
                            label="Zip Code"
                            name="zipCode"
                            rules={[{ required: true, message: 'Please enter the zip code' }]}
                        >
                            <Input placeholder="Enter zip code" />
                        </Form.Item>

                        <Form.Item
                            label="Country"
                            name="country"
                            rules={[{ required: true, message: 'Please enter the country' }]}
                        >
                            <Input placeholder="Enter country" />
                        </Form.Item>

                        <div className="flex justify-end gap-4">
                            <Button onClick={() => navigate('/admin/hotels')}>Cancel</Button>
                            <Button type="primary" htmlType="submit" loading={loading}>
                                Save Changes
                            </Button>
                        </div>
                    </Form>
                </div>
            </main>
        </div>
    );
}