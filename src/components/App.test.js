import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";

const fileFormLabel = "Upload a file";

test("App component loads and displays file input form", () => {
  render(<App />);
  const fileInput = screen.getByLabelText(fileFormLabel);

  expect(fileInput).toBeInTheDocument();
});

test("file input form should not accept invalid file type", () => {
  const invalidFile = new File(["(⌐□_□)"], "chucknorris.png", {
    type: "image/png",
  });
  const { queryByText } = render(<App />);
  const fileInput = screen.getByLabelText(fileFormLabel);
  fireEvent.change(fileInput, { target: { files: [invalidFile] } });

  expect(queryByText("File type must be audio/wav")).toBeInTheDocument();
  expect(queryByText("Upload")).not.toBeInTheDocument();
});

test("file input form should accept valid file type", () => {
  const validFile = new File(["(⌐□_□)"], "chucknorris.wav", {
    type: "audio/wav",
  });
  const { queryByText } = render(<App />);
  const fileInput = screen.getByLabelText(fileFormLabel);
  fireEvent.change(fileInput, { target: { files: [validFile] } });

  expect(queryByText("File type must be audio/wav")).not.toBeInTheDocument();
  expect(queryByText("Upload")).toBeInTheDocument();
});
