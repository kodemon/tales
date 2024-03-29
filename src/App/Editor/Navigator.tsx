import * as React from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import styled from "styled-components";

import { Source } from "Engine/Enums";
import { Page } from "Engine/Page";
import { Section } from "Engine/Section";
import { Stack } from "Engine/Stack";

import { router } from "../../Router";
import { Color, Font } from "../Variables";
import { portal } from "./Components/Portal";
import { AssetItem } from "./Lib/Assets/Item";
import { AssetManager } from "./Lib/Assets/Manager";
import { deleteResource } from "./Lib/Assets/Providers/Cloudinary";
import { AssetUpload } from "./Lib/Assets/Upload";
import { getCaretPosition, getComponentIcon } from "./Lib/Utils";
import { PageSettings } from "./Settings/Page";
import { Category, CategoryHeader } from "./Styles";
import { TemplatePortal } from "./Templates/Portal";

export class Navigator extends React.Component<
  {
    page: Page;
    edit: (section?: string, stack?: string, component?: string) => void;
    ratio: (ratio: string) => void;
  },
  {
    pane: string;
    ratio: string;
    expanded: {
      sections: Set<string>;
    };
  }
> {
  private hovered = false;

  constructor(props: any) {
    super(props);
    this.state = {
      pane: localStorage.getItem(`pane.${router.params.get("page")}`) || "",
      ratio: "",
      expanded: {
        sections: new Set()
      }
    };
  }

  public componentDidMount() {
    window.addEventListener("mouseup", this.checkHoverState);
  }

  public componentWillUnmount() {
    window.removeEventListener("mouseup", this.checkHoverState);
  }

  public componentDidUpdate(prevProps: any, prevState: any) {
    // console.log(prevProps.page && this.props.page);
    // if (!prevProps.page && this.props.page) {
    //   getFolder(`page:${this.props.page.id}`)
    //     .then((res: any) => {
    //       console.log(res);
    //     })
    //     .catch((err: any) => {
    //       console.log(err);
    //     });
    // }
  }

  /*
   |--------------------------------------------------------------------------------
   | Event Handlers
   |--------------------------------------------------------------------------------
   */

  private checkHoverState = () => {
    if (!this.hovered) {
      this.setPane("");
    }
  };

  private openSectionTemplates = () => {
    portal.open(<TemplatePortal page={this.props.page} />);
  };

  /*
   |--------------------------------------------------------------------------------
   | Navigator States
   |--------------------------------------------------------------------------------
   */

  private setPane = (pane: string) => {
    if (this.state.pane === pane) {
      localStorage.setItem(`pane.${router.params.get("page")}`, "");
      this.setState(() => ({ pane: "" }));
    } else {
      localStorage.setItem(`pane.${router.params.get("page")}`, pane);
      this.setState(() => ({ pane }));
    }
  };

  private expandSection = (id: string) => {
    const sections = this.state.expanded.sections;
    if (sections.has(id)) {
      sections.delete(id);
    } else {
      sections.add(id);
    }
    this.setState(() => ({ expanded: { ...this.state.expanded, sections } }));
  };

  /*
   |--------------------------------------------------------------------------------
   | Drag n Drop Events
   |--------------------------------------------------------------------------------
   */

  private onDragEnd = ({ type, source, destination }: any) => {
    if (type === "SECTION") {
      this.props.page.moveSection(source.index, destination.index, Source.User);
    }
  };

  /*
   |--------------------------------------------------------------------------------
   | Renderer
   |--------------------------------------------------------------------------------
   */

  public render() {
    if (!this.props.page) {
      return <Sidebar style={{ gridArea: "navigation" }} />;
    }
    return (
      <React.Fragment>
        <Sidebar style={{ gridArea: "navigation" }} onMouseEnter={() => (this.hovered = true)} onMouseLeave={() => (this.hovered = false)}>
          <Icons>
            <Icon
              className={`fa fa-file-o${this.state.pane === "page" ? " active" : ""}`}
              onClick={() => {
                this.setPane("page");
              }}
            />
            <Icon
              className={`fa fa-align-left${this.state.pane === "sections" ? " active" : ""}`}
              onClick={() => {
                this.setPane("sections");
              }}
            />
            <Icon
              className={`fa fa-folder-open-o${this.state.pane === "assets" ? " active" : ""}`}
              onClick={() => {
                this.setPane("assets");
              }}
            />
            <Icon className="fa fa-plus" onClick={this.openSectionTemplates} />
          </Icons>
          {this.state.pane !== "" && (
            <Pane>
              <PaneBar />
              <PaneContent>
                {this.state.pane === "page" && this.renderPage()}
                {this.state.pane === "sections" && this.renderSections(this.props.page.sections)}
                {this.state.pane === "assets" && this.renderAssets()}
              </PaneContent>
            </Pane>
          )}
        </Sidebar>
      </React.Fragment>
    );
  }

  private renderPage() {
    return (
      <React.Fragment>
        <PaneHeader>
          <h1>Page</h1>
        </PaneHeader>
        <PageSettings page={this.props.page} />
      </React.Fragment>
    );
  }

  private renderSections(sections: Section[]) {
    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <PaneHeader>
          <h1>Sections</h1>
        </PaneHeader>
        <Droppable droppableId={this.props.page.id} type="SECTION">
          {(provided, snapshot) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {sections.map((section, index) => {
                return (
                  <Draggable key={section.id} draggableId={section.id} index={index}>
                    {(provided, snapshot) => (
                      <React.Fragment>
                        <Category ref={provided.innerRef} {...provided.draggableProps}>
                          <CategoryHeader>
                            <div
                              className="caret"
                              onClick={() => {
                                this.expandSection(section.id);
                              }}
                            >
                              {getCaretPosition(this.state.expanded.sections.has(section.id))}
                            </div>
                            <div
                              className="header"
                              onClick={() => {
                                this.expandSection(section.id);
                              }}
                            >
                              {index} - {section.getSetting("name", section.id)}
                            </div>
                            <div className="actions">
                              <i
                                className="fa fa-trash"
                                onClick={() => {
                                  if (confirm(`Delete '${section.getSetting("name", section.id)}' section? This cannot be undone.`)) {
                                    this.props.edit();
                                    section.remove(Source.User);
                                  }
                                }}
                              />
                              <i
                                className="fa fa-pencil"
                                onClick={() => {
                                  this.props.edit(section.id);
                                }}
                              />
                              <i className="fa fa-bars grab" {...provided.dragHandleProps} />
                            </div>
                          </CategoryHeader>
                        </Category>
                        {this.state.expanded.sections.has(section.id) && this.renderStacks(section.stacks)}
                      </React.Fragment>
                    )}
                  </Draggable>
                );
              })}
            </div>
          )}
        </Droppable>
        <PaneButtons>
          <button onClick={this.openSectionTemplates}>Add Section</button>
        </PaneButtons>
      </DragDropContext>
    );
  }

  private renderStacks(stacks: Stack[]) {
    return (
      <EntityList>
        {stacks.map(stack => (
          <li key={stack.id}>
            <div
              style={{ cursor: "default" }}
              onClick={() => {
                this.props.edit(stack.section.id, stack.id);
              }}
            >
              <i className="fa fa-database" style={{ marginRight: 5 }} /> {stack.getSetting("name", stack.id)}
            </div>
            <EntityList>
              {stack.components.map(component => (
                <li key={component.id}>
                  <div
                    style={{ cursor: "default" }}
                    onClick={() => {
                      this.props.edit(component.section.id, component.stack.id, component.id);
                    }}
                  >
                    {getComponentIcon(component.type)} <span style={{ textTransform: "capitalize" }}>{component.type}</span> - {component.getSetting("name", component.id)}
                  </div>
                </li>
              ))}
            </EntityList>
          </li>
        ))}
      </EntityList>
    );
  }

  private renderAssets() {
    return (
      <React.Fragment>
        <PaneHeader>
          <h1>Assets</h1>
          <AssetUpload page={this.props.page} />
        </PaneHeader>
        <PaneContent>
          <AssetManager page={this.props.page} />
        </PaneContent>
      </React.Fragment>
    );
  }
}

