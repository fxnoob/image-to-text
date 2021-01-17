import chromeService from "./services/chromeService";
import tesserService from "./services/tesseractService";
import MessagePassingService from "./services/messagePassing";

const Routes = async () => {
  const worker = await tesserService.initTesser();
  const options = { worker };
  // set extra options
  MessagePassingService.setOptions(options);
  // recognize text from an Image and return text data
  MessagePassingService.on("/recognize", async (req, res, options) => {
    const response = {
      status: "SUCCESS",
      error: "",
      data: ""
    };
    const { worker } = options;
    const loadImage = src => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.addEventListener("load", () => resolve(img));
        img.addEventListener("error", err => reject(err));
        img.src = src;
      });
    };
    try {
      const image = await loadImage(req.url);
      const {
        data: { text }
      } = await worker.recognize(image);
      response.data = text;
    } catch (e) {
      response.status = "ERROR";
      response.error = e;
    }
    response.url = req.url;
    res(response);
  });
  //open new tab
  MessagePassingService.on("/open_tab", (req, res, options) => {
    chromeService.openHelpPage("home", encodeURIComponent(req.imgSrc));
  });
};

export default Routes;
