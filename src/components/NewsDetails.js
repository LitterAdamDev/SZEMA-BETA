import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: '100px' ,
    width: '50%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
}));

const NewsDetails = ({allnews}) => {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  console.log(allnews);
  return (
    <div className={classes.root}>
        { allnews && allnews.map(news => {
            return(
                <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel2bh-content" id="panel2bh-header" >
                        <Typography className={classes.heading}>{news.user}</Typography>
                        <Typography className={classes.secondaryHeading}>{news.date}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>{news.message}</Typography>
                    </AccordionDetails>
                </Accordion>
            )
        })}
    </div>
  );
}
export default NewsDetails