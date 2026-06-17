import { usePage } from '@inertiajs/react';

export function useTranslation() {
    const { translations = {}, locale = 'en' } = usePage().props;

    const __ = (key, replace = {}) => {
        let translation = translations[key] !== undefined ? translations[key] : key;

        Object.keys(replace).forEach((search) => {
            translation = translation.replace(`:${search}`, replace[search]);
        });

        return translation;
    };

    return { __, locale };
}
