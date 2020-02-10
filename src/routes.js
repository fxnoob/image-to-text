const ROUTES = {};

ROUTES["/recognize"] = async (request, { worker }) => {
  const image = new Image();
  image.src = request.url;
  const {
    data: { text }
  } = await worker.recognize(image);
  return text;
};

export default ROUTES;