/*
 |--------------------------------------------------------------------------------
 | Styled
 |--------------------------------------------------------------------------------
 */

const Sidebar = styled.div`
  position: relative;
  background: ${Color.Background};
  border-right: 1px solid ${Color.Border};
  font-family: ${Font.Family};
  width: 40px;

  i {
    color: ${Color.Font};
  }
`;

const Icons = styled.div``;

const Icon = styled.i`
  border-bottom: 1px solid ${Color.BorderLight};
  color: ${Color.FontLight};
  font-size: 0.9rem;
  padding: 10px 0;
  text-align: center;
  width: 40px;

  &.active {
    position: relative;
    background: ${Color.BackgroundLight};
    color: ${Color.FontLight};
    width: 40px;
    z-index: 5;
  }

  &:hover {
    background: ${Color.BackgroundLight};
    cursor: pointer;
    margin-left: -1px;
  }

  &.active {
    &:hover {
      margin-left: 0;
    }
  }
`;

const Pane = styled.div`
  display: grid;
  grid-template-columns: 7px 1fr;
  grid-template-rows: 1fr;
  grid-template-areas: "bar content";

  position: absolute;
  top: 0;
  right: -280px;
  bottom: 0;

  border-right: 1px solid ${Color.Border};
  width: 280px;
  z-index: 2;
`;

const PaneBar = styled.div`
  grid-area: bar;

  background: ${Color.BackgroundLight};
  border-left: 1px solid ${Color.BorderLight};
  border-right: 1px solid ${Color.BorderLight};
`;

const PaneContent = styled.div`
  grid-area: content;

  background: ${Color.Background};
`;

const PaneHeader = styled.div`
  position: relative;

  background: ${Color.BackgroundLight};
  border-bottom: 1px solid ${Color.Border};
  padding: 10px;
  color: ${Color.Font};

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

export const PaneButtons = styled.div`
  padding: 10px;
  text-align: center;

  button {
    background: ${Color.BackgroundLight};
    border: 1px solid ${Color.BorderLight};
    color: ${Color.FontLight};
    padding: 6px 18px;

    font-family: ${Font.Family};
    font-size: 12px;

    cursor: pointer;

    &:hover {
      background: ${Color.BackgroundLightHover};
    }
  }
`;

const EntityList = styled.ul`
  color: ${Color.Font};
  font-family: ${Font.Family};
  font-size: 12px;

  list-style: none;

  > li {
    margin-bottom: 10px;
    margin-left: 10px;

    > i {
      margin-right: 5px;
    }

    &:first-child {
      margin-top: 15px;
    }

    &:last-child {
      margin-bottom: 15px;
    }
  }
`;
