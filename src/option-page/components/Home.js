import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { red } from "@material-ui/core/colors";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import chromeService from "../../services/chromeService";

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: 900
  },
  media: {
    height: "100%",
    width: "100%",
    backgroundSize: "contain",
    paddingTop: "56.25%" // 16:9
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: "rotate(180deg)"
  },
  avatar: {
    backgroundColor: red[500]
  }
}));

export default function OCRCard(props) {
  const classes = useStyles();
  const [copied, setCopied] = React.useState(false);
  const copyText = text => {
    const dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  return (
    <Card className={classes.root}>
      <CardHeader title="Image to text" subheader="Extracted Text" />
      <CardContent>
        <CardMedia
          height="100%"
          width="100%"
          className={classes.media}
          image={props.url}
          title={props.ocrText}
        />
      </CardContent>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={10}>
            <Typography variant="body2" color="textSecondary" component="p">
              {props.ocrText}
            </Typography>
          </Grid>
          <Grid item xs={2} style={{ padding: "0", paddingTop: "1rem" }}>
            <ButtonGroup
              orientation="vertical"
              color="primary"
              variant="contained"
              aria-label="Actions "
            >
              <Button
                onClick={() => {
                  copyText(props.ocrText);
                }}
              >
                Copy
              </Button>
              <Button
                onClick={() => {
                  chromeService.speak(props.ocrText);
                }}
              >
                Speak
              </Button>
              {copied && <div>Copied!</div>}
            </ButtonGroup>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
