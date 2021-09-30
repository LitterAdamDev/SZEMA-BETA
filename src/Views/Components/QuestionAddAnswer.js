import React, { useState, useEffect } from "react";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";

import IconButton from "@material-ui/core/IconButton";
import RemoveIcon from "@material-ui/icons/Remove";
import AddIcon from "@material-ui/icons/Add";
import Icon from "@material-ui/core/Icon";
import { v4 as uuidv4 } from "uuid";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
    },
  },
  button: {
    margin: theme.spacing(1),
  },
}));

//function App() {
export default function QuestionAddAnswer({
  otherCurrentAns,
  getOtherAns,
  title,
  badAnswer,
}) {
  const classes = useStyles();
  // const dispatch = useDispatch();
  // let { data } = useSelector(({ questionAddAnswer }) => questionAddAnswer);

  const [inputFields, setInputFields] = useState([{ questionOption: "" }]);

  getOtherAns(inputFields);

  useEffect(() => {
    console.log("otherCurrentAns", otherCurrentAns);
    setInputFields([{ questionOption: "" }]);

    if (otherCurrentAns.length > 0) {
      let otherAnswer = [];

      otherCurrentAns.forEach((v, i) => {
        if (badAnswer) {
          otherAnswer.push({ questionOption: v });
        } else {
          if (i !== 0) otherAnswer.push({ questionOption: v });
        }
      });
      setInputFields(otherAnswer);
    }
  }, [badAnswer, otherCurrentAns]);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleChangeInput = (currIndex, event) => {
    const newInputFields = inputFields.map((i, index) => {
      if (currIndex === index) {
        i[event.target.name] = event.target.value;
      }
      return i;
    });

    setInputFields(newInputFields);
  };

  const handleAddFields = (index) => {
    setInputFields([...inputFields, { questionOption: "" }]);
  };

  const handleRemoveFields = (index) => {
    const values = [...inputFields];
    values.splice(index, 1);
    setInputFields(values);
  };

  return (
    <form
      className={classes.root}
      onSubmit={handleSubmit}
      noValidate
      autoComplete="off"
    >
      {inputFields.map((inputField, index) => (
        <div key={index}>
          <TextField
            name="questionOption"
            label={title}
            style={{ width: "80%" }}
            placeholder="Adjon meg egy új válasz lehetőséget..."
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            value={inputField.questionOption}
            onChange={(event) => handleChangeInput(index, event)}
          />

          <IconButton
            disabled={inputFields.length === 1}
            onClick={() => handleRemoveFields(index)}
          >
            <RemoveIcon />
          </IconButton>
          <IconButton onClick={() => handleAddFields(index)}>
            {" "}
            <AddIcon />{" "}
          </IconButton>
        </div>
      ))}
    </form>
  );
}
