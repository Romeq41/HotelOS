import { useTranslation } from 'react-i18next';

export default function Footer() {
    const { t } = useTranslation();
    return (
        <footer className='text-center text-lg bg-slate-500 text-white py-4'>
            {t('footer.copyright', 'JR © 2024')}
        </footer>
    );
};
