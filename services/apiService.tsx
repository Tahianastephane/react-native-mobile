// services/apiService.ts
export async function fetchDataWithHeaders(url: string) {
    try {
      const response = await fetch(url, {
        method: 'GET', // ou 'POST', 'PUT', etc.
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer YOUR_API_KEY'
          // Ajoutez d'autres en-têtes si nécessaire
        }
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        console.error('Fetch failed:', error.message);
        throw error;
      } else {
        console.error('An unknown error occurred');
        throw new Error('An unknown error occurred');
      }
    }
  }
  