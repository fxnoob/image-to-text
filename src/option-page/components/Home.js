import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { red } from "@material-ui/core/colors";

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: 800
  },
  media: {
    height: "100%",
    width: "100%",
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

export default function RecipeReviewCard(props) {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
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
        <Typography variant="body2" color="textSecondary" component="p">
          {props.ocrText}
        </Typography>
      </CardContent>
    </Card>
  );
}
