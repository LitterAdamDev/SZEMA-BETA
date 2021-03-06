import React, { useEffect, useState } from "react";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import Skeleton from "react-loading-skeleton";
import swal from "sweetalert";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import "firebase/firestore";
import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import FormControl from "@material-ui/core/FormControl";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

import Tooltip from "@material-ui/core/Tooltip";

import QuestionAddAnswer from "../Components/QuestionAddAnswer";
import DisplayTopics from "./DisplayTopics";
import DisplayTopicsWithDialog from "./DisplayTopicsWithDialog";

import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import ResHeader from "../Components/ResHeader";
import storage, { db } from "../../config/base";
import firebase from "firebase/app";

//for lists
function ListItemLink(props) {
  return <ListItem button component="a" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    padding: theme.spacing(8, 0, 6),
    backgroundColor: "#bec1ca",
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  cardMedia: {
    paddingTop: "56.25%", // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2),
    backgroundColor: "#1c2442",
  },
  themeQuestions: {
    display: "inline-block",
    verticalAlign: "text-top",
    margin: "15px",
    width: "100%",
    maxWidth: 450,
    backgroundColor: theme.palette.background.paper,
    //boxShadow: '0px 0px 12px 2px rgba(15, 15, 15, 0.281)',
    boxShadow: "0px 0px 12px 2px rgba(15, 15, 15, 0.2)",
    borderRadius: "6px",
    padding: "17px 10px",
    marginTop: "15px",
  },
  createQuestion: {
    display: "center",
    //verticalAlign: 'text-top',
    //margin: '15px',
    //width: '100%',
    minWidth: 920,
    maxWidth: 450,
    backgroundColor: theme.palette.background.paper,
    //boxShadow: '0px 0px 12px 2px rgba(15, 15, 15, 0.281)',
    boxShadow: "0px 0px 12px 2px rgba(15, 15, 15, 0.2)",
    borderRadius: "6px",
    padding: "17px 10px",
    marginTop: "-25px",
    marginBottom: "15px",
  },
  gombok: {
    padding: "2rem",
  },
  formControl: {
    float: "left",
    marginBottom: "10px",
    marginLeft: "16px",
  },
}));

