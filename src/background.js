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
    this.ctxMenuId1 = null;
    this.ctxMenuId2 = null;
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
    chrome.browserAction.onClicked.addListener(async () => {
      const screenshotUrl = await chromeService.takeScreenShot();
      chromeService.sendMessageToActiveTab({
        action: "show_popup",
        data: { screenshotUrl }
      });
    });
  };
  /**
   * Context menu option initialization
   *
   * @method
   * @memberof Main
   */
  initContextMenu = () => {
    if (this.ctxMenuId1) return;
    this.ctxMenuId1 = chromeService.createContextMenu({
      title: "Extract Text from this screen",
      contexts: ["all"],
      onclick: this.onContextMenu1Click
    });
    if (this.ctxMenuId2) return;
    this.ctxMenuId2 = chromeService.createContextMenu({
      title: "Extract Text from this image",
      contexts: ["image"],
      onclick: this.onContextMenu2Click
    });
  };
  onContextMenu1Click = async (info, tab) => {
    const screenshotUrl = await chromeService.takeScreenShot();
    chromeService.sendMessageToActiveTab({
      action: "show_popup",
      data: { screenshotUrl }
    });
  };
  onContextMenu2Click = (info, tab) => {
    const { srcUrl } = info;
    chromeService.openHelpPage(encodeURIComponent(srcUrl));
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
