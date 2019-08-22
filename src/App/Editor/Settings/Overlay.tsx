import * as React from "react";

import { ColorPicker } from "../Components/ColorPicker";
import { DataSetting } from "../Components/DataSetting";

export const OverlaySettings: React.SFC<{
  component: any;
}> = function OverlaySettings({ component }) {
  return (
    <React.Fragment key={`component-${component.id}`}>
      <DataSetting entity={component} type="input" label="Name" attr="settings.name" placeholder={component.id} />
      <DataSetting entity={component} type="checkbox" label="Sticky" attr="settings.sticky" />
      <DataSetting
        entity={component}
        type="select"
        label="Position"
        attr="settings.type"
        options={[
          { label: "Top to Bottom", value: "topToBottom" },
          { label: "Bottom to Top", value: "bottomToTop" },
          { label: "Horizontal Left to Right", value: "leftToRight" },
          { label: "Horizontal Right to Left", value: "rightToLeft" },
          { label: "Vignette", value: "vignette" }
        ]}
      />

      <h1>Style</h1>
      <DataSetting entity={component} type="input" label="Height" attr="style.height" placeholder={component.id} />
      <DataSetting entity={component} type="input" label="Border Width" attr="style.borderWidth" fallback={0} placeholder={component.id} />
      <ColorPicker label="Background Color" effected={component} />
    </React.Fragment>
  );
};
