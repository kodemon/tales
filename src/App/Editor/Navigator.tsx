import * as React from "react";
import styled from "styled-components";

import { Source } from "Engine/Enums";
import { Page } from "Engine/Page";
import { Section } from "Engine/Section";
import { Stack } from "Engine/Stack";

import { Sections } from "./Components/Sections";

export class Navigator extends React.Component<
  {
    page: Page;
    edit: (section: Section, stack?: Stack, component?: any) => void;
  },
  {
    pane: string;
  }
> {
  constructor(props: any) {
    super(props);
    this.state = {
      pane: ""
    };
  }

  public render() {
    if (!this.props.page) {
      return null;
    }
    return (
      <Sidebar>
        <Icons>
          <Icon
            className={`fa fa-file-o${this.state.pane === "page" ? " active" : ""}`}
            onClick={() => {
              this.setState(() => ({ pane: this.state.pane === "page" ? "" : "page" }));
            }}
          />
          <Icon
            className={`fa fa-align-left${this.state.pane === "sections" ? " active" : ""}`}
            onClick={() => {
              this.setState(() => ({ pane: this.state.pane === "sections" ? "" : "sections" }));
            }}
          />
        </Icons>
        {this.state.pane !== "" && (
          <Pane>
            <PaneBar />
            <PaneContent>{this.state.pane === "sections" && this.renderSections()}</PaneContent>
          </Pane>
        )}
      </Sidebar>
    );
  }

  private renderSections() {
    return (
      <React.Fragment>
        <PaneHeader>
          <h1>Sections</h1>
          <div style={{ paddingTop: 6, textAlign: "right" }}>
            <button
              onClick={() => {
                this.props.page.flush();
                // this.setState(() => ({ section: undefined, component: undefined }));
              }}
            >
              <i className="fa fa-trash" />
            </button>
            <button
              onClick={() => {
                this.props.page.addSection({}, Source.User);
                // this.setState(() => ({ section: this.props.page.addSection({}, Source.User) }));
              }}
            >
              <i className="fa fa-plus" /> Section
            </button>
          </div>
        </PaneHeader>
        <Sections page={this.props.page} active={{ section: "", stack: "", component: "" }} edit={this.props.edit} />
      </React.Fragment>
    );
  }
}

/*
 |--------------------------------------------------------------------------------
 | Styled Components
 |--------------------------------------------------------------------------------
 */

const Sidebar = styled.div`
  position: relative;
  background: #f6f6f6;
  border-right: 1px solid #ccc;
  font-family: "Roboto", sans-serif;
`;

const Icons = styled.div``;

const Icon = styled.i`
  border-bottom: 1px solid #ccc;
  padding: 10px 0;
  text-align: center;
  width: 40px;

  &.active {
    position: relative;
    background: #fcfcfc;
    width: 41px;
    z-index: 100;
  }

  &:hover {
    cursor: pointer;
  }
`;

const Pane = styled.div`
  display: grid;
  grid-template-columns: 10px 1fr;
  grid-template-rows: 1fr;
  grid-template-areas: "bar content";

  position: absolute;
  top: 0;
  right: -280px;
  bottom: 0;

  background: #f6f6f6;
  width: 280px;
  z-index: 99;
`;

const PaneBar = styled.div`
  grid-area: bar;

  background: #fcfcfc;
  border-left: 1px solid #ccc;
  border-right: 1px solid #ccc;
`;

const PaneContent = styled.div`
  grid-area: content;

  background: #f6f6f6;
  border-right: 1px solid #ccc;
`;

const PaneHeader = styled.div`
  position: relative;

  background: #fcfcfc;
  border-bottom: 1px solid #ccc;
  margin-left: -1px;
  padding: 10px;

  > h1 {
    font-size: 1.2em;
    font-weight: 300;
  }

  > div {
    position: absolute;
    top: 4px;
    right: 14px;
  }

  button {
    cursor: pointer;
    background: none;
    border: none;
    margin-left: 14px;
  }
`;

/*
export const SectionSidebar = styled.div`
  background: #f6f6f6;
  border-right: 1px solid #ccc;
  font-family: "Roboto", sans-serif;

  header {
    > div {
      position: absolute;
      top: 6px;
      right: 10px;

      button {
        cursor: pointer;
        margin: 0 3px;
        padding: 3px;
      }
    }
  }
`;
*/

/*
<SectionSidebar>
  <Header>
    <h1>Page</h1>
  </Header>
  {this.page && <PageSettings page={this.page} />}
  <Header>
    <h1>Sections</h1>
    <div>
      <button
        onClick={() => {
          if (this.page) {
            this.page.flush();
            this.setState(() => ({ section: undefined, component: undefined }));
          }
        }}
      >
        <i className="fa fa-trash" />
      </button>
      <button
        onClick={() => {
          if (this.page) {
            this.setState(() => ({ section: this.page.addSection({}, Source.User) }));
          }
        }}
      >
        <i className="fa fa-plus" />
      </button>
    </div>
  </Header>
  {this.page && (
    <Sections
      page={this.page}
      active={{
        section: maybe(this.state, "section.id", ""),
        stack: maybe(this.state, "stack.id", ""),
        component: maybe(this.state, "component.id", "")
      }}
      edit={this.onEdit}
    />
  )}
</SectionSidebar>
*/