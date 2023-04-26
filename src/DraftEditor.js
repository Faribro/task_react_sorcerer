import React, { useState, useEffect } from "react";
import { Editor, EditorState, RichUtils } from "draft-js";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Save";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";

import "draft-js/dist/Draft.css";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: theme.spacing(2),
  },
  editor: {
    minHeight: 200,
    border: `1px solid ${theme.palette.divider}`,
    padding: theme.spacing(1),
  },
  button: {
    margin: theme.spacing(0.5),
  },
}));

const DraftEditor = () => {
  const classes = useStyles();

  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  useEffect(() => {
    const savedContent = localStorage.getItem("editorContent");
    if (savedContent) {
      setEditorState(EditorState.createWithContent(JSON.parse(savedContent)));
    }
  }, []);

  const handleEditorChange = (newEditorState) => {
    setEditorState(newEditorState);
  };

  const handleSave = () => {
    localStorage.setItem(
      "editorContent",
      JSON.stringify(editorState.getCurrentContent())
    );
  };

  const handleKeyCommand = (command, editorState) => {
    const newEditorState = RichUtils.handleKeyCommand(editorState, command);
    if (newEditorState) {
      handleEditorChange(newEditorState);
      return "handled";
    }
    return "not-handled";
  };

  const handleHeader = () => {
    const selection = editorState.getSelection();
    const contentState = editorState.getCurrentContent();
    const currentBlock = contentState.getBlockForKey(selection.getStartKey());
    const text = currentBlock.getText();

    const blockType = text.startsWith("# ") ? "unstyled" : "header-one";

    const newContentState = RichUtils.toggleBlockType(contentState, blockType);
    handleEditorChange(EditorState.push(editorState, newContentState));
  };

  const handleBold = () => {
    handleEditorChange(RichUtils.toggleInlineStyle(editorState, "BOLD"));
  };

  const handleStrikethrough = () => {
    handleEditorChange(
      RichUtils.toggleInlineStyle(editorState, "STRIKETHROUGH")
    );
  };

  const handleUnderline = () => {
    handleEditorChange(RichUtils.toggleInlineStyle(editorState, "UNDERLINE"));
  };

  return (
    <Paper className={classes.root}>
      <Typography variant="h4" gutterBottom>
        Editor
      </Typography>
      <Toolbar className={classes.toolbar}>
        <div>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={handleHeader}
          >
            #
          </Button>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={handleUnderline}
          >
            U
          </Button>
        </div>
        <div>
          <Button
            variant="contained"
            color="secondary"
            className={classes.button}
            startIcon={<SaveIcon />}
            onClick={handleSave}
          >
            Save
          </Button>
        </div>
      </Toolbar>
      <Editor
        editorState={editorState}
        onChange={handleEditorChange}
        handleKeyCommand={handleKeyCommand}
        placeholder="Write something here..."
        className={classes.editor}
      />
    </Paper>
  );
};

export default DraftEditor;
