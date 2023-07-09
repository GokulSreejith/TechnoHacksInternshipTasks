import { LocalStorageKeys } from '@/core/localStorageKeys';
import { useEffect } from 'react';
import Loader from './Loader';
import { useRouter } from 'next/navigation';

const WithAuth = (Component: React.ComponentType) => {
  return function WithAuth(props: any) {
    const router = useRouter();

    // Simulate authentication check
    const isAuthenticated = localStorage.getItem(LocalStorageKeys.adminToken);

    useEffect(() => {
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
