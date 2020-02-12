import "@babel/polyfill";
import chromeService from "./services/chromeService";
import ROUTES from "./routes";
import "./tesseract.min";
/**
 * Main extension functionality
 *
 * @class Main
 */
class Main {
  constructor() {
    this.ctxMenuId = null;
    this.init().catch(e => {
      console.log("Error loading extension", { e });
    });
  }
  init = async () => {
    chromeService.setBadgeOnActionIcon("Loading...");
    await this.initRoutes();
    this.initContextMenu();
    this.popUpClickSetup();
    chromeService.setBadgeOnActionIcon("");
  };
  popUpClickSetup = () => {
    chrome.browserAction.onClicked.addListener(tab => {
      console.log({ tab });
      chromeService.openHelpPage();
    });
  };
  /**
   * Context menu option initialization
   *
   * @method
   * @memberof Main
   */
  initContextMenu = () => {
    console.log({ ctx: chrome.contextMenus });
    if (this.ctxMenuId) return;
    this.ctxMenuId = chromeService.createContextMenu({
      title: "Extract Text from this image",
      contexts: ["image"],
      onclick: this.onContextMenuClick
    });
  };
  onContextMenuClick = (info, tab) => {
    const { srcUrl } = info;
    chromeService.openHelpPage(srcUrl);
  };
  initTesser = async () => {
    const { createWorker } = Tesseract;
    const worker = createWorker({
      workerPath: chrome.runtime.getURL("js/worker.min.js"),
      langPath: chrome.runtime.getURL("traineddata"),
      corePath: chrome.runtime.getURL("js/tesseract-core.wasm.js")
    });
    await worker.load();
    await worker.loadLanguage("eng");
    await worker.initialize("eng");
    return worker;
  };
  /**
   * set message passing routes. get messages from content scripts
   *
   * @method
   * @memberof Main
   */
  initRoutes = async () => {
    const worker = await this.initTesser();
    const routes = async (request, sender, sendResponse) => {
      const response = {
        url: "",
        status: "SUCCESS",
        error: "",
        data: ""
      };
      try {
        const options = { worker };
        response.data = await ROUTES[request.path](request, options);
        console.log({ response });
      } catch (e) {
        response.status = "ERROR";
        response.error = e;
      }
      response.url = request.url;
      sendResponse(response);
    };
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      routes(request, sender, sendResponse).catch(e => {
        console.log(e);
      });
      return true;
    });
  };
}

const main = new Main();
