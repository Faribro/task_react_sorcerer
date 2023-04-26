import React, { useRef, useState, useEffect } from "react";
import {
  Editor,
  EditorState,
  RichUtils,
  getDefaultKeyBinding,
  convertToRaw,
  convertFromRaw,
} from "draft-js";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      width: "100%",
    },
  },
  button: {
    margin: theme.spacing(1),
  },
  editor: {
    border: "1px solid #ccc",
    minHeight: "6em",
    padding: "1em",
  },
}));

function TextEditor() {
  const editorRef = useRef(null);
  const classes = useStyles();
  const [editorState, setEditorState] = useState(() => {
    const savedData = localStorage.getItem("draftState");
    if (savedData) {
      return EditorState.createWithContent(
        convertFromRaw(JSON.parse(savedData))
      );
    } else {
      return EditorState.createEmpty();
    }
  });

  useEffect(() => {
    localStorage.setItem(
      "draftState",
      JSON.stringify(convertToRaw(editorState.getCurrentContent()))
    );
  }, [editorState]);

  function handleKeyCommand(command, newState) {
    const newEditorState = RichUtils.handleKeyCommand(editorState, command);
    if (newEditorState) {
      setEditorState(newEditorState);
      return "handled";
    }
    return "not-handled";
  }

  function handleHeader() {
    setEditorState(RichUtils.toggleBlockType(editorState, "header-one"));
  }

  function handleBold() {
    setEditorState(RichUtils.toggleInlineStyle(editorState, "BOLD"));
  }

  function handleRedLine() {
    setEditorState(RichUtils.toggleInlineStyle(editorState, "REDLINE"));
  }

  function handleUnderline() {
    setEditorState(RichUtils.toggleInlineStyle(editorState, "UNDERLINE"));
  }

  function handleEditorChange(newState) {
    setEditorState(newState);
  }

  function handleSave() {
    localStorage.setItem(
      "draftState",
      JSON.stringify(convertToRaw(editorState.getCurrentContent()))
    );
  }

  function keyBindingFn(event) {
    if (
      event.keyCode === 83 /* `S` key */ &&
      (navigator.platform.match("Mac") ? event.metaKey : event.ctrlKey)
    ) {
      return "save";
    }
    return getDefaultKeyBinding(event);
  }

  return (
    <div className={classes.root}>
      <TextField label="Title" variant="outlined" />
      <Button
        className={classes.button}
        variant="contained"
        color="primary"
        onClick={handleHeader}
      >
        Header
      </Button>
      <Button
        className={classes.button}
        variant="contained"
        color="primary"
        onClick={handleBold}
      >
        Bold
      </Button>
      <Button
        className={classes.button}
        variant="contained"
        color="primary"
        onClick={handleRedLine}
      >
        Red Line
      </Button>
      <Button
        className={classes.button}
        variant="contained"
        color="primary"
        onClick={handleUnderline}
      >
        Underline
      </Button>
      <div className={classes.editor} onClick={() => editorRef.current.focus()}>
        <Editor
          editorState={editorState}
          handleKeyCommand={handleKeyCommand}
          keyBinding
