import * as React from "react";

import { Source } from "Engine/Enums";
import { ComponentDivider } from "../Components/ComponentDivider";
import { DataGroup, DataSetting } from "../Components/DataSetting";
import { ActionButton, ActionGroup, SettingGroup } from "../Styles";

export const RevealSettings: React.SFC<{
  component: any;
  edit: (section?: string, stack?: string, component?: string) => void;
}> = function ImageSettings({ component, edit }) {
  return (
    <React.Fragment key={`component-${component.id}`}>
      <DataGroup>
        <DataSetting entity={component} type="input" label="Name" attr="settings.name" placeholder={component.id} />
        <SettingGroup>
          <label className="input">Actions</label>
          <ActionGroup>
            <ActionButton
              onClick={() => {
                component.remove(Source.User);
                edit(component.section.id, component.stack.id);
              }}
            >
              <i className="fa fa-magic" />
            </ActionButton>
            <ActionButton
              onClick={() => {
                component.remove(Source.User);
                edit(component.section.id, component.stack.id);
              }}
            >
              <i className="fa fa-copy" />
            </ActionButton>
            <ActionButton
              onClick={() => {
                component.remove(Source.User);
                edit(component.section.id, component.stack.id);
              }}
            >
              <i className="fa fa-trash" />
            </ActionButton>
          </ActionGroup>
        </SettingGroup>
      </DataGroup>
      <ComponentDivider label="Settings" icon="cogs" />
    </React.Fragment>
  );
};
