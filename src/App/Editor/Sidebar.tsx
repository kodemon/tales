import * as React from "react";
import styled from "styled-components";

import { Component } from "Engine/Component";
import { Section } from "Engine/Section";
import { Stack } from "Engine/Stack";

import { ColorPicker } from "./Components/ColorPicker";
import { DataSetting } from "./Components/DataSetting";
import { StackLayout } from "./Components/StackLayout";
import { GallerySettings } from "./Settings/Gallery";
import { ImageSettings } from "./Settings/Image";
import { OverlaySettings } from "./Settings/Overlay";
import { RevealSettings } from "./Settings/Reveal";
import { TextSettings } from "./Settings/Text";

export class Sidebar extends React.Component<
  {
    section?: Section;
  },
  {
    stack: string;
    component: string;
  }
> {
  constructor(props: any) {
    super(props);
    this.state = {
      stack: "",
      component: ""
    };
  }

  public render() {
    const section = this.props.section;
    if (!section) {
      return (
        <Container>
          <NoSection>
            <div>Select a section to start editing</div>
          </NoSection>
        </Container>
      );
    }
    return (
      <Container key={`section-${section.id}`}>
        <Category>
          <CategoryHeader>
            <h1>
              Section
              <small>{section.getSetting("name", section.id)}</small>
            </h1>
          </CategoryHeader>
          <CategoryContent>
            <DataSetting entity={section} type="input" label="Name" attr="settings.name" placeholder={section.id} />
            <DataSetting
              entity={section}
              type="select"
              label="Position"
              attr="settings.position"
              options={[{ label: "Relative", value: "relative" }, { label: "Absolute", value: "absolute" }, { label: "Sticky", value: "sticky" }]}
            />
            <DataSetting
              entity={section}
              type="input"
              label="Height"
              attr="settings.height"
              fallback={1}
              placeholder="100"
              onValue={value => value * 100}
              onChange={value => (value === "" ? 0 : parseFloat(value) / 100)}
            />
            <ColorPicker label="Background Color" effected={section} />
          </CategoryContent>
        </Category>
        <Category>
          <CategoryHeader>
            <h1>Stacks</h1>
          </CategoryHeader>
          {this.renderStacks(section)}
        </Category>
        <Category>
          <CategoryHeader>
            <h1>Components</h1>
          </CategoryHeader>
          {this.state.stack && this.renderComponents(section, section.getStack(this.state.stack))}
        </Category>
      </Container>
    );
  }

  private renderStacks(section: Section) {
    return (
      <Stacks>
        {section.stacks.map(stack => (
          <Stack key={stack.id}>
            <StackHeader onClick={() => this.setState(() => ({ stack: this.state.stack === stack.id ? "" : stack.id }))}>
              <h1>{stack.getSetting("name", stack.id)}</h1>
              <div>
                <i className={`fa fa-caret-${this.state.stack === stack.id ? "up" : "down"}`} />
              </div>
            </StackHeader>
            {this.state.stack === stack.id && (
              <StackContent>
                <DataSetting entity={stack} type="input" label="Name" attr="settings.name" placeholder={stack.id} />
                <DataSetting
                  entity={stack}
                  type="select"
                  label="Position"
                  attr="settings.position"
                  options={[{ label: "Relative", value: "relative" }, { label: "Absolute", value: "absolute" }, { label: "Sticky", value: "sticky" }]}
                />
                <StackLayout stack={stack} />
              </StackContent>
            )}
          </Stack>
        ))}
      </Stacks>
    );
  }

  private renderComponents(section: Section, stack?: Stack) {
    if (!stack) {
      return null;
    }
    return (
      <Components>
        {stack.components.map(component => (
          <Component>
            <ComponentHeader onClick={() => this.setState(() => ({ component: this.state.component === component.id ? "" : component.id }))}>
              <h1>
                {component.getSetting("name", component.id)}
                <small>{component.type}</small>
              </h1>
              <div>
                <i className={`fa fa-caret-${this.state.component === component.id ? "up" : "down"}`} />
              </div>
            </ComponentHeader>
            {this.state.component && this.renderComponent(component)}
          </Component>
        ))}
      </Components>
    );
  }

  private renderComponent(component: Component) {
    switch (component.type) {
      case "image": {
        return (
          <ComponentContent>
            <ImageSettings component={component} />
          </ComponentContent>
        );
      }
      case "text": {
        return (
          <ComponentContent>
            <TextSettings component={component} />
          </ComponentContent>
        );
      }
      case "overlay": {
        return (
          <ComponentContent>
            <OverlaySettings component={component} />
          </ComponentContent>
        );
      }
      case "gallery": {
        return (
          <ComponentContent>
            <GallerySettings component={component} />
          </ComponentContent>
        );
      }
      case "reveal": {
        return (
          <ComponentContent>
            <RevealSettings component={component} />
          </ComponentContent>
        );
      }
    }
  }
}

/*
 |--------------------------------------------------------------------------------
 | Container
 |--------------------------------------------------------------------------------
 */

const Container = styled.div`
  position: relative;
  background: #f6f6f6;
  color: #262626;
  border-left: 1px solid #ccc;
  font-family: "Roboto", sans-serif;
  height: 100vh;
`;

/*
 |--------------------------------------------------------------------------------
 | Category
 |--------------------------------------------------------------------------------
 */

const Category = styled.div``;

const CategoryHeader = styled.div`
  position: relative;

  background: #fafafa;
  border-bottom: 1px solid #ccc;
  padding: 6px 10px;

  > h1 {
    display: inline;
    font-size: 1.2em;
    font-weight: 300;

    > small {
      margin-left: 3px;
      font-size: 68%;
      font-weight: 400;
    }
  }
`;

const CategoryContent = styled.div`
  border-bottom: 1px solid #ccc;
  padding: 10px;
`;

/*
 |--------------------------------------------------------------------------------
 | Stacks
 |--------------------------------------------------------------------------------
 */

const Stacks = styled.div``;

const Stack = styled.div``;

const StackHeader = styled.div`
  position: relative;

  background: #f3f3f3;
  border-bottom: 1px solid #ccc;
  padding: 5px 10px;

  > h1 {
    display: inline;
    font-size: 0.788em;
    font-weight: 300;

    > small {
      margin-left: 3px;
      font-size: 68%;
      font-weight: 400;
    }
  }

  > div {
    float: right;
  }
`;

const StackContent = styled.div`
  border-bottom: 1px solid #ccc;
  padding: 10px;
`;

/*
 |--------------------------------------------------------------------------------
 | Comopnents
 |--------------------------------------------------------------------------------
 */

const Components = styled.div``;

const Component = styled.div``;

const ComponentHeader = styled.div`
  position: relative;

  background: #f3f3f3;
  border-bottom: 1px solid #ccc;
  padding: 5px 10px;

  > h1 {
    display: inline;
    font-size: 0.788em;
    font-weight: 300;

    > small {
      margin-left: 3px;
      font-size: 79%;
      font-weight: 400;
      text-transform: capitalize;
    }
  }

  > div {
    float: right;
  }
`;

const ComponentContent = styled.div`
  border-bottom: 1px solid #ccc;
  padding: 10px;
`;

/*
 |--------------------------------------------------------------------------------
 | Misc
 |--------------------------------------------------------------------------------
 */

const NoSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  background: rgba(0, 0, 0, 0.05);
  width: 100%;
  height: 100%;
  font-weight: 300;
`;
