import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import firebase, { db } from "../../config/base";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const filter = createFilterOptions();

export default function FreeSoloCreateOptionDialog({
  getValueOfTopic,
  defaultValue,
}) {
  const user = firebase.auth().currentUser;

  const [value, setValue] = useState({
    Topicname: "",
    Description: "",
    Createdby: "",
  });
  const [open, toggleOpen] = useState(false);
  const [info, setInfo] = useState([]);
  const [dialogValue, setDialogValue] = useState({
    Topicname: "",
    Description: "",
    Createdby: "",
  });

  useEffect(() => {
    if (user) {
      db.collection("users")
        .doc(user.uid) // optional
        .onSnapshot((snapshot) => {
          setDialogValue((prevState) => ({
            ...prevState,
            Createdby: snapshot.data().name,
          }));
        });
    }
  }, []);

  getValueOfTopic(value?.Topicname);

  useEffect(() => {
    setValue({ Topicname: defaultValue });
  }, [defaultValue]);

  useEffect(() => {
    Fetchdata();
  }, []);

  const Fetchdata = () => {
    db.collection("topics").onSnapshot((snapshot) => {
      setInfo(
        snapshot.docs.map((doc) => {
          let data = doc.data();
          data.id = doc.id;
          return data;
        })
      );
    });
  };

  const handleClose = () => {
    setDialogValue({
      Topicname: "",
      Description: "",
    });

    toggleOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setValue(dialogValue.Topicname);

    handleClose();
  };

  const addTopics = () => {
    db.collection("topics")
      .add(dialogValue)
      .then((docRef) => {});
  };

  return (
    <React.Fragment>
      <Autocomplete
        style={{ margin: "20px 0 20px 0" }}
        value={value?.Topicname}
        onChange={(event, newValue) => {
          if (typeof newValue === "string") {
            // timeout to avoid instant validation of the dialog's form.
            setTimeout(() => {
              toggleOpen(true);
              setDialogValue({
                Topicname: newValue,
                Description: "",
              });
            });
          } else if (newValue && newValue.inputValue) {
            toggleOpen(true);
            setDialogValue({
              Topicname: newValue.inputValue,
              Description: "",
            });
          } else {
            setValue(newValue);
          }
        }}
        filterOptions={(options, params) => {
          const filtered = filter(options, params);

          if (params.inputValue !== "") {
            filtered.push({
              inputValue: params.inputValue,
              Topicname: `Felv??tel "${params.inputValue}"`,
            });
          }

          return filtered;
        }}
        id="free-solo-dialog-demo"
        options={info}
        getOptionLabel={(option) => {
          // e.g value selected with enter, right from the input
          if (typeof option === "string") {
            return option;
          }
          if (option.inputValue) {
            return option.inputValue;
          }
          return option.Topicname;
        }}
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        renderOption={(props, option) => <li {...props}>{option.Topicname}</li>}
        sx={{ width: 300 }}
        freeSolo
        renderInput={(params) => (
          <TextField {...params} label="T??mak??r kiv??laszt??sa" />
        )}
      />
      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>??j t??mak??r felv??tele</DialogTitle>
          <DialogContent>
            <DialogContentText>
              K??rem adja meg a t??mak??r nev??t, ??s le??r??s??t!
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              value={dialogValue.Topicname}
              onChange={(event) =>
                setDialogValue({
                  ...dialogValue,
                  Topicname: event.target.value,
                })
              }
              label="T??mak??r nevee"
              type="text"
              variant="standard"
            />
            <TextField
              margin="dense"
              id="name"
              value={dialogValue.Description}
              onChange={(event) =>
                setDialogValue({
                  ...dialogValue,
                  Description: event.target.value,
                })
              }
              label="T??mak??r le??r??sa"
              variant="standard"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Elvet??s</Button>
            <Button onClick={addTopics} type="submit">
              Hozz??ad??s
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </React.Fragment>
  );
}

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const top100Films = [
  { Topicname: "The Shawshank Redemption", Description: 1994 },
  { Topicname: "The Godfather", Description: 1972 },
];
