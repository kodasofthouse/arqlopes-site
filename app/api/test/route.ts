/**
 * Test route to debug edge runtime
 */
export const runtime = 'edge';

export async function GET(): Promise<Response> {
  try {
    // Test 1: Basic response
    const test1 = { step: 'basic', ok: true };
    
    // Test 2: Fetch R2 directly
    const r2Url = 'https://pub-9def9de695584c4c8300c62ce8af1bbd.r2.dev/content/hero.json';
    const response = await fetch(r2Url);
    const test2 = { 
      step: 'fetch', 
      ok: response.ok, 
      status: response.status 
    };
    
    // Test 3: Parse JSON
    let test3 = { step: 'json', ok: false, error: '' };
    try {
      const data = await response.json();
      test3 = { step: 'json', ok: true, hasTitle: !!data?.title, error: '' };
    } catch (e) {
      test3.error = e instanceof Error ? e.message : 'unknown';
    }
    
    return new Response(
      JSON.stringify({ test1, test2, test3 }, null, 2),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
