'use client';

import { useEffect } from 'react';
import Home from '../page';

export default function SellerPage({ params }: { params: { sellerCode: string } }) {
  useEffect(() => {
    // Basic validation for the code format (e.g., 12-11)
    if (/^\d{2}-\d{2}$/.test(params.sellerCode)) {
      localStorage.setItem('sellerCode', params.sellerCode);
    }
  }, [params.sellerCode]);

  return <Home />;
}
