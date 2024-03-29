import * as React from "react";

import { Page } from "Engine/Page";

import { Color, Font } from "../../Variables";
import { PaneButtons } from "../Navigator";
import { SettingGroup } from "../Styles";

export const PageSettings: React.SFC<{
  page: Page;
}> = function PageSettings({ page }) {
  return (
    <div key={`page-${page.id}`} style={{ padding: 10 }}>
      <ConduitSettings page={page} />
    </div>
  );
};

class ConduitSettings extends React.Component<{ page: Page }, { isConnecting: boolean; isConnected: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = {
      isConnecting: false,
      isConnected: this.props.page.conduit ? true : false
    };
  }

  public componentDidMount() {
    this.props.page.on("conduit:open", this.onConduitOpened);
  }

  public componentWillUnmount() {
    this.props.page.off("conduit:open", this.onConduitOpened);
  }

  private onConduitOpened = () => {
    if (this.props.page.conduit) {
      this.setState(() => ({ isConnecting: false, isConnected: true }));
    }
  };

  public render() {
    const page = this.props.page;
    if (this.state.isConnecting) {
      return <div style={{ color: Color.Font, fontSize: Font.Size }}>Connecting...</div>;
    }
    if (page.conduit) {
      return (
        <React.Fragment>
          <SettingGroup>
            <label>Peer ID</label>
            <div>{page.conduit.id}</div>
          </SettingGroup>
          <SettingGroup>
            <label>Connect</label>
            <input
              type="text"
              placeholder="Enter a share id"
              onBlur={event => {
                page.connect(event.target.value);
                event.target.value = "";
              }}
            />
          </SettingGroup>
          <SettingGroup>
            <label>Peers</label>
            <div>
              {Array.from(page.conduit.list).map((conn: any) => {
                return <div key={conn.peer}>{conn.peer}</div>;
              })}
            </div>
          </SettingGroup>
        </React.Fragment>
      );
    }
    return (
      <PaneButtons>
        <button
          type="button"
          onClick={() => {
            this.setState(
              () => ({ isConnecting: true }),
              () => {
                page.share();
              }
            );
          }}
        >
          Share Page
        </button>
      </PaneButtons>
    );
  }
}
