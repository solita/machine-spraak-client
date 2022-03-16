import { render,screen } from "@testing-library/react";
import React, { ReactElement } from "react";
import UploadFile from "./UploadFile";

describe("UploadFile", ()=>{
    let testComponent:ReactElement;
    beforeEach(()=>{
        testComponent = <UploadFile/>;
    });

    it("Rendering the component",()=>{
        render(testComponent);
        expect(screen.getByRole("heading",{name:"Upload a file"}));
    });
});