function QuestionBaseDashboard() {
  const classes = useStyles();

  const [allTopicsForQuestions, setAllTopicsForQuestions] = useState([]);
  const [allQuestions, setAllQuestions] = useState([]);
  const [currentTopic, setCurrentTopic] = useState("");
  const [currentTopicInputValue, setCurrentTopicInputValue] = useState("");
  const [selectBoxTopicValue, setSelectBoxTopicValue] = useState("");

  const [currentQuestion, setCurrentQuestion] = useState("");
  const [point, setPoint] = useState("");
  const [correctAns, setCorrectAns] = useState([]);
  const [correctAnsValue, setCorrectAnsValue] = useState("");
  const [allOherAns, setAllOherAns] = useState([]);
  const [allOherBadAns, setAllOherBadAns] = useState([]);
  const [badAns, setBadAns] = useState([]);
  const [currentQuestionEdit, setCurrentQuestionEdit] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [updatedId, setUpdateId] = useState(false);
  const [src, setSrc] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getAllTopics();
  }, []);

  useEffect(() => {
    getAllQuestionRelatedToTopic();
    setCurrentQuestion("");
  }, [currentTopic]);

  const getValueOfTopic = (value) => {
    setSelectBoxTopicValue(value);
  };

  const getOtherAns = (arr) => {
    setAllOherAns(arr);
  };
  const getOtherBadAns = (arr) => {
    setAllOherBadAns(arr);
  };

  const add = () => {
    const otherAnserFilter = allOherAns.filter((obj) => {
      return obj.questionOption !== "";
    });

    let withoutObjAns = otherAnserFilter.map((v) => v.questionOption);
    //withoutObjAns.unshift(correctAnsValue);

    const otherBadAnserFilter = allOherBadAns.filter((obj) => {
      return obj.questionOption !== "";
    });
    let withoutObjBadAns = otherBadAnserFilter.map((v) => v.questionOption);
    let requiredData = {
      topicName: selectBoxTopicValue,
      point,
      question: currentQuestionEdit,
      rightAnswer: withoutObjAns,
      badAnswers: withoutObjBadAns,
    };

    let data = {
      answers: requiredData.badAnswers,
      isPicture: src ? true : false,
      picture: src,
      points: requiredData.point,
      question: requiredData.question,
      rightAnswer: requiredData.rightAnswer,
      topicName: requiredData.topicName,
      type: withoutObjAns.length > 1 ? 1 : 0,
    };

    for (var d in requiredData) {
      if (
        requiredData[d] == "" ||
        withoutObjAns.length < 1 ||
        requiredData[d] == null ||
        requiredData[d] == undefined ||
        requiredData[d] == false
      ) {
        //swal("Figyelem!", `${camelCase(d)} mez??k ??resek!`);
         swal("Figyelem!", `T??ltse ki a sz??ks??ges mez??ket!`);
        return;
        break;
      }
    }

    db.collection("questions")
      .add(data)
      .then((docRef) => {
        swal("Sikeres m??velet!", "K??rd??s sikeresen hozz??adva", "success");
        cencel();
      })
      .catch((error) => swal("Hiba", "Hiba a k??rd??s hozz??ad??sakor"));
  };

  const update = () => {
    const otherAnserFilter = allOherAns.filter((obj) => {
      return obj.questionOption !== "";
    });

    let withoutObjAns = otherAnserFilter.map((v) => v.questionOption);
    //withoutObjAns.unshift(correctAnsValue);
    const otherBadAnserFilter = allOherBadAns.filter((obj) => {
      return obj.questionOption !== "";
    });

    let withoutObjBadAns = otherBadAnserFilter.map((v) => v.questionOption);

    let requiredData = {
      topicName: selectBoxTopicValue,
      point,
      question: currentQuestionEdit,
      rightAnswer: withoutObjAns,
      badAnswers: withoutObjBadAns,
    };

    let data = {
      answers: requiredData.badAnswers,
      isPicture: src ? true : false,
      picture: src,
      points: requiredData.point,
      question: requiredData.question,
      rightAnswer: requiredData.rightAnswer,
      topicName: requiredData.topicName,
      type: withoutObjAns.length > 1 ? 1 : 0,
    };

    for (var d in requiredData) {
      if (
        requiredData[d] == "" ||
        withoutObjAns.length < 1 ||
        requiredData[d] == null ||
        requiredData[d] == undefined ||
        requiredData[d] == false
      ) {
        //swal("Warning!", `${camelCase(d)} field are empty`);
        swal("Figyelem!", `T??ltse ki a sz??ks??ges mez??ket!`);
        return;
        break;
      }
    }

    db.collection("questions")
      .doc(updatedId)
      .update(data)
      .then((docRef) => {
        swal("Sikeres m??velet!", "A k??rd??s sikeresen m??dos??tva!", "success");
        cencel();
      })
      .catch((error) => swal("Hiba", "Hiba a k??rd??s friss??t??sekor"));
  };

  const deleteQuestion = (id) => {
    if(window.confirm("Biztosan t??rli a k??rd??st?")){
    setAllQuestions(allQuestions.filter((item) => item.id !== id));
    db.collection("questions").doc(id).delete();
    window.location.reload();
    }
  };

  const deleteTopic = (id, Topicname) => {
    if(window.confirm("Biztosan t??rli a t??mak??rt?")){
      setAllQuestions(allTopicsForQuestions.filter((item) => item.id !== id));
    db.collection("questions")
      .where("topicName", "==", Topicname)
      .onSnapshot((snapshot) => {
        snapshot.docs.map((doc) => {
          deleteQuestion(doc.id);
        });
      });
    db.collection("topics").doc(id).delete();
    } 
  };

  const getAllTopics = () => {
    db.collection("topics").onSnapshot((snapshot) => {
      setAllTopicsForQuestions(
        snapshot.docs.map((doc) => {
          let data = doc.data();
          data.id = doc.id;
          return data;
        })
      );
    });
  };

  const getAllQuestionRelatedToTopic = () => {
    db.collection("questions")
      .where("topicName", "==", currentTopic)
      .onSnapshot((snapshot) => {
        setAllQuestions(
          snapshot.docs.map((doc) => {
            let data = doc.data();

            data.id = doc.id;
            return data;
          })
        );
      });
  };

  const cencel = () => {
    setIsEdit(false);
    setCurrentTopic("");
    setCurrentTopicInputValue("");
    setSrc("");
    setSelectBoxTopicValue("");
    setPoint("");
    setCurrentQuestion("");
    setCurrentQuestionEdit("");
    setCorrectAns([]);
    setBadAns([]);
  };

  const editQuestion = ({
    question,
    id,
    topicName,
    rightAnswer,
    points,
    answers,
    picture,
  }) => {
    setIsEdit(true);
    setLoading(false);
    setSrc(picture ? picture : "");
    setUpdateId(id);
    setCurrentQuestion(question);
    setCurrentQuestionEdit(question);
    setCorrectAns(rightAnswer);
    setBadAns(answers);
    setPoint(points);
    setCurrentTopic(topicName);
    setCurrentTopicInputValue(setCurrentTopicInputValue);
  };

  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      //reader.addEventListener("load", () => setSrc(reader.result));
      reader.readAsDataURL(e.target.files[0]);

      imageUpload(e.target.files[0]);
    }
  };

  const imageUpload = (file) => {
    setLoading(true);
    console.log(file);
    firebase
      .storage()
      .ref()
      .child(file.name)
      .child(file.name + Math.random())
      .put(file)
      .then((snapshot) => {
        snapshot.ref.getDownloadURL().then((downloadURL) => {
          console.log(downloadURL);
          setSrc(downloadURL);
          setLoading(false);
        });
      });

    setSrc(null);
  };

  const blockInvalidChar = (e) =>
    ["e", "E", "+", "-"].includes(e.key) && e.preventDefault();

  function camelCase(camelCase) {
    return camelCase
      .replace(/([A-Z])/g, (match) => ` ${match}`)
      .replace(/^./, (match) => match.toUpperCase());
  }

  function scrollTop(elementY, duration) { 
    var startingY = window.pageYOffset;
    var diff = elementY - startingY;
    var start;
  
    // Bootstrap our animation - it will get called right before next frame shall be rendered.
    window.requestAnimationFrame(function step(timestamp) {
      if (!start) start = timestamp;
      // Elapsed milliseconds since start of scrolling.
      var time = timestamp - start;
      // Get percent of completion in range [0, 1].
      var percent = Math.min(time / duration, 1);
  
      window.scrollTo(0, startingY + diff * percent);
  
      // Proceed with animation as long as we wanted it to.
      if (time < duration) {
        window.requestAnimationFrame(step);
      }
    })
  }
  return (
    <React.Fragment>
      <CssBaseline />
      <ResHeader />
      <main>
        {/* Hero unit */}
        <div className={classes.heroContent}>
          <Container maxWidth="sm">
            {/*  <Typography component="h1" variant="h3" align="center" color="textPrimary" gutterBottom>
                 K??rd??sb??zis
              </Typography>*/}
          </Container>

          <center>
            <div className={classes.createQuestion}>
              <h1>K??rd??sek kezel??se</h1>
              <Divider />

              <Container
                style={{
                  display: "flex",
                  marginLeft: 20,

                  justifyContent: "space-between",
                }}
              >
                {/* <DisplayTopics
                  getValueOfTopic={getValueOfTopic}
                  defaultValue={isEdit ? currentTopic : ""}
                /> */}
                <DisplayTopicsWithDialog
                  getValueOfTopic={getValueOfTopic}
                  defaultValue={currentTopic}
                />

                  <label for="file-input-id">
                  <div
                    style={{
                      width: 100,
                      height: 40,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "20px",
                      backgroundColor: "#1c2442",
                      color: "#fff",
                      cursor: "pointer",
                      margin: "20px 20px",
                    }}
                  >
                    {!loading ? (
                      "K??p felt??lt??s"
                    ) : (
                      <CircularProgress size={30} color="warning" />
                    )}
                  </div>

                  <input
                    id="file-input-id"
                    onClick={(e) => (e.target.value = "")}
                    style={{ display: "none" }}
                    onInputCapture={(e) => onSelectFile(e)}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                  />
                </label>
              </Container>

              <form className={classes.root} noValidate autoComplete="off">
                <TextField
                  id="outlined-full-width"
                  label="Pontsz??m meghat??roz??sa"
                  style={{ margin: 8, width: "91%" }}
                  InputProps={{ inputProps: { min: 0, max: 20 } }}
                  type="number"
                  onKeyDown={blockInvalidChar}
                  value={point}
                  onChange={(e) => setPoint(e.target.value)}
                  placeholder="K??rem adja meg a k??v??nt pontsz??mot a k??rd??shez..."
                  margin="normal"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                />
                <TextField
                  id="outlined-full-width"
                  label="??j k??rd??s l??trehoz??sa"
                  style={{ margin: 8 }}
                  value={currentQuestionEdit}
                  onChange={(e) => setCurrentQuestionEdit(e.target.value)}
                  placeholder="K??rem adjon meg egy k??rd??st ..."
                  // helperText="Full width!"
                  style={{ width: "91%" }}
                  multiline
                  margin="normal"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  variant="outlined"
                />

                {src && (
                  <img
                    style={{ width: "80%", height: "auto", margin: "30px 0" }}
                    src={src}
                    alt="image"
                  />
                )}

                
                {/* ide a valasz lehetosegeket hozzaado comp */}
                <QuestionAddAnswer
                  getOtherAns={getOtherAns}
                  otherCurrentAns={correctAns}
                  title="Helyes v??lasz hozz??ad??sa"
                />

                <QuestionAddAnswer
                  getOtherAns={getOtherBadAns}
                  otherCurrentAns={badAns}
                  title="Rossz v??lasz hozz??ad??sa"
                  badAnswer
                />

                {/*<input id="haha" value={this.state.userInput} name="sampleInput" />*/}

                {/* Elvet??sre r??nyomva a m??dos??t??s gomb megjelenik ??s a hozz??ad??s is. K??rd??sek a ... t??mak??rben-re r??nyomva pedig a m??dos??t??s ??s a hozz??ad??s elt??nik. */}
                <div className={classes.gombok}>
                  <Tooltip
                    title={
                      <h1
                        style={{
                          lineHeight: "1.5rem",
                          fontSize: "15px",
                          color: "lightblue",
                          margin: "2rem",
                        }}
                      >
                        Jelenleg bet??lt??tt mez??k elvet??se. Az adott k??rd??st nem t??rli!
                      </h1>
                    }
                  >
                    <Button onClick={cencel} variant="contained">
                      Elvet??s
                    </Button>
                  </Tooltip>
                  {isEdit ? (
                    <Tooltip
                      title={
                        <h1
                          style={{
                            lineHeight: "1.5rem",
                            fontSize: "15px",
                            color: "lightblue",
                          }}
                        >
                          A jelenleg bet??lt??tt k??rd??s fel??l??r??sa. Nem vesz fel ??j k??rd??st, csup??n a jelenlegit m??dos??tja.
                        </h1>
                      }
                    >
                      <Button
                        onClick={update}
                        variant="contained"
                        color="primary"
                        style={{ margin: "1rem" }}
                      >
                        M??dos??t??s
                      </Button>
                    </Tooltip>
                  ) : (
                    <Tooltip
                      title={
                        <h1
                          style={{
                            lineHeight: "1.5rem",
                            fontSize: "15px",
                            color: "lightblue",
                          }}
                        >
                          ??j k??rd??s hozz??ad??sa, a be??ll??tott t??mak??rrel ??s v??laszokkal, k??ppel.
                        </h1>
                      }
                    >
                      <Button
                        onClick={add}
                        style={{ marginLeft: 10 }}
                        variant="contained"
                        color="secondary"
                      >
                        Hozz??ad??s
                      </Button>
                    </Tooltip>
                  )}
                </div>

                {/*><TextField id="filled-basic" label="Filled" variant="filled" />
  <TextField id="outlined-basic" label="Outlined" variant="outlined" />*/}
              </form>
            </div>

            <div className={classes.themeQuestions}>
              <h1>T??mak??r??k</h1>
              {/*<SearchField placeholder='Keres??s a t??mak??r??k k??z??tt...' />*/}

              <Autocomplete
                freeSolo
                id="free-solo-2-demo"
                disableClearable
                inputValue={currentTopic}
                options={
                  allTopicsForQuestions.length > 0
                    ? allTopicsForQuestions.map((option) => option.Topicname)
                    : []
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="T??mak??r??k keres??se ..."
                    margin="normal"
                    onChange={(e) => setCurrentTopic(e.target.value)}
                    variant="outlined"
                    InputProps={{
                      ...params.InputProps,
                      type: "search",
                      endAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />

              <Divider />
              <List component="nav" aria-label="secondary mailbox folders" style={{maxHeight: '20vw', overflow: 'auto'}}>
                {allTopicsForQuestions.length > 0 ? (
                  allTopicsForQuestions.map(
                    ({ Topicname, id, Description }, index) => (
                      <Tooltip
                        style={{ cursor: "pointer" }}
                        title={Description ? Description : "Nincs le??r??s"}
                      >
                        <ListItem key={id}>
                          <ListItemText primary={Topicname} />
                          <IconButton
                            onClick={() => setCurrentTopic(Topicname)}
                            edge="end"
                            aria-label="delete"
                          >
                            <ArrowForwardIosIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => deleteTopic(id, Topicname)}
                            edge="end"
                            aria-label="delete"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </ListItem>
                      </Tooltip>
                    )
                  )
                ) : (
                  <Skeleton height={34} count={5} />
                )}
              </List>
            </div>

            <div className={classes.themeQuestions}>
              <h1>K??rd??sek a t??mak??r??kben</h1>

              <Autocomplete
                freeSolo
                id="free-solo-2-demo"
                disableClearable
                inputValue={currentQuestion}
                options={allQuestions.map((option) => option.question)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="K??rd??sek keres??se ..."
                    margin="normal"
                    variant="outlined"
                    onChange={(e) => setCurrentQuestion(e.target.value)}
                    InputProps={{
                      ...params.InputProps,
                      type: "search",
                      endAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />

              <Divider />
              <List component="nav" aria-label="secondary mailbox folders" style={{maxHeight: '20vw', overflow: 'auto'}}>
                {allQuestions.length > 0 ? (
                  allQuestions.map((item, index) => (
                    <ListItem key={item.id}>
                      <ListItemText primary={item.question} />
                      <IconButton
                        onClick={() => {
                          editQuestion(item)
                          scrollTop(0,700)
                        }
                        }
                        edge="end"
                        aria-label="delete"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => deleteQuestion(item.id)}
                        edge="end"
                        aria-label="delete"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItem>
                  ))
                ) : (
                  <Skeleton height={34} count={5} />
                )}
              </List>
            </div>
          </center>
        </div>
      </main>
      {/* Footer */}
      <footer className={classes.footer}>
        {/* <Typography variant="h6" align="center" gutterBottom>
            SZEMA
          </Typography>*/}
        <Typography
          variant="subtitle1"
          align="center"
          color="textSecondary"
          component="p"
        >
          <div className="footer-text" style={{color: "white"}}>
          <strong>SZEMA - </strong>Sz??chenyi Istv??n Egyetem
          </div>
        </Typography>
        {/* <Typography
          variant="subtitle1"
          align="center"
          color="textSecondary"
          component="p"
        >
          Bir?? Istv??n - istvanbiro.bwe@gmail.com - 06-30-403-9089
        </Typography> */}
      </footer>
      {/* End footer */}
    </React.Fragment>
  );
}
export default withStyles(useStyles)(QuestionBaseDashboard);
