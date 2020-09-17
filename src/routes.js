import chromeService from "./services/chromeService";

const ROUTES = {};

ROUTES["/recognize"] = async (request, { worker }) => {
  const loadImage = src => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.addEventListener("load", () => resolve(img));
      img.addEventListener("error", err => reject(err));
      img.src = src;
    });
  };
  const image = await loadImage(request.url);
  const {
    data: { text }
  } = await worker.recognize(image);
  return text;
};

ROUTES["/open_tab"] = async (request, { worker }) => {
  chromeService.openHelpPage(encodeURIComponent(request.data.imgSrc));
  return true;
};

export default ROUTES;
