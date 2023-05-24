import React from 'react';
import { ClassicPreset } from "rete";
import { TextSocket } from "../sockets";
import { Presets } from "rete-react-render-plugin";

// Custom InputControl class
export class CustomInputControl extends ClassicPreset.InputControl<"text"> {
  setValue(val: any) {
    super.setValue(val);
    this.update();
  }
  update() {
    throw new Error('Method not implemented.');
  }
}
// Custom React component for the control
export const CustomInputComponent = (props: { data: { value: any; onChange: any; }; }) => {
  const { value, onChange = () => {} } = props.data;


  return (
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{ 
        height: '40px',
        width: '140px',
        border: '2px solid #ccc',
        borderRadius: '10px',
        padding: '5px',
        fontSize: '1.2em',
        textAlign: 'center'
      }} // Set your desired height
    />
  );
};

// Node class
export class Message extends ClassicPreset.Node<
  {},
  { text: ClassicPreset.Socket },
  { value: CustomInputControl }
> {
  width = 180;
  height = 140;

  constructor(initial: string) {
    super("Agent");
    this.addControl(
      "value",
      new CustomInputControl("text", { initial })
    );
    this.addOutput("text", new ClassicPreset.Output(new TextSocket()));

  }

  execute() {}

  data() {
    return {
      text: this.controls.value.value || ""
    };
  }
}