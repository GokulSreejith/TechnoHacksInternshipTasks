import { LocalStorageKeys } from '@/core/localStorageKeys';
import { useEffect, useState } from 'react';
import Loader from './Loader';
import { useRouter } from 'next/navigation';

const WithoutAuth = (Component: React.ComponentType) => {
    return function WithoutAuth(props: any) {
        const router = useRouter();
        const [isAuthenticated, setAuthenticate] = useState<boolean>(false);

        useEffect(() => {
            const token = localStorage.getItem(LocalStorageKeys.adminToken);
            setAuthenticate(!!token);

            if (token) {
                router.replace("/");
            }
        }, [router]);

        if (isAuthenticated) {
            // Render a loading state or a login form
            return <Loader />
        }

        // Render the protected component if authenticated
        return <Component {...props} />;
    };
};

export default WithoutAuth;
