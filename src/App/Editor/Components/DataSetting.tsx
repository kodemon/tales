import { Source } from "Engine/Enums";
import * as React from "react";
import { SettingGroup } from "../Styles";

export class DataSetting extends React.Component<{
  entity: any;

  // ### Form Settings

  type: "input" | "checkbox" | "select";
  label: string;
  options?: SelectOption[];
  placeholder?: string;

  // Data Settings

  attr: string;
  fallback?: any;

  // ### Event Parsers

  onValue?: (value: any) => any;
  onChange?: (value: any) => any;
}> {
  private current: any;

  public shouldComponentUpdate() {
    const { entity, attr, fallback, onValue } = this.props;
    const value = onValue ? onValue(entity.get(attr, fallback || "")) : entity.get(attr, fallback || "");
    if (value !== this.current) {
      this.current = value;
      return true;
    }
    return false;
  }

  public render() {
    const { entity, type, label, attr, fallback, options, placeholder, onValue, onChange } = this.props;
    switch (type) {
      case "input": {
        return (
          <SettingGroup>
            <label className="input">{label}</label>
            <input
              type="text"
              value={onValue ? onValue(entity.get(attr, fallback || "")) : entity.get(attr, fallback || "")}
              placeholder={placeholder || ""}
              onChange={event => {
                entity.set(attr, onChange ? onChange(event.target.value) : event.target.value, Source.User);
              }}
            />
          </SettingGroup>
        );
      }
      case "select": {
        return (
          <SettingGroup>
            <label className="input">{label}</label>
            <select
              value={onValue ? onValue(entity.get(attr, fallback || "")) : entity.get(attr, fallback || "")}
              onChange={event => {
                entity.set(attr, onChange ? onChange(event.target.value) : event.target.value, Source.User);
              }}
            >
              {(options || []).map(option => (
                <option value={option.value}>{option.label}</option>
              ))}
            </select>
          </SettingGroup>
        );
      }
    }
  }
}

/*
 |--------------------------------------------------------------------------------
 | Interfaces
 |--------------------------------------------------------------------------------
 */

interface SelectOption {
  label: string;
  value: any;
}
