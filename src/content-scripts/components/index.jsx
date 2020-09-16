import React from "react";
import Dialog from "@material-ui/core/Dialog";
import FrameCropper from "./FrameCropper";
import initialContent from "./initialIframeContent";

export default class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imgSrc: "",
      isModalOpen: false
    };
  }
  componentDidMount() {
    chrome.runtime.onMessage.addListener(
      async (request, sender, sendResponse) => {
        const { action, data } = request;
        if (action == "show_popup") {
          if (!this.state.isModalOpen) {
            this.setState({ imgSrc: data.screenshotUrl });
          }
          this.setState({ isModalOpen: !this.state.isModalOpen });
        }
      }
    );
  }
  handleClose = () => {
    this.setState({ isModalOpen: false });
  };
  onCropEnd = imgSrc => {
    chrome.runtime.sendMessage(
      { path: "/open_tab", data: { imgSrc: imgSrc } },
      response => {}
    );
    this.handleClose();
  };
  render() {
    return (
      <Dialog
        fullScreen
        style={{ zIndex: 2147483647 }}
        open={this.state.isModalOpen}
        onClose={this.handleClose}
        aria-labelledby="draggable-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <FrameCropper
          onCropEnd={this.onCropEnd}
          src={this.state.imgSrc}
          initialContent={initialContent()}
          style={{ width: "100%", height: "100%", border: "none" }}
        />
      </Dialog>
    );
  }
}
