import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { serviceRequestService } from '../services/serviceRequestService';
import { quoteRequestService } from '../services/quoteRequestService';
import type { ServiceRequest } from '../types/ServiceRequest';
import type { QuoteRequest } from '../services/quoteRequestService';

export const TestDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [quoteRequests, setQuoteRequests] = useState<QuoteRequest[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user || authLoading) {
        console.log('No user or still loading:', { user: !!user, authLoading });
        return;
      }

      try {
        console.log('=== TEST DASHBOARD ===');
        console.log('User:', { uid: user.uid, email: user.email, type: user.type });
        
        console.log('Fetching service requests...');
        const fetchedServiceRequests = await serviceRequestService.getRequests(user.uid);
        console.log('Service requests fetched:', fetchedServiceRequests);
        
        if (Array.isArray(fetchedServiceRequests)) {
          setServiceRequests(fetchedServiceRequests);
          console.log('Service requests set:', fetchedServiceRequests.length);
        } else {
          console.error('Service requests not an array:', fetchedServiceRequests);
          setServiceRequests([]);
        }

        console.log('Fetching quote requests...');
        const fetchedQuoteRequests = await quoteRequestService.getQuoteRequests(user.uid);
        console.log('Quote requests fetched:', fetchedQuoteRequests);
        
        if (Array.isArray(fetchedQuoteRequests)) {
          setQuoteRequests(fetchedQuoteRequests);
          console.log('Quote requests set:', fetchedQuoteRequests.length);
        } else {
          console.error('Quote requests not an array:', fetchedQuoteRequests);
          setQuoteRequests([]);
        }
        
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error instanceof Error ? error.message : 'Unknown error');
      }
    };

    fetchData();
  }, [user, authLoading]);

  // Filter active requests
  const activeServiceRequests = serviceRequests.filter((req) => {
    const clientId = typeof req.clientId === 'string' ? req.clientId : (req.clientId?.uid || req.clientId?.id || req.clientId);
    const userMatches = user && user.uid && clientId === user.uid;
    const statusMatches = ['pending', 'assigned', 'in-process'].includes(req.status);
    const matches = userMatches && statusMatches;
    
    console.log(`Filtering Service Request ${req._id}:`, {
      clientId,
      userUID: user?.uid,
      userMatches,
      status: req.status,
      statusMatches,
      finalMatch: matches
    });
    
    return matches;
  });

  const activeQuoteRequests = quoteRequests.filter((req) => {
    const clientId = typeof req.clientId === 'string' ? req.clientId : (req.clientId?.uid || req.clientId?.id || req.clientId);
    const userMatches = user && user.uid && clientId === user.uid;
    const statusMatches = ['pending', 'quoted', 'in_progress'].includes(req.status);
    const matches = userMatches && statusMatches;
    
    console.log(`Filtering Quote Request ${req._id}:`, {
      clientId,
      userUID: user?.uid,
      userMatches,
      status: req.status,
      statusMatches,
      finalMatch: matches
    });
    
    return matches;
  });

  console.log('Final counts:', {
    totalServiceRequests: serviceRequests.length,
    activeServiceRequests: activeServiceRequests.length,
    totalQuoteRequests: quoteRequests.length,
    activeQuoteRequests: activeQuoteRequests.length
  });

  if (authLoading) {
    return <div className="p-8">Loading authentication...</div>;
  }

  if (!user) {
    return <div className="p-8">No user authenticated</div>;
  }

  if (error) {
    return <div className="p-8 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Dashboard</h1>
      
      <div className="mb-4">
        <h2 className="text-lg font-semibold">User Info:</h2>
        <p>UID: {user.uid}</p>
        <p>Email: {user.email}</p>
        <p>Type: {user.type}</p>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold">Service Requests:</h2>
        <p>Total: {serviceRequests.length}</p>
        <p>Active: {activeServiceRequests.length}</p>
        {serviceRequests.map(req => (
          <div key={req._id} className="ml-4 p-2 border rounded mb-2">
            <p>ID: {req._id}</p>
            <p>Client ID: {typeof req.clientId === 'string' ? req.clientId : req.clientId?.id || 'N/A'}</p>
            <p>Status: {req.status}</p>
            <p>Category: {req.category}</p>
          </div>
        ))}
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold">Quote Requests:</h2>
        <p>Total: {quoteRequests.length}</p>
        <p>Active: {activeQuoteRequests.length}</p>
        {quoteRequests.map(req => (
          <div key={req._id} className="ml-4 p-2 border rounded mb-2">
            <p>ID: {req._id}</p>
            <p>Client ID: {typeof req.clientId === 'string' ? req.clientId : req.clientId?.id || 'N/A'}</p>
            <p>Status: {req.status}</p>
            <p>Description: {req.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};