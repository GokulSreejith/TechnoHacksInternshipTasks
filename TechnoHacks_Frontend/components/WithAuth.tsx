import { LocalStorageKeys } from '@/core/localStorageKeys';
import { useEffect, useState } from 'react';
import Loader from './Loader';
import { useRouter } from 'next/navigation';

const WithAuth = (Component: React.ComponentType) => {
  return function WithAuth(props: any) {
    const router = useRouter();

    const [isAuthenticated, setAuthenticate] = useState<string | null>(null);

    useEffect(() => {
      setAuthenticate(localStorage.getItem(LocalStorageKeys.adminToken));

      if (!isAuthenticated) {
        router.replace("/login")
      }
    }, [isAuthenticated, router])


    if (!isAuthenticated) {
      // Render a loading state or a login form
      return <Loader />
    }

    // Render the protected component if authenticated
    return <Component {...props} />;
  };
};

export default WithAuth;
