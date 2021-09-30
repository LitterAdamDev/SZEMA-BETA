// Import Firestore database
import { db } from "../../config/base";
import { useState, useEffect } from "react";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";

const DisplayTopics = ({ defaultValue, getValueOfTopic }) => {
  const [info, setInfo] = useState([]);
  const [value, setValue] = useState("");
  // with no callback attributes it only gets called once at the first render
  getValueOfTopic(value);

  useEffect(() => {
    Fetchdata();
  }, []);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);
  // Fetch the required data using the get() method
  const Fetchdata = () => {
    db.collection("topics")
      .get()
      .then((querySnapshot) => {
        // Loop through the data and store
        // it in array to display
        querySnapshot.forEach((element) => {
          var data = element.data();
          setInfo((arr) => [...arr, { ...data, id: data.id }]);
        });
      });
  };

  // Display the result on the page
  return (
    <div className="asd">
      <FormControl style={{ width: "auto", marginLeft: "-28vw" }}>
        <InputLabel id="demo-simple-select-helper-label">
          Select a topic
        </InputLabel>
        <Select
          value={value}
          defaultValue
          onChange={(e) => {
            setValue(e.target.value);
          }}
          labelId="demo-simple-select-helper-label"
          id="demo-simple-select-helper"
        >
          {info.map((data, index) => (
            <MenuItem key={index} value={data.Topicname}>
              {data.Topicname}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>
          Select a topic to categorize the question
        </FormHelperText>
      </FormControl>
      <p style={{ marginTop: "-2vw" }}>Gomb</p>
    </div>
  );
};
export default DisplayTopics;
