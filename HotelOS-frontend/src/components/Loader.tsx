import { Spin } from 'antd';

export function Spinner() {
    return (
        <div className="loading-screen fixed inset-0 z-50 flex items-center justify-center bg-gray-500/60">
            <Spin size="large" className="loading-screen" />
        </div>

    );
}

export function SpinnerSmall() {
    return (
        <div className="loading-screen fixed inset-0 z-50 flex items-center justify-center bg-gray-500-100/60">
            <Spin size="small" className="loading-screen" />
        </div>
    );
}