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
    description: "",
    Createdby: "",
  });
  const [open, toggleOpen] = useState(false);
  const [info, setInfo] = useState([]);
  const [dialogValue, setDialogValue] = useState({
    Topicname: "",
    description: "",
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
      description: "",
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
                description: "",
              });
            });
          } else if (newValue && newValue.inputValue) {
            toggleOpen(true);
            setDialogValue({
              Topicname: newValue.inputValue,
              description: "",
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
              Topicname: `Felvétel "${params.inputValue}"`,
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
          <TextField {...params} label="Témakör kiválasztása" />
        )}
      />
      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>Új témakör felvétele</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Kérem adja meg a témakör nevét, és leírását!
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
              label="Témakör nevee"
              type="text"
              variant="standard"
            />
            <TextField
              margin="dense"
              id="name"
              value={dialogValue.description}
              onChange={(event) =>
                setDialogValue({
                  ...dialogValue,
                  description: event.target.value,
                })
              }
              label="Témakör leírása"
              variant="standard"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Elvetés</Button>
            <Button onClick={addTopics} type="submit">
              Hozzáadás
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </React.Fragment>
  );
}

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const top100Films = [
  { Topicname: "The Shawshank Redemption", description: 1994 },
  { Topicname: "The Godfather", description: 1972 },
];
