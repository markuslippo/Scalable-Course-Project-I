const sseConnections = new Map();

const addSSEConnection = (userId, response) => {
    sseConnections.set(userId, response);
}

const removeSSEConnection = (userId) => {
  sseConnections.delete(userId);
}

const handleSSEConnection = async (request, params) => {
  const url = new URL(request.url, `http://${request.headers.get('host')}`);
  const userID = url.searchParams.get("uuid");
  const headers = new Headers({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });

  const stream = new ReadableStream({
    start(controller) {
      addSSEConnection(userID, controller);
    },
    cancel() {
      removeSSEConnection(userID);
    }
  });

  return new Response(stream, { headers });
};


export { sseConnections, addSSEConnection, removeSSEConnection, handleSSEConnection }