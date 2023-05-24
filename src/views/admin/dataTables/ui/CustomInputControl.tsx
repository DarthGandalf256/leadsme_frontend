import { ClassicPreset } from "rete";

class CustomInputControl extends ClassicPreset.InputControl<"text"> {
    constructor() {
        super("text");
    }
}

export default CustomInputControl;
